import {Address} from "viem";
import {AffiliateContract, AffiliateFundContract, defaultMulticall, MultimintContract, PassContract, ZeroAddress} from "@betfinio/abi";
import {Balance, Member, Options} from "betfinio_app/lib/types";
import {isMember} from "betfinio_app/lib/api/pass";
import {multicall, readContract, writeContract} from "@wagmi/core";
import {MemberWithUsername, TableMember} from "@/src/lib/types.ts";
import {getLevel, getSide} from "@/src/lib/utils.ts";

const PASS_ADDRESS = import.meta.env.PUBLIC_PASS_ADDRESS;
const AFFILIATE_ADDRESS = import.meta.env.PUBLIC_AFFILIATE_ADDRESS;
const AFFILIATE_FUND_ADDRESS = import.meta.env.PUBLIC_AFFILIATE_FUND_ADDRESS;
export const fetchMember = async (address: Address | undefined, options: Options): Promise<Member | undefined> => {
	if (!options.supabase) {
		throw new Error('Supabase client is not defined')
	}
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	if (address === ZeroAddress || !address) {
		throw new Error('Address is not defined')
	}
	// check if member
	if (!await isMember(address, options)) {
		throw new Error('Not a member')
	}
	console.log('fetching member', address)
	const data = await multicall(options.config, {
		multicallAddress: defaultMulticall,
		contracts: [
			{
				abi: PassContract.abi,
				address: PASS_ADDRESS,
				functionName: 'getInviteesCount',
				args: [address]
			},
			{
				abi: PassContract.abi,
				address: PASS_ADDRESS,
				functionName: 'getInviter',
				args: [address]
			},
			{
				abi: AffiliateContract.abi,
				address: AFFILIATE_ADDRESS,
				functionName: 'checkInviteCondition',
				args: [address]
			},
			{
				
				abi: AffiliateContract.abi,
				address: AFFILIATE_ADDRESS,
				functionName: 'checkMatchingCondition',
				args: [address]
			}
		]
	})
	const {data: doc} = await options.supabase.from('members').select('parent, inviter, left, betsLeft::text, betsRight::text, bets::text, right, volume::text, volumeLeft::text, volumeRight::text, matchedLeft::text, matchedRight::text').eq('member', address.toLowerCase()).single<{
		volumeLeft: string,
		volumeRight: string,
		matchedLeft: string,
		matchedRight: string,
		parent: string,
		volume: string,
		left: string,
		right: string,
		bets: string,
		betsLeft: string,
		betsRight: string,
		inviter: string
	}>()
	if (!doc) {
		throw new Error('Member not found')
	}
	const {data: counts} = await options.supabase.from('tree').select('id::text, left, right').eq('member', address.toLowerCase()).single<{
		id: string,
		left: number,
		right: number
	}>();
	return {
		member: address.toLowerCase(),
		index: BigInt(counts?.id || "0"),
		inviter: doc.inviter || ZeroAddress,
		parent: doc.parent || ZeroAddress,
		invitees: Number(data[0].result),
		username: "",
		is: {
			inviting: data[2].result as boolean,
			matching: data[3].result as boolean
		},
		left: doc.left || ZeroAddress,
		right: doc.right || ZeroAddress,
		count: {
			left: counts?.left || 0,
			right: counts?.right || 0
		},
		volume: {
			member: BigInt(doc.volume),
			left: BigInt(doc.volumeLeft),
			right: BigInt(doc.volumeRight)
		},
		matched: {
			left: BigInt(doc.matchedLeft),
			right: BigInt(doc.matchedRight)
		},
		bets: {
			left: BigInt(doc.betsLeft),
			right: BigInt(doc.betsRight),
			member: BigInt(doc.bets)
		}
	} as Member
}


