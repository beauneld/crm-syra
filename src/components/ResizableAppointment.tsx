import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { formatDuration, minutesToTime, parseTimeToMinutes, roundToQuarter, clampDuration } from '../utils/calendarUtils';

interface ResizableAppointmentProps {
  appointment: {
    id: string;
    time: string;
    duration: number;
    leadName: string;
    title: string;
    projectId: string;
    column?: number;
    totalColumns?: number;
  };
  color: string;
  onAppointmentClick: () => void;
  onDurationChange: (newDuration: number, newTime: string) => void;
  onDragStart: () => void;
  containerHeight?: number;
}

export default function ResizableAppointment({
  appointment,
  color,
  onAppointmentClick,
  onDurationChange,
  onDragStart,
  containerHeight = 48
}: ResizableAppointmentProps) {
  const [isResizing, setIsResizing] = useState<'top' | 'bottom' | null>(null);
  const [tempDuration, setTempDuration] = useState(appointment.duration);
  const [tempStartMinutes, setTempStartMinutes] = useState(parseTimeToMinutes(appointment.time));
  const appointmentRef = useRef<HTMLDivElement>(null);
  const initialY = useRef(0);
  const initialDuration = useRef(0);
  const initialStartMinutes = useRef(0);

  const startMinutes = parseTimeToMinutes(appointment.time);
  const endMinutes = startMinutes + appointment.duration;
  const minuteInHour = startMinutes % 60;
  const topPosition = (minuteInHour / 60) * 100;

  const pixelsPerMinute = containerHeight / 60;
  const height = appointment.duration * pixelsPerMinute;

  const width = appointment.totalColumns ? (100 / appointment.totalColumns) : 100;
  const leftPosition = appointment.column !== undefined && appointment.totalColumns ? (appointment.column * width) : 0;

  const handleResizeStart = (e: React.MouseEvent, direction: 'top' | 'bottom') => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(direction);
    initialY.current = e.clientY;
    initialDuration.current = appointment.duration;
    initialStartMinutes.current = parseTimeToMinutes(appointment.time);
    setTempDuration(appointment.duration);
    setTempStartMinutes(initialStartMinutes.current);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - initialY.current;
      const deltaMinutes = Math.round(deltaY / pixelsPerMinute);

      if (isResizing === 'bottom') {
        const newDuration = clampDuration(roundToQuarter(initialDuration.current + deltaMinutes));
        setTempDuration(newDuration);
      } else if (isResizing === 'top') {
        const newStartMinutes = roundToQuarter(initialStartMinutes.current + deltaMinutes);
        const newEndMinutes = initialStartMinutes.current + initialDuration.current;
        const newDuration = clampDuration(newEndMinutes - newStartMinutes);

        if (newStartMinutes >= 0 && newStartMinutes < 24 * 60 && newDuration >= 15) {
          setTempStartMinutes(newStartMinutes);
          setTempDuration(newDuration);
        }
      }
    };

    const handleMouseUp = () => {
      if (isResizing === 'bottom' && tempDuration !== appointment.duration) {
        onDurationChange(tempDuration, appointment.time);
      } else if (isResizing === 'top' && (tempStartMinutes !== initialStartMinutes.current || tempDuration !== appointment.duration)) {
        const newTime = minutesToTime(tempStartMinutes);
        onDurationChange(tempDuration, newTime);
      }
      setIsResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, tempDuration, tempStartMinutes, appointment.duration, appointment.time, pixelsPerMinute, onDurationChange]);

  const displayStartMinutes = isResizing === 'top' ? tempStartMinutes : startMinutes;
  const displayDuration = isResizing ? tempDuration : appointment.duration;
  const displayTopPosition = isResizing === 'top' ? ((tempStartMinutes % 60) / 60) * 100 : topPosition;
  const displayHeight = isResizing ? displayDuration * pixelsPerMinute : height;

  const getColorClasses = (colorName: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500/90',
      green: 'bg-green-500/90',
      orange: 'bg-orange-500/90',
    };
    return colors[colorName] || colors.blue;
  };

  return (
    <div
      ref={appointmentRef}
      draggable={!isResizing}
      onDragStart={(e) => {
        if (isResizing) {
          e.preventDefault();
          return;
        }
        onDragStart();
      }}
      style={{
        top: `${displayTopPosition}%`,
        left: `${leftPosition}%`,
        width: `${width}%`,
        height: `${displayHeight}px`,
        minHeight: '24px'
      }}
      className={`${getColorClasses(color)} text-white rounded-lg absolute cursor-move hover:opacity-95 transition-opacity group ${
        isResizing ? 'cursor-ns-resize opacity-90' : ''
      }`}
      onClick={(e) => {
        if (!isResizing) {
          e.stopPropagation();
          onAppointmentClick();
        }
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity flex items-center justify-center"
        onMouseDown={(e) => handleResizeStart(e, 'top')}
      >
        <GripVertical className="w-3 h-3" />
      </div>

      <div className="px-2 py-1 flex flex-col justify-center h-full pointer-events-none">
        <div className="flex items-center justify-between gap-1">
          <div className="text-[10px] font-normal">
            {minutesToTime(displayStartMinutes)}
          </div>
          <div className="text-[9px] opacity-80">{formatDuration(displayDuration)}</div>
        </div>
        {displayHeight > 30 && (
          <div className="text-[10px] truncate mt-0.5">{appointment.leadName}</div>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity flex items-center justify-center"
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
      >
        <GripVertical className="w-3 h-3" />
      </div>
    </div>
  );
}
