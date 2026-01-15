import { Bell, TrendingUp, DollarSign, Clock, AlertCircle, CheckCircle, Calendar, PieChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getStatistiquesCommissions } from '../../services/commissionsService';

export default function StatistiquesCommissions() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState('mois');

  useEffect(() => {
    loadData();
  }, [periode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getStatistiquesCommissions();
      setStats(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(montant);
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
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Statistiques & Tableaux de Bord</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Vue d'ensemble complète de vos commissions</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setPeriode('mois')}
            className={`px-4 py-2 text-xs md:text-sm font-light rounded-full transition-all ${
              periode === 'mois'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Ce mois
          </button>
          <button
            onClick={() => setPeriode('trimestre')}
            className={`px-4 py-2 text-xs md:text-sm font-light rounded-full transition-all ${
              periode === 'trimestre'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Trimestre
          </button>
          <button
            onClick={() => setPeriode('annee')}
            className={`px-4 py-2 text-xs md:text-sm font-light rounded-full transition-all ${
              periode === 'annee'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Année
          </button>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="glass-card floating-shadow p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-light uppercase tracking-wide">Total attendu</div>
                <div className="text-2xl md:text-3xl font-light text-gray-900 mt-2">{formatMontant(stats.total || 0)}</div>
              </div>

              <div className="glass-card floating-shadow p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-light uppercase tracking-wide">Total reçu</div>
                <div className="text-2xl md:text-3xl font-light text-green-600 mt-2">{formatMontant(stats.reçue || 0)}</div>
              </div>

              <div className="glass-card floating-shadow p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-light uppercase tracking-wide">Taux de paiement</div>
                <div className="text-2xl md:text-3xl font-light text-purple-600 mt-2">{stats.taux_paiement || 0}%</div>
              </div>

              <div className="glass-card floating-shadow p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-light uppercase tracking-wide">En retard</div>
                <div className="text-2xl md:text-3xl font-light text-red-600 mt-2">{stats.en_retard || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="glass-card floating-shadow p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-light text-gray-900">Performance des paiements</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm font-light text-gray-600 mb-2">
                      <span>Commissions reçues</span>
                      <span className="font-medium">{stats.taux_paiement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${stats.taux_paiement}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-light text-gray-600 mb-2">
                      <span>En attente</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-light text-gray-600 mb-2">
                      <span>En retard</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card floating-shadow p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-light text-gray-900">Délai moyen par fournisseur</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-gray-700">MMA</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">28 jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-gray-700">Generali</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">42 jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-gray-700">SwissLife</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">35 jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-gray-700">AXA</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">58 jours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card floating-shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-light text-gray-900">Répartition par type de produit</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <div className="text-xs text-blue-600 font-light uppercase mb-1">Assurance Vie</div>
                  <div className="text-2xl font-light text-blue-700">45%</div>
                  <div className="text-xs text-blue-600 mt-1">{formatMontant(45000)}</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl">
                  <div className="text-xs text-purple-600 font-light uppercase mb-1">SCPI</div>
                  <div className="text-2xl font-light text-purple-700">25%</div>
                  <div className="text-xs text-purple-600 mt-1">{formatMontant(25000)}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl">
                  <div className="text-xs text-green-600 font-light uppercase mb-1">PER</div>
                  <div className="text-2xl font-light text-green-700">20%</div>
                  <div className="text-xs text-green-600 mt-1">{formatMontant(20000)}</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-2xl">
                  <div className="text-xs text-orange-600 font-light uppercase mb-1">Autres</div>
                  <div className="text-2xl font-light text-orange-700">10%</div>
                  <div className="text-xs text-orange-600 mt-1">{formatMontant(10000)}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
