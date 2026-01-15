import { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Fournisseur } from '../../types';
import { getFournisseurs } from '../../services/commissionsService';

export default function ParametragesFournisseurs() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getFournisseurs();
      setFournisseurs(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div>Chargement...</div></div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Paramétrage des Fournisseurs</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Configurez les règles de commission</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex gap-2">
          <button className="px-4 md:px-5 py-2 text-xs md:text-sm font-light text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-sm flex items-center gap-2 transition-all hover:scale-105">
            <Plus className="w-4 h-4" />
            Ajouter un fournisseur
          </button>
        </div>

        <div className="glass-card floating-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Fournisseur</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Taux Initial</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Taux Récurrent</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Délai versement</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Libellé(s) bancaire</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Paiement regroupé</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-light text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fournisseurs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 font-light">
                      Aucun fournisseur configuré
                    </td>
                  </tr>
                ) : (
                  fournisseurs.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900 font-medium">{f.name}</td>
                      <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900">{f.taux_initial}%</td>
                      <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900">{f.taux_recurrent}%/an</td>
                      <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900">{f.delai_versement_jours} jours</td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {f.libelles_bancaires?.map((libelle, idx) => (
                            <span key={idx} className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-light">
                              {libelle}
                            </span>
                          )) || <span className="text-gray-400 text-xs">–</span>}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        {f.paiement_regroupe ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-light">Oui</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400">
                            <X className="w-4 h-4" />
                            <span className="text-xs font-light">Non</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-full transition-colors" title="Modifier">
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-full transition-colors" title="Supprimer">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
