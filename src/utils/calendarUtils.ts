export interface AppointmentWithPosition {
  id: string;
  date: Date;
  time: string;
  duration: number;
  title: string;
  leadName: string;
  projectId: string;
  collaborators?: string[];
  column?: number;
  totalColumns?: number;
  startMinutes: number;
  endMinutes: number;
}

export interface ConflictWarning {
  appointmentId: string;
  conflictsWith: string[];
  message: string;
}

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const formatDuration = (durationInMinutes: number): string => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  }
};

export const roundToQuarter = (minutes: number): number => {
  return Math.round(minutes / 15) * 15;
};

export const clampDuration = (duration: number): number => {
  const MIN_DURATION = 15;
  const MAX_DURATION = 240;
  return Math.max(MIN_DURATION, Math.min(MAX_DURATION, duration));
};

export const checkConflict = (
  apt1Start: number,
  apt1End: number,
  apt2Start: number,
  apt2End: number
): boolean => {
  return apt1Start < apt2End && apt2Start < apt1End;
};

export const detectConflicts = (
  appointment: AppointmentWithPosition,
  allAppointments: AppointmentWithPosition[],
  sameDate: boolean = true
): ConflictWarning | null => {
  const conflictingIds: string[] = [];

  allAppointments.forEach(apt => {
    if (apt.id === appointment.id) return;

    if (sameDate) {
      const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date);
      const checkDate = appointment.date instanceof Date ? appointment.date : new Date(appointment.date);

      if (aptDate.getDate() !== checkDate.getDate() ||
          aptDate.getMonth() !== checkDate.getMonth() ||
          aptDate.getFullYear() !== checkDate.getFullYear()) {
        return;
      }
    }

    if (checkConflict(appointment.startMinutes, appointment.endMinutes, apt.startMinutes, apt.endMinutes)) {
      conflictingIds.push(apt.id);
    }
  });

  if (conflictingIds.length > 0) {
    return {
      appointmentId: appointment.id,
      conflictsWith: conflictingIds,
      message: `Ce rendez-vous chevauche ${conflictingIds.length} autre${conflictingIds.length > 1 ? 's' : ''} rendez-vous`
    };
  }

  return null;
};

export const calculateAppointmentColumns = (
  appointments: AppointmentWithPosition[]
): AppointmentWithPosition[] => {
  if (appointments.length === 0) return [];

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.startMinutes !== b.startMinutes) {
      return a.startMinutes - b.startMinutes;
    }
    return (b.endMinutes - b.startMinutes) - (a.endMinutes - a.startMinutes);
  });

  const columns: AppointmentWithPosition[][] = [];

  sortedAppointments.forEach(apt => {
    let placed = false;

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const hasConflict = column.some(existingApt =>
        checkConflict(apt.startMinutes, apt.endMinutes, existingApt.startMinutes, existingApt.endMinutes)
      );

      if (!hasConflict) {
        column.push(apt);
        apt.column = i;
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([apt]);
      apt.column = columns.length - 1;
    }
  });

  const maxColumns = columns.length;
  sortedAppointments.forEach(apt => {
    apt.totalColumns = maxColumns;
  });

  return sortedAppointments;
};

export const groupAppointmentsByHour = (
  appointments: AppointmentWithPosition[]
): Record<number, AppointmentWithPosition[]> => {
  const grouped: Record<number, AppointmentWithPosition[]> = {};

  appointments.forEach(apt => {
    const hour = Math.floor(apt.startMinutes / 60);

    if (!grouped[hour]) {
      grouped[hour] = [];
    }
    grouped[hour].push(apt);
  });

  return grouped;
};

export const getAppointmentsInTimeRange = (
  appointments: AppointmentWithPosition[],
  startMinutes: number,
  endMinutes: number
): AppointmentWithPosition[] => {
  return appointments.filter(apt =>
    checkConflict(apt.startMinutes, apt.endMinutes, startMinutes, endMinutes)
  );
};
