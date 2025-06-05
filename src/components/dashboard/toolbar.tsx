import { NavigateAction } from "react-big-calendar";

type ToolbarProps = {
	onCreate: () => void;
	label: string;
	onNavigate: (navigate: NavigateAction, date?: Date) => void;
	children?: React.ReactNode;
};

export default function CustomToolbar({
	onCreate,
	label,
	onNavigate,
}: ToolbarProps & { onCreate: () => void }) {
	return (
		<div className="grid grid-cols-3 items-center mb-2">
			<div className="flex space-x-1">
				<button
					className="border border-[var(--border)] shadow-sm px-3 py-1 rounded text-sm cursor-pointer bg-white dark:bg-black dark:text-white dark:border-neutral-800"
					onClick={() => onNavigate("TODAY")}
				>
					Aujourd&apos;hui
				</button>
				<button
					className="border border-[var(--border)] shadow-sm px-3 py-1 rounded text-sm cursor-pointer bg-white dark:bg-black dark:text-white dark:border-neutral-800"
					onClick={() => onNavigate("PREV")}
				>
					<i className="fa-light fa-chevron-left fa-sm" />
				</button>
				<button
					className="border border-[var(--border)] shadow-sm px-3 py-1 rounded text-sm cursor-pointer bg-white dark:bg-black dark:text-white dark:border-neutral-800"
					onClick={() => onNavigate("NEXT")}
				>
					<i className="fa-light fa-chevron-right fa-sm" />
				</button>
			</div>

			<h2 className="text-lg font-medium text-center first-letter:capitalize dark:text-white">
				{label}
			</h2>

			<div className="flex justify-end">
				<button
					className="flex items-center px-2.5 py-0.5 rounded-md cursor-pointer bg-black text-white dark:border dark:border-neutral-700"
					onClick={onCreate}
				>
					<i className="fa-solid fa-plus fa-sm" />
					<span className="text-md ml-2">Créer</span>
				</button>
			</div>
		</div>
	);
}
