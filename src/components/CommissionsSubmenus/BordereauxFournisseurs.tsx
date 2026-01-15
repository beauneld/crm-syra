import { Bell, Eye, Download, FileText, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Bordereau } from '../../types';
import { getBordereaux } from '../../services/commissionsService';

export default function BordereauxFournisseurs() {
  const [bordereaux, setBordereaux] = useState<Bordereau[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getBordereaux();
      setBordereaux(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  const getMatchingStatusDisplay = (statut: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      ok: { label: '✅ OK', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      partiel: { label: '⚠️ Partiel', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
      ecarts: { label: '❌ Écarts détectés', color: 'bg-red-100 text-red-700', icon: XCircle },
      en_cours: { label: '🔄 En cours', color: 'bg-blue-100 text-blue-700', icon: FileText },
    };
    return statuses[statut] || statuses.en_cours;
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
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Bordereaux Fournisseurs</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Gestion et rapprochement des bordereaux reçus</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="glass-card floating-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Fournisseur</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Date réception</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Fichier</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Nb commissions déclarées</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Status matching</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-light text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bordereaux.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 font-light">
                      Aucun bordereau reçu
                    </td>
                  </tr>
                ) : (
                  bordereaux.map((b) => {
                    const status = getMatchingStatusDisplay(b.statut_matching);
                    return (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900 font-medium">{b.fournisseur_id}</td>
                        <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900">{formatDate(b.date_reception)}</td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2 text-sm font-light text-gray-900">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {b.fichier_nom}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {b.nb_commissions_declarees} commissions
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-light ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Voir détail">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-blue-50 rounded-full transition-colors" title="Télécharger">
                              <Download className="w-4 h-4 text-blue-600" />
                            </button>
                            {(b.statut_matching === 'partiel' || b.statut_matching === 'ecarts') && (
                              <button className="p-2 hover:bg-orange-50 rounded-full transition-colors" title="Corriger les écarts">
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
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

        {bordereaux.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-full">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-light text-blue-900 mb-1">Rapprochement automatique</h3>
                <p className="text-sm text-blue-800 font-light">
                  Les bordereaux sont automatiquement rapprochés avec les commissions attendues et les virements reçus.
                  Les écarts sont signalés pour correction manuelle.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
