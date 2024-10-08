import { DataTableToolbar } from '@/src/components/network/Tollbar.tsx';
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { DataTablePagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'betfinio_app/table';
import cx from 'clsx';
import { type MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onRowClick?: (row: TData) => void;
	isLoading?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, onRowClick, isLoading }: DataTableProps<TData, TValue>) {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		activity: false,
		category: false,
		username: false,
		level: false,
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{
			id: 'side',
			value: ['left', 'right'],
		},
		{
			id: 'category',
			value: ['matching', 'inviting', 'active', 'inactive'],
		},
	]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const { t } = useTranslation('affiliate', { keyPrefix: 'tables' });
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnFilters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	const handleClick = (e: MouseEvent, row: TData) => {
		if ((e.target as HTMLElement).role !== 'menuitem') {
			onRowClick?.(row);
		}
	};

	return (
		<div className="space-y-2 affiliate w-full">
			<DataTableToolbar table={table} />
			<div className="rounded-md border border-gray-800 w-full">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan} className={cx(header.column.columnDef.meta?.className)}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow className={'cursor-pointer'} key={row.id} onClick={(e: MouseEvent) => handleClick(e, row.original)}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className={cx(cell.column.columnDef.meta?.className, 'h-[50px]')}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									{isLoading ? t('loading') : t('noData')}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
