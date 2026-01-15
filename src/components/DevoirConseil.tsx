import { useState, useEffect } from 'react';
import { Bell, FileText, Plus, Search, Filter, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PDFViewerModal from './PDFViewerModal';
import NewDevoirConseil from './NewDevoirConseil';
import type { DevoirConseil, DevoirConseilContrat, DevoirConseilStatus } from '../types';

interface PageHeaderProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export default function DevoirConseil({ onNotificationClick, notificationCount }: PageHeaderProps) {
  const [conseils, setConseils] = useState<DevoirConseil[]>([]);
  const [editingConseil, setEditingConseil] = useState<DevoirConseil | null>(null);
  const [viewingConseil, setViewingConseil] = useState<DevoirConseil | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewDevoirForm, setShowNewDevoirForm] = useState(false);
  const [filterClientName, setFilterClientName] = useState('');
  const [filterContrat, setFilterContrat] = useState('');
  const [filterDateDebut, setFilterDateDebut] = useState('');
  const [filterDateFin, setFilterDateFin] = useState('');
  const [filterBudgetMin, setFilterBudgetMin] = useState('');
  const [filterBudgetMax, setFilterBudgetMax] = useState('');
  const [listSearchTerm, setListSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  const [filterMyRecordsOnly, setFilterMyRecordsOnly] = useState(false);
  const [filterLegalForm, setFilterLegalForm] = useState('');
  const [filterCollaborator, setFilterCollaborator] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterHasContracts, setFilterHasContracts] = useState('');
  const [filterContractProducts, setFilterContractProducts] = useState<string[]>([]);
  const [filterNoContractProducts, setFilterNoContractProducts] = useState<string[]>([]);
  const [contractInputValue, setContractInputValue] = useState('');
  const [noContractInputValue, setNoContractInputValue] = useState('');
  const [showContractAutocomplete, setShowContractAutocomplete] = useState(false);
  const [showNoContractAutocomplete, setShowNoContractAutocomplete] = useState(false);

  const PRODUCT_LIST = [
    'Accord de participation',
    "Accord d'intéressement",
    'Assurance Bris de Machines',
    "Assurance Prud'homme",
    'Assurance Santé Chien Chat',
    "Assurance des Œuvres d'Art et Collections",
    'Assurance habitation colocation',
    'Assurance trottinette électrique & NVEI',
    'Auto / Moto',
    'Bateau de Plaisance',
    'Dommages Ouvrage',
    'Dépendance',
    'Emprunteur',
    'Épargne',
    'Épargne Salariale',
    'Flotte de Véhicules Entreprise',
    'Flotte de Véhicules et Matériels Agricoles',
    'Garantie Accident de la Vie',
    'Garantie Loyers Impayés',
    'IFC / IL',
    'Intempéries',
    'Loisirs',
    'Multirisque Associations',
    'Multirisque Commerce',
    'Multirisque Habitation',
    'Multirisque Immeuble',
    'Multirisque Professionnelle',
    'Obsèques',
    'Propriétaire Non Occupant',
    'Protection Juridique',
    'Protection Juridique Professionnelle',
    'Prévoyance Collective',
    'Prévoyance Individuelle',
    'Responsabilité Civile Décennale',
    'Responsabilité Civile Professionnelle',
    'Responsabilité Civile Vie Privée',
    'Retraite',
    'Santé Collective',
    'Santé Individuelle',
    'Scolaire et Extra-scolaire',
    'Tous Risques Bureaux',
    'Tracteurs et Matériels Agricoles',
    'Voyage',
    'Véhicule Professionnel'
  ];

  useEffect(() => {
    loadConseils();
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    const { data: profilesData } = await supabase
      .from('user_profiles')
      .select('profile_type')
      .limit(1)
      .maybeSingle();

    if (profilesData) {
      setUserRole(profilesData.profile_type);
    }
  };


  const loadConseils = async () => {
    const { data: conseilsData, error: conseilsError } = await supabase
      .from('devoirs_conseil')
      .select('*')
      .order('created_at', { ascending: false });

    if (conseilsError) {
      console.error('Error loading conseils:', conseilsError);
      return;
    }

    if (conseilsData) {
      const conseilsWithContrats = await Promise.all(
        conseilsData.map(async (conseil) => {
          const { data: contratsData } = await supabase
            .from('devoir_conseil_contrats')
            .select('*')
            .eq('devoir_conseil_id', conseil.id)
            .order('created_at', { ascending: true });

          return {
            ...conseil,
            contrats: contratsData || []
          };
        })
      );

      setConseils(conseilsWithContrats);
    }
  };

  const handleSendToAffairesNouvelles = async (conseilId: string) => {
    const { error } = await supabase
      .from('devoirs_conseil')
      .update({ status: 'Envoyé en AF' })
      .eq('id', conseilId);

    if (error) {
      console.error('Error sending to affaires nouvelles:', error);
      alert('Erreur lors de l\'envoi en affaires nouvelles');
    } else {
      alert('Devoir de conseil envoyé en affaires nouvelles avec succès');
      loadConseils();
    }
  };

  const filteredConseils = conseils.filter(conseil => {
    const contratsText = conseil.contrats?.map(c => `${c.contrat_type} ${c.contrat_nom}`).join(' ').toLowerCase() || '';

    const matchesSearch = listSearchTerm === '' ||
      conseil.client_name.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
      contratsText.includes(listSearchTerm.toLowerCase());

    const matchesClientName = filterClientName === '' ||
      conseil.client_name.toLowerCase().includes(filterClientName.toLowerCase());

    const matchesContrat = filterContrat === '' ||
      contratsText.includes(filterContrat.toLowerCase());

    const matchesDateDebut = filterDateDebut === '' ||
      new Date(conseil.date_signature) >= new Date(filterDateDebut);

    const matchesDateFin = filterDateFin === '' ||
      new Date(conseil.date_signature) <= new Date(filterDateFin);

    const conseilBudget = parseFloat(conseil.budget.replace(/[^0-9.]/g, '')) || 0;
    const matchesBudgetMin = filterBudgetMin === '' ||
      conseilBudget >= parseFloat(filterBudgetMin);

    const matchesBudgetMax = filterBudgetMax === '' ||
      conseilBudget <= parseFloat(filterBudgetMax);

    return matchesSearch && matchesClientName && matchesContrat &&
           matchesDateDebut && matchesDateFin && matchesBudgetMin && matchesBudgetMax;
  });

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Devoir de conseil</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Gestion des documents d'adéquation DDA</p>
        </div>
        <button
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-105 relative flex-shrink-0"
        >
          <Bell className="w-5 h-5 text-gray-900 dark:text-gray-300" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 max-w-[1800px] mx-auto">
        {!showNewDevoirForm && (
          <>
            <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou contrat..."
                  value={listSearchTerm}
                  onChange={(e) => setListSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-light text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex-shrink-0"
              >
                <Filter className="w-4 h-4 text-gray-900 dark:text-gray-300" />
                Filtres
                {(filterClientName || filterContrat || filterDateDebut || filterDateFin || filterBudgetMin || filterBudgetMax) && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setShowNewDevoirForm(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center gap-2 justify-center flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Nouveau devoir de conseil
              </button>
            </div>

            {showFilters && (
              <>
                <div className="fixed inset-0 z-[9998]" onClick={() => setShowFilters(false)} />
                <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-[600px]">
                    <div className="p-6 border-b border-gray-200/30 flex items-center justify-between">
                      <h2 className="text-xl font-light text-gray-900">Filtres</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-light text-gray-700">Nom du client</label>
                        </div>
                        <input
                          type="text"
                          placeholder="Filtrer par nom..."
                          value={filterClientName}
                          onChange={(e) => setFilterClientName(e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-light text-gray-700">Période de signature</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            placeholder="Date début"
                            value={filterDateDebut}
                            onChange={(e) => setFilterDateDebut(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                          />
                          <input
                            type="date"
                            placeholder="Date fin"
                            value={filterDateFin}
                            onChange={(e) => setFilterDateFin(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-light text-gray-700">Budget (€/mois)</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            placeholder="Budget Min."
                            value={filterBudgetMin}
                            onChange={(e) => setFilterBudgetMin(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                          />
                          <input
                            type="number"
                            placeholder="Budget Max."
                            value={filterBudgetMax}
                            onChange={(e) => setFilterBudgetMax(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                          />
                        </div>
                      </div>

                      {userRole && ['Admin', 'Manager', 'Gestion'].includes(userRole) && (
                        <>
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Filtres avancés</h4>

                            <div className="space-y-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filterMyRecordsOnly}
                                  onChange={(e) => setFilterMyRecordsOnly(e.target.checked)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span className="text-sm font-light text-gray-700">Uniquement mes enregistrements</span>
                              </label>

                              <div>
                                <label className="text-sm font-light text-gray-700 block mb-2">Forme juridique</label>
                                <select
                                  value={filterLegalForm}
                                  onChange={(e) => setFilterLegalForm(e.target.value)}
                                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                                >
                                  <option value="">Tous</option>
                                  <option value="Personnes physiques">Personnes physiques</option>
                                  <option value="Personnes morales">Personnes morales</option>
                                </select>
                              </div>

                              <div className="relative">
                                <label className="text-sm font-light text-gray-700 block mb-2">Collaborateur</label>
                                <input
                                  type="text"
                                  value={filterCollaborator}
                                  onChange={(e) => setFilterCollaborator(e.target.value)}
                                  placeholder="Rechercher un collaborateur..."
                                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                                />
                                {filterCollaborator && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                                    {['Marie Dubois', 'Jean Martin', 'Sophie Lefevre', 'Philippe Renard']
                                      .filter(name => name.toLowerCase().includes(filterCollaborator.toLowerCase()))
                                      .map((name) => (
                                        <button
                                          key={name}
                                          type="button"
                                          onClick={() => {
                                            setFilterCollaborator(name);
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 font-light first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-200 last:border-b-0"
                                        >
                                          {name}
                                        </button>
                                      ))}
                                  </div>
                                )}
                              </div>

                              <div>
                                <label className="text-sm font-light text-gray-700 block mb-2">Statut du dossier</label>
                                <select
                                  value={filterStatus}
                                  onChange={(e) => setFilterStatus(e.target.value)}
                                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                                >
                                  <option value="">Tous</option>
                                  <option value="Non signé">Non signé</option>
                                  <option value="Signature par email">Signature par email</option>
                                  <option value="Signature physique">Signature physique</option>
                                  <option value="Envoyé en AF">Envoyé en AF</option>
                                </select>
                              </div>

                              <div className="border-t border-gray-200 pt-3">
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input
                                    type="checkbox"
                                    checked={filterHasContracts === 'has'}
                                    onChange={(e) => {
                                      setFilterHasContracts(e.target.checked ? 'has' : '');
                                      if (!e.target.checked) {
                                        setFilterContractProducts([]);
                                        setContractInputValue('');
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                  />
                                  <span className="text-sm font-light text-gray-700">Détient un de ces contrats</span>
                                </label>
                                {filterHasContracts === 'has' && (
                                  <div className="ml-6 mt-2">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {filterContractProducts.map((product) => (
                                        <div key={product} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-light">
                                          <span>{product}</span>
                                          <button
                                            type="button"
                                            onClick={() => setFilterContractProducts(filterContractProducts.filter(p => p !== product))}
                                            className="hover:bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={contractInputValue}
                                        onChange={(e) => {
                                          setContractInputValue(e.target.value);
                                          setShowContractAutocomplete(true);
                                        }}
                                        onFocus={() => setShowContractAutocomplete(true)}
                                        placeholder="Ajouter des contrats..."
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                                      />
                                      {showContractAutocomplete && contractInputValue && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                          {PRODUCT_LIST
                                            .filter(product =>
                                              product.toLowerCase().includes(contractInputValue.toLowerCase()) &&
                                              !filterContractProducts.includes(product)
                                            )
                                            .slice(0, 10)
                                            .map((product) => (
                                              <button
                                                key={product}
                                                type="button"
                                                onClick={() => {
                                                  setFilterContractProducts([...filterContractProducts, product]);
                                                  setContractInputValue('');
                                                  setShowContractAutocomplete(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 font-light border-b border-gray-200 last:border-b-0"
                                              >
                                                {product}
                                              </button>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="border-t border-gray-200 pt-3">
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input
                                    type="checkbox"
                                    checked={filterHasContracts === 'not'}
                                    onChange={(e) => {
                                      setFilterHasContracts(e.target.checked ? 'not' : '');
                                      if (!e.target.checked) {
                                        setFilterNoContractProducts([]);
                                        setNoContractInputValue('');
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                  />
                                  <span className="text-sm font-light text-gray-700">Ne détient pas un de ces contrats</span>
                                </label>
                                {filterHasContracts === 'not' && (
                                  <div className="ml-6 mt-2">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {filterNoContractProducts.map((product) => (
                                        <div key={product} className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-light">
                                          <span>{product}</span>
                                          <button
                                            type="button"
                                            onClick={() => setFilterNoContractProducts(filterNoContractProducts.filter(p => p !== product))}
                                            className="hover:bg-red-200 rounded-full w-5 h-5 flex items-center justify-center"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={noContractInputValue}
                                        onChange={(e) => {
                                          setNoContractInputValue(e.target.value);
                                          setShowNoContractAutocomplete(true);
                                        }}
                                        onFocus={() => setShowNoContractAutocomplete(true)}
                                        placeholder="Ajouter des contrats..."
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                                      />
                                      {showNoContractAutocomplete && noContractInputValue && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                          {PRODUCT_LIST
                                            .filter(product =>
                                              product.toLowerCase().includes(noContractInputValue.toLowerCase()) &&
                                              !filterNoContractProducts.includes(product)
                                            )
                                            .slice(0, 10)
                                            .map((product) => (
                                              <button
                                                key={product}
                                                type="button"
                                                onClick={() => {
                                                  setFilterNoContractProducts([...filterNoContractProducts, product]);
                                                  setNoContractInputValue('');
                                                  setShowNoContractAutocomplete(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 font-light border-b border-gray-200 last:border-b-0"
                                              >
                                                {product}
                                              </button>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-6 border-t border-gray-200/30 flex gap-3">
                      <button
                        onClick={() => {
                          setFilterClientName('');
                          setFilterContrat('');
                          setFilterDateDebut('');
                          setFilterDateFin('');
                          setFilterBudgetMin('');
                          setFilterBudgetMax('');
                          setFilterMyRecordsOnly(false);
                          setFilterLegalForm('');
                          setFilterCollaborator('');
                          setFilterStatus('');
                          setFilterHasContracts('');
                          setFilterContractProducts('');
                          setFilterNoContractProducts('');
                        }}
                        className="flex-1 px-6 py-2.5 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
                      >
                        Réinitialiser
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={`space-y-4 transition-all duration-300 ${showFilters ? 'blur-sm' : ''}`}>
              {filteredConseils.map((conseil) => (
              <div key={conseil.id} className="glass-card glass-card-hover floating-shadow">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-light shadow-lg flex-shrink-0">
                        {conseil.client_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-gray-900 text-base md:text-lg">{conseil.client_name}</h3>
                        <p className="text-xs text-gray-500 font-light mt-1">
                          Créé le {new Date(conseil.created_at!).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-3 py-1 rounded-full font-light ${
                        conseil.status === 'Envoyé en AF'
                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                          : conseil.status === 'Signature par email' || conseil.status === 'Signature physique'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-orange-100 text-orange-700 border border-orange-300'
                      }`}>
                        {conseil.status || 'Non signé'}
                      </span>
                      {conseil.date_signature && (
                        <p className="text-xs text-gray-500 font-light">
                          Signé le {new Date(conseil.date_signature).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-sm mb-4">
                    <div>
                      <span className="text-gray-500 font-light">Contrats:</span>
                      <p className="text-gray-800">
                        {conseil.contrats && conseil.contrats.length > 0
                          ? `${conseil.contrats.length} contrat(s) - ${conseil.contrats.map(c => c.contrat_type).join(', ')}`
                          : 'Aucun contrat'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingConseil(conseil);
                        setShowNewDevoirForm(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
                    >
                      Consulter
                    </button>
                    {(conseil.status === 'Signature par email' || conseil.status === 'Signature physique') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendToAffairesNouvelles(conseil.id!);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-light hover:from-green-600 hover:to-green-700 shadow-md transition-all"
                      >
                        Envoyer en affaires nouvelles
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredConseils.length === 0 && (
              <div className="glass-card p-16 text-center floating-shadow">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-light">
                  {conseils.length === 0 ? 'Aucun devoir de conseil créé' : 'Aucun résultat ne correspond à vos critères'}
                </p>
              </div>
            )}
          </div>
          </>
        )}

        {showNewDevoirForm && (
          <NewDevoirConseil
            onClose={() => {
              setShowNewDevoirForm(false);
              setEditingConseil(null);
              loadConseils();
            }}
            onSubmit={(data) => {
              console.log('Form data submitted:', data);
              setShowNewDevoirForm(false);
              setEditingConseil(null);
              loadConseils();
            }}
            initialData={editingConseil || undefined}
            conseilId={editingConseil?.id}
          />
        )}
      </div>

      {viewingConseil && (
        <PDFViewerModal conseil={viewingConseil} onClose={() => setViewingConseil(null)} />
      )}
    </div>
  );
}
