import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  color: string;
}

export const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Reunião de equipe',
      date: new Date(2025, 0, 20),
      time: '14:00',
      color: '#3B82F6',
    },
    {
      id: '2',
      title: 'Apresentação do projeto',
      date: new Date(2025, 0, 22),
      time: '10:00',
      color: '#8B5CF6',
    },
    {
      id: '3',
      title: 'Almoço com cliente',
      date: new Date(2025, 0, 25),
      time: '12:30',
      color: '#22C55E',
    },
  ]);

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

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = event.date;
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  return (
    <div className="flex h-full">
      {/* Calendar View */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-muted rounded-lg"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Hoje
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-muted rounded-lg"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-border">
            {dayNames.map(day => (
              <div
                key={day}
                className="p-4 text-center text-sm font-medium text-muted-foreground bg-muted/30"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square border-r border-b border-border bg-muted/10" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className="aspect-square border-r border-b border-border p-2 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isToday
                        ? 'w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center'
                        : ''
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className="text-xs px-1 py-0.5 rounded truncate"
                        style={{ backgroundColor: event.color + '20', color: event.color }}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-[hsl(var(--window-titlebar))] border-l border-border p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Próximos eventos</h3>
          <button className="p-2 hover:bg-muted rounded-lg" aria-label="Adicionar evento">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {events.map(event => (
            <div
              key={event.id}
              className="p-3 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-1 h-full rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {event.date.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                    })} às {event.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
