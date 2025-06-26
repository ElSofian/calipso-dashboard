"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Stock } from '@/types';

export default function Table({ stock }: { stock: Stock[] }) {

	const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
	const [filteredStock, setFilteredStock] = useState<Stock[]>([]);

	const totalRows = stock.length;
	const totalPages = Math.ceil(totalRows / rowsPerPage)

	useEffect(() => {
		setFilteredStock(stock
			.sort((a, b) => {
				const aAlert = (a.target - (a.amount_in + a.amount_ext)) > 0 ? 1 : 0;
				const bAlert = (b.target - (b.amount_in + b.amount_ext)) > 0 ? 1 : 0;
				
				if (aAlert !== bAlert) {
					return bAlert - aAlert; 
				}
				
				return a.category.localeCompare(b.category);
			})
			.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
		);
	}, [currentPage, rowsPerPage, stock]);

	const filterData = (search: string) => {
		if (!search.length) {
			setFilteredStock(stock.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage));
			return;
		}
		
		setFilteredStock(stock.filter((item) => {
			return `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase());
		}));
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<input
						placeholder="Rechercher"
						onChange={(e) => filterData(e.target.value)}
						className="w-sm border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300"
					/>
				</div>
			</div>
			<div className="rounded-lg bg-white border border-[var(--border)] dark:bg-neutral-900 dark:border-none">
				<div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50 dark:bg-[var(--table-header-dark)] dark:border-neutral-800">
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Nom</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Catégorie</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Quantité (interne)</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Quantité (externe)</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Total</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Objectif</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">À commander</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Prix</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Coût</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Promotion</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
							{filteredStock.map((item: Stock) => {
								const total = item.amount_in + item.amount_ext;
								return (
								<tr
									key={item.id}
									className={`${total < item.target ? "bg-red-50 dark:bg-red-400/15" : "hover:bg-gray-50 dark:hover:bg-neutral-800"}`}
								>
									<td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.category}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.amount_in}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.amount_ext}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{total}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.target}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.target - total}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.price}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.cost}</td>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.promotion}</td>
								</tr>
							)})}
						</tbody>
					</table>
				</div>

				<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900">
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-700 dark:text-gray-300">Items par page</span>
							<select
								value={rowsPerPage}
								onChange={(e) => setRowsPerPage(Number(e.target.value))}
								className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300"
							>
								<option value={10}>10</option>
								<option value={20}>20</option>
								<option value={30}>30</option>
								<option value={40}>40</option>
								<option value={50}>50</option>
							</select>
						</div>

						<span className="text-sm text-gray-700 dark:text-gray-300">
							Page {currentPage} sur {totalPages}
						</span>

						<div className="flex items-center gap-1">
							<button
								onClick={() => setCurrentPage(1)}
								disabled={currentPage === 1}
								className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronsLeft className="w-4 h-4 dark:text-gray-300" />
							</button>
							<button
								onClick={() => setCurrentPage(prev => prev - 1)}
								disabled={currentPage === 1}
								className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronLeft className="w-4 h-4 dark:text-gray-300" />
							</button>
							<button
								onClick={() => setCurrentPage(prev => prev + 1)}
								disabled={currentPage === totalPages}
								className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronRight className="w-4 h-4 dark:text-gray-300" />
							</button>
							<button
								onClick={() => setCurrentPage(totalPages)}
								disabled={currentPage === totalPages}
								className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronsRight className="w-4 h-4 dark:text-gray-300" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}