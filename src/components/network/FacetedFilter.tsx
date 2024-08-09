import type { Column } from '@tanstack/react-table';
import { Badge } from 'betfinio_app/badge';
import { Button } from 'betfinio_app/button';
import { Command, CommandGroup, CommandItem, CommandList } from 'betfinio_app/command';
import { PopoverContent, PopoverTrigger } from 'betfinio_app/popover';
import { Popover } from 'betfinio_app/popover';
import { Separator } from 'betfinio_app/separator';
import cx from 'clsx';
import { CheckIcon, CirclePlus } from 'lucide-react';
import type { ComponentType } from 'react';

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
}

export function DataTableFacetedFilter<TData, TValue>({ column, title, options }: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed border-gray-800">
					<CirclePlus className="mr-2 h-4 w-4" />
					{title}
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 2 ? (
									<Badge variant="secondary" className="rounded-sm px-1 font-normal">
										{selectedValues.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal flex flex-row items-center gap-1">
												{option.icon && <option.icon className={'w-3 h-3'} />}
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandList>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value);
											} else {
												selectedValues.add(option.value);
											}
											const filterValues = Array.from(selectedValues);
											column?.setFilterValue(filterValues.length ? filterValues : undefined);
										}}
									>
										<div
											className={cx(
												'mr-2 flex h-4 w-4 items-center justify-center  rounded-sm border ',
												isSelected ? 'bg-primary text-white ' : '[&_svg]:invisible',
											)}
										>
											{isSelected && <CheckIcon className={cx('h-4 w-4')} />}
										</div>
										{option.icon && <option.icon className={cx('mr-2 h-4 w-4', isSelected && 'text-white')} />}
										<span className={cx(isSelected && 'text-white')}>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">{facets.get(option.value)}</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
