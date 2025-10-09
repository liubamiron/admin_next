"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useState } from "react";
import CalendarSidebar from "@/components/calendar/CalendarSidebar";
import { usePathname } from "next/navigation";

export default function ShiftsCalendarPage() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const localizer = useMemo(() => momentLocalizer(moment), []);
    const pathname = usePathname();

    const handleAddEvent = (newEvent) => {
        setEvents([...events, newEvent]);
        setShowSidebar(false);
    };

    const handleEditEvent = (updatedEvent) => {
        setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
        setShowSidebar(false);
    };

    const handleDeleteEvent = (id) => {
        setEvents(events.filter((event) => event.id !== id));
        setShowSidebar(false);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowSidebar(true);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Calendar */}
            <div className="flex-1 p-5">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shifts Calendar</h2>
                    <button
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                        onClick={() => {
                            setSelectedEvent(null);
                            setShowSidebar(true);
                        }}
                    >
                        Add Event
                    </button>
                </div>
                <Calendar
                    key={pathname} // пересоздаём календарь при смене маршрута
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="month"
                    onSelectEvent={handleSelectEvent}
                    style={{ height: "85vh" }}
                />
            </div>

            {/* Sidebar */}
            <CalendarSidebar
                show={showSidebar}
                onHide={() => setShowSidebar(false)}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                selectedEvent={selectedEvent}
            />
        </div>
    );
}
