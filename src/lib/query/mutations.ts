import logger from '@/src/config/logger.ts';
import { claimDirect, claimMatching, multimint } from '@/src/lib/api';
import { ZeroAddress } from '@betfinio/abi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type WriteContractReturnType, waitForTransactionReceipt } from '@wagmi/core';
import { getTransactionLink } from 'betfinio_app/helpers';
import { useToast } from 'betfinio_app/use-toast';
import { useTranslation } from 'react-i18next';
import type { Address, WriteContractErrorType } from 'viem';
import { useAccount, useConfig } from 'wagmi';

export const useClaimMatching = () => {
	const config = useConfig();
	const queryClient = useQueryClient();
	const { address = ZeroAddress } = useAccount();
	const { t: tShared } = useTranslation('shared', { keyPrefix: 'errors' });
	const { t } = useTranslation('affiliate', { keyPrefix: 'toast.claimMatching' });
	const { toast } = useToast();
	return useMutation<WriteContractReturnType, WriteContractErrorType>({
		mutationKey: ['affiliate', 'claim', 'matching'],
		mutationFn: () => claimMatching(address, { config }),
		onError: (e) => {
			// @ts-ignore
			if (e?.cause?.reason) {
				toast({
					title: t('failed'),
					// @ts-ignore
					description: tShared(e.cause.reason),
					variant: 'destructive',
				});
			} else {
				toast({
					title: tShared('unknown'),
					variant: 'destructive',
				});
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const { id, update } = toast({
					title: t('pending.title'),
					description: t('pending.description'),
					variant: 'loading',
					duration: 60 * 1000,
				});
				await waitForTransactionReceipt(config, {
					hash: data,
				});
				update({
					title: t('success.title'),
					description: t('success.description'),
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

export const useClaimDirect = () => {
	const config = useConfig();
	const queryClient = useQueryClient();
	const { t: tShared } = useTranslation('shared', { keyPrefix: 'errors' });
	const { t } = useTranslation('affiliate', { keyPrefix: 'toast.claimMatching' });
	const { toast } = useToast();
	return useMutation<WriteContractReturnType, WriteContractErrorType>({
		mutationKey: ['affiliate', 'claim', 'direct'],
		mutationFn: () => claimDirect({ config }),
		onError: (e) => {
			// @ts-ignore
			if (e?.cause?.reason) {
				toast({
					title: t('failed'),
					// @ts-ignore
					description: tShared(e.cause.reason),
					variant: 'destructive',
				});
			} else {
				toast({
					title: tShared('unknown'),
					variant: 'destructive',
				});
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const { id, update } = toast({
					title: t('pending.title'),
					description: t('pending.description'),
					variant: 'loading',
					duration: 60 * 1000,
				});
				await waitForTransactionReceipt(config, {
					hash: data,
				});
				update({
					title: t('success.title'),
					description: t('success.description'),
					variant: 'default',
					duration: 5 * 1000,
					id: id,
					action: getTransactionLink(data),
				});
				await queryClient.invalidateQueries({ queryKey: ['affiliate', 'claims', 'direct'] });
			}
		},
	});
};

interface MintParams {
	members: Address[];
	parents: Address[];
}

export const useMultimint = () => {
	const config = useConfig();
	const { t: tShared } = useTranslation('shared', { keyPrefix: 'errors' });
	const { t } = useTranslation('affiliate', { keyPrefix: 'toast.multimint' });
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
					title: t('failed'),
					// @ts-ignore
					description: tShared(e.cause.reason),
					variant: 'destructive',
				});
			} else {
				toast({
					title: tShared('unknown'),
					variant: 'destructive',
				});
			}
		},
		onSuccess: async (data) => {
			if (data !== undefined) {
				const { id, update } = toast({
					title: t('pending.title'),
					description: t('pending.description'),
					variant: 'loading',
					duration: 60 * 1000,
				});
				await waitForTransactionReceipt(config, {
					hash: data,
				});
				update({
					title: t('success.title'),
					description: t('success.description'),
					variant: 'default',
					duration: 5 * 1000,
					id: id,
					action: getTransactionLink(data),
				});
			}
		},
	});
};
