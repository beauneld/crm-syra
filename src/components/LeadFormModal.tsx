import { X, Camera, Search, Upload } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { Lead } from '../types';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';

interface LeadFormModalProps {
  onClose: () => void;
  onSubmit?: (data: FormData) => void;
}

interface FormData {
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
  screenshot?: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    organization_id: '1',
    first_name: 'SERGE',
    last_name: 'DEL VALL',
    email: 'delvallepaton.sergie@gmail.com',
    phone: '0620847919',
    status: 'Actif',
    owner: 'Marie Dubois',
    owner_since: '2025-09-15',
    imposition: '+2500€',
    birth_year: 1985,
    postal_code: '31200',
    city: 'TOULOUSE',
    profession: '',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
];

export default function LeadFormModal({ onClose, onSubmit }: LeadFormModalProps) {
  const [currentStep, setCurrentStep] = useState<'screenshot' | 'search' | 'form'>('screenshot');
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'FAMILLE' | 'BESOINS' | 'FICHES' | 'AUTRES'>('GENERAL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    civilite: 'M.',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    site_internet: '',
    actif: false,
    adresse: '',
    ville: '',
    code_postal: '',
    date_naissance: '',
    statut_professionnel: '',
    profession: '',
    caisse_professionnelle: '',
    remuneration: '',
    dividende: '0',
    credit_en_cours: '0',
    autres_revenus: '0',
    commentaire: '',
  });

  const captureScreenshot = async () => {
    try {
      const element = document.body;
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scale: 0.5,
      });
      const screenshotData = canvas.toDataURL('image/png');
      setScreenshot(screenshotData);
      setCurrentStep('search');
    } catch (error) {
      console.error('Erreur lors de la capture d\'écran:', error);
      setCurrentStep('search');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const filtered = mockLeads.filter(lead =>
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        lead.phone.includes(query)
      );
      setSearchResults(filtered);
      return;
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(5);

    if (error || !data || data.length === 0) {
      const filtered = mockLeads.filter(lead =>
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        lead.phone.includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(data);
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setFormData({
      civilite: 'M.',
      nom: lead.last_name,
      prenom: lead.first_name,
      telephone: lead.phone || '',
      email: lead.email || '',
      site_internet: '',
      actif: true,
      adresse: '',
      ville: lead.city || '',
      code_postal: lead.postal_code || '',
      date_naissance: lead.birth_year ? `${lead.birth_year}-01-01` : '',
      statut_professionnel: '',
      profession: lead.profession || '',
      caisse_professionnelle: '',
      remuneration: '',
      dividende: '0',
      credit_en_cours: '0',
      autres_revenus: '0',
      commentaire: '',
      screenshot: screenshot || undefined,
    });
    setCurrentStep('form');
  };

  const handleSkipSearch = () => {
    setCurrentStep('form');
  };

  const updateFormField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-6xl my-4 overflow-hidden flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-light text-white">Devoir de conseil</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white dark:hover:bg-gray-800/30 flex items-center justify-center transition-all">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Screenshot Step */}
          {currentStep === 'screenshot' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-xl">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-light text-gray-800">Capture d'écran</h3>
              <p className="text-gray-600 dark:text-gray-400 font-light text-center max-w-md">
                Commencez par capturer une capture d'écran du contexte actuel pour référence future.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('search')}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 font-light transition-colors"
                >
                  Ignorer
                </button>
                <button
                  onClick={captureScreenshot}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-light hover:from-teal-600 hover:to-teal-700 shadow-lg transition-all hover:scale-105"
                >
                  Capturer l'écran
                </button>
              </div>
            </div>
          )}

          {/* Search Step */}
          {currentStep === 'search' && (
            <div className="flex-1 flex flex-col p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-light text-gray-800">Rechercher un client existant</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light text-sm">
                  Recherchez un client pour préremplir automatiquement le formulaire
                </p>
              </div>

              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Nom, prénom, email ou téléphone..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 dark:border-gray-700 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 font-light"
                  autoFocus
                />
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => handleSelectLead(lead)}
                      className="w-full p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center gap-4 transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-light shadow-md">
                        {lead.first_name.charAt(0)}{lead.last_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-light text-gray-900 dark:text-gray-100">{lead.first_name} {lead.last_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light">{lead.email} • {lead.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSkipSearch}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-light hover:from-teal-600 hover:to-teal-700 shadow-lg transition-all hover:scale-105"
                >
                  Créer un nouveau lead
                </button>
              </div>
            </div>
          )}

          {/* Form Step */}
          {currentStep === 'form' && (
            <>
              <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-light">
                    1
                  </div>
                  <span className="text-base font-light text-gray-700 dark:text-gray-300">Informations</span>
                </div>
                <div className="flex gap-2">
                  {(['GENERAL', 'FAMILLE', 'BESOINS', 'FICHES', 'AUTRES'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 text-sm font-light transition-all rounded-t-lg ${
                        activeTab === tab
                          ? 'bg-teal-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'GENERAL' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-light text-gray-700 dark:text-gray-300">TNS</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.actif}
                          onChange={(e) => updateFormField('actif', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                          <span className="text-red-500">*</span> Civilité
                        </label>
                        <select
                          value={formData.civilite}
                          onChange={(e) => updateFormField('civilite', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        >
                          <option>M.</option>
                          <option>Mme.</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                          <span className="text-red-500">*</span> Nom
                        </label>
                        <input
                          type="text"
                          value={formData.nom}
                          onChange={(e) => updateFormField('nom', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                          <span className="text-red-500">*</span> Prénom
                        </label>
                        <input
                          type="text"
                          value={formData.prenom}
                          onChange={(e) => updateFormField('prenom', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                          <span className="text-red-500">*</span> Téléphone du contact
                        </label>
                        <input
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => updateFormField('telephone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                          <span className="text-red-500">*</span> Email du contact
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormField('email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Site internet</label>
                        <input
                          type="url"
                          value={formData.site_internet}
                          onChange={(e) => updateFormField('site_internet', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Adresse</label>
                        <input
                          type="text"
                          value={formData.adresse}
                          onChange={(e) => updateFormField('adresse', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Ville</label>
                        <input
                          type="text"
                          value={formData.ville}
                          onChange={(e) => updateFormField('ville', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Code Postal</label>
                        <input
                          type="text"
                          value={formData.code_postal}
                          onChange={(e) => updateFormField('code_postal', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Date de Naissance</label>
                        <input
                          type="date"
                          value={formData.date_naissance}
                          onChange={(e) => updateFormField('date_naissance', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Statut Professionnel</label>
                        <select
                          value={formData.statut_professionnel}
                          onChange={(e) => updateFormField('statut_professionnel', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        >
                          <option value="">Sélectionner...</option>
                          <option>Salarié</option>
                          <option>Indépendant</option>
                          <option>Chef d'entreprise</option>
                          <option>Retraité</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Profession</label>
                        <input
                          type="text"
                          value={formData.profession}
                          onChange={(e) => updateFormField('profession', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Caisse professionnelle</label>
                        <select
                          value={formData.caisse_professionnelle}
                          onChange={(e) => updateFormField('caisse_professionnelle', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        >
                          <option value="">Sélectionner...</option>
                          <option>CIPAV</option>
                          <option>CARMF</option>
                          <option>CARPIMKO</option>
                          <option>CAVP</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Rémuneration</label>
                        <input
                          type="text"
                          value={formData.remuneration}
                          onChange={(e) => updateFormField('remuneration', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Dividende</label>
                        <input
                          type="text"
                          value={formData.dividende}
                          onChange={(e) => updateFormField('dividende', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Crédit en cours</label>
                        <input
                          type="text"
                          value={formData.credit_en_cours}
                          onChange={(e) => updateFormField('credit_en_cours', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Autres revenus</label>
                        <input
                          type="text"
                          value={formData.autres_revenus}
                          onChange={(e) => updateFormField('autres_revenus', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Commentaire</label>
                      <textarea
                        value={formData.commentaire}
                        onChange={(e) => updateFormField('commentaire', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none"
                      />
                    </div>

                    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 space-y-2">
                      <p className="text-teal-700 font-light text-sm text-center">
                        Recueil des exigences et des besoins pour des opérations
                        d'assurance vie, de retraite ou de capitalisation
                      </p>
                      <p className="text-teal-600 font-light text-xs text-center">
                        La partie des exigences et besoins vise à identifier les attentes et les besoins s'agissant de la souscription ou de l'opération envisagée
                        (Reversement, arbitrage, ...)
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'FAMILLE' && (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400 font-light">Section Famille - À venir</p>
                  </div>
                )}

                {activeTab === 'BESOINS' && (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400 font-light">Section Besoins - À venir</p>
                  </div>
                )}

                {activeTab === 'FICHES' && (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400 font-light">Section Fiches - À venir</p>
                  </div>
                )}

                {activeTab === 'AUTRES' && (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400 font-light">Section Autres - À venir</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={onClose}
                  className="px-8 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 font-light transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-light hover:from-teal-600 hover:to-teal-700 shadow-lg transition-all hover:scale-105"
                >
                  Enregistrer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
