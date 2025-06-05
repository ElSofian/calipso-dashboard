export interface Employee {
	id: number;
	first_name: string;
	last_name: string;
	name: string;
	character_id: number;
	grade: string;
	salary: number;
	in_service: boolean;
	phone: string;
	iban: string;
	eotw_count: number;
	time_in_service: number;
	avatar: string;
	grades: {
		name: string;
		salary: number;
	};
}

export interface Grades {
	name: string;
	salary: number;
}

export interface Run {
	id: number;
	employee_id: number;
	name: string;
	pump: string;
	amount: number;
	date: Date;
}

export interface Stock {
	id: number;
	name: string;
	category: string;
	price: number;
	cost: number;
	amount_in: number;
	amount_ext: number;
	total: number;
	amount_to_order: number;
	target: number;
	promotion: number;
}

export interface Session {
	id: string;
	user_id: string;
	expires_at: Date;
	created_at: Date;
	updated_at: Date;
}

export const GradesNames = [
	"CEO",
	"COO",
	"Responsable",
	"Manager Vendeurs",
	"Manager Pompistes",
	"Ressources Humaines",
	"Chef d'équipe Vendeurs",
	"Chef d'équipe Pompistes",
	"Vendeur Expérimenté",
	"Pompiste Expérimenté",
	"Vendeur",
	"Pompiste",
	// "Vendeur Novice",
	// "Pompiste Novice",
];

export interface Vehicle {
	id: number;
	vehicle_id: number;
	employee_id: number;
	plate: string;
	model: string;
	employee?: {
		first_name: string;
		last_name: string;
	} | null;
}

export interface Sale {
	id: number;
	client_name: string;
	client_character_id: number;
	amount: number;
	reason: string;
	date: Date;
	is_paid: boolean;
	employee?: {
		first_name: string;
		last_name: string;
	} | null;
}

export interface Payment {
	id: number;
	amount: number;
	reason: string;
	date: Date;
}

export interface Export {
	id: number;
	employee_id: number;
	name: string;
	amount: number;
	date: Date;
}

export interface Income {
	id: number;
	category: string;
	amount: number;
	reason: string;
	date: Date;
}

export interface Company {
	id: number;
	name: string;
	type: string;
	logo: string;
	active?: boolean;
	created_at: string;
}

export interface User {
	id: string;
	username: string;
	avatar: string;
	active_employee_id: number;
	discord_user_id: string;
	discord_avatar_hash: string;
	employee: Employee;
	company: Company;
}

export interface Notification {
	id: number;
	title: string;
	message: string;
	readed: boolean;
	date: Date;
}