import { X, CalendarPlus } from 'lucide-react';

interface CalendarSyncModalProps {
  onClose: () => void;
}

export default function CalendarSyncModal({ onClose }: CalendarSyncModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg my-4 p-8 text-center pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            <CalendarPlus className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">Calendrier Non Synchronisé</h2>

          <p className="text-gray-600 dark:text-gray-400 font-light mb-3">
            Synchronisez-le maintenant pour lier vos rendez-vous avec les contacts de Nova et envoyer des SMS de confirmation de rendez-vous.
          </p>

          <p className="text-gray-600 dark:text-gray-400 font-light mb-8">
            Vous pouvez choisir un compte différent de l'email pour se connecter à Nova.
          </p>

          <button
            onClick={onClose}
            className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
          >
            Synchroniser le calendrier
          </button>
        </div>
      </div>
    </>
  );
}
