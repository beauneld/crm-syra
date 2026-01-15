import { useState, useEffect } from 'react';
import { X, Clock, Calendar, Activity, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { UserDailyActivity, ActivityStats } from '../types';
import {
  getUserDailyActivity,
  getMonthlyStats,
  getLastLoginDate,
  formatDuration,
} from '../services/activityTrackingService';

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const avatarColors = [
  'from-blue-400 to-violet-500',
  'from-violet-400 to-purple-500',
  'from-indigo-400 to-blue-500',
  'from-purple-400 to-pink-500',
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
];

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<UserDailyActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    totalHours: 0,
    activeDays: 0,
    averageHoursPerDay: 0,
    totalSessions: 0,
  });
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  useEffect(() => {
    loadActivityData();
  }, [user.id, currentYear, currentMonth]);

  useEffect(() => {
    loadLastLogin();
  }, [user.id]);

  const loadActivityData = async () => {
    setIsLoading(true);
    try {
      const activityData = await getUserDailyActivity(user.id, currentYear, currentMonth);
      const statsData = await getMonthlyStats(user.id, currentYear, currentMonth);
      setActivities(activityData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLastLogin = async () => {
    const lastLoginDate = await getLastLoginDate(user.id);
    setLastLogin(lastLoginDate);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return 'Jamais connecté';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const colorIndex = parseInt(user.id, 36) % avatarColors.length;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[90vh] bg-white backdrop-blur-xl rounded-3xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-light text-gray-900">Détails de l'utilisateur</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="glass-card p-6 mb-6">
              <div className="flex items-start gap-6">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColors[colorIndex]} flex items-center justify-center text-white text-xl font-light shadow-md flex-shrink-0`}
                >
                  {getInitials(user.first_name, user.last_name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border ${
                        user.role === 'admin'
                          ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-200/50'
                          : user.role === 'manager'
                          ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200/50'
                          : user.role === 'gestion'
                          ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200/50'
                          : user.role === 'signataire'
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200/50'
                          : 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200/50'
                      }`}
                    >
                      {user.role === 'admin'
                        ? 'Admin'
                        : user.role === 'manager'
                        ? 'Manager'
                        : user.role === 'gestion'
                        ? 'Gestion'
                        : user.role === 'signataire'
                        ? 'Signataire'
                        : "Indicateur d'affaires"}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border ${
                        user.is_active
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200/50'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200/50'
                      }`}
                    >
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Dernière connexion: {formatLastLogin(lastLogin)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Journal d'activité
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePreviousMonth}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-sm font-light text-gray-700 min-w-[120px] text-center">
                    {months[currentMonth - 1]} {currentYear}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() + 1}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4">
                  <div className="text-2xl font-light text-blue-900">{stats.totalHours}h</div>
                  <div className="text-xs text-blue-700 mt-1">Temps total</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4">
                  <div className="text-2xl font-light text-green-900">{stats.activeDays}</div>
                  <div className="text-xs text-green-700 mt-1">Jours actifs</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4">
                  <div className="text-2xl font-light text-purple-900">
                    {stats.averageHoursPerDay}h
                  </div>
                  <div className="text-xs text-purple-700 mt-1">Moyenne/jour</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-4">
                  <div className="text-2xl font-light text-orange-900">{stats.totalSessions}</div>
                  <div className="text-xs text-orange-700 mt-1">Sessions</div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-pulse text-gray-500">Chargement...</div>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-12">
                  <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-light">
                    Aucune activité enregistrée pour ce mois
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          Sessions
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          Durée totale
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          Première connexion
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-gray-600 uppercase tracking-wider">
                          Dernière déconnexion
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activities.map((activity, index) => (
                        <tr
                          key={activity.id}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          } hover:bg-blue-50/30 transition-colors`}
                        >
                          <td className="px-4 py-3 text-sm font-light text-gray-900">
                            {formatDate(activity.activity_date)}
                          </td>
                          <td className="px-4 py-3 text-sm font-light text-gray-700">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                              {activity.session_count}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-light text-gray-700">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                activity.total_duration_seconds > 14400
                                  ? 'bg-green-100 text-green-700'
                                  : activity.total_duration_seconds > 7200
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {formatDuration(activity.total_duration_seconds)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-light text-gray-700">
                            {formatTime(activity.first_login)}
                          </td>
                          <td className="px-4 py-3 text-sm font-light text-gray-700">
                            {formatTime(activity.last_logout)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
