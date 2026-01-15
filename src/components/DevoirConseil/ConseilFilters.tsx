import { Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ConseilFiltersProps {
  showFilters: boolean;
  filterClientName: string;
  filterContrat: string;
  filterDateDebut: string;
  filterDateFin: string;
  filterBudgetMin: string;
  filterBudgetMax: string;
  userRole?: string;
  onToggleFilters: () => void;
  onFilterChange: (field: string, value: string | boolean) => void;
  onClearFilters: () => void;
  filterMyRecordsOnly?: boolean;
  filterLegalForm?: string;
  filterCollaborator?: string;
  filterStatus?: string;
  filterHasContracts?: string;
  filterContractProducts?: string;
  filterNoContractProducts?: string;
}

export default function ConseilFilters({
  showFilters,
  filterClientName,
  filterContrat,
  filterDateDebut,
  filterDateFin,
  filterBudgetMin,
  filterBudgetMax,
  userRole,
  onToggleFilters,
  onFilterChange,
  onClearFilters,
  filterMyRecordsOnly = false,
  filterLegalForm = '',
  filterCollaborator = '',
  filterStatus = '',
  filterHasContracts = '',
  filterContractProducts = '',
  filterNoContractProducts = ''
}: ConseilFiltersProps) {
  const [collaborators, setCollaborators] = useState<any[]>([]);

  const isAdvancedUser = userRole && ['Admin', 'Manager', 'Gestion'].includes(userRole);

  useEffect(() => {
    if (isAdvancedUser) {
      loadCollaborators();
    }
  }, [isAdvancedUser]);

  const loadCollaborators = async () => {
    // Mock collaborators - in real app would fetch from database
    setCollaborators([
      { id: '1', name: 'Marie Dubois' },
      { id: '2', name: 'Jean Martin' },
      { id: '3', name: 'Sophie Lefevre' },
      { id: '4', name: 'Philippe Renard' }
    ]);
  };
  return (
    <>
      <button
        onClick={onToggleFilters}
        className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Filtres
      </button>

      {showFilters && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Réinitialiser
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Nom du client</label>
                <input
                  type="text"
                  value={filterClientName}
                  onChange={(e) => onFilterChange('filterClientName', e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Date de début</label>
                <input
                  type="date"
                  value={filterDateDebut}
                  onChange={(e) => onFilterChange('filterDateDebut', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Date de fin</label>
                <input
                  type="date"
                  value={filterDateFin}
                  onChange={(e) => onFilterChange('filterDateFin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Budget min (€)</label>
                <input
                  type="number"
                  value={filterBudgetMin}
                  onChange={(e) => onFilterChange('filterBudgetMin', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Budget max (€)</label>
                <input
                  type="number"
                  value={filterBudgetMax}
                  onChange={(e) => onFilterChange('filterBudgetMax', e.target.value)}
                  placeholder="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
            </div>

            {isAdvancedUser && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Filtres avancés</h4>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterMyRecordsOnly}
                        onChange={(e) => onFilterChange('filterMyRecordsOnly', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-normal text-gray-700">Uniquement mes enregistrements</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-2">Forme juridique</label>
                    <select
                      value={filterLegalForm}
                      onChange={(e) => onFilterChange('filterLegalForm', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white"
                    >
                      <option value="">Tous</option>
                      <option value="Personnes physiques">Personnes physiques</option>
                      <option value="Personnes morales">Personnes morales</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-2">Collaborateur</label>
                    <select
                      value={filterCollaborator}
                      onChange={(e) => onFilterChange('filterCollaborator', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white"
                    >
                      <option value="">Tous</option>
                      {collaborators.map(collab => (
                        <option key={collab.id} value={collab.id}>{collab.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-2">Statut du dossier</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => onFilterChange('filterStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white"
                    >
                      <option value="">Tous</option>
                      <option value="Non signé">Non signé</option>
                      <option value="Signature par email">Signature par email</option>
                      <option value="Signature physique">Signature physique</option>
                      <option value="Envoyé en AF">Envoyé en AF</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={filterHasContracts === 'has'}
                        onChange={(e) => onFilterChange('filterHasContracts', e.target.checked ? 'has' : '')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-normal text-gray-700">Détient un de ces contrats</span>
                    </label>
                    {filterHasContracts === 'has' && (
                      <input
                        type="text"
                        value={filterContractProducts}
                        onChange={(e) => onFilterChange('filterContractProducts', e.target.value)}
                        placeholder="Ex: Assurance Vie, PER, Santé..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 ml-6"
                      />
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={filterHasContracts === 'not'}
                        onChange={(e) => onFilterChange('filterHasContracts', e.target.checked ? 'not' : '')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-normal text-gray-700">Ne détient pas un de ces contrats</span>
                    </label>
                    {filterHasContracts === 'not' && (
                      <input
                        type="text"
                        value={filterNoContractProducts}
                        onChange={(e) => onFilterChange('filterNoContractProducts', e.target.value)}
                        placeholder="Ex: Assurance Vie, PER, Santé..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 ml-6"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
