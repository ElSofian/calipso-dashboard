import React from 'react';
import ReactDOM from 'react-dom';
import { Event } from '@/components/dashboard/calendar';

export default function ShowEvent({
	modalIsOpen,
	setModalIsOpen,
	event,
}: {
	modalIsOpen: boolean,
	setModalIsOpen: (isOpen: boolean) => void,
	event: Event,
}) {

	if (typeof window === 'undefined') return null;
	if (!event) return null;

	const formatDate = (date: Date | string) => {
		if (!date) return '';
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toLocaleDateString();
	};

	const formatTime = (time: Date | string) => {
		if (!time) return '';
		const timeObj = typeof time === 'string' ? new Date(time) : time;
		return timeObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
	};
	
	const handleDeleteEvent = async () => {
		const res = await fetch(`/api/events`, {
			method: 'DELETE',
			body: JSON.stringify({ id: event.id }),
		});
		if (res.ok) {
			setModalIsOpen(false);
		}
	}

	return ReactDOM.createPortal(
		modalIsOpen && (
			<div className="fixed inset-0 flex items-center justify-center z-1000 bg-black/20 backdrop-blur-sm dark:text-white" onClick={() => setModalIsOpen(false)}>
				<div className="relative flex flex-col p-6 bg-gradient-to-t from-gray-50 to-white dark:from-black dark:to-neutral-900 rounded-xl shadow-sm" onClick={(e) => e.stopPropagation()}>
					<h2 className="text-lg font-semibold leading-none tracking-tight pb-1.5">{event.title}</h2>
					<p className="text-sm text-gray-500 pb-6">{event.description}</p>
					<button className="absolute right-4 top-4 rounded-sm opacity-70 focus:outline-none text-black dark:text-white" onClick={() => setModalIsOpen(false)}>
						<i className="fa-light fa-xmark" />
					</button>
					<form className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">Lieu</label>
							<p className="text-sm text-gray-500">{event.location}</p>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Date de début</label>
								<p className="text-sm text-gray-500">{formatDate(event.start)}</p>
							</div>
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Heure de début</label>
								<p className="text-sm text-gray-500">{formatTime(event.start_time)}</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Date de fin</label>
								<p className="text-sm text-gray-500">{formatDate(event.end)}</p>
							</div>
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Heure de fin</label>
								<p className="text-sm text-gray-500">{formatTime(event.end_time)}</p>
							</div>
						</div>
						<button className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-md w-full cursor-pointer" onClick={() => handleDeleteEvent()}>
							Supprimer
						</button>
					</form>
				</div>
			</div>
		),
		document.body
	);
}
