import * as types from "@/types";

export function formatDate(date: string): string {
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "long",
		timeStyle: "short",
		timeZone: "Etc/GMT-0",
	}).format(new Date(date));
}

type TimeFrame = "daily" | "weekly" | "monthly";
type ArrayType = types.Sale | types.Run | types.Payment | types.Export;

export function getTimeFrame(timeframe: TimeFrame): string {
	const today = new Date();
	
	switch (timeframe) {
		case "daily":
			return "Aujourd'hui";
		case "weekly":
			return "Cette semaine";
		case "monthly": {
			const date = new Intl.DateTimeFormat("fr-FR", {
				month: "long",
				year: "numeric"
			}).format(today);
			return date.charAt(0).toUpperCase() + date.slice(1);
		}
		
		default:
			return "";
	}
}

export function getTime(array: ArrayType[], timeframe: TimeFrame): ArrayType[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const offsetDays = timeframe === "daily" ? 1 : timeframe === "weekly" ? 7 : 30;
	const startTime = today.getTime() - offsetDays * 24 * 60 * 60 * 1000;
	const endTime = today.getTime();

	return array.filter(item => {
		const itemDate = new Date(item.date);
		itemDate.setHours(0, 0, 0, 0);
		const time = itemDate.getTime();
		return time >= startTime && time <= endTime;
	});
}

export function getTimeAmount(array: ArrayType[], timeframe: TimeFrame): string {
	const data = getTime(array, timeframe);
	const value = data.reduce((acc, item) => acc + (item.amount || 0), 0);
	return value.toLocaleString('fr-FR');
}

export function getTimePercentage(array: ArrayType[], timeframe: TimeFrame): number {
	const current = getTime(array, timeframe);
	const previous = getTime(array.slice(1), timeframe);

	const diff = current.length - previous.length;
	const percent = (diff / (previous.length || 1)) * 100;

	if (isNaN(percent) || percent === Infinity) return 0;
	return percent > 0 ? Number(percent.toFixed(0)) : 0;
}

export function getEmployeeTime(employee: types.Employee): string {
	const time = employee.time_in_service;
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = time % 60;

	return `${hours.toLocaleString('fr-FR')}h ${minutes.toLocaleString('fr-FR')}m ${seconds.toLocaleString('fr-FR')}s`
}