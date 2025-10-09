"use client";

import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useCallback, useState } from "react";
import CalendarSidebar from "@/components/calendar/CalendarSidebar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

const DnDCalendar = withDragAndDrop(Calendar);

export default function InterviewCalendarPage() {
    const [view, setView] = useState("month");
    const [date, setDate] = useState(new Date());
    const [showSidebar, setShowSidebar] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const localizer = dayjsLocalizer(dayjs);

    const onNavigate = useCallback((newDate) => {
        setDate(newDate);
    }, []);

    const onView = useCallback((newView) => {
        setView(newView);
    }, []);

    const handleAddEvent = (newEvent) => {
        setEvents((prev) => [...prev, newEvent]);
        setShowSidebar(false);
    };

    const handleEditEvent = (updatedEvent) => {
        setEvents((prev) =>
            prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
        setShowSidebar(false);
    };

    const handleDeleteEvent = (id) => {
        setEvents((prev) => prev.filter((event) => event.id !== id));
        setShowSidebar(false);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setSelectedDate(null);
        setShowSidebar(true);
    };

    // 🔹 When clicking on a day slot
    const handleSelectSlot = ({ start }) => {
        setSelectedEvent(null);
        setSelectedDate(start); // prefill the date
        setShowSidebar(true);
    };

    // Drag and drop handlers
    const handleEventDrop = ({ event, start, end }) => {
        const updatedEvent = { ...event, start, end };
        setEvents((prev) =>
            prev.map((e) => (e.id === event.id ? updatedEvent : e))
        );
    };

    const handleEventResize = ({ event, start, end }) => {
        const updatedEvent = { ...event, start, end };
        setEvents((prev) =>
            prev.map((e) => (e.id === event.id ? updatedEvent : e))
        );
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Calendar */}
            <div className="flex-1 p-5">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Shifts Calendar
                    </h2>
                    <button
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                        onClick={() => {
                            setSelectedEvent(null);
                            setSelectedDate(null);
                            setShowSidebar(true);
                        }}
                    >
                        Add Event
                    </button>
                </div>

                <DnDCalendar
                    selectable
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    resizable
                    defaultDate={new Date()}
                    defaultView="month"
                    date={date}
                    onNavigate={onNavigate}
                    view={view}
                    onView={onView}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot} // ✅ when clicking empty day
                    onEventDrop={handleEventDrop}
                    onEventResize={handleEventResize}
                    style={{ height: "85vh" }}
                />
            </div>
            <CalendarSidebar
                show={showSidebar}
                onHide={() => setShowSidebar(false)}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                selectedEvent={selectedEvent}
                selectedDate={selectedDate}

            />
        </div>
    );
}