export const fetchBalances = async (address: Address | undefined, options: Options): Promise<Balance> => {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	if (!address) {
		throw new Error('Address is not defined')
	}
	console.log('fetching earning balances of', address)
	const data = await multicall(options.config, {
		multicallAddress: defaultMulticall,
		contracts: [
			{
				abi: AffiliateFundContract.abi,
				address: AFFILIATE_FUND_ADDRESS,
				functionName: 'getDirectBettingBonusFromInvitees',
				args: [address]
			},
			{
				abi: AffiliateFundContract.abi,
				address: AFFILIATE_FUND_ADDRESS,
				functionName: 'getClaimableDirectBettingBonusFromInvitees',
				args: [address]
			},
			{
				abi: PassContract.abi,
				address: PASS_ADDRESS,
				functionName: 'getClaimedDirectBettingBonus',
				args: [address]
			},
			{
				abi: AffiliateFundContract.abi,
				address: AFFILIATE_FUND_ADDRESS,
				functionName: 'getDirectStakingBonusFromInvitees',
				args: [address]
			},
			{
				abi: AffiliateFundContract.abi,
				address: AFFILIATE_FUND_ADDRESS,
				functionName: 'getClaimableDirectStakingBonusFromInvitees',
				args: [address]
			},
			{
				abi: PassContract.abi,
				address: PASS_ADDRESS,
				functionName: 'getClaimedDirectStakingBonus',
				args: [address]
			},
			{
				abi: AffiliateContract.abi,
				address: AFFILIATE_ADDRESS,
				functionName: 'matchedBonus',
				args: [address]
			},
			{
				abi: AffiliateFundContract.abi,
				address: AFFILIATE_FUND_ADDRESS,
				functionName: 'getClaimableMatchingBonus',
				args: [address]
			},
			{
				abi: PassContract.abi,
				address: PASS_ADDRESS,
				functionName: 'getClaimedMatchingBonus',
				args: [address]
			},
			{
				abi: AffiliateFundContract.abi,
				address: AFFILIATE_FUND_ADDRESS,
				functionName: 'getClaimableMatchingBonusDaily',
				args: [address]
			}
		]
	})
	return {
		bets: {
			claimable: data[1].result as bigint || 0n,
			claimed: data[2].result as bigint || 0n,
			total: data[0].result as bigint || 0n
		},
		staking: {
			claimable: data[4].result as bigint || 0n,
			claimed: data[5].result as bigint || 0n,
			total: data[3].result as bigint || 0n
		},
		matching: {
			claimable: data[7].result as bigint || 0n,
			claimed: data[8].result as bigint || 0n,
			total: data[6].result as bigint || 0n,
			claimableDaily: data[9].result as bigint || 0n
		}
	} as Balance;
}


export const fetchPendingMatching = async (address: Address | undefined, options: Options) => {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	if (!options.supabase) {
		throw new Error('Wagmi config is not defined')
	}
	if (!address) {
		throw new Error('Address is not defined')
	}
	const doc = await options.supabase.from("members").select("totalMatching::text").eq("member", address.toLowerCase()).single()
	if (!doc.data) return 0n;
	const claimable = await readContract(options.config, {
		abi: AffiliateContract.abi,
		address: AFFILIATE_ADDRESS,
		functionName: 'matchedBonus',
		args: [address]
	}) as bigint
	return BigInt(doc.data.totalMatching) * 8n / 100n - claimable;
}
export const fetchDailyLimit = async (address: Address | undefined, options: Options) => {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	if (!address) {
		throw new Error('Address is not defined')
	}
	return await readContract(options.config, {
		abi: AffiliateContract.abi,
		address: AFFILIATE_ADDRESS,
		functionName: 'getClaimableMatchingBonusDaily',
		args: [address]
	}) as bigint
}


export const fetchInviteCondition = async (options: Options): Promise<bigint> => {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	
	return await readContract(options.config, {
		abi: AffiliateContract.abi,
		address: AFFILIATE_ADDRESS,
		functionName: 'inviteStakingCondition'
	}) as bigint
}

export const findMembersByUsername = async (username: string, options: Options): Promise<MemberWithUsername[]> => {
	if (!options.supabase) {
		throw new Error('Supabase client is not defined')
	}
	const {data: data, error} = await options.supabase.from('metadata').select('member, username').ilike('username', `%${username.toLowerCase()}%`)
	console.log(error)
	if (!data) return [];
	return data as MemberWithUsername[];
}


