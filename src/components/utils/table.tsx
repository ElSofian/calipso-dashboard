"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { format } from 'date-fns'
import { Employee, Export, Vehicle, Income, Payment, Run, Sale, Stock } from '@/types';

type Data = Employee | Export | Vehicle | Income | Payment | Run | Sale | Stock;
type Column = { label: string, value: string, start?: string, end?: string, muted?: boolean, number?: boolean, badge?: { on: string, off: string }, date?: boolean }

const formatNumber = (number: number) => {
	return number.toLocaleString('fr-FR');
}

export default function Table({ name, columns, data, filterCategory, button, onClick }: { name: string, columns: Column[], data: Data[], filterCategory?: string | string[], button?: React.ReactNode, onClick?: (item: Data) => void }) {

	const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
	const [filteredData, setFilteredData] = useState<Data[]>([]);

	const totalRows = data.length;
	const totalPages = Math.ceil(totalRows / rowsPerPage)

	useEffect(() => {
		setFilteredData(data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage));
	}, [currentPage, rowsPerPage, data]);


	const StatusBadge = ({ status, badge }: { status: boolean, badge: { on: string, off: string } }) => {
    if (status) {
      return (
        <div className="flex items-center gap-2 text-green-600">
					<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
					<span className="text-sm font-medium">{badge.on}</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 text-orange-600">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">{badge.off}</span>
      </div>
    )
  }

	const filterData = (search: string) => {
		if (!search.length || !filterCategory) {
			setFilteredData(data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage));
			return;
		}
		
		setFilteredData(data.filter((item) => {
			if (Array.isArray(filterCategory)) {
				return filterCategory.some((category) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const value = (item as any)[category];
					return value && String(value).toLowerCase().includes(search.toLowerCase());
				})
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const value = (item as any)[filterCategory];
			return value && String(value).toLowerCase().includes(search.toLowerCase());
		}));
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			{filterCategory && (
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<input
							placeholder="Rechercher"
							onChange={(e) => filterData(e.target.value)}
							className="w-sm border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300"
						/>
					</div>
					{button && button}
				</div>
			)}
			<div className="rounded-lg bg-white border border-[var(--border)] dark:bg-neutral-900 dark:border-none">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50 dark:bg-[var(--table-header-dark)] dark:border-neutral-800">
								{
									columns.map((column: Column) => (
										<th key={column.value} className="px-4 py-3 text-left text-sm font-medium first:rounded-tl-lg last:rounded-tr-lg text-gray-900 dark:text-gray-300">
											{column.label}
										</th>
									))
								}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
							{filteredData.map((item: Data) => {
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								const itemData = item as any;

								return (
									<tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50" onClick={() => onClick?.(item)}>
										{
											columns.map((column: Column) => (
												<td key={column.value} className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
													{column.date ?
														(
															<span className="text-gray-500 dark:text-gray-400">
																{format(new Date(itemData[column.value]), 'dd/MM/yyyy à HH:mm')}
															</span>
														)
														:
														(
															<span className={`${column.muted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
																{column.start}{column.number ? formatNumber(itemData[column.value]) : itemData[column.value]}{column.end}
															</span>
														)
													}
													{column.badge && (
														<StatusBadge status={itemData[column.value]} badge={column.badge} />
													)}
												</td>
											))
										}
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>

				<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900">
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-700 dark:text-gray-300">{name} par page</span>
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