import { X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface RecueilExigencesModalProps {
  onClose: () => void;
  onSave?: (data: RecueilExigencesData) => void;
  leadData?: {
    civilite: string;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    site_internet: string;
    actif: boolean;
    adresse: string;
    ville: string;
    code_postal: string;
    date_naissance: string;
    statut_professionnel: string;
    profession: string;
    caisse_professionnelle: string;
    remuneration: string;
    dividende: string;
    credit_en_cours: string;
    autres_revenus: string;
    commentaire: string;
    situation_familiale: string;
    situation_professionnelle: string;
    projets: string;
  };
}

interface RecueilExigencesData {
  affiche_devoir_conseil: boolean;
  patrimoine_financier: string;
  patrimoine_immobilier: string;
  revenus_reguliers: string;
  origine_revenus: {
    salaire: boolean;
    pension_retraite: boolean;
    bic_bnc: boolean;
    revenu_fonciers: boolean;
    autre: boolean;
  };
  charges_regulieres: string;
  foyer_fiscal_france: boolean;
  pays_identification_fiscale: string;
  impose_france_ifi: boolean;
  nationalite_americaine: boolean;
  numero_identification_americain: string;
  resident_fiscal_usa: boolean;
  fonction_politique: boolean;
  fonction_politique_details: string;
  entourage_fonction_politique: boolean;
  entourage_fonction_politique_details: string;
  objectif_principal: string;
  objectifs_secondaires: string;
  horizon_placement: string;
  tranche_age: string;
  niveau_experience: string;
  produits_investis: string;
  orientation_placement: string;
  gestion_patrimoine: string;
  reaction_placement_baisse: string;
}

export default function RecueilExigencesModal({ onClose, onSave, leadData }: RecueilExigencesModalProps) {
  const [activeTab, setActiveTab] = useState<'situation' | 'obligations' | 'fatca' | 'personne' | 'objectif' | 'connaissance'>('situation');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<RecueilExigencesData>({
    affiche_devoir_conseil: true,
    patrimoine_financier: '0-50k',
    patrimoine_immobilier: '0-100k',
    revenus_reguliers: '31-45k',
    origine_revenus: {
      salaire: true,
      pension_retraite: false,
      bic_bnc: false,
      revenu_fonciers: false,
      autre: false,
    },
    charges_regulieres: '21-40',
    foyer_fiscal_france: true,
    pays_identification_fiscale: '',
    impose_france_ifi: false,
    nationalite_americaine: false,
    numero_identification_americain: '',
    resident_fiscal_usa: false,
    fonction_politique: false,
    fonction_politique_details: '',
    entourage_fonction_politique: false,
    entourage_fonction_politique_details: '',
    objectif_principal: 'valoriser_capital',
    objectifs_secondaires: '',
    horizon_placement: '15+',
    tranche_age: '-55',
    niveau_experience: 'pas_connaissance',
    produits_investis: '',
    orientation_placement: 'faible',
    gestion_patrimoine: 'libre',
    reaction_placement_baisse: 'conserve',
  });

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl my-4 pointer-events-auto border border-gray-200/50 dark:border-gray-700/30" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/20 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-t-3xl z-10">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">
              Recueil des exigences et des besoins
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Checkbox */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.affiche_devoir_conseil}
                onChange={(e) => setFormData({ ...formData, affiche_devoir_conseil: e.target.checked })}
                className="w-5 h-5 text-blue-600 dark:text-blue-400 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-light text-gray-700 dark:text-gray-300">
                Les informations sont affichées dans le devoir de conseil
              </span>
            </label>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/20 bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'situation', label: 'Situation financière' },
                { key: 'obligations', label: 'Obligations fiscales' },
                { key: 'fatca', label: 'FATCA' },
                { key: 'personne', label: 'Personne politiquement exposée' },
                { key: 'objectif', label: 'Objectif' },
                { key: 'connaissance', label: 'Connaissance des marchés financiers' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-2 text-xs font-light transition-all whitespace-nowrap rounded-xl ${
                    activeTab === tab.key
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white/80 text-gray-600 hover:bg-white border border-gray-200/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {activeTab === 'situation' && (
              <>
                {/* Patrimoine financier */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Patrimoine financier</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-3">
                    {['0-50k€', '51-250k€', '251-500k€', '501k-1M€', '+1M€'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="patrimoine_financier"
                          checked={formData.patrimoine_financier === option}
                          onChange={() => setFormData({ ...formData, patrimoine_financier: option })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-light text-gray-700 dark:text-gray-300 whitespace-nowrap">{option}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2">Assurance Vie, PEA, Compte titres, Livret A...</p>
                </div>

                {/* Patrimoine immobilier */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Patrimoine immobilier</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-3">
                    {['0-100k€', '101-250k€', '251-500k€', '501k-1M€', '+1M€'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="patrimoine_immobilier"
                          checked={formData.patrimoine_immobilier === option}
                          onChange={() => setFormData({ ...formData, patrimoine_immobilier: option })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-light text-gray-700 dark:text-gray-300 whitespace-nowrap">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Revenus réguliers annuels bruts */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Revenus réguliers annuels bruts</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-3">
                    {['0-30k€', '31-45k€', '46-75k€', '76-100k€', '+100k€'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="revenus_reguliers"
                          checked={formData.revenus_reguliers === option}
                          onChange={() => setFormData({ ...formData, revenus_reguliers: option })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-light text-gray-700 dark:text-gray-300 whitespace-nowrap">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Origine des revenus */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Origine des revenus</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-3">
                    {[
                      { key: 'salaire', label: 'Salaire' },
                      { key: 'pension_retraite', label: 'Pension/retraite' },
                      { key: 'bic_bnc', label: 'BIC/BNC' },
                      { key: 'revenu_fonciers', label: 'Revenu fonciers' },
                      { key: 'autre', label: 'Autre' },
                    ].map((option) => (
                      <label key={option.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.origine_revenus[option.key as keyof typeof formData.origine_revenus]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              origine_revenus: {
                                ...formData.origine_revenus,
                                [option.key]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-light text-gray-700 dark:text-gray-300 whitespace-nowrap">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Charges régulières */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Charges régulières</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-3">
                    {['0-20%', '21-40%', '41-60%', '61-80%', '+80%'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="charges_regulieres"
                          checked={formData.charges_regulieres === option}
                          onChange={() => setFormData({ ...formData, charges_regulieres: option })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-light text-gray-700 dark:text-gray-300 whitespace-nowrap">{option}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2">Loyer, emprunts, dépenses courantes...</p>
                </div>
              </>
            )}

            {activeTab === 'obligations' && (
              <>
                {/* Foyer fiscal imposé en France */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Foyer fiscal imposé en France</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="foyer_fiscal_france"
                        checked={formData.foyer_fiscal_france === true}
                        onChange={() => setFormData({ ...formData, foyer_fiscal_france: true })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="foyer_fiscal_france"
                        checked={formData.foyer_fiscal_france === false}
                        onChange={() => setFormData({ ...formData, foyer_fiscal_france: false })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2">
                    Si non, préciser le pays suivi du numéro d'identification fiscale
                  </p>
                </div>

                {/* Pays / Identification fiscale */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Pays / Identification fiscale
                  </label>
                  <input
                    type="text"
                    value={formData.pays_identification_fiscale}
                    onChange={(e) => setFormData({ ...formData, pays_identification_fiscale: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                {/* Imposé en France à l'IFI */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Imposé en France à l'IFI</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="impose_france_ifi"
                        checked={formData.impose_france_ifi === true}
                        onChange={() => setFormData({ ...formData, impose_france_ifi: true })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="impose_france_ifi"
                        checked={formData.impose_france_ifi === false}
                        onChange={() => setFormData({ ...formData, impose_france_ifi: false })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'fatca' && (
              <>
                {/* Nationalité américaine */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Avez-vous la nationalité américaine</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="nationalite_americaine"
                        checked={formData.nationalite_americaine === true}
                        onChange={() => setFormData({ ...formData, nationalite_americaine: true })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="nationalite_americaine"
                        checked={formData.nationalite_americaine === false}
                        onChange={() => setFormData({ ...formData, nationalite_americaine: false })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2">
                    Si oui, numéro d'identification américain (Au choix ITIN, SSN, EIN)
                  </p>
                </div>

                {/* Résident fiscal USA */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Résident fiscal USA</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="resident_fiscal_usa"
                        checked={formData.resident_fiscal_usa === true}
                        onChange={() => setFormData({ ...formData, resident_fiscal_usa: true })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="resident_fiscal_usa"
                        checked={formData.resident_fiscal_usa === false}
                        onChange={() => setFormData({ ...formData, resident_fiscal_usa: false })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2">
                    Si oui, numéro d'identification américain (Au choix ITIN, SSN, EIN)
                  </p>
                </div>

                {/* Numéro d'identification américain */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Numéro d'identification américain
                  </label>
                  <input
                    type="text"
                    value={formData.numero_identification_americain}
                    onChange={(e) => setFormData({ ...formData, numero_identification_americain: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder=""
                  />
                </div>
              </>
            )}

            {activeTab === 'personne' && (
              <>
                {/* Fonction politique */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">
                    Avez vous exercé une fonction politique, juridictionnelle ou administrative importante depuis moins d'un an ?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fonction_politique"
                        checked={formData.fonction_politique === true}
                        onChange={() => setFormData({ ...formData, fonction_politique: true })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fonction_politique"
                        checked={formData.fonction_politique === false}
                        onChange={() => setFormData({ ...formData, fonction_politique: false })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2">Si oui : Fonction exercée + date de cessation</p>
                </div>

                {/* Fonction exercée / Date de cessation */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Fonction exercée / Date de cessation
                  </label>
                  <input
                    type="text"
                    value={formData.fonction_politique_details}
                    onChange={(e) => setFormData({ ...formData, fonction_politique_details: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                {/* Entourage fonction politique */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">
                    Personne de votre entourage proche a t'elle exercé une fonction politique, juridictionnelle ou administrative importante depuis moins d'un an ?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="entourage_fonction_politique"
                        checked={formData.entourage_fonction_politique === true}
                        onChange={() => setFormData({ ...formData, entourage_fonction_politique: true })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="entourage_fonction_politique"
                        checked={formData.entourage_fonction_politique === false}
                        onChange={() => setFormData({ ...formData, entourage_fonction_politique: false })}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-2">Si oui : Fonction exercée + lien avec cette personne</p>
                </div>

                {/* Fonction exercée / Lien avec cette personne */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Fonction exercée / Lien avec cette personne
                  </label>
                  <input
                    type="text"
                    value={formData.entourage_fonction_politique_details}
                    onChange={(e) => setFormData({ ...formData, entourage_fonction_politique_details: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder=""
                  />
                </div>
              </>
            )}

            {activeTab === 'objectif' && (
              <>
                {/* Objectif principal */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Objectif principal</label>
                  <div className="space-y-2">
                    {[
                      { value: 'valoriser_capital', label: 'Valoriser capital' },
                      { value: 'transmettre_capital', label: 'Transmettre un capital' },
                      { value: 'completer_revenus', label: 'Compléter vos revenus' },
                      { value: 'epargner_projet', label: "Épargner en vue d'un projet" },
                      { value: 'preparer_retraite', label: 'Préparer votre retraite' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="objectif_principal"
                          checked={formData.objectif_principal === option.value}
                          onChange={() => setFormData({ ...formData, objectif_principal: option.value })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-light text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Objectifs secondaires */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Objectifs secondaires</label>
                  <input
                    type="text"
                    value={formData.objectifs_secondaires}
                    onChange={(e) => setFormData({ ...formData, objectifs_secondaires: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                {/* Horizon de placement */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Horizon de placement</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: '0-4', label: '0-4 ans' },
                      { value: '5-8', label: '5-8 ans' },
                      { value: '9-15', label: '9-15 ans' },
                      { value: '15+', label: '+15ans' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="horizon_placement"
                          checked={formData.horizon_placement === option.value}
                          onChange={() => setFormData({ ...formData, horizon_placement: option.value })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-light text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tranche d'âge */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Tranche d'âge</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: '-55', label: '-55 ans' },
                      { value: '55-69', label: '55 ans à 69 ans' },
                      { value: '70-85', label: '70 ans à 85 ans' },
                      { value: '85+', label: '+85 ans' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tranche_age"
                          checked={formData.tranche_age === option.value}
                          onChange={() => setFormData({ ...formData, tranche_age: option.value })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-light text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'connaissance' && (
              <>
                {/* Niveau d'expérience */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Niveau d'expérience des marchés financiers</label>
                  <div className="space-y-2">
                    {[
                      { value: 'pas_connaissance', label: "Pas de connaissance et pas d'expérience de placement sur produits financiers" },
                      { value: 'experience', label: "J'ai des connaissances / de l'expérience" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="niveau_experience"
                          checked={formData.niveau_experience === option.value}
                          onChange={() => setFormData({ ...formData, niveau_experience: option.value })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-light text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Produits investis */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                    Sur quels produits ? Dans lesquels avez-vous investi ces 3 dernières années ?
                  </label>
                  <input
                    type="text"
                    value={formData.produits_investis}
                    onChange={(e) => setFormData({ ...formData, produits_investis: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                {/* Orientation placement */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Placements financiers, quelle orientation ?</label>
                  <div className="space-y-2">
                    {[
                      { value: 'faible', label: 'Risque / Rendement Faible : +/- 5% par an' },
                      { value: 'modere', label: 'Risque / Rendement Modéré : +/- 10% par an' },
                      { value: 'eleve', label: 'Risque / Rendement Élevé : +/- 20% par an' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="orientation_placement"
                          checked={formData.orientation_placement === option.value}
                          onChange={() => setFormData({ ...formData, orientation_placement: option.value })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-light text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gestion patrimoine */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Gestion de votre patrimoine financier, vous avez l'habitude de</label>
                  <div className="space-y-2">
                    {[
                      { value: 'libre', label: 'Gestion libre : Je choisis' },
                      { value: 'mandat', label: 'Gestion sous mandat : Je confie' },
                      { value: 'evolutive', label: 'Gestion évolutive : Répartition et sécurisation automatiques' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gestion_patrimoine"
                          checked={formData.gestion_patrimoine === option.value}
                          onChange={() => setFormData({ ...formData, gestion_patrimoine: option.value })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-light text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Réaction placement en baisse */}
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Placement -20% sur 1 an, que faites vous ?</label>
                  <div className="space-y-2">
                    {[
                      { value: 'vends', label: 'Je vends, même à perte. Ce type de placement ne me convient pas.' },
                      { value: 'conserve', label: "Je conserve. Les fluctuations sont normales à court terme, c'est la croissance à long terme qui m'importe." },
                      { value: 'investis', label: "J'investis des sommes supplémentaires pour améliorer le rendement de mon portefeuille." },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="reaction_placement_baisse"
                          checked={formData.reaction_placement_baisse === option.value}
                          onChange={() => setFormData({ ...formData, reaction_placement_baisse: option.value })}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-light text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 bg-white dark:bg-gray-900 flex justify-between gap-3 rounded-b-3xl">
            <button
              onClick={() => setShowPreview(true)}
              className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-blue-50 dark:bg-blue-900/20 transition-all"
            >
              Prévisualiser
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-white dark:hover:bg-gray-800 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]" onClick={() => setShowPreview(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[10001] p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl my-4 flex flex-col border border-gray-200 dark:border-gray-700/50 pointer-events-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Prévisualisation - Recueil des exigences</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Informations du Lead */}
                  {leadData && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Informations personnelles</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">Civilité:</span> {leadData.civilite}</div>
                        <div><span className="font-medium">Nom:</span> {leadData.nom}</div>
                        <div><span className="font-medium">Prénom:</span> {leadData.prenom}</div>
                        <div><span className="font-medium">Date de naissance:</span> {leadData.date_naissance ? new Date(leadData.date_naissance).toLocaleDateString('fr-FR') : '-'}</div>
                        <div><span className="font-medium">Téléphone:</span> {leadData.telephone}</div>
                        <div><span className="font-medium">Email:</span> {leadData.email}</div>
                        <div><span className="font-medium">Site internet:</span> {leadData.site_internet || '-'}</div>
                        <div><span className="font-medium">TNS:</span> {leadData.actif ? 'Oui' : 'Non'}</div>
                        <div><span className="font-medium">Adresse:</span> {leadData.adresse || '-'}</div>
                        <div><span className="font-medium">Ville:</span> {leadData.ville || '-'}</div>
                        <div><span className="font-medium">Code postal:</span> {leadData.code_postal || '-'}</div>
                        <div><span className="font-medium">Statut professionnel:</span> {leadData.statut_professionnel || '-'}</div>
                        <div><span className="font-medium">Profession:</span> {leadData.profession || '-'}</div>
                        <div><span className="font-medium">Caisse professionnelle:</span> {leadData.caisse_professionnelle || '-'}</div>
                        <div><span className="font-medium">Rémunération:</span> {leadData.remuneration || '-'}</div>
                        <div><span className="font-medium">Dividende:</span> {leadData.dividende || '-'}</div>
                        <div><span className="font-medium">Crédit en cours:</span> {leadData.credit_en_cours || '-'}</div>
                        <div><span className="font-medium">Autres revenus:</span> {leadData.autres_revenus || '-'}</div>
                        <div><span className="font-medium">Situation familiale:</span> {leadData.situation_familiale || '-'}</div>
                        <div><span className="font-medium">Situation professionnelle:</span> {leadData.situation_professionnelle || '-'}</div>
                        <div className="col-span-2"><span className="font-medium">Projets:</span> {leadData.projets || '-'}</div>
                        <div className="col-span-2"><span className="font-medium">Commentaire:</span> {leadData.commentaire || '-'}</div>
                      </div>
                    </div>
                  )}

                  {/* Afficher les données uniquement si la checkbox est cochée */}
                  {formData.affiche_devoir_conseil && (
                    <>
                      {/* Situation Financière et Patrimoniale */}
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Situation Financière et Patrimoniale</h3>
                        <div className="space-y-3 text-sm">
                          <div><span className="font-medium">Patrimoine financier:</span> {formData.patrimoine_financier}</div>
                          <div><span className="font-medium">Patrimoine immobilier:</span> {formData.patrimoine_immobilier}</div>
                          <div><span className="font-medium">Revenus réguliers:</span> {formData.revenus_reguliers}</div>
                          <div><span className="font-medium">Charges régulières:</span> {formData.charges_regulieres}</div>
                          <div className="pt-2">
                            <span className="font-medium">Origine des revenus:</span>
                            <div className="ml-4 mt-1">
                              {formData.origine_revenus.salaire && <div>• Salaire</div>}
                              {formData.origine_revenus.pension_retraite && <div>• Pension de retraite</div>}
                              {formData.origine_revenus.bic_bnc && <div>• BIC/BNC</div>}
                              {formData.origine_revenus.revenu_fonciers && <div>• Revenus fonciers</div>}
                              {formData.origine_revenus.autre && <div>• Autre</div>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Objectifs */}
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Objectifs</h3>
                        <div className="space-y-3 text-sm">
                          <div><span className="font-medium">Objectif principal:</span> {formData.objectif_principal}</div>
                          <div><span className="font-medium">Horizon de placement:</span> {formData.horizon_placement}</div>
                          <div><span className="font-medium">Tranche d'âge:</span> {formData.tranche_age}</div>
                        </div>
                      </div>

                      {/* Connaissances et Expérience */}
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Connaissances et Expérience</h3>
                        <div className="space-y-3 text-sm">
                          <div><span className="font-medium">Niveau d'expérience:</span> {formData.niveau_experience}</div>
                          <div><span className="font-medium">Orientation placement:</span> {formData.orientation_placement}</div>
                          <div><span className="font-medium">Gestion du patrimoine:</span> {formData.gestion_patrimoine}</div>
                          <div><span className="font-medium">Réaction en cas de baisse:</span> {formData.reaction_placement_baisse}</div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Signature électronique */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Texte de signature électronique</h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      {leadData && (
                        <>
                          <p>Je soussigné(e) {leadData.prenom} {leadData.nom}, né(e) le {leadData.date_naissance ? new Date(leadData.date_naissance).toLocaleDateString('fr-FR') : '___________'}</p>
                          <p>Certifie avoir rempli ce recueil des exigences et des besoins en toute connaissance de cause.</p>
                          <p>Date de signature: {new Date().toLocaleDateString('fr-FR')}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 bg-white flex justify-end">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>,
    document.body
  );
}
