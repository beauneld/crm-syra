import { X, AlertCircle, FileText, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getAllCompanies, getProductsByCompany, getCompaniesOfferingProductType, getProductType, CSVProduct } from '../services/csvProductsService';
import { getDateConfigForType, getFinancialFieldsForType, shouldShowPERExistantField, shouldShowAssuranceVieExistanteField, shouldShowPrevoyanceRenouvellementField, shouldShowGirardinDocumentUpload, calculateEcheanceDate } from '../utils/productFieldsConfig';
import { createAutomaticReminder } from '../services/automaticRemindersService';

interface AddContractModalProps {
  onClose: () => void;
  onSave?: (contract: ContractData) => void;
  editContract?: ContractData;
  editIndex?: number;
}

interface ContractData {
  compagnie: string;
  produit: string;
  type_produit: string;
  numero_contrat: string;
  delegataire_gestion: string;
  commentaires: string;
  date_souscription: string;
  date_effet: string;
  date_echeance: string;

  // Financial fields - dynamic based on product type
  montant_initial: string;
  versement_programme: string;
  versement_initial: string;
  periodicite: string;
  frais_versement: string;
  frais_versement_vi: string;
  vp_mois: string;
  montant_prime: string;
  frais_dossier: string;
  montant_versement: string;
  allocation_actifs: string;

  // Meta fields
  assureurs_interroges: string[];
  per_existant?: boolean;
  assurance_vie_existante?: boolean;
  rachat_effectue?: boolean;
  contrat_renouvellement_remplacement?: 'nouveau' | 'renouvellement' | 'remplacement' | '';

  // File uploads for Girardin
  avis_imposition_files?: File[];
}

