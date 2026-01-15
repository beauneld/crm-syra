import { MessageSquare } from 'lucide-react';

interface PreconisationSectionProps {
  contracts: any[];
  contractDescriptions: { [key: number]: string };
  contractJustifications: { [key: number]: string };
  manualAssureurs: { [key: string]: string[] };
  searchManualAssureur: string;
  showManualAssureurSearch: boolean;
  currentContractForAssureur: number | null;
  onUpdateDescription: (index: number, value: string) => void;
  onUpdateJustification: (index: number, value: string) => void;
  onShowMessageModal: (index: number, type: 'description' | 'justification') => void;
  onSearchAssureur: (value: string, index: number) => void;
  onAddManualAssureur: (index: number) => void;
  onRemoveManualAssureur: (contractIndex: number, assureurIndex: number) => void;
  onSelectAssureur: (assureur: string, index: number) => void;
}

const ASSUREURS = ['Allianz', 'AXA', 'Generali', 'Swiss Life', 'Suravenir', 'April', 'Malakoff Humanis', 'Groupama'];

export default function PreconisationSection({
  contracts,
  contractDescriptions,
  contractJustifications,
  manualAssureurs,
  searchManualAssureur,
  showManualAssureurSearch,
  currentContractForAssureur,
  onUpdateDescription,
  onUpdateJustification,
  onShowMessageModal,
  onSearchAssureur,
  onAddManualAssureur,
  onRemoveManualAssureur,
  onSelectAssureur
}: PreconisationSectionProps) {
  return (
    <div>
      {contracts.length > 0 ? (
        <div className="space-y-8">
          {contracts.map((contract, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800 pb-2 border-b border-gray-200">
                {contract.gamme_contrat}
              </h3>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-normal text-gray-700">Description</label>
                  <button
                    type="button"
                    onClick={() => onShowMessageModal(index, 'description')}
                    className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded-full text-xs font-light hover:bg-blue-100 transition-all flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Insérer un message
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={contractDescriptions[index] || contract.gamme_contrat}
                  onChange={(e) => onUpdateDescription(index, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder={`Description pour ${contract.gamme_contrat}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-normal text-gray-700">Justification</label>
                  <button
                    type="button"
                    onClick={() => onShowMessageModal(index, 'justification')}
                    className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded-full text-xs font-light hover:bg-blue-100 transition-all flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Insérer un message
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={contractJustifications[index] || ''}
                  onChange={(e) => onUpdateJustification(index, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Justification du choix"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Assureurs interrogés</label>
                <div className="p-4 bg-white rounded-lg border border-gray-300">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {contract.assureurs_interroges && contract.assureurs_interroges.length > 0 ? (
                      contract.assureurs_interroges.map((assureur: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-xs font-light"
                        >
                          {assureur}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-xs font-light">
                        {contract.assureur}
                      </span>
                    )}
                    {manualAssureurs[index]?.map((assureur, idx) => (
                      <span
                        key={`manual-${idx}`}
                        className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-xs font-light flex items-center gap-1"
                      >
                        {assureur}
                        <button
                          type="button"
                          onClick={() => onRemoveManualAssureur(index, idx)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={currentContractForAssureur === index ? searchManualAssureur : ''}
                        onChange={(e) => onSearchAssureur(e.target.value, index)}
                        onFocus={() => onSearchAssureur(searchManualAssureur, index)}
                        placeholder="Ajouter un autre assureur..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      {showManualAssureurSearch && currentContractForAssureur === index && searchManualAssureur && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-40 overflow-y-auto z-20">
                          {ASSUREURS.filter(a =>
                            a.toLowerCase().includes(searchManualAssureur.toLowerCase())
                          ).map((assureur) => (
                            <button
                              key={assureur}
                              type="button"
                              onClick={() => onSelectAssureur(assureur, index)}
                              className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                            >
                              {assureur}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddManualAssureur(index)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 font-light text-sm py-8">Ajoutez des contrats dans la section 2 pour les configurer ici</p>
      )}

      <p className="text-xs text-gray-600 font-light mt-6 text-center">
        Nous tenons à votre disposition les devis des autres assureurs même si nous estimons que cela ne correspond pas à votre besoin.
      </p>
    </div>
  );
}
