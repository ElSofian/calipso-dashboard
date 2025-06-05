import React from "react";
import ReactDOM from "react-dom";
import { toast } from "@/lib/toast";
import { Event, SelectedSlot } from "@/components/dashboard/calendar";
import { format } from "date-fns";

export default function CreateEvent({
	modalIsOpen,
	setModalIsOpen,
	isSaving,
	setIsSaving,
	onEventCreated,
	selectedSlot
}: {
	modalIsOpen: boolean,
	setModalIsOpen: (isOpen: boolean) => void,
	isSaving: boolean,
	setIsSaving: (isSaving: boolean) => void,
	onEventCreated: (createdEvent: Event) => void,
	selectedSlot: SelectedSlot | null
}) {

	if (typeof window === 'undefined') return null;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSaving(true); 

		try {

			const formData = new FormData(e.currentTarget);
			const payload = {
				title: formData.get("title")?.toString() || "",
				description: formData.get("description")?.toString() || "",
				location: formData.get("location")?.toString() || "",
				start: new Date(formData.get("start")?.toString() || ""),
				end: new Date(formData.get("end")?.toString() || ""),
				start_time: new Date(`${formData.get("start")?.toString()}T${formData.get("start_time")?.toString()}`),
				end_time: new Date(`${formData.get("end")?.toString()}T${formData.get("end_time")?.toString()}`),
			};

			const res = await fetch(`/api/events`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || err.errorMessage);
			}

			onEventCreated(payload);
			setModalIsOpen(false);
			toast.success('Événement créé !');

		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error('Une erreur inconnue est survenue.');
			}
		} finally {
			setIsSaving(false);
		}

	};

	return ReactDOM.createPortal(
		modalIsOpen && (
			<div className="fixed inset-0 flex items-center justify-center z-1000 bg-black/20 backdrop-blur-sm" onClick={() => setModalIsOpen(false)}>
				<div className="relative flex flex-col p-6 bg-gradient-to-t from-gray-50 to-white rounded-xl shadow-sm dark:from-black dark:to-neutral-800 dark:border dark:border-neutral-700 dark:text-white" onClick={(e) => e.stopPropagation()}>
					<h2 className="text-lg font-semibold leading-none tracking-tight pb-1.5">Créez un événement</h2>
					<p className="text-sm text-gray-500 pb-6">Partagez les événements de l&apos;entreprise à vos collègues.</p>
					<button className="absolute right-4 top-4 rounded-sm opacity-70 focus:outline-none text-black cursor-pointer dark:text-white" onClick={() => setModalIsOpen(false)}>
						<i className="fa-light fa-xmark" />
					</button>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">Titre</label>
							<input className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs" type="text" name="title" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">Description</label>
							<input className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs" type="text" name="description" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">Lieu</label>
							<input className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs" type="text" name="location" />
						</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Date de début</label>
								<input className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs" type="date" name="start" defaultValue={selectedSlot ? format(selectedSlot.start, 'yyyy-MM-dd') : undefined} />
							</div>
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Heure de début</label>
								<input className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs" type="time" name="start_time" />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Date de fin</label>
								<input className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs" type="date" name="end" />
							</div>
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Heure de fin</label>
								<input className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs" type="time" name="end_time" />
							</div>
						</div>
						<div className="flex justify-end">
							<button className="modal-save-button bg-black text-white rounded-md py-1.5 px-5 mt-6 cursor-pointer dark:border dark:border-neutral-700 dark:bg-neutral-800" type="submit" disabled={isSaving}>
							{isSaving
								? (
								<>
									<i className="fa-solid fa-spinner fa-spin" />  
									<span style={{ marginLeft: 8 }}>Enregistrement...</span>
								</>
								)
									: 'Enregistrer'
								}
							</button>
						</div>
					</form>
				</div>
			</div>
		),
		document.body
	);
}
