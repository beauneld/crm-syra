import { X, Calendar, Clock, MapPin, Users, Link as LinkIcon, Edit, Trash2, Bell, Mail, Phone, User, CalendarDays, Send } from 'lucide-react';
import { useState } from 'react';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  birth_year?: number;
  city?: string;
  postal_code?: string;
  residence_status?: string;
  profession?: string;
  notes?: string;
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  collaborator?: string;
  collaborators?: string[];
  google_calendar_link?: string;
  reminder: boolean;
  notes: string;
  lead: Lead;
  calendarName?: string;
  calendarColor?: string;
}

interface AppointmentDetailsWithLeadModalProps {
  appointment: Appointment;
  onClose: () => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentDetailsWithLeadModal({
  appointment,
  onClose,
  onEdit,
  onDelete
}: AppointmentDetailsWithLeadModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(appointment.id);
    onClose();
  };

  const handleSendToClient = () => {
    console.log(`Envoi du rendez-vous ${appointment.id} au client ${appointment.lead.first_name} ${appointment.lead.last_name}`);
  };


  const lead = appointment.lead;
  const fullName = `${lead.first_name} ${lead.last_name}`;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto my-4 pointer-events-auto border border-gray-200/50 dark:border-gray-700/30" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-t-3xl p-6 border-b border-gray-200 dark:border-gray-700/20 flex items-center justify-between z-10">
            <h2 id="modalTitle" className="text-xl font-light text-gray-900 dark:text-gray-100">Détails du rendez-vous</h2>
            <button
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/30">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-1">{appointment.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light">{fullName}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Informations du rendez-vous</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    <Calendar className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Date</p>
                      <p className="text-sm text-gray-800 dark:text-gray-100">{appointment.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Heure</p>
                      <p className="text-sm text-gray-800">{appointment.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    <Clock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Durée</p>
                      <p className="text-sm text-gray-800">{appointment.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    <Bell className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
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
                    <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Lieu</p>
                      <p className="text-sm text-gray-800">{appointment.location}</p>
                    </div>
                  </div>
                )}

                {appointment.calendarName && (
                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    <CalendarDays className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      appointment.calendarColor === 'blue' ? 'text-blue-500' :
                      appointment.calendarColor === 'green' ? 'text-green-500' :
                      appointment.calendarColor === 'orange' ? 'text-orange-500' :
                      'text-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">Calendrier</p>
                      <p className="text-sm text-gray-800">{appointment.calendarName}</p>
                    </div>
                  </div>
                )}

                {(appointment.collaborators && appointment.collaborators.length > 0) && (
                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    <Users className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-1">
                        Collaborateur{appointment.collaborators.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {appointment.collaborators.map((collab, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-light border border-purple-200"
                          >
                            {collab}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {appointment.google_calendar_link && (
                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    <LinkIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
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
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Informations du lead</h4>

                <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-5 border border-blue-200 dark:border-blue-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                      {lead.first_name[0]}{lead.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{fullName}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-light">Lead</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {lead.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate">
                          {lead.email}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <a href={`tel:${lead.phone}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 transition-colors">
                        {lead.phone}
                      </a>
                    </div>

                    {lead.birth_year && (
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Âge: {new Date().getFullYear() - lead.birth_year} ans
                        </p>
                      </div>
                    )}

                    {lead.city && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {lead.city} {lead.postal_code && `(${lead.postal_code})`}
                        </p>
                      </div>
                    )}

                    {lead.residence_status && (
                      <div className="pt-2 border-t border-blue-200 dark:border-blue-700/30">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-light mb-1">Statut de résidence</p>
                        <p className="text-sm text-gray-800">{lead.residence_status}</p>
                      </div>
                    )}

                    {lead.profession && (
                      <div className="pt-2 border-t border-blue-200 dark:border-blue-700/30">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-light mb-1">Profession</p>
                        <p className="text-sm text-gray-800">{lead.profession}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {(appointment.notes || lead.notes) && (
              <div className="space-y-3">
                {appointment.notes && (
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/50">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">Notes du rendez-vous</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{appointment.notes}</p>
                  </div>
                )}

                {lead.notes && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20/50 rounded-2xl border border-blue-200 dark:border-blue-700/50">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">Notes complémentaires du lead</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{lead.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 border-t border-gray-200 dark:border-gray-700/30">
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
              <button
                onClick={handleSendToClient}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Envoyer au client
              </button>
            </div>
          </div>
        </div>
      </div>


      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fadeIn bg-black/30 backdrop-blur-sm">
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
              Êtes-vous sûr de vouloir supprimer ce rendez-vous avec <strong>{fullName}</strong> ?
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
