import {useQuery} from "@tanstack/react-query";
import {Address} from "viem";
import {Member} from "betfinio_app/lib/types";
import {fetchBalances, fetchMember} from "@/src/lib/api";
import {useConfig} from "wagmi";
import {useSupabase} from "betfinio_app/supabase";
import {Balance} from "betfinio_app/lib/types";


export const useMember = (address?: Address) => {
	const config = useConfig()
	const {client} = useSupabase()
	return useQuery<Member | undefined>({
		queryKey: ['affiliate', 'member', address],
		queryFn: async () => fetchMember(address, {config: config}),
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})
}


export const useEarningBalances = (address?: Address) => {
	const config = useConfig()
	return useQuery<Balance>({
		queryKey: ['affiliate', 'balances', address],
		queryFn: async () => fetchBalances(address, {config})
	})
}
