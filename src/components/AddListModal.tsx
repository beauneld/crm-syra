import { X, Upload, Plus, Search, UserPlus, Trash2, Eye, Edit2, Sheet, Link2 } from 'lucide-react';
import { useState, useRef } from 'react';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
}

interface ListData {
  id?: string;
  name: string;
  type: string;
  leads: Lead[];
  users: string[];
  managers: string[];
}

interface AddListModalProps {
  onClose: () => void;
  onSave?: (listId: string, users: string[], managers: string[]) => void;
  list?: ListData;
  availableUsers: User[];
}

export default function AddListModal({ onClose, onSave, list, availableUsers }: AddListModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'leads' | 'users'>('info');
  const [listName, setListName] = useState(list?.name || '');
  const [listType, setListType] = useState(list?.type || 'Importés');
  const [leads, setLeads] = useState<Lead[]>(list?.leads || []);

  const getUserIdsFromNames = (names: string[]) => {
    return names.map(name => {
      const user = availableUsers.find(u => `${u.first_name} ${u.last_name}` === name);
      return user?.id;
    }).filter(Boolean) as string[];
  };

  const getExampleUsersForList = (listName: string) => {
    if (!list && !listName) {
      const exampleManagers = availableUsers.filter(u => u.role === 'Manager' || u.role === 'Admin').slice(0, 3);
      const exampleUsers = availableUsers.filter(u => u.role === 'Utilisateur' || u.role === 'Indicateur d\'affaires').slice(0, 4);
      return {
        managers: exampleManagers.map(u => u.id),
        users: exampleUsers.map(u => u.id)
      };
    }
    return { managers: [], users: [] };
  };

  const examples = getExampleUsersForList(listName);

  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    list?.users ? getUserIdsFromNames(list.users) : examples.users
  );
  const [selectedManagers, setSelectedManagers] = useState<string[]>(
    list?.managers ? getUserIdsFromNames(list.managers) : examples.managers
  );
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [manualLeadStep, setManualLeadStep] = useState(1);
  const [manualLeadData, setManualLeadData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    status: '',
    city: '',
    department: '',
    birth_year: '',
    imposition: '',
    residence_status: '',
    postal_code: ''
  });
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editingLeadData, setEditingLeadData] = useState<Lead | null>(null);
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = availableUsers.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());

      const nameIndex = headers.findIndex(h => h.includes('nom') || h.includes('name'));
      const emailIndex = headers.findIndex(h => h.includes('email') || h.includes('mail'));
      const phoneIndex = headers.findIndex(h => h.includes('phone') || h.includes('tel') || h.includes('telephone'));

      const newLeads: Lead[] = rows.slice(1)
        .filter(row => row.trim())
        .map((row, index) => {
          const columns = row.split(',').map(c => c.trim());
          return {
            id: `imported-${Date.now()}-${index}`,
            name: columns[nameIndex] || '',
            email: columns[emailIndex] || '',
            phone: columns[phoneIndex] || '',
            status: 'nouveau'
          };
        })
        .filter(lead => lead.name || lead.email);

      setLeads([...leads, ...newLeads]);
    };
    reader.readAsText(file);
  };

  const handleAddManualLead = () => {
    if (!manualLeadData.first_name || !manualLeadData.last_name || !manualLeadData.email) return;

    const newLead: Lead = {
      id: `manual-${Date.now()}`,
      name: `${manualLeadData.first_name} ${manualLeadData.last_name}`,
      email: manualLeadData.email,
      phone: manualLeadData.phone,
      status: manualLeadData.status || 'nouveau'
    };

    setLeads([...leads, newLead]);
    setManualLeadData({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      status: '',
      city: '',
      department: '',
      birth_year: '',
      imposition: '',
      residence_status: '',
      postal_code: ''
    });
    setManualLeadStep(1);
  };

  const handleRemoveLead = (leadId: string) => {
    setLeads(leads.filter(l => l.id !== leadId));
  };

  const handleStartEditLead = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setEditingLeadData({ ...lead });
  };

  const handleSaveEditLead = () => {
    if (editingLeadId && editingLeadData) {
      setLeads(leads.map(l => l.id === editingLeadId ? editingLeadData : l));
      setEditingLeadId(null);
      setEditingLeadData(null);
    }
  };

  const handleCancelEditLead = () => {
    setEditingLeadId(null);
    setEditingLeadData(null);
  };

  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleManager = (userId: string) => {
    if (selectedManagers.includes(userId)) {
      setSelectedManagers(selectedManagers.filter(id => id !== userId));
    } else {
      setSelectedManagers([...selectedManagers, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name: listName,
      type: listType,
      leads: leads,
      users: selectedUsers,
      managers: selectedManagers
    });
    if (list?.id && onSave) {
      onSave(list.id, selectedUsers, selectedManagers);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700/50 pointer-events-auto max-h-[90vh] flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">
              {list ? 'Éditer la liste' : 'Créer une nouvelle liste'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700/30 flex-shrink-0">
            <div className="flex gap-1 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 text-sm font-light transition-all ${
                  activeTab === 'info'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Informations
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-6 py-3 text-sm font-light transition-all ${
                  activeTab === 'leads'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 text-sm font-light transition-all ${
                  activeTab === 'users'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Accès ({selectedUsers.length})
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            {activeTab === 'info' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Nom de la liste</label>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                    placeholder="Ex: Professions médicales"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Type de liste</label>
                  <select
                    value={listType}
                    onChange={(e) => setListType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  >
                    <option value="Importés">Importés</option>
                    <option value="Manuels">Manuels</option>
                    <option value="Mixte">Mixte</option>
                  </select>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20/50 border border-blue-100 dark:border-blue-800 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                    Après avoir créé la liste, vous pourrez ajouter des leads via l'import CSV ou manuellement dans l'onglet "Leads".
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-sm font-light text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Importer un fichier CSV
                    </h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm font-light hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      Choisir un fichier
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-3">
                      Format attendu : Nom, Email, Téléphone
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-sm font-light text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Sheet className="w-4 h-4 text-green-600 dark:text-green-400" />
                      Importer depuis Google Sheets
                      <span className="ml-auto px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">LIVE</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => alert('Fonctionnalité Google Sheets - À venir. Nécessite un compte Admin ou Manager avec Google Sheets synchronisé.')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl text-sm font-light hover:from-green-600 hover:to-green-700 flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Link2 className="w-4 h-4" />
                      Connecter Google Sheets
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-3">
                      Synchronisation en temps réel avec votre feuille
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-light text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Ajouter manuellement
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                      Étape {manualLeadStep} / 4
                    </span>
                  </div>

                  {manualLeadStep === 1 && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                        <input
                          type="text"
                          value={manualLeadData.first_name}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, first_name: e.target.value })}
                          placeholder="Prénom"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                        <input
                          type="text"
                          value={manualLeadData.last_name}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, last_name: e.target.value })}
                          placeholder="Nom"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                        <input
                          type="tel"
                          value={manualLeadData.phone}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, phone: e.target.value })}
                          placeholder="Téléphone"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                    </div>
                  )}

                  {manualLeadStep === 2 && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={manualLeadData.email}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, email: e.target.value })}
                          placeholder="Email"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                        <input
                          type="text"
                          value={manualLeadData.status}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, status: e.target.value })}
                          placeholder="Statut"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                        <input
                          type="text"
                          value={manualLeadData.city}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, city: e.target.value })}
                          placeholder="Ville"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                    </div>
                  )}

                  {manualLeadStep === 3 && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Département</label>
                        <input
                          type="text"
                          value={manualLeadData.department}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, department: e.target.value })}
                          placeholder="Département"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Année</label>
                        <input
                          type="text"
                          value={manualLeadData.birth_year}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, birth_year: e.target.value })}
                          placeholder="Année"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Imposition</label>
                        <input
                          type="text"
                          value={manualLeadData.imposition}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, imposition: e.target.value })}
                          placeholder="Imposition"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                    </div>
                  )}

                  {manualLeadStep === 4 && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Résidence</label>
                        <input
                          type="text"
                          value={manualLeadData.residence_status}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, residence_status: e.target.value })}
                          placeholder="Résidence"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-1">Code postal</label>
                        <input
                          type="text"
                          value={manualLeadData.postal_code}
                          onChange={(e) => setManualLeadData({ ...manualLeadData, postal_code: e.target.value })}
                          placeholder="Code postal"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setManualLeadStep(Math.max(1, manualLeadStep - 1))}
                      disabled={manualLeadStep === 1}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>

                    {manualLeadStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => setManualLeadStep(Math.min(4, manualLeadStep + 1))}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-light hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        Suivant
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddManualLead}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-light hover:from-green-600 hover:to-green-700 flex items-center gap-2 shadow-md transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-light text-gray-900 dark:text-gray-100">Leads dans cette liste ({leads.length})</h3>
                  </div>
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      placeholder="Rechercher un lead par nom, email ou téléphone..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                    />
                  </div>
                  <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl max-h-[600px] overflow-y-auto">
                    {leads.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-light text-sm">
                        Aucun lead ajouté pour le moment
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {leads
                          .filter(lead => {
                            if (!leadSearchQuery) return true;
                            const searchLower = leadSearchQuery.toLowerCase();
                            return (
                              lead.name.toLowerCase().includes(searchLower) ||
                              lead.email.toLowerCase().includes(searchLower) ||
                              lead.phone.toLowerCase().includes(searchLower)
                            );
                          })
                          .map((lead) => (
                          <div key={lead.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            {editingLeadId === lead.id ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={editingLeadData?.name || ''}
                                  onChange={(e) => setEditingLeadData(editingLeadData ? { ...editingLeadData, name: e.target.value } : null)}
                                  placeholder="Nom complet"
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                                />
                                <input
                                  type="email"
                                  value={editingLeadData?.email || ''}
                                  onChange={(e) => setEditingLeadData(editingLeadData ? { ...editingLeadData, email: e.target.value } : null)}
                                  placeholder="Email"
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                                />
                                <input
                                  type="tel"
                                  value={editingLeadData?.phone || ''}
                                  onChange={(e) => setEditingLeadData(editingLeadData ? { ...editingLeadData, phone: e.target.value } : null)}
                                  placeholder="Téléphone"
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={handleSaveEditLead}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light hover:from-green-600 hover:to-green-700 transition-all"
                                  >
                                    Enregistrer
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelEditLead}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-light transition-all"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-light text-gray-900 dark:text-gray-100">{lead.name}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{lead.email} • {lead.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditLead(lead)}
                                    className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 flex items-center justify-center transition-all"
                                  >
                                    <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLead(lead.id)}
                                    className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 flex items-center justify-center transition-all"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Rechercher et ajouter des utilisateurs..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                </div>

                {userSearchQuery && availableUsers
                  .filter(user => !selectedUsers.includes(user.id))
                  .filter(user =>
                    `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                  ).length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-light text-gray-900 dark:text-gray-100">
                        Résultats de recherche ({availableUsers
                          .filter(user => !selectedUsers.includes(user.id))
                          .filter(user =>
                            `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                          ).length})
                      </h3>
                    </div>
                    <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl max-h-60 overflow-y-auto mb-6">
                      <div className="divide-y divide-gray-200">
                        {availableUsers
                          .filter(user => !selectedUsers.includes(user.id))
                          .filter(user =>
                            `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                          )
                          .map((user) => (
                            <div
                              key={`search-${user.id}`}
                              className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-light">
                                  {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.first_name} {user.last_name}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleUser(user.id);
                                    toggleManager(user.id);
                                    setUserSearchQuery('');
                                  }}
                                  className="px-3 py-1.5 rounded-full text-xs font-light transition-all bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100"
                                >
                                  Manager
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleUser(user.id);
                                    setUserSearchQuery('');
                                  }}
                                  className="px-3 py-1.5 rounded-full text-xs font-light transition-all bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 hover:bg-blue-100"
                                >
                                  Utilisateur
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-light text-gray-900 dark:text-gray-100">Managers ({selectedManagers.length})</h3>
                  </div>
                  <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl max-h-60 overflow-y-auto">
                    {availableUsers
                      .filter(user => selectedManagers.includes(user.id))
                      .filter(user =>
                        `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                      ).length === 0 ? (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400 font-light text-sm">
                        {userSearchQuery ? 'Aucun manager trouvé' : 'Aucun manager pour cette liste'}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {availableUsers
                          .filter(user => selectedManagers.includes(user.id))
                          .filter(user =>
                            `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                          )
                          .map((user) => (
                            <div
                              key={`manager-${user.id}`}
                              className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-light">
                                  {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.first_name} {user.last_name}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleManager(user.id)}
                                  className="px-3 py-1.5 rounded-full text-xs font-light transition-all bg-gray-50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  Rétrograder
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleUser(user.id);
                                    toggleManager(user.id);
                                  }}
                                  className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 flex items-center justify-center transition-all"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-light text-gray-900 dark:text-gray-100">Utilisateurs avec accès ({selectedUsers.filter(id => !selectedManagers.includes(id)).length})</h3>
                  </div>
                  <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl max-h-60 overflow-y-auto">
                    {availableUsers
                      .filter(user => selectedUsers.includes(user.id) && !selectedManagers.includes(user.id))
                      .filter(user =>
                        `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                      ).length === 0 ? (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400 font-light text-sm">
                        {userSearchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur avec accès'}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {availableUsers
                          .filter(user => selectedUsers.includes(user.id) && !selectedManagers.includes(user.id))
                          .filter(user =>
                            `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                          )
                          .map((user) => (
                            <div
                              key={`user-${user.id}`}
                              className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light">
                                  {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.first_name} {user.last_name}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleManager(user.id)}
                                  className="px-3 py-1.5 rounded-full text-xs font-light transition-all bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100"
                                >
                                  Promouvoir
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleUser(user.id)}
                                  className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 flex items-center justify-center transition-all"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
            >
              {list ? 'Enregistrer' : 'Créer la liste'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
