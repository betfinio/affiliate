import {
	fetchAffiliateConditions,
	fetchBalances,
	fetchDailyLimit,
	fetchInviteCondition,
	fetchLinearMembers,
	fetchMember,
	fetchMemberSide,
	fetchPendingMatching,
	fetchTreeMember,
	findMembersByAddress,
	findMembersByUsername,
} from '@/src/lib/api';
import { getDirectClaims, getMatchingClaims } from '@/src/lib/gql';
import type { MemberWithUsername, TableMember } from '@/src/lib/types.ts';
import { useQuery } from '@tanstack/react-query';
import type { Balance, Member, TreeMember } from 'betfinio_app/lib/types';
import { useSupabase } from 'betfinio_app/supabase';
import type { Address } from 'viem';
import { useConfig } from 'wagmi';

export const useMember = (address?: Address) => {
	const config = useConfig();
	const { client } = useSupabase();
	return useQuery<Member | undefined>({
		queryKey: ['affiliate', 'member', address],
		queryFn: async () => fetchMember(address, { config: config, supabase: client }),
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};

export const useEarningBalances = (address?: Address) => {
	const config = useConfig();
	return useQuery<Balance>({
		queryKey: ['affiliate', 'balances', address],
		initialData: {
			staking: {
				claimable: 0n,
				claimed: 0n,
				total: 0n,
				claimableDaily: 0n,
			},
			bets: {
				claimable: 0n,
				claimed: 0n,
				total: 0n,
				claimableDaily: 0n,
			},
			matching: {
				claimable: 0n,
				claimed: 0n,
				total: 0n,
				claimableDaily: 0n,
			},
		},
		queryFn: async () => fetchBalances(address, { config }),
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	});
};

export const usePendingMatchingBonus = (address?: Address) => {
	const config = useConfig();
	const { client } = useSupabase();
	return useQuery<bigint>({
		queryKey: ['affiliate', 'pendingMatching', address],
		queryFn: async () => fetchPendingMatching(address, { config: config, supabase: client }),
	});
};
export const useDailyLimit = (address?: Address) => {
	const config = useConfig();
	return useQuery<bigint>({
		queryKey: ['affiliate', 'dailyLimit', address],
		queryFn: async () => fetchDailyLimit(address, { config }),
	});
};

export const useInviteCondition = () => {
	const config = useConfig();
	return useQuery({
		queryKey: ['affiliate', 'inviteStakingCondition'],
		queryFn: () => fetchInviteCondition({ config }),
	});
};

export const usePossibleUsernames = (value: string) => {
	const { client } = useSupabase();
	return useQuery<MemberWithUsername[]>({
		queryKey: ['affiliate', 'possibleUsernames', value],
		queryFn: async () => findMembersByUsername(value, { supabase: client }),
		enabled: value.length > 2,
	});
};
export const usePossibleAddresses = (value: string) => {
	const { client } = useSupabase();
	return useQuery<MemberWithUsername[]>({
		queryKey: ['affiliate', 'possibleAddresses', value],
		queryFn: async () => findMembersByAddress(value, { supabase: client }),
		enabled: value.length > 2,
	});
};
export const useMemberSide = (member: Address | undefined, user: Address | undefined) => {
	const { client } = useSupabase();
	return useQuery<'left' | 'right' | null>({
		queryKey: ['affiliate', 'side', member, user],
		queryFn: async () => fetchMemberSide(member, user, { supabase: client }),
	});
};

export const useAffiliateConditions = () => {
	const config = useConfig();
	return useQuery<bigint[]>({
		queryKey: ['affiliate', 'conditions'],
		queryFn: () => fetchAffiliateConditions({ config }),
	});
};

export const useLinearMembers = (address: Address) => {
	const config = useConfig();
	const { client } = useSupabase();
	return useQuery<TableMember[]>({
		queryKey: ['affiliate', 'members', 'linear', address],
		queryFn: () => fetchLinearMembers(address, { config, supabase: client }),
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};

export const useTreeMember = (address: Address) => {
	const { client } = useSupabase();
	return useQuery<TreeMember>({
		queryKey: ['affiliate', 'members', 'tree', 'member', address],
		queryFn: () => fetchTreeMember(address, { supabase: client }),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		staleTime: 10 * 60 * 1000, //10min
	});
};

export const useDirectClaims = (address: Address) => {
	return useQuery({
		queryKey: ['affiliate', 'claims', 'direct', address],
		queryFn: () => getDirectClaims(address),
	});
};
export const useMatchingClaims = (address: Address) => {
	return useQuery({
		queryKey: ['affiliate', 'claims', 'matching', address],
		queryFn: () => getMatchingClaims(address),
	});
};
