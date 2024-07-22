import {useQuery} from "@tanstack/react-query";
import {Address} from "viem";
import {Member} from "betfinio_app/lib/types";
import {fetchBalances, fetchDailyLimit, fetchInviteCondition, fetchMember, fetchMemberSide, fetchPendingMatching, findMembersByAddress, findMembersByUsername} from "@/src/lib/api";
import {useConfig} from "wagmi";
import {useSupabase} from "betfinio_app/supabase";
import {Balance} from "betfinio_app/lib/types";
import {MemberWithUsername} from "@/src/lib/types.ts";


export const useMember = (address?: Address) => {
	const config = useConfig()
	const {client} = useSupabase()
	return useQuery<Member | undefined>({
		queryKey: ['affiliate', 'member', address],
		queryFn: async () => fetchMember(address, {config: config, supabase: client}),
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


export const usePendingMatchingBonus = (address?: Address) => {
	const config = useConfig();
	const {client} = useSupabase();
	return useQuery<bigint>({
		queryKey: ['affiliate', 'pendingMatching', address],
		queryFn: async () => fetchPendingMatching(address, {config: config, supabase: client})
	})
}
export const useDailyLimit = (address?: Address) => {
	const config = useConfig();
	return useQuery<bigint>({
		queryKey: ['affiliate', 'dailyLimit', address],
		queryFn: async () => fetchDailyLimit(address, {config})
	})
}

export const useInviteCondition = () => {
	const config = useConfig();
	return useQuery({
		queryKey: ['affiliate', 'inviteStakingCondition'],
		queryFn: () => fetchInviteCondition({config})
	})
}

export const usePossibleUsernames = (value: string) => {
	const {client} = useSupabase()
	return useQuery<MemberWithUsername[]>({
		queryKey: ['affiliate', 'possibleUsernames', value],
		queryFn: async () => findMembersByUsername(value, {supabase: client}),
		enabled: value.length > 2,
	})
}
export const usePossibleAddresses = (value: string) => {
	const {client} = useSupabase()
	return useQuery<MemberWithUsername[]>({
		queryKey: ['affiliate', 'possibleAddresses', value],
		queryFn: async () => findMembersByAddress(value, {supabase: client}),
		enabled: value.length > 2,
	})
}
export const useMemberSide = (member: Address | undefined, user: Address | undefined) => {
	const {client} = useSupabase()
	return useQuery<'left' | 'right' | null>({
		queryKey: ['affiliate', 'side', member, user],
		queryFn: async () => fetchMemberSide(member, user, {supabase: client}),
	})
}