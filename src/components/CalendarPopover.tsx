import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CalendarPopoverProps {
  onClose: () => void;
}

export const CalendarPopover = ({ onClose }: CalendarPopoverProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors ${
            isToday(day)
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'hover:bg-muted'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Calendar */}
      <div className="fixed bottom-14 right-2 w-80 glass-strong rounded-xl shadow-window z-50 animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={previousMonth}
                className="p-1 hover:bg-muted rounded transition-colors"
                aria-label="Mês anterior"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-muted rounded transition-colors"
                aria-label="Próximo mês"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(name => (
              <div key={name} className="text-xs font-medium text-center text-muted-foreground">
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>
        </div>

        {/* Today button */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Hoje
          </button>
        </div>
      </div>
    </>
  );
};