import { X, Download, Plus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface TableauComparatifModalProps {
  onClose: () => void;
}

export default function TableauComparatifModal({ onClose }: TableauComparatifModalProps) {
  const [columnName, setColumnName] = useState('');
  const [showColumnInput, setShowColumnInput] = useState(false);
  const [visibleRows, setVisibleRows] = useState<{ [key: number]: boolean }>({});

  const rows = [
    'Système par point ou capitalisation',
    'Les Frais pendant la vie du contrat',
    'Frais sur versements',
    'Frais de gestion',
    "Frais d'arbitrage",
    'Frais transfert entrant',
    'Frais exonération',
    'Frais garantie bonne fin',
    'Gestion financière',
    'rendement Actif général sur 3 ans',
    'Nombre de Gestion pilotée',
    'Nombre de fonds',
    'Multigestionnaire oui /non',
    'Calcul de la retraite',
    "Table de mortalité de l'assuré"
  ];

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl my-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl z-10">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Tableau comparatif</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {showColumnInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    placeholder="Nom de la colonne"
                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-xs font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/80 dark:bg-gray-800/80"
                  />
                  <button
                    onClick={() => {
                      if (columnName.trim()) {
                        setColumnName('');
                        setShowColumnInput(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-xs font-light hover:bg-blue-50 dark:bg-blue-900/20 transition-all whitespace-nowrap"
                  >
                    Ajouter
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowColumnInput(true)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-xs font-light hover:bg-blue-50 dark:bg-blue-900/20 transition-all whitespace-nowrap"
                >
                  + Colonne
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-xs font-light hover:bg-blue-50 dark:bg-blue-900/20 transition-all flex items-center gap-1.5 whitespace-nowrap">
                <Download className="w-3.5 h-3.5" />
                PDF
              </button>
              <button className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-xs font-light hover:bg-blue-50 dark:bg-blue-900/20 transition-all flex items-center gap-1.5 whitespace-nowrap">
                <Download className="w-3.5 h-3.5" />
                Excel
              </button>
              <button className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-xs font-light hover:bg-blue-50 dark:bg-blue-900/20 transition-all whitespace-nowrap">
                Proposition
              </button>
              <button className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all">
                Sauvegarder
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-3 py-2 text-left text-xs font-normal text-gray-700 dark:text-gray-300"></th>
                  <th className="px-3 py-2 text-right">
                    <span className="text-xs font-light text-gray-600 dark:text-gray-400">ACTIONS</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-blue-50/30' : 'bg-white'
                    }`}
                  >
                    <td className="px-3 py-2 text-xs font-light text-gray-800">{row}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => setVisibleRows({ ...visibleRows, [index]: !visibleRows[index] })}
                        className="text-gray-400 dark:text-gray-400 hover:text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        {visibleRows[index] ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Personnalisé Section */}
          <div className="mt-4 p-3 bg-gray-50/80 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-900 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-50 dark:bg-blue-900/200"></div>
              </label>
              <span className="text-xs font-light text-gray-700 dark:text-gray-300">Personnalisé</span>
            </div>

            <div className="flex items-center gap-2">
              <select className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-xs font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/80 dark:bg-gray-800/80">
                <option>Veuillez sélectionner une catégorie déjà existante</option>
              </select>
              <button className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-xs font-light hover:bg-blue-50 dark:bg-blue-900/20 transition-all flex items-center gap-1.5 whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
