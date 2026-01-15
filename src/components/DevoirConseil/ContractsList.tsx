import { Plus, Edit2, Trash2 } from 'lucide-react';

interface ContractsListProps {
  contracts: any[];
  contractFilter: string;
  onFilterChange: (filter: string) => void;
  onAddContract: () => void;
  onEditContract: (contract: any, index: number) => void;
  onDeleteContract: (index: number) => void;
}

export default function ContractsList({
  contracts,
  contractFilter,
  onFilterChange,
  onAddContract,
  onEditContract,
  onDeleteContract
}: ContractsListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1"></div>
        <select
          value={contractFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option>Tous les contrats</option>
          <option>Assurance vie</option>
          <option>PER</option>
          <option>Capitalisation</option>
          <option>Prévoyance</option>
        </select>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg mb-4">
        <div className="grid grid-cols-4 gap-6 px-4 py-3">
          <div className="text-xs font-light text-gray-600 uppercase">PORTEFEUILLE</div>
          <div className="text-xs font-light text-gray-600 uppercase">GAMME</div>
          <div className="text-xs font-light text-gray-600 uppercase">ASSUREUR</div>
          <div className="text-xs font-light text-gray-600 uppercase">ACTIONS</div>
        </div>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm font-light mb-6">Aucun élément n'a été trouvé</p>
          <button
            onClick={onAddContract}
            className="px-8 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un nouveau contrat
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {contracts.map((contract, index) => (
            <div key={index} className="grid grid-cols-4 gap-6 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
              <div className="text-sm font-light text-gray-700">{contract.en_portefeuille ? 'Oui' : 'Non'}</div>
              <div className="text-sm font-light text-gray-700">{contract.gamme_contrat}</div>
              <div className="text-sm font-light text-gray-700">{contract.assureur}</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEditContract(contract, index)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteContract(index)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={onAddContract}
            className="w-full px-8 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all inline-flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-4 h-4" />
            Ajouter un nouveau contrat
          </button>
        </div>
      )}
    </div>
  );
}
