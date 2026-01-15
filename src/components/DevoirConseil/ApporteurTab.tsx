import { Search, Trash2 } from 'lucide-react';

interface ApporteurTabProps {
  userSearchQuery: string;
  userSearchResults: any[];
  apporteurAffaires: string;
  onSearchUsers: (query: string) => void;
  onSelectUser: (fullName: string) => void;
  onRemoveUser: () => void;
}

export default function ApporteurTab({
  userSearchQuery,
  userSearchResults,
  apporteurAffaires,
  onSearchUsers,
  onSelectUser,
  onRemoveUser
}: ApporteurTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">
          <span className="text-red-500">*</span> Apporteur d'affaires (non visible client)
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={userSearchQuery}
            onChange={(e) => onSearchUsers(e.target.value)}
            placeholder="Rechercher et ajouter un utilisateur..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
          />
        </div>

        {userSearchQuery && userSearchResults.length > 0 && !apporteurAffaires && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-light text-gray-900">
                Résultats de recherche ({userSearchResults.length})
              </h3>
            </div>
            <div className="bg-white/80 border border-gray-200 rounded-2xl max-h-60 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {userSearchResults.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-light text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-600 font-light">{user.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectUser(`${user.first_name} ${user.last_name}`)}
                      className="px-4 py-1.5 rounded-full text-xs font-light transition-all bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                    >
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {apporteurAffaires && (
          <div className="mt-4">
            <h3 className="text-sm font-light text-gray-900 mb-3">Apporteur d'affaires sélectionné</h3>
            <div className="bg-white/80 border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-light">
                  {apporteurAffaires.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-light text-gray-900">{apporteurAffaires}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemoveUser}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
