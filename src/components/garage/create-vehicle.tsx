import { toast } from "@/lib/toast";
import React from "react";
import ReactDOM from "react-dom";

export default function CreateVehicle({
  modalIsOpen,
  setModalIsOpen,
  isSaving,
  setIsSaving,
  onSuccess,
}: {
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  onSuccess?: () => void;
}) {
  if (typeof window === "undefined") return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        vehicle_id: formData.get("vehicle_id")?.toString() || "",
        model: formData.get("model")?.toString() || "",
        plate: formData.get("plate")?.toString() || "",
      };

      const res = await fetch(`/api/garage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.errorMessage);
      }

      setModalIsOpen(false);
      toast.success("Véhicule ajouté !");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return ReactDOM.createPortal(
    modalIsOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center z-1000 bg-black/20 backdrop-blur-sm"
        onClick={() => setModalIsOpen(false)}
      >
        <div
          className="relative flex flex-col p-6 bg-gradient-to-t from-gray-50 to-white rounded-xl shadow-sm dark:from-black dark:to-neutral-800 dark:border dark:border-neutral-700 dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold leading-none tracking-tight pb-1.5">
            Ajoutez un véhicule
          </h2>
          <p className="text-sm text-gray-500 pb-6">
            Ceci ajoutera un véhicule à la liste des véhicules de
            l&apos;entreprise.
          </p>
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 focus:outline-none text-black cursor-pointer dark:text-white"
            onClick={() => setModalIsOpen(false)}
          >
            <i className="fa-light fa-xmark" />
          </button>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">ID Véhicule</label>
              <input
                className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs"
                type="number"
                name="vehicle_id"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Modèle</label>
              <input
                className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs"
                type="text"
                name="model"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Plaque</label>
              <input
                className="text-sm font-medium rounded-sm border-1 border-gray-200 py-1 px-2 shadow-xs"
                type="text"
                name="plate"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                className="modal-save-button bg-black text-white rounded-md py-1.5 px-5 mt-6 cursor-pointer dark:border dark:border-neutral-700 dark:bg-neutral-800"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" />
                    <span style={{ marginLeft: 8 }}>Enregistrement...</span>
                  </>
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    ),
    document.body
  );
}