export default function AddContractModal({ onClose, onSave, editContract, editIndex }: AddContractModalProps) {
  const [companies] = useState<string[]>(getAllCompanies());
  const [availableProducts, setAvailableProducts] = useState<CSVProduct[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const [assureursInterroges, setAssureursInterroges] = useState<string[]>(editContract?.assureurs_interroges || []);
  const [reminderMessage, setReminderMessage] = useState('');
  const [showReminderSuccess, setShowReminderSuccess] = useState(false);
  const [avisImpositionFiles, setAvisImpositionFiles] = useState<File[]>([]);
  const [searchCompany, setSearchCompany] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const [formData, setFormData] = useState<ContractData>(editContract || {
    compagnie: '',
    produit: '',
    type_produit: '',
    numero_contrat: '',
    delegataire_gestion: '',
    commentaires: '',
    date_souscription: '',
    date_effet: '',
    date_echeance: '',
    montant_initial: '',
    versement_programme: '',
    versement_initial: '',
    periodicite: '',
    frais_versement: '',
    frais_versement_vi: '',
    vp_mois: '',
    montant_prime: '',
    frais_dossier: '',
    montant_versement: '',
    allocation_actifs: '',
    assureurs_interroges: [],
    per_existant: false,
    assurance_vie_existante: false,
    rachat_effectue: false,
    contrat_renouvellement_remplacement: '',
    avis_imposition_files: []
  });

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(searchCompany.toLowerCase())
  );

  // Update products when company changes
  const handleCompanyChange = (companyName: string) => {
    const products = getProductsByCompany(companyName);
    setAvailableProducts(products);
    setFormData({
      ...formData,
      compagnie: companyName,
      produit: '',
      type_produit: '',
      assureurs_interroges: []
    });
    setSelectedProductType('');
    setAssureursInterroges([]);
  };

  // Update type and assureurs when product changes
  const handleProductChange = (productName: string) => {
    const productType = getProductType(formData.compagnie, productName);

    if (productType) {
      setSelectedProductType(productType);

      // Get companies offering same product type (excluding current company)
      const otherCompanies = getCompaniesOfferingProductType(productType, formData.compagnie);
      setAssureursInterroges([formData.compagnie, ...otherCompanies.slice(0, 3)]);

      setFormData({
        ...formData,
        produit: productName,
        type_produit: productType,
        assureurs_interroges: [formData.compagnie, ...otherCompanies.slice(0, 3)]
      });
    }
  };

  // Auto-calculate date_echeance when date_effet changes
  useEffect(() => {
    if (formData.date_effet && selectedProductType) {
      const dateConfig = getDateConfigForType(selectedProductType);

      if (dateConfig.calculateEcheance) {
        const calculatedDate = calculateEcheanceDate(formData.date_effet);
        setFormData(prev => ({
          ...prev,
          date_echeance: calculatedDate
        }));
      }
    }
  }, [formData.date_effet, selectedProductType]);

  const handleSave = async () => {
    if (!formData.compagnie || !formData.produit) {
      alert('Veuillez sélectionner une compagnie et un produit');
      return;
    }

    if (onSave) {
      const dataToSave = {
        ...formData,
        assureurs_interroges: assureursInterroges,
        avis_imposition_files: avisImpositionFiles
      };

      onSave(dataToSave);

      // Create automatic reminders based on product type
      try {
        const result = await createAutomaticReminder(
          {
            produit: formData.produit,
            compagnie: formData.compagnie,
            date_effet: formData.date_effet,
            per_existant: formData.per_existant,
            assurance_vie_existante: formData.assurance_vie_existante,
            rachat_effectue: formData.rachat_effectue,
            contrat_renouvellement_remplacement: formData.contrat_renouvellement_remplacement,
          },
          'mock-user-id',
          '1'
        );

        if (result.reminderCreated) {
          setReminderMessage(result.message);
          setShowReminderSuccess(true);
          setTimeout(() => {
            setShowReminderSuccess(false);
            onClose();
          }, 2000);
        } else {
          onClose();
        }
      } catch (error) {
        console.error('Erreur lors de la création du rappel:', error);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const dateConfig = selectedProductType ? getDateConfigForType(selectedProductType) : null;
  const financialConfig = selectedProductType ? getFinancialFieldsForType(selectedProductType) : null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl my-4 pointer-events-auto max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl z-10">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">
              {editContract ? 'Éditer le contrat' : 'Ajouter un nouveau contrat'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">

            {/* Section: Sélection Produit */}
            <div>
              <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Sélection du produit</h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Compagnie - Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    <span className="text-red-500">*</span> Compagnie
                  </label>
                  <input
                    type="text"
                    value={searchCompany || formData.compagnie}
                    onChange={(e) => {
                      setSearchCompany(e.target.value);
                      setShowCompanyDropdown(true);
                      if (!e.target.value) {
                        handleCompanyChange('');
                      }
                    }}
                    onFocus={() => {
                      setSearchCompany(formData.compagnie);
                      setShowCompanyDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowCompanyDropdown(false), 200);
                    }}
                    placeholder="Rechercher une compagnie..."
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                  {showCompanyDropdown && searchCompany && filteredCompanies.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 max-h-60 overflow-y-auto z-20">
                      {filteredCompanies.map((company) => (
                        <button
                          key={company}
                          type="button"
                          onClick={() => {
                            handleCompanyChange(company);
                            setSearchCompany('');
                            setShowCompanyDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-light text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Produit */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    <span className="text-red-500">*</span> Produit
                  </label>
                  <select
                    value={formData.produit}
                    onChange={(e) => handleProductChange(e.target.value)}
                    disabled={!formData.compagnie}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.compagnie ? 'Sélectionner un produit...' : 'Sélectionner d\'abord une compagnie...'}
                    </option>
                    {availableProducts.map((product) => (
                      <option key={product.produit} value={product.produit}>
                        {product.produit}
                      </option>
                    ))}
                  </select>
                  {selectedProductType && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Type: {selectedProductType}
                    </p>
                  )}
                </div>
              </div>

              {/* Assureurs interrogés */}
              {formData.produit && assureursInterroges.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Assureurs interrogés pour comparaison
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {assureursInterroges.map((assureur, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-white dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-full text-xs font-light"
                      >
                        {assureur}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Ces assureurs ont été consultés pour comparer les offres disponibles
                  </p>
                </div>
              )}
            </div>

            {/* Section: Dates */}
            {dateConfig && (
              <div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Dates</h3>
                <div className="grid grid-cols-3 gap-6">
                  {dateConfig.showDateSouscription && (
                    <div>
                      <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                        Date de souscription
                      </label>
                      <input
                        type="date"
                        value={formData.date_souscription}
                        onChange={(e) => setFormData({ ...formData, date_souscription: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {dateConfig.showDateEffet && (
                    <div>
                      <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                        Date d'effet
                      </label>
                      <input
                        type="date"
                        value={formData.date_effet}
                        onChange={(e) => setFormData({ ...formData, date_effet: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {dateConfig.showDateEcheance && (
                    <div>
                      <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                        Date d'échéance
                        {dateConfig.calculateEcheance && (
                          <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">(auto)</span>
                        )}
                      </label>
                      <input
                        type="date"
                        value={formData.date_echeance}
                        onChange={(e) => !dateConfig.calculateEcheance && setFormData({ ...formData, date_echeance: e.target.value })}
                        disabled={dateConfig.calculateEcheance}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section: Informations financières */}
            {financialConfig && (
              <div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Informations financières</h3>
                <div className="grid grid-cols-2 gap-6">
                  {financialConfig.fields.map((field) => (
                    <div key={field.name} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                      <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                        {field.required && <span className="text-red-500">* </span>}
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={(formData as any)[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={(formData as any)[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        />
                      )}
                      {field.helpText && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
                      )}
                    </div>
                  ))}

                  {/* Périodicité */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                      Périodicité
                    </label>
                    <select
                      value={formData.periodicite}
                      onChange={(e) => setFormData({ ...formData, periodicite: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Mensuel">Mensuel</option>
                      <option value="Trimestriel">Trimestriel</option>
                      <option value="Semestriel">Semestriel</option>
                      <option value="Annuel">Annuel</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Configuration spécifique PER */}
            {selectedProductType && shouldShowPERExistantField(selectedProductType) && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Plan Épargne Retraite (PER)</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Configuration spécifique pour les contrats PER</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={formData.per_existant}
                    onChange={(e) => setFormData({ ...formData, per_existant: e.target.checked })}
                    className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-light text-gray-700 dark:text-gray-300">PER déjà existant</span>
                </label>
                {formData.per_existant && (
                  <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-light">
                      ✓ Un rappel sera automatiquement créé : "Faire demande de transfert + suspension des versements sur l'ancien PER"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Configuration spécifique Assurance Vie */}
            {selectedProductType && shouldShowAssuranceVieExistanteField(selectedProductType) && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-700">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Assurance Vie / Épargne</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Configuration spécifique pour l'assurance vie</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={formData.assurance_vie_existante}
                    onChange={(e) => setFormData({ ...formData, assurance_vie_existante: e.target.checked })}
                    className="w-4 h-4 text-green-600 dark:text-green-400 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm font-light text-gray-700 dark:text-gray-300">Assurance vie déjà existante</span>
                </label>
                {formData.assurance_vie_existante && (
                  <div className="mt-3 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rachat_effectue}
                        onChange={(e) => setFormData({ ...formData, rachat_effectue: e.target.checked })}
                        className="w-4 h-4 text-green-600 dark:text-green-400 rounded border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Avez-vous effectué un rachat total ou partiel ?</span>
                    </label>
                    {formData.rachat_effectue && (
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <p className="text-xs text-green-700 dark:text-green-300 font-light">
                          ✓ Un rappel sera automatiquement créé : "Suivi du rachat total ou partiel"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Configuration spécifique Prévoyance */}
            {selectedProductType && shouldShowPrevoyanceRenouvellementField(selectedProductType) && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-700">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Prévoyance</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Configuration spécifique pour les contrats de prévoyance</p>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Le contrat est-il en renouvellement ou en remplacement ?
                  </label>
                  <select
                    value={formData.contrat_renouvellement_remplacement}
                    onChange={(e) => setFormData({ ...formData, contrat_renouvellement_remplacement: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="nouveau">Nouveau contrat</option>
                    <option value="renouvellement">Renouvellement</option>
                    <option value="remplacement">Remplacement</option>
                  </select>
                  {(formData.contrat_renouvellement_remplacement === 'renouvellement' || formData.contrat_renouvellement_remplacement === 'remplacement') && (
                    <div className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                      <p className="text-xs text-orange-700 dark:text-orange-300 font-light">
                        ✓ Un rappel sera automatiquement créé : "Avez-vous effectué la RIA (résiliation ou non reconduction) ?"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upload Girardin - Avis d'imposition */}
            {selectedProductType && shouldShowGirardinDocumentUpload(selectedProductType) && (
              <div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Documents obligatoires</h3>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700">
                  <div className="flex items-start gap-3 mb-3">
                    <Upload className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Avis d'imposition</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Document obligatoire pour les produits Girardin</p>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-2xl p-6 text-center hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
                    <input
                      type="file"
                      id="avis-imposition-input"
                      accept=".pdf,.jpg,.jpeg"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const validFiles = files.filter(file => {
                          const isValidType = file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/jpg';
                          const isValidSize = file.size <= 5 * 1024 * 1024;
                          if (!isValidType) {
                            alert(`${file.name}: Format non accepté. Uniquement PDF et JPG.`);
                            return false;
                          }
                          if (!isValidSize) {
                            alert(`${file.name}: Fichier trop volumineux (max 5Mo).`);
                            return false;
                          }
                          return true;
                        });
                        setAvisImpositionFiles([...avisImpositionFiles, ...validFiles]);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="avis-imposition-input"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-amber-500 dark:text-amber-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Cliquez pour ajouter l'avis d'imposition</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-1">PDF ou JPG (max 5Mo par fichier)</p>
                    </label>
                  </div>

                  {avisImpositionFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-light text-gray-700 dark:text-gray-300">Fichiers ajoutés ({avisImpositionFiles.length})</h4>
                      {avisImpositionFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-amber-900/30 rounded-2xl border border-amber-200 dark:border-amber-700">
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-gray-100 font-light truncate">{file.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                                {(file.size / 1024).toFixed(2)} Ko
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAvisImpositionFiles(avisImpositionFiles.filter((_, i) => i !== index));
                            }}
                            className="w-8 h-8 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 flex items-center justify-center transition-all"
                          >
                            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section Commentaires */}
            <div>
              <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Commentaires</h3>
              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                  Commentaires
                </label>
                <textarea
                  value={formData.commentaires}
                  onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                  placeholder=""
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 bg-white dark:bg-gray-900 rounded-b-3xl flex-shrink-0">
            {showReminderSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl">
                <p className="text-sm text-green-700 dark:text-green-300 font-light text-center">
                  ✓ {reminderMessage}
                </p>
              </div>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-8 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-light hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
              >
                {editContract ? 'Enregistrer' : 'Ajouter et fermer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
