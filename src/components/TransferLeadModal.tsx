import { X, UserPlus, Search } from 'lucide-react';
import { Lead, User } from '../types';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface TransferLeadModalProps {
  lead: Lead;
  onClose: () => void;
}

const mockUsers: User[] = [
  {
    id: '1',
    organization_id: '1',
    email: 'e.aboukrat@bnvce.fr',
    first_name: 'Ethan',
    last_name: 'Aboukrat',
    role: 'collaborateur',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '2',
    organization_id: '1',
    email: 'd.alamihamdouni@bnvce.fr',
    first_name: 'Driss',
    last_name: 'Alami hamdouni',
    role: 'collaborateur',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '3',
    organization_id: '1',
    email: 'm.assouline@bnvce.fr',
    first_name: 'Maor',
    last_name: 'Assouline',
    role: 'collaborateur',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '4',
    organization_id: '1',
    email: 's.atlan@bnvce.fr',
    first_name: 'Sacha',
    last_name: 'Atlan',
    role: 'collaborateur',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '5',
    organization_id: '1',
    email: 'm.azran@bnvce.fr',
    first_name: 'Moche',
    last_name: 'Azran',
    role: 'manager',
    is_active: true,
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
];

export default function TransferLeadModal({ lead, onClose }: TransferLeadModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setUsers(mockUsers);
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('first_name');

    if (error || !data || data.length === 0) {
      setUsers(mockUsers);
    } else {
      setUsers(data);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    return role === 'manager' ? 'Manager' : 'Collaborateur';
  };
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg my-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Transférer le lead</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all">
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
              <p className="text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Lead à transférer</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light shadow-md">
                  {lead.first_name[0]}{lead.last_name[0]}
                </div>
                <div>
                  <p className="text-sm font-light text-gray-900 dark:text-gray-100">{lead.first_name} {lead.last_name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{lead.email}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Transférer à</label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-light py-4">Aucun utilisateur trouvé</p>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`w-full p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                        selectedUserId === user.id
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white/80 hover:bg-white border-gray-200/50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-light shadow-md">
                        {getInitials(user.first_name, user.last_name)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{getRoleLabel(user.role)} • {user.email}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-2 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={onClose}
              disabled={!selectedUserId}
              className="flex-1 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Transférer
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
