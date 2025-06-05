"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CreateEvent from "@/components/dashboard/create-event";
import ShowEvent from "@/components/dashboard/show-event";
import CustomToolbar from "@/components/dashboard/toolbar";

const locales = { "fr": fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const messages = {
  allDay: "Toute la journée",
  previous: "<",
  next: ">",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
  noEventsInRange: "Aucun événement à afficher.",
  showMore: (total: number) => `+${total} de plus`,
};

export type Event = {
  id?: number;
  title: string;
  description: string;
  location: string;
  start: Date | string;
  end: Date | string;
  start_time: Date | string;
  end_time: Date | string;
};

export type SelectedSlot = {
  start: Date;
  end: Date;
}

export default function BigCalendar() {

  const [events, setEvents] = useState<Event[]>([]);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [showModalIsOpen, setShowModalIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events);
    }
    fetchEvents();
  }, []);

  const handleSelectSlot = (slot: SlotInfo) => {
    setSelectedSlot(slot);
    setCreateModalIsOpen(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowModalIsOpen(true);
  };

  const handleCreateEvent = (event: Event) => {
    setEvents([...events, event]);
    setCreateModalIsOpen(false);
  }

  return (
    <div className="p-4 rounded-xl border border-[var(--border)] shadow-sm bg-gradient-to-t from-gray-100 to-gray-50 dark:from-black dark:to-neutral-900 dark:border-neutral-800">
      <Calendar
        localizer={localizer}
        culture="fr"
        messages={messages}
        events={events}
        startAccessor={(event) => {
          return typeof event.start === 'string' ? new Date(event.start) : event.start;
        }}
        endAccessor={(event) => {
          return typeof event.end === 'string' ? new Date(event.end) : event.end;
        }}
        defaultView={Views.MONTH}
        views={[Views.MONTH]}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 600 }}
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              onCreate={() => setCreateModalIsOpen(true)}
            />
          ),
        }}
      />
      <CreateEvent
        modalIsOpen={createModalIsOpen}
        setModalIsOpen={setCreateModalIsOpen}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        onEventCreated={handleCreateEvent}
        selectedSlot={selectedSlot}
      />
      <ShowEvent
        modalIsOpen={showModalIsOpen}
        setModalIsOpen={setShowModalIsOpen}
        event={selectedEvent!}
      />
    </div>
  );
}
