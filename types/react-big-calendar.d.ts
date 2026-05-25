declare module 'react-big-calendar' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

  export interface Event {
    title?: ReactNode;
    start?: Date;
    end?: Date;
    allDay?: boolean;
    resource?: unknown;
  }

  export interface CalendarProps<TEvent extends object = Event> {
    localizer: unknown;
    events?: TEvent[];
    startAccessor?: string | ((event: TEvent) => Date);
    endAccessor?: string | ((event: TEvent) => Date);
    titleAccessor?: string | ((event: TEvent) => string);
    view?: View;
    date?: Date;
    onView?: (view: View) => void;
    onNavigate?: (date: Date) => void;
    onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[]; action: string }) => void;
    onSelectEvent?: (event: TEvent) => void;
    selectable?: boolean;
    eventPropGetter?: (event: TEvent) => { className?: string; style?: CSSProperties };
    step?: number;
    timeslots?: number;
    min?: Date;
    max?: Date;
    formats?: Record<string, unknown>;
    culture?: string;
    messages?: Record<string, string | ((...args: unknown[]) => string)>;
    rtl?: boolean;
    style?: CSSProperties;
    className?: string;
    popup?: boolean;
    defaultView?: View;
  }

  export const Calendar: <TEvent extends object = Event>(
    props: CalendarProps<TEvent>
  ) => React.ReactElement | null;

  export function dateFnsLocalizer(config: unknown): unknown;
}
