import { X, Search, Clock, Calendar as CalendarIcon, MapPin, Users, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Appointment {
  id: string;
  title: string;
  client_name?: string;
  date: string;
  time: string;
  duration: string | number;
  location: string;
  collaborator?: string;
  reminder: boolean;
  notes: string;
}

interface AddAppointmentModalProps {
  onClose: () => void;
  appointment?: Appointment;
}

const mockLeads = [
  { id: '1', name: 'Madame DAHCHAR', email: 'dahchar@icloud.com', phone: '0781170861', status: 'RDV pris' },
  { id: '2', name: 'Monsieur DUPART', email: 'dupart33@gmail.com', phone: '0688523264', status: 'À rappeler' },
  { id: '3', name: 'Yannick GOASDOUE', email: 'nikenyan0@gmail.com', phone: '0687180650', status: 'NRP' },
];

const mockUsers = [
  { id: '1', name: 'Moche Azran', email: 'azran@bienviyance.com' },
  { id: '2', name: 'Sophie Martin', email: 'sophie@bienviyance.com' },
  { id: '3', name: 'Thomas Dubois', email: 'thomas@bienviyance.com' },
];

export default function AddAppointmentModal({ onClose, appointment }: AddAppointmentModalProps) {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [enableReminder, setEnableReminder] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState('1');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string | null>(null);

  const mockCalendars = [
    { id: '1', name: 'Ornella Attard', color: 'blue' },
    { id: '2', name: 'Benjamin Zaoui', color: 'green' },
    { id: '3', name: 'Maor Assouline', color: 'orange' },
  ];

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title);
      setDate(appointment.date);
      setTime(appointment.time);
      const durationValue = typeof appointment.duration === 'string'
        ? appointment.duration.replace(' min', '')
        : appointment.duration.toString();
      setDuration(durationValue);
      setLocation(appointment.location || '');
      setNotes(appointment.notes || '');
      setEnableReminder(appointment.reminder || false);
      if (appointment.client_name) {
        const lead = mockLeads.find(l => l.name === appointment.client_name);
        if (lead) {
          setSelectedLead(lead.id);
          setSearchQuery(lead.name);
        }
      }
      if (appointment.collaborator) {
        const user = mockUsers.find(u => u.name === appointment.collaborator);
        if (user) setSharedWith([user.id]);
      }
    }
  }, [appointment]);

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto my-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl z-10">
            <h2 id="modalTitle" className="text-xl font-light text-gray-900 dark:text-gray-100">{appointment ? 'Modifier le rendez-vous' : 'Ajouter un rendez-vous'}</h2>
            <button
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Titre du rendez-vous</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                placeholder="Consultation, Présentation..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Lead / Prospect</label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un lead..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>

              {searchQuery && (
                <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                  {filteredLeads.map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => {
                        setSelectedLead(lead.id);
                        setSelectedLeadStatus(lead.status);
                        setSearchQuery('');
                        if (lead.status === 'RDV pris') {
                          setDuration('60');
                        } else if (lead.status === 'À rappeler') {
                          setDuration('30');
                        }
                      }}
                      className="w-full p-3 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/50 flex items-center gap-3 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light shadow-md">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">{lead.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{lead.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-light ${
                        lead.status === 'RDV pris' ? 'bg-green-100 text-green-700' :
                        lead.status === 'À rappeler' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'NRP' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {selectedLead && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light shadow-md">
                    {mockLeads.find(l => l.id === selectedLead)?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-light text-gray-900 dark:text-gray-100">{mockLeads.find(l => l.id === selectedLead)?.name}</p>
                      {selectedLeadStatus && (
                        <span className={`text-xs px-2 py-1 rounded-full font-light ${
                          selectedLeadStatus === 'RDV pris' ? 'bg-green-100 text-green-700' :
                          selectedLeadStatus === 'À rappeler' ? 'bg-blue-100 text-blue-700' :
                          selectedLeadStatus === 'NRP' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedLeadStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{mockLeads.find(l => l.id === selectedLead)?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLead(null);
                      setSelectedLeadStatus(null);
                    }}
                    className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                  >
                    <X className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                  Heure
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                  Durée
                  {selectedLeadStatus && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({selectedLeadStatus === 'RDV pris' ? '1h obligatoire' : selectedLeadStatus === 'À rappeler' ? '30min obligatoire' : ''})
                    </span>
                  )}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={selectedLeadStatus === 'RDV pris' || selectedLeadStatus === 'À rappeler'}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="75">1h15</option>
                  <option value="90">1h30</option>
                  <option value="105">1h45</option>
                  <option value="120">2 heures</option>
                  <option value="135">2h15</option>
                  <option value="150">2h30</option>
                  <option value="165">2h45</option>
                  <option value="180">3 heures</option>
                  <option value="195">3h15</option>
                  <option value="210">3h30</option>
                  <option value="225">3h45</option>
                  <option value="240">4 heures</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Type de RDV</label>
                <select
                  value={appointmentType}
                  onChange={(e) => {
                    setAppointmentType(e.target.value);
                    setEnableReminder(e.target.value === 'rdv-physique' || e.target.value === 'visio');
                  }}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                >
                  <option value="consultation">Consultation</option>
                  <option value="rdv-physique">RDV Physique (rappel 30min)</option>
                  <option value="visio">Visio (rappel 30min)</option>
                  <option value="appel">Appel téléphonique</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Calendrier</label>
                <select
                  value={selectedCalendar}
                  onChange={(e) => setSelectedCalendar(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                >
                  {mockCalendars.map(cal => (
                    <option key={cal.id} value={cal.id}>{cal.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                Lieu (optionnel)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                placeholder="Adresse ou lien de visio..."
              />
            </div>

            {enableReminder && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-light text-gray-900 dark:text-gray-100">Rappel activé</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light mt-1">
                    Une notification sera envoyée 30 minutes avant le rendez-vous
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                Partager avec des collaborateurs (optionnel)
              </label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Rechercher un collaborateur..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>

              {sharedWith.length > 0 && (
                <div className="mb-3 space-y-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light">Collaborateurs sélectionnés:</p>
                  {sharedWith.map((userId) => {
                    const user = mockUsers.find(u => u.id === userId);
                    if (!user) return null;
                    return (
                      <div key={userId} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light shadow-md">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{user.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSharedWith(sharedWith.filter(id => id !== userId))}
                          className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                        >
                          <X className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {userSearchQuery && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredUsers
                    .filter(user => !sharedWith.includes(user.id))
                    .map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSharedWith([...sharedWith, user.id]);
                          setUserSearchQuery('');
                        }}
                        className="w-full p-3 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/50 flex items-center gap-3 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light shadow-md">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{user.email}</p>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Notes (optionnel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                placeholder="Informations complémentaires..."
              />
            </div>

            {showConfirmation && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 animate-scale-in">
                <p className="text-sm text-green-800 dark:text-green-300 font-light text-center">
                  Un e-mail de confirmation sera envoyé au lead pour l'informer de ce rendez-vous.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-white dark:hover:bg-gray-800 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
              >
                Créer le rendez-vous
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
