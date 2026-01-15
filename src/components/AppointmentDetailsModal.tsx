import { X, Calendar, Clock, MapPin, Users, Link as LinkIcon, CreditCard as Edit, Trash2, Bell, Send } from 'lucide-react';
import { useState } from 'react';

interface Appointment {
  id: string;
  title: string;
  client_name: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  collaborator?: string;
  google_calendar_link?: string;
  reminder: boolean;
  notes: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentDetailsModal({ appointment, onClose, onEdit, onDelete }: AppointmentDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(appointment.id);
    onClose();
  };

  const handleSendToClient = () => {
    console.log(`Envoi du rendez-vous ${appointment.id} au client ${appointment.client_name}`);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl my-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between">
            <h2 id="modalTitle" className="text-xl font-light text-gray-900 dark:text-gray-100">Détails du rendez-vous</h2>
            <button
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-4">
              <h3 className="text-xl font-medium text-gray-800 mb-1">{appointment.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light">{appointment.client_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Date</p>
                  <p className="text-sm text-gray-800">{appointment.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Heure</p>
                  <p className="text-sm text-gray-800">{appointment.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <Clock className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Durée</p>
                  <p className="text-sm text-gray-800">{appointment.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <Bell className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Rappel</p>
                  <p className="text-sm text-gray-800">
                    {appointment.reminder ? '30 min avant' : 'Aucun'}
                  </p>
                </div>
              </div>
            </div>

            {appointment.location && (
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Lieu</p>
                  <p className="text-sm text-gray-800">{appointment.location}</p>
                </div>
              </div>
            )}

            {appointment.collaborator && (
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Collaborateur</p>
                  <p className="text-sm text-gray-800">{appointment.collaborator}</p>
                </div>
              </div>
            )}

            {appointment.google_calendar_link && (
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <LinkIcon className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Google Agenda</p>
                  <a
                    href={appointment.google_calendar_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline"
                  >
                    Voir dans Google Agenda
                  </a>
                </div>
              </div>
            )}

            {appointment.notes && (
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-2">Notes internes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{appointment.notes}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700/30 flex flex-col gap-3">
            <button
              onClick={handleSendToClient}
              className="w-full px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-green-600 hover:to-green-700 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer au client
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(appointment)}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 px-6 py-2.5 bg-white dark:bg-gray-800/80 border border-red-200 dark:border-red-800/50 text-red-600 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-red-50 dark:bg-red-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 border border-red-200 dark:border-red-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Confirmer la suppression</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Cette action est irréversible</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer ce rendez-vous avec <strong>{appointment.client_name}</strong> ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-red-600 hover:to-red-700 shadow-md transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
