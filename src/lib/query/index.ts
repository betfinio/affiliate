import logger from '@/src/config/logger';
import {
	claimDirect,
	claimMatching,
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
	multimint,
} from '@/src/lib/api';
import type { MemberWithUsername, TableMember } from '@/src/lib/types.ts';
import { ZeroAddress } from '@betfinio/abi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { WriteContractReturnType } from '@wagmi/core';
import { waitForTransactionReceipt } from '@wagmi/core';
import { getTransactionLink } from 'betfinio_app/helpers';
import type { Balance, Member, TreeMember } from 'betfinio_app/lib/types';
import { useSupabase } from 'betfinio_app/supabase';
import { useToast } from 'betfinio_app/use-toast';
import { useTranslation } from 'react-i18next';
import type { Address, WriteContractErrorType } from 'viem';
import { useAccount, useConfig } from 'wagmi';

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

interface MintParams {
	members: Address[];
	parents: Address[];
}

export const useMultimint = () => {
	const config = useConfig();
	const { t } = useTranslation('', { keyPrefix: 'shared.errors' });
	const { toast } = useToast();
	return useMutation<WriteContractReturnType, WriteContractErrorType, MintParams>({
		mutationKey: ['affiliate', 'multimint'],
		mutationFn: ({ members, parents }) => multimint(members, parents, { config }),
		onError: (e) => {
			// @ts-ignore
			logger.error(e, e.cause, e.cause.reason);
			// @ts-ignore
			if (e?.cause?.reason) {
				toast({
					title: 'Failed to mint passes',
					// @ts-ignore
					description: t(e.cause.reason),
					variant: 'destructive',
				});
			} else {
				toast({
					title: t('unknown'),
					variant: 'destructive',
				});
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const { id, update } = toast({
					title: 'Minting passes',
					description: 'Transaction submitted',
					variant: 'loading',
					duration: 60 * 1000,
				});
				await waitForTransactionReceipt(config, {
					hash: data,
				});
				update({
					title: 'Passes were minted',
					description: 'Transaction confirmed',
					variant: 'default',
					duration: 5 * 1000,
					id: id,
					action: getTransactionLink(data),
				});
			}
		},
	});
};

export const useClaimDirect = () => {
	const config = useConfig();
	const queryClient = useQueryClient();
	const { t } = useTranslation('', { keyPrefix: 'shared.errors' });
	const { toast } = useToast();
	return useMutation<WriteContractReturnType, WriteContractErrorType>({
		mutationKey: ['affiliate', 'claim', 'direct'],
		mutationFn: () => claimDirect({ config }),
		onError: (e) => {
			// @ts-ignore
			if (e?.cause?.reason) {
				toast({
					title: 'Failed to claim direct bonus',
					// @ts-ignore
					description: t(e.cause.reason),
					variant: 'destructive',
				});
			} else {
				toast({
					title: t('unknown'),
					variant: 'destructive',
				});
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const { id, update } = toast({
					title: 'Claiming direct bonus',
					description: 'Transaction submitted',
					variant: 'loading',
					duration: 60 * 1000,
				});
				await waitForTransactionReceipt(config, {
					hash: data,
				});
				update({
					title: 'Direct bonus claimed',
					description: 'Transaction confirmed',
					variant: 'default',
					duration: 5 * 1000,
					id: id,
					action: getTransactionLink(data),
				});
				await queryClient.invalidateQueries({ queryKey: ['affiliate'] });
			}
		},
	});
};

export const useClaimMatching = () => {
	const config = useConfig();
	const queryClient = useQueryClient();
	const { address = ZeroAddress } = useAccount();
	const { t } = useTranslation('', { keyPrefix: 'shared.errors' });
	const { toast } = useToast();
	return useMutation<WriteContractReturnType, WriteContractErrorType>({
		mutationKey: ['affiliate', 'claim', 'matching'],
		mutationFn: () => claimMatching(address, { config }),
		onError: (e) => {
			// @ts-ignore
			if (e?.cause?.reason) {
				toast({
					title: 'Failed to claim matching bonus',
					// @ts-ignore
					description: t(e.cause.reason),
					variant: 'destructive',
				});
			} else {
				toast({
					title: t('unknown'),
					variant: 'destructive',
				});
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const { id, update } = toast({
					title: 'Claiming matching bonus',
					description: 'Transaction submitted',
					variant: 'loading',
					duration: 60 * 1000,
				});
				await waitForTransactionReceipt(config, {
					hash: data,
				});
				update({
					title: 'Matching bonus claimed',
					description: 'Transaction confirmed',
					variant: 'default',
					duration: 5 * 1000,
					id: id,
					action: getTransactionLink(data),
				});
				await queryClient.invalidateQueries({ queryKey: ['affiliate'] });
			}
		},
	});
};
