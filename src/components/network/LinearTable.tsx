import {useAccount} from "wagmi";
import {DataTable} from "./Table"
import {columns} from "@/src/components/network/columns.tsx";
import {useLinearMembers} from "@/src/lib/query";
import {ZeroAddress} from "@betfinio/abi";

const LinearTable = () => {
	const {address = ZeroAddress} = useAccount();
	const {data = []} = useLinearMembers(address);
	// @ts-ignore
	return <DataTable columns={columns} data={data}/>
}

export default LinearTable