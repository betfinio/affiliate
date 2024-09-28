import { GetDirectClaimsDocument, type GetDirectClaimsQuery, GetMatchingClaimsDocument, type GetMatchingClaimsQuery, execute } from '@/.graphclient';
import logger from '@/src/config/logger';
import type { ExecutionResult } from 'graphql/execution';
import type { Address } from 'viem';
import type { Claim } from '../types';

export const getDirectClaims = async (address: Address): Promise<Claim[]> => {
	logger.start('fetching direct claims', address);
	const result: ExecutionResult<GetDirectClaimsQuery> = await execute(GetDirectClaimsDocument, { address });
	logger.success('fetched direct claims', result.data?.directBonusClaims.length);
	if (result.data) {
		return result.data.directBonusClaims.map((claim) => ({
			member: address,
			amount: BigInt(claim.amount),
			transactionHash: claim.transactionHash as Address,
			timestamp: Number(claim.blockTimestamp),
		}));
	}
	return [];
};

export const getMatchingClaims = async (address: Address): Promise<Claim[]> => {
	logger.start('fetching matching claims', address);
	const result: ExecutionResult<GetMatchingClaimsQuery> = await execute(GetMatchingClaimsDocument, { address });
	logger.success('fetched matching claims', result.data?.matchingBonusClaims.length);
	if (result.data) {
		return result.data.matchingBonusClaims.map((claim) => ({
			member: address,
			amount: BigInt(claim.amount),
			transactionHash: claim.transactionHash as Address,
			timestamp: Number(claim.blockTimestamp),
		}));
	}
	return [];
};
