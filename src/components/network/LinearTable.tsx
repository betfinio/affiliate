import {useAccount} from "wagmi";
import {DataTable} from "./Table"
import {columnHelper, columns} from "@/src/components/network/columns.tsx";
import {useLinearMembers} from "@/src/lib/query";
import {ZeroAddress} from "@betfinio/abi";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "betfinio_app/dropdown-menu";
import {Button} from "betfinio_app/button";
import {MoreHorizontal} from "lucide-react";
import {Address} from "viem";
import {useOpenProfile} from "betfinio_app/lib/query/shared";

const LinearTable = () => {
	const {address = ZeroAddress} = useAccount();
	const {data = []} = useLinearMembers(address);
	const {open} = useOpenProfile()
	const handleOpenProfile = (member: Address) => {
		open(member)
	}
	const columnsWithActions = [...columns, columnHelper.display({
		id: 'action',
		meta: {
			className: 'w-10'
		},
		cell: ({row}) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4"/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleOpenProfile(row.original.member)}>
							Display profile
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	}),]
	// @ts-ignore
	return <DataTable columns={columnsWithActions} data={data}/>
}

export default LinearTable



