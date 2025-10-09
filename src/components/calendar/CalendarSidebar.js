"use client";

import { useEffect, useState } from "react";
import moment from "moment";

export default function CalendarSidebar({
                                            show,
                                            onHide,
                                            onAddEvent,
                                            onEditEvent,
                                            onDeleteEvent,
                                            selectedEvent,
                                            selectedDate, // 🔹 NEW prop
                                        }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");


    useEffect(() => {
        if (selectedEvent) {
            // Editing an event
            setTitle(selectedEvent.title || "");
            setDate(moment(selectedEvent.start).format("YYYY-MM-DD"));
            setStartTime(moment(selectedEvent.start).format("HH:mm"));
            setEndTime(moment(selectedEvent.end).format("HH:mm"));
        } else if (selectedDate) {
            // Adding new event with pre-selected date
            setTitle("");
            setDate(moment(selectedDate).format("YYYY-MM-DD"));
            setStartTime("09:00"); // default start time
            setEndTime("10:00");   // default end time
        } else {
            // Fresh new event
            setTitle("");
            setDate("");
            setStartTime("");
            setEndTime("");
        }
    }, [selectedEvent, selectedDate]);

    const handleSubmit = () => {
        if (!title || !date) return;

        const start = moment(date).set({
            hour: startTime.split(":")[0] || 0,
            minute: startTime.split(":")[1] || 0,
        }).toDate();

        const end = moment(date).set({
            hour: endTime.split(":")[0] || 0,
            minute: endTime.split(":")[1] || 0,
        }).toDate();

        if (selectedEvent) {
            onEditEvent({ ...selectedEvent, title, description, start, end });
        } else {
            onAddEvent({ id: Math.random(), title, description, start, end });
        }
    };

    const handleDelete = () => {
        if (selectedEvent) onDeleteEvent(selectedEvent.id);
    };

    return (
        <div
            className={`fixed top-20 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-10 ${
                show ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedEvent ? "Edit Event" : "Add Event"}
                    </h3>
                    <button
                        className="text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-white"
                        onClick={onHide}
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Title</label>
                    <input
                        className="border rounded-md p-2 text-gray-900 dark:text-white dark:bg-gray-700"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className="text-sm text-gray-700 dark:text-gray-300">Date</label>
                    <input
                        className="border rounded-md p-2 text-gray-900 dark:text-white dark:bg-gray-700"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <label className="text-sm text-gray-700 dark:text-gray-300">Start Time</label>
                    <input
                        className="border rounded-md p-2 text-gray-900 dark:text-white dark:bg-gray-700"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />

                    <label className="text-sm text-gray-700 dark:text-gray-300">End Time</label>
                    <input
                        className="border rounded-md p-2 text-gray-900 dark:text-white dark:bg-gray-700"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />

                    <button
                        className="mt-3 bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800"
                        onClick={handleSubmit}
                    >
                        {selectedEvent ? "Update" : "Add"}
                    </button>
                    {selectedEvent && (
                        <button
                            className="mt-2 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
