import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Lead } from '../types';

interface ReminderModalProps {
  lead: Lead;
  onClose: () => void;
}

export default function ReminderModal({ lead, onClose }: ReminderModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [minutes, setMinutes] = useState('');
  const [reason, setReason] = useState('');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);
  const weekDays = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-8">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-light text-gray-900 dark:text-gray-100">Créer un rappel</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all">
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Lead</h3>
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-light shadow-md">
                    {lead.first_name[0]}{lead.last_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-900 dark:text-gray-100">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{lead.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4 md:space-y-6">
              <div>
                <h3 className="text-sm font-light text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span>📅</span> Choisir date et horraire
                </h3>

                <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="p-2 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="text-sm font-light text-gray-900 dark:text-gray-100 capitalize">{monthName}</span>
                    <button onClick={nextMonth} className="p-2 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-[10px] md:text-xs font-light text-gray-600 dark:text-gray-400 uppercase">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {days.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => day && setSelectedDate(day)}
                        disabled={!day}
                        className={`aspect-square rounded-lg md:rounded-xl text-xs md:text-sm font-light transition-all ${
                          day
                            ? selectedDate?.toDateString() === day.toDateString()
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                              : 'hover:bg-blue-50 text-blue-600'
                            : 'invisible'
                        }`}
                      >
                        {day?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-light text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span>⏱️</span> Durée
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  >
                    <option value="">Pas d'heure</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                    <option value="120">2 heures</option>
                  </select>
                  <input
                    type="text"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="Minute (optionnel)"
                    className="px-4 py-2 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-light text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span>📝</span> Raison
                </h3>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Raison"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700/30 flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 md:px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs md:text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
