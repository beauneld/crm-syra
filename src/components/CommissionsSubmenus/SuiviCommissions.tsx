import { useState, useEffect } from 'react';
import { Search, Bell, Eye, Mail, FileText, Clock } from 'lucide-react';
import { CommissionAttendue } from '../../types';
import { getCommissionsAttendu } from '../../services/commissionsService';

export default function SuiviCommissions() {
  const [commissions, setCommissions] = useState<CommissionAttendue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fournisseurFilter, setFournisseurFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getCommissionsAttendu();
      setCommissions(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRelance = (commissionId: string) => {
    console.log('Relance fournisseur pour commission:', commissionId);
  };

  const getStatusDisplay = (statut: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      reçue: { label: '✅ Reçue', color: 'bg-green-100 text-green-700' },
      en_attente: { label: '⏱️ En attente', color: 'bg-yellow-100 text-yellow-700' },
      en_retard: { label: '🚨 En retard', color: 'bg-red-100 text-red-700' },
      partielle: { label: '🟠 Partielle', color: 'bg-orange-100 text-orange-700' },
      litige: { label: '⚠️ Litige', color: 'bg-purple-100 text-purple-700' },
    };
    return statuses[statut] || statuses.en_attente;
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
  };

  const formatDate = (date?: string) => {
    if (!date) return '–';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const filteredCommissions = commissions.filter(c => {
    const matchesSearch = searchTerm === '' ||
      c.fournisseur_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contrat_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.statut === statusFilter;
    const matchesFournisseur = fournisseurFilter === 'all' || c.fournisseur_id === fournisseurFilter;
    return matchesSearch && matchesStatus && matchesFournisseur;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Suivi des Commissions</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Suivez vos commissions</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="glass-card floating-shadow overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex gap-3 flex-col md:flex-row items-stretch md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un contrat ou fournisseur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs md:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="all">Tous les statuts</option>
                <option value="reçue">✅ Reçues</option>
                <option value="en_attente">⏱️ En attente</option>
                <option value="en_retard">🚨 En retard</option>
                <option value="partielle">🟠 Partielles</option>
                <option value="litige">⚠️ Litiges</option>
              </select>
              <select
                value={fournisseurFilter}
                onChange={(e) => setFournisseurFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs md:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="all">Tous les fournisseurs</option>
                <option value="MMA">MMA</option>
                <option value="Generali">Generali</option>
                <option value="SwissLife">SwissLife</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Contrat</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Fournisseur</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Montant attendu</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Date échéance</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Date virement</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-light text-gray-600 uppercase">Statut</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-light text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 font-light">
                      Aucune commission trouvée
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((c) => {
                    const status = getStatusDisplay(c.statut);
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-light text-gray-900">
                              {c.contrat_id || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900">{c.fournisseur_id}</td>
                        <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900 font-medium">{formatMontant(c.montant_attendu)}</td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-1 text-sm font-light text-gray-900">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {formatDate(c.date_estimee)}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm font-light text-gray-900">{formatDate(c.date_virement)}</td>
                        <td className="px-4 md:px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-light ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => console.log('Voir détail', c.id)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              title="Voir détail"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            {(c.statut === 'en_attente' || c.statut === 'en_retard') && (
                              <button
                                onClick={() => handleRelance(c.id)}
                                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                title="Relancer fournisseur"
                              >
                                <Mail className="w-4 h-4 text-blue-600" />
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
