import type { IFilterKeys } from '@/src/i18next';
import type { Column } from '@tanstack/react-table';
import { Badge } from 'betfinio_app/badge';
import { Button } from 'betfinio_app/button';
import { Command, CommandGroup, CommandItem, CommandList } from 'betfinio_app/command';
import { Popover, PopoverContent, PopoverTrigger } from 'betfinio_app/popover';
import { Separator } from 'betfinio_app/separator';
import cx from 'clsx';
import { CheckIcon, CirclePlus } from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	options: {
		label: string;
		value: string;
		color?: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
}

export function DataTableFacetedFilter<TData, TValue>({ column, title, options }: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);
	const { t } = useTranslation('affiliate', { keyPrefix: 'tables.filter' });
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
												{option.color && <div className={cx(option.color, 'w-3 h-3 rounded-full')} />}
												{option.icon && <option.icon className={'w-3 h-3'} />}
												{t(option.label as keyof IFilterKeys)}
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
										<span className={cx(isSelected && 'text-white')}>{t(option.label as keyof IFilterKeys)}</span>
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
