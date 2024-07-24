import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Address} from "viem";
import {Member} from "betfinio_app/lib/types";
import {
	claimDirect,
	claimMatching,
	fetchAffiliateConditions,
	fetchBalances,
	fetchDailyLimit,
	fetchInviteCondition,
	fetchMember,
	fetchMemberSide,
	fetchPendingMatching,
	findMembersByAddress,
	findMembersByUsername,
	multimint
} from "@/src/lib/api";
import {useAccount, useConfig} from "wagmi";
import {waitForTransactionReceipt} from "@wagmi/core"
import {useSupabase} from "betfinio_app/supabase";
import {Balance} from "betfinio_app/lib/types";
import {MemberWithUsername} from "@/src/lib/types.ts";
import {useTranslation} from "react-i18next";
import {useToast} from "betfinio_app/use-toast";
import {getTransactionLink} from "@/src/components/utils.tsx";
import {type WriteContractReturnType} from '@wagmi/core'
import {ZeroAddress} from "@betfinio/abi";


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
			}
		},
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

export const useAffiliateConditions = () => {
	const config = useConfig();
	return useQuery<bigint[]>({
		queryKey: ['affiliate', 'conditions'],
		queryFn: () => fetchAffiliateConditions({config})
	})
}

interface MintParams {
	members: Address[],
	parents: Address[]
}

export const useMultimint = () => {
	const config = useConfig();
	const {t} = useTranslation('', {keyPrefix: 'shared.errors'})
	const {toast} = useToast();
	return useMutation<any, any, MintParams>({
		mutationKey: ['affiliate', 'multimint'],
		mutationFn: ({members, parents}) => multimint(members, parents, {config}),
		onError: (e) => {
			console.log('error', e, e.cause, e.cause.reason)
			if (e && e.cause && e.cause.reason) {
				toast({
					title: "Failed to mint passes",
					description: t(e.cause.reason),
					variant: 'destructive'
				})
			} else {
				toast({
					title: t('unknown'),
					variant: 'destructive'
				})
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const {id, update} = toast({
					title: "Minting passes",
					description: "Transaction submitted",
					variant: 'loading',
					duration: 60 * 1000
				})
				await waitForTransactionReceipt(config, {
					hash: data
				})
				update({
					title: "Passes were minted",
					description: "Transaction confirmed",
					variant: 'default',
					duration: 5 * 1000,
					id: id,
					action: getTransactionLink(data)
				})
			}
		}
	})
}


export const useClaimDirect = () => {
	const config = useConfig();
	const queryClient = useQueryClient();
	const {t} = useTranslation('', {keyPrefix: 'shared.errors'})
	const {toast} = useToast();
	return useMutation<WriteContractReturnType, any>({
		mutationKey: ['affiliate', 'claim', 'direct'],
		mutationFn: () => claimDirect({config}),
		onError: (e) => {
			console.log('error', e, e.cause, e.cause.reason)
			if (e && e.cause && e.cause.reason) {
				toast({
					title: "Failed to claim direct bonus",
					description: t(e.cause.reason),
					variant: 'destructive'
				})
			} else {
				toast({
					title: t('unknown'),
					variant: 'destructive'
				})
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const {id, update} = toast({
					title: "Claiming direct bonus",
					description: "Transaction submitted",
					variant: 'loading',
					duration: 60 * 1000
				})
				await waitForTransactionReceipt(config, {
					hash: data
				})
				update({
					title: "Direct bonus claimed",
					description: "Transaction confirmed",
					variant: 'default',
					duration: 5 * 1000,
					id: id,
					action: getTransactionLink(data)
				})
				await queryClient.invalidateQueries({queryKey: ['affiliate']})
			}
		}
	})
}

export const useClaimMatching = () => {
	const config = useConfig();
	const queryClient = useQueryClient();
	const {address = ZeroAddress} = useAccount()
	const {t} = useTranslation('', {keyPrefix: 'shared.errors'})
	const {toast} = useToast();
	return useMutation<WriteContractReturnType, any>({
		mutationKey: ['affiliate', 'claim', 'matching'],
		mutationFn: () => claimMatching(address, {config}),
		onError: (e) => {
			console.log('error', e, e.cause, e.cause.reason)
			if (e && e.cause && e.cause.reason) {
				toast({
					title: "Failed to claim matching bonus",
					description: t(e.cause.reason),
					variant: 'destructive'
				})
			} else {
				toast({
					title: t('unknown'),
					variant: 'destructive'
				})
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const {id, update} = toast({
					title: "Claiming matching bonus",
					description: "Transaction submitted",
					variant: 'loading',
					duration: 60 * 1000
				})
				await waitForTransactionReceipt(config, {
					hash: data
				})
				update({
					title: "Matching bonus claimed",
					description: "Transaction confirmed",
					variant: 'default',
					duration: 5 * 1000,
					id: id,
					action: getTransactionLink(data)
				})
				await queryClient.invalidateQueries({queryKey: ['affiliate']})
			}
		}
	})
}