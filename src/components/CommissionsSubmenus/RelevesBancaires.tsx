import { Bell, Eye, FileText, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { RelevesBancaires } from '../../types';
import { useState, useEffect } from 'react';
import { getRelevesBancaires } from '../../services/commissionsService';

export default function RelevesBancairesTab() {
  const [releves, setReleves] = useState<RelevesBancaires[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getRelevesBancaires();
      setReleves(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  const getParsingStatusDisplay = (statut: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      ok: { label: '✅ OK', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      en_cours: { label: '🔄 En cours', color: 'bg-blue-100 text-blue-700', icon: Upload },
      incomplet: { label: '⚠️ Incomplet', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
      erreur: { label: '❌ Erreur', color: 'bg-red-100 text-red-700', icon: AlertCircle },
    };
    return statuses[statut] || statuses.ok;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-gray-500 font-light">Chargement...</div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Relevés Bancaires</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Imports automatiques et parsing des virements</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500 rounded-full">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-light text-blue-900 mb-1">Import automatique</h3>
              <p className="text-sm text-blue-800 font-light">
                Envoyez vos relevés à <strong className="font-medium">releves@example.com</strong> pour un parsing automatique des virements
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card floating-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Date réception</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Banque</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Fichier</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Status parsing</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Nb virements détectés</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-light text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {releves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 font-light">
                      Aucun relevé bancaire reçu
                    </td>
                  </tr>
                ) : (
                  releves.map((r) => {
                    const status = getParsingStatusDisplay(r.statut_parsing);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900">{formatDate(r.date_reception)}</td>
                        <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900 font-medium">{r.banque}</td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2 text-sm font-light text-gray-900">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {r.fichier_nom}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-light ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {r.nb_virements_detectes}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Voir détail">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            {r.statut_parsing === 'incomplet' && (
                              <button className="p-2 hover:bg-orange-50 rounded-full transition-colors" title="Revoir le parsing">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
