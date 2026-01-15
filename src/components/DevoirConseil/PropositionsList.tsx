import { Trash2 } from 'lucide-react';

interface PropositionsListProps {
  propositions: string[];
  selectedProposition: string;
  propositionDates: { [key: string]: string };
  propositionOptions: string[];
  onSelectProposition: (value: string) => void;
  onAddProposition: () => void;
  onRemoveProposition: (index: number) => void;
  onUpdateDate: (proposition: string, date: string) => void;
  onShowTableauComparatif: () => void;
}

export default function PropositionsList({
  propositions,
  selectedProposition,
  propositionDates,
  propositionOptions,
  onSelectProposition,
  onAddProposition,
  onRemoveProposition,
  onUpdateDate,
  onShowTableauComparatif
}: PropositionsListProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <select
            value={selectedProposition}
            onChange={(e) => onSelectProposition(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">Sélectionner une proposition</option>
            {propositionOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onAddProposition}
          disabled={!selectedProposition}
          className="px-6 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter
        </button>
        <span className="text-sm font-light text-blue-600">{propositions.length} / 5</span>
      </div>

      <div className="space-y-4">
        {propositions.map((proposition, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-normal text-gray-800">{proposition}</h3>
              <input
                type="date"
                value={propositionDates[proposition] || ''}
                onChange={(e) => onUpdateDate(proposition, e.target.value)}
                className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Date d'effet"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onShowTableauComparatif}
                className="px-4 py-1.5 bg-white border border-blue-500 text-blue-600 rounded-full text-xs font-light hover:bg-blue-50 transition-all"
              >
                Tableau comparatif
              </button>
              <span className="text-sm font-light text-blue-600">0</span>
              <button
                onClick={() => onRemoveProposition(index)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