export const findMembersByAddress = async (username: string, options: Options): Promise<MemberWithUsername[]> => {
	if (!options.supabase) {
		throw new Error('Supabase client is not defined')
	}
	const {data: data, error} = await options.supabase.from('tree').select('member').ilike('member', `%${username.toLowerCase()}%`)
	console.log(error)
	if (!data) return [];
	return data as MemberWithUsername[];
}


export const fetchMemberSide = async (parent: Address | undefined, member: Address | undefined, options: Options): Promise<"left" | "right" | null> => {
	if (!member) return null;
	if (!parent) return null;
	if (!options.supabase) {
		throw new Error('Supabase client is not defined')
	}
	const {data: result, count} = await options.supabase.rpc("find_parent", {member: member.toLowerCase(), parent: parent.toLowerCase()}, {count: 'exact'})
	if (count === 0) return null;
	if (count === 1) {
		return result[0].side === 2 ? 'right' : result[0].side === 1 ? 'left' : null
	}
	return null;
}


export async function fetchAffiliateConditions(options: Options): Promise<bigint[]> {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	const data = await multicall(options.config, {
		contracts: [
			{
				abi: AffiliateContract.abi,
				address: AFFILIATE_ADDRESS,
				functionName: 'inviteStakingCondition'
			},
			{
				abi: AffiliateContract.abi,
				address: AFFILIATE_ADDRESS,
				functionName: 'matchingStakingCondition'
			},
			{
				abi: AffiliateContract.abi,
				address: AFFILIATE_ADDRESS,
				functionName: 'matchingInviteeCondition'
			}
		]
	})
	return data.map(e => e.result as bigint)
}


export const fetchLinearMembers = async (address: Address, options: Options): Promise<TableMember[]> => {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	if (!options.supabase) {
		throw new Error('Supabase client is not defined')
	}
	if (address === ZeroAddress) {
		return []
	}
	const {data: rawData, error} = await options.supabase
		.from('table_members')
		.select('member, inviter, staking::text, betting::text, betting_volume::text, direct_count::text, binary_count::text, staking_volume::text, username, id::text, inviter_id::text, activity, category')
		.eq('inviter', address.toLowerCase())
	return (rawData || []).map((member) => {
		const activity = []
		if (['staking', 'both'].includes(member.activity)) activity.push('staking');
		if (['betting', 'both'].includes(member.activity)) activity.push('betting');
		return {
			betting: BigInt(member.betting),
			staking: BigInt(member.staking),
			staking_volume: BigInt(member.staking_volume),
			betting_volume: BigInt(member.betting_volume),
			member: member.member,
			inviter: member.inviter,
			id: BigInt(member.id),
			direct_count: BigInt(member.direct_count),
			binary_count: BigInt(member.binary_count),
			inviter_id: BigInt(member.inviter_id),
			activity: activity,
			category: member.category,
			level: getLevel(BigInt(member.id), BigInt(member.inviter_id)),
			side: getSide(BigInt(member.id), BigInt(member.inviter_id)),
			username: member.username
		} as TableMember
	})
}

export const multimint = async (members: Address[], parents: Address[], options: Options) => {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	return writeContract(options.config, {
		abi: MultimintContract.abi,
		address: import.meta.env.PUBLIC_MULTIMINT_ADDRESS as Address,
		functionName: 'multimint',
		args: [members, parents, PASS_ADDRESS]
	})
}

export const claimDirect = async (options: Options) => {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	return writeContract(options.config, {
		abi: AffiliateFundContract.abi,
		address: AFFILIATE_FUND_ADDRESS,
		functionName: 'claimDirectBonus',
		args: []
	})
}


export const claimMatching = async (address: Address, options: Options) => {
	if (!options.config) {
		throw new Error('Wagmi config is not defined')
	}
	return writeContract(options.config, {
		abi: AffiliateFundContract.abi,
		address: AFFILIATE_FUND_ADDRESS,
		functionName: 'claimMatchingBonus',
		args: [address]
	})
}



