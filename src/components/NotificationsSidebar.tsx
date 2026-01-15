import { X, UserPlus, CalendarDays, FileText, Bell } from 'lucide-react';

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsSidebar({ isOpen, onClose }: NotificationsSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto slide-in-right">
        <div className="p-6 border-b border-gray-200/30">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-light text-gray-900">Notifications</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-500 font-light">Activités récentes de votre SaaS</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-light text-gray-900">Nouveau lead assigné</p>
                <p className="text-xs text-gray-600 font-light mt-1">Sophie Martin a été ajoutée à votre liste</p>
                <p className="text-xs text-gray-400 font-light mt-2">Il y a 5 minutes</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50/80 rounded-2xl border border-green-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-light text-gray-900">RDV confirmé</p>
                <p className="text-xs text-gray-600 font-light mt-1">Marie Moreau - 14h00 aujourd'hui</p>
                <p className="text-xs text-gray-400 font-light mt-2">Il y a 1 heure</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-light text-gray-900">Document signé</p>
                <p className="text-xs text-gray-600 font-light mt-1">Lucas Simon a finalisé son contrat</p>
                <p className="text-xs text-gray-400 font-light mt-2">Il y a 2 heures</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-light text-gray-900">Rappel important</p>
                <p className="text-xs text-gray-600 font-light mt-1">3 leads à rappeler aujourd'hui</p>
                <p className="text-xs text-gray-400 font-light mt-2">Il y a 3 heures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
