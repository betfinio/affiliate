import {Table} from "@tanstack/react-table"
import {Input} from "betfinio_app/input"
import {DataTableFacetedFilter} from "./FacetedFilter"
import {activities, categories, sides} from "@/src/components/network/columns.tsx";
import {Button} from "betfinio_app/button";
import {X} from "lucide-react";

interface DataTableToolbarProps<TData> {
	table: Table<TData>
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0
	
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center gap-2 flex-wrap">
				{table.getColumn("side") && (
					<DataTableFacetedFilter
						column={table.getColumn("side")}
						title="Side"
						options={sides}
					/>
				)}
				{table.getColumn("category") && (
					<DataTableFacetedFilter
						column={table.getColumn("category")}
						title="Category"
						options={categories}
					/>
				)}
				{table.getColumn("activity") && (
					<DataTableFacetedFilter
						column={table.getColumn("activity")}
						title="Activity"
						options={activities}
					/>
				)}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<X className="ml-2 h-4 w-4"/>
					</Button>
				)}
				<div className={'w-full  lg:w-auto flex-1 flex justify-end '}>
					<Input
						placeholder="Filter members..."
						value={(table.getColumn("member")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("member")?.setFilterValue(event.target.value)
						}
						className="h-8 w-[250px] border-gray-800"
					/>
				</div>
			</div>
		</div>
	)
}