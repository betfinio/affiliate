import type { Column } from '@tanstack/react-table';
import { Button } from 'betfinio_app/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from 'betfinio_app/dropdown-menu';
import cx from 'clsx';
import { ArrowUpDown, ArrowUpIcon, EyeOff } from 'lucide-react';
import { ArrowDownIcon } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cx(className)}>{title}</div>;
	}

	return (
		<div className={cx('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-8 p-1 px-2 data-[state=open]:bg-primaryLighter">
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ? (
							<ArrowDownIcon className="ml-2 h-3 w-3" />
						) : column.getIsSorted() === 'asc' ? (
							<ArrowUpIcon className="ml-2 h-3 w-3" />
						) : (
							<ArrowUpDown className="ml-2 h-3 w-3" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Desc
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
