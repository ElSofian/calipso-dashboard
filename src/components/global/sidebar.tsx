"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Company, User } from "@/types";

const menuItems = [
	{
		icon: "fa-square-poll-vertical",
		label: "Dashboard",
		hash: "dashboard",
	},
	{
		icon: "fa-money-check",
		label: "Revenus",
		hash: "incomes",
	},
	{
		icon: "fa-cart-shopping",
		label: "Ventes",
		hash: "sales",
	},
	{
		icon: "fa-box",
		label: "Stock",
		hash: "stock",
	},
]

const othersItems = [
	{
		icon: "fa-wallet",
		label: "Paiements",
		hash: "payments",
	},
	{
		icon: "fa-user",
		label: "Employés",
		hash: "employees",
	},
	{
		icon: "fa-car",
		label: "Garage",
		hash: "garage",
	},
]

const ltdSpecialities: SpecialityItem[] = [
	{
		icon: "fa-gas-pump",
		label: "Runs",
		hash: "runs",
	},
	{
		icon: "fa-truck",
		label: "Export",
		hash: "exports",
	},
]
const specialities: Record<string, SpecialityItem[]> = {
	"LTD Little Seoul": ltdSpecialities,
	"LTD Groove Street": ltdSpecialities,
	"LTD Paleto": ltdSpecialities,
	"LTD Sandy Shores": ltdSpecialities,

	"Roxwood PWR": [
		{
			icon: "fa-gas-pump",
			label: "Runs",
			hash: "runs",
		},
	],

	"Pawn Shop": [
		{
			icon: "fa-coins",
			label: "Vendre",
			hash: "pawn-shop-buyback",
		},
	],
}


interface SidebarCompany extends Company {
	active: boolean;
}

interface SpecialityItem {
  icon: string;
  label: string;
  hash: string;
}

//import logger from "@/utils/logger";

export default function Sidebar({ user }: { user: User | undefined }) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [companies, setCompanies] = useState<SidebarCompany[]>([]);

	
	useEffect(() => {
		const fetchCompanies = async () => {
			const response = await fetch(`/api/companies?character_id=${user?.employee.character_id}&active_employee_id=${user?.active_employee_id}`);
			const data = await response.json();
			setCompanies(data.companies);
		};
		fetchCompanies();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	const employee = user?.employee || { name: '', grade: '' };
	const company = user?.company || { id: 0, name: '', type: '' };

	const handleMenuClick = (hash: string) => {
		if (hash === 'dashboard' || !hash || hash === "#") {
			window.location.hash = '';
		} else {
			window.location.hash = hash;
		}
	};

	const handleCompanyChange = async (companyId: number) => {
		const response = await fetch(`/api/companies`,
			{
				method: 'PUT',
				body: JSON.stringify({
					user_id: user?.id,
					character_id: user?.employee.character_id,
					company_id: companyId,
				})
			}
		);
		const data = await response.json();
		setCompanies(data.companies);
		setIsDropdownOpen(false);
		window.location.reload();
	};

	return (
		<div className="flex flex-col h-full p-2 gap-4 w-full bg-gray-50 dark:bg-neutral-800 md:bg-transparent md:dark:bg-transparent transition-all duration-300 ease-in-out">
			<div className="flex flex-col p-2 w-full min-w-full">
				<button className="flex flex-row items-center w-full gap-4 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
					<i className="fa-light fa-rectangle-history pl-2 dark:text-white" />
					<div className="flex flex-col gap-0.5">
						<span className="text-sm font-semibold tracking-tight leading-none text-left dark:text-white">{company.name}</span>
						<span className="text-sm tracking-tight leading-none text-left dark:text-white">{company.type}</span>
					</div>
					<div className="ml-auto px-1 cursor-pointer">
						<i className="fa-solid fa-xs fa-angles-up-down dark:text-white" />
					</div>
				</button>
				<div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen ? 'max-h-40 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}>
					<div className="self-start w-max flex flex-col p-1 gap-1 rounded-xl shadow-xs bg-white dark:bg-neutral-800 mt-2 transition-all duration-300">
						{companies.map(company => {
							return (
								<div key={company.id} onClick={() => handleCompanyChange(company.id)}>
									<div className="flex flex-row items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg">
										<Image src={`/companies/${company.name}.png`}
											alt={company.name}
											className="rounded-full"
											width={24}
											height={24}
											onError={(e) => {
												const img = e.currentTarget as HTMLImageElement;
												img.onerror = null;
												img.src = "/companies/default.png";
											}}
										/>
										<span className="text-sm tracking-tight leading-none text-left dark:text-white">{company.name}</span>
										{company.active && <i className="fa-light fa-check mr-4 dark:text-white" />}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>


			<div className="flex flex-col gap-2 p-2">
				<p className="text-sm font-semibold tracking-tight leading-none px-2 dark:text-white">Menu</p>
				<ul className="flex flex-col gap-3 p-2">
					{menuItems.map(item => {
						return (
							<li key={item.label} 
								onClick={() => handleMenuClick(item.hash)}
								className="cursor-pointer hover:opacity-80 transition-opacity"
							>
								<i className={`fa-light dark:fa-solid fa-fw fa-md ${item.icon} w-5 h-5 dark:text-white`} />
								<span className="ml-2 text-sm dark:text-white">{item.label}</span>
							</li>
						);
					})}
				</ul>
			</div>


			<div className="flex flex-col gap-2 p-2">
				<p className="text-sm font-semibold tracking-tight leading-none px-2 dark:text-white">Administration</p>
				<ul className="flex flex-col gap-3 p-2">
					{othersItems.map(item => {
						return (
							<li key={item.label}
								onClick={() => handleMenuClick(item.hash)}
								className="cursor-pointer hover:opacity-80 transition-opacity"
							>
								<i className={`fa-light dark:fa-solid fa-fw fa-md ${item.icon} w-5 h-5 dark:text-white`} />
								<span className="ml-2 text-sm dark:text-white">{item.label}</span>	
							</li>
						);
					})}
				</ul>
			</div>

			{specialities[company.name]?.length > 0 &&
				<div className="flex flex-col gap-2 p-2">
					<p className="text-sm font-semibold tracking-tight leading-none px-2 dark:text-white">Spécialités</p>
					<ul className="flex flex-col gap-3 p-2">
						{specialities[company.name].map(item => {
							return (
								<li
									key={item.hash}
									onClick={() => handleMenuClick(item.hash)}
									className="cursor-pointer hover:opacity-80 transition-opacity flex items-center"
								>
									<i className={`fa-light dark:fa-solid fa-fw fa-md ${item.icon} w-5 h-5 dark:text-white`} />
									<span className="ml-2 text-sm dark:text-white">{item.label}</span>
								</li>
							);
						})}
					</ul>
				</div>
			}


			<footer className="flex flex-row gap-2 mt-auto w-full">
				<div className="flex flex-col h-full p-2 gap-4 w-full">
					<div className="w-full p-2">
						<div className="flex flex-row items-center p-2 gap-4 w-full min-w-full">
							<Image src={user?.avatar || '/default-avatar.png'} alt={user?.username || 'Utilisateur'} className="rounded-full" width={32} height={32} />
							<div className="flex flex-col gap-0.5">
								<p className="text-sm font-medium tracking-tight leading-none dark:text-white">{employee.name}</p>
								<p className="text-xs text-[var(--muted-foreground)] tracking-tight leading-none dark:text-white">{employee.grade}</p>
							</div>
							<Link href="/api/auth/logout" prefetch={false} className="ml-auto px-1 cursor-pointer"><i className="fa-solid fa-xs fa-sign-out-alt dark:text-white" /></Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
