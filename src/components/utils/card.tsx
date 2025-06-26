import Image from "next/image";

interface CardProps {
	title: string;
	value: string;
	description?: string;
	subDescription?: string;
	percentage?: string;
	iconDirection?: string;
	color?: string;
	image?: string;
	countCircle?: boolean;
}

export default function Card({ title, value, description, subDescription, percentage, iconDirection, color, image, countCircle }: CardProps) {

	return (
		<div className="relative flex flex-col gap-6 p-6 rounded-2xl shadow-md border-[var(--border)] bg-gradient-to-t from-gray-100 to-white dark:from-black dark:to-neutral-800 dark:border-white">
			<div>
				{percentage 
					?
					<div className="flex flex-row items-center justify-between">
						<p className="text-sm opacity-75 dark:text-white">{title}</p>
						
						<div className="flex flex-row items-center gap-2 rounded-md px-2 py-0.5 border-1 border-gray-200 dark:bg-neutral-800 dark:border-gray-700">
							<i className={`fa-light fa-xs fa-arrow-trend-${iconDirection} ${color}`} />
							<p className="text-xs font-medium dark:text-white">{percentage}%</p>
						</div>
					</div>

					: 
					<div className="flex flex-row items-center justify-between">
						<p className="text-sm opacity-75 dark:text-white">{title}</p>
						{image && <Image src={image} alt={title} className="absolute top-5 right-5 rounded-full" width={48} height={48} />}
					</div>
				}

				<div className="flex flex-row items-center gap-2">
					{countCircle && <div className="w-3 h-3 bg-green-500 rounded-full" />}
					<p className="text-3xl font-semibold dark:text-white tabular-nums">{value}</p>
				</div>
			</div>

			<div>
				{description && <p className="text-sm dark:text-white">{description}</p>}
				{subDescription && <p className="text-sm opacity-60 dark:text-white">{subDescription}</p>}
			</div>
		</div>
	);
}