import { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { UserProfile, getAllProfiles, switchProfile, getProfileBadgeColor } from '../services/profileService';

interface ProfileSwitcherProps {
  onClose: () => void;
  onProfileChange: (profile: UserProfile) => void;
  currentProfile: UserProfile | null;
}

export default function ProfileSwitcher({ onClose, onProfileChange, currentProfile }: ProfileSwitcherProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des profils');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSwitch = async (profile: UserProfile) => {
    if (profile.id === currentProfile?.id) {
      onClose();
      return;
    }

    try {
      setIsSwitching(true);
      setError('');
      await switchProfile(profile.id);
      onProfileChange(profile);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de profil');
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md my-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">Changer de profil</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                <p className="text-sm text-red-600 dark:text-red-300 font-light">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-3">
                {profiles.map((profile) => {
                  const isActive = profile.id === currentProfile?.id;
                  const badgeColor = getProfileBadgeColor(profile.profile_type);

                  return (
                    <button
                      key={profile.id}
                      onClick={() => handleProfileSwitch(profile)}
                      disabled={isSwitching}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-violet-500 shadow-md flex-shrink-0">
                          <img
                            src={profile.photo_url}
                            alt={`${profile.first_name} ${profile.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                              {profile.first_name} {profile.last_name}
                            </p>
                            {isActive && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-light truncate">{profile.email}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-light mt-1 ${badgeColor}`}>
                            {profile.profile_type}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
