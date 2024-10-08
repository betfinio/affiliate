import { useEarningBalances, useMember } from '@/src/lib/query';
import { truncateEthAddress, valueToNumber } from '@betfinio/abi';
import CoinStack from '@betfinio/ui/dist/icons/CoinStack';
import GoldenBars from '@betfinio/ui/dist/icons/GoldenBars';
import Network from '@betfinio/ui/dist/icons/Network';
import Referer from '@betfinio/ui/dist/icons/Referer';
import { BetValue } from 'betfinio_app/BetValue';
import { Skeleton } from 'betfinio_app/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import cx from 'clsx';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

const InfoCards: FC = () => {
	const { t } = useTranslation('affiliate', { keyPrefix: 'cards' });
	const { address } = useAccount();
	const { data: member } = useMember(address);
	const { data: balance } = useEarningBalances(address);

	const children = { direct: member?.invitees || 0, total: (member?.count.left || 0) + (member?.count.right || 0) };
	const volume = (member?.volume.left || 0n) + (member?.volume.right || 0n);
	const income = (balance?.staking.total || 0n) + (balance?.bets.total || 0n) + (balance?.matching.total || 0n);
	return (
		<div className={cx('grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 ')}>
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<motion.div
						className={cx('relative py-3 border border-gray-800 h-[125px] flex flex-col justify-between gap-2 items-center bg-primaryLighter rounded-lg')}
					>
						<Referer className={'w-10 h-10 text-yellow-400'} />
						<div className={cx('text-base lg:text-lg font-semibold')}>{member ? truncateEthAddress(member.inviter) : <Skeleton className={'w-32 h-6'} />}</div>
						<h2 className={'text-xs text-gray-500'}>{t('referer')}</h2>
						<span
							className={
								'absolute right-4 top-2 border-2 text-gray-500 border-gray-500 font-semibold text-xs w-5 h-5 flex items-center justify-center rounded-full'
							}
						>
							<TooltipTrigger>?</TooltipTrigger>
						</span>
					</motion.div>
					<TooltipContent>
						<div className={'p-4 text-xs max-w-[90vw] leading-5'}>
							<div>
								<b className={'font-semibold text-yellow-400'}>{t('referrerTooltip.title')}</b> {t('referrerTooltip.content')}
							</div>
							{t('referrerTooltip.content2')}
						</div>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<motion.div className="relative border border-gray-800 py-3 flex flex-col justify-between gap-2 h-[125px] items-center bg-primaryLighter rounded-lg">
						<Network className={'w-10 h-10 text-yellow-400'} />
						<div className={cx(' text-base lg:text-lg font-semibold text-center flex flex-wrap items-center justify-center gap-1')}>
							{!member ? (
								<Skeleton className={'w-32 h-6'} />
							) : (
								<>
									<span>{t('children_total', children)}</span>
									<span className={'font-medium text-yellow-400'}>({t('children_direct', children)})</span>
								</>
							)}
						</div>
						<h2 className={'text-xs text-gray-500'}>{t('networkSize')}</h2>
						<span
							className={
								'absolute right-4 top-2 border-2 text-gray-500 border-gray-500 font-semibold text-xs w-[18px] h-[18px] flex items-center justify-center rounded-full'
							}
						>
							<TooltipTrigger>?</TooltipTrigger>
						</span>
					</motion.div>
					<TooltipContent>
						<div className={'p-4 text-xs max-w-[90vw] leading-5 '}>
							<p>{t('networkTooltip.content')}</p>
							<p>{t('networkTooltip.content2')}</p>
							<p>{t('networkTooltip.content3')}</p>
						</div>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<motion.div className="relative border border-gray-800 py-3 h-[125px] flex flex-col justify-between gap-2 items-center bg-primaryLighter rounded-lg">
						<CoinStack className={'w-10 h-10 text-yellow-400'} />
						<h1 className={cx('text-base lg:text-lg font-semibold')}>
							{member ? <BetValue value={valueToNumber(volume)} withIcon precision={2} /> : <Skeleton className={'w-16 h-6'} />}
						</h1>
						<h2 className={'text-xs text-gray-500'}>{t('networkVolume')}</h2>
						<span
							className={
								'absolute right-4 top-2 border-2 text-gray-500 border-gray-500 font-semibold text-xs w-[18px] h-[18px] flex items-center justify-center rounded-full'
							}
						>
							<TooltipTrigger>?</TooltipTrigger>
						</span>
					</motion.div>
					<TooltipContent>
						<div className={'p-4 text-xs max-w-[90vw]'}>
							<p>{t('volumeTooltip.content')}</p>
							<p>{t('volumeTooltip.content2')}</p>
							<p>{t('volumeTooltip.content3')}</p>
						</div>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<motion.div className="relative border border-gray-800 py-3 h-[125px] flex flex-col justify-between gap-2 items-center bg-primaryLighter rounded-lg">
						<GoldenBars className={'w-10 h-10 text-yellow-400'} />
						<div className={cx('text-base lg:text-lg font-semibold')}>
							{member ? <BetValue value={valueToNumber(income)} precision={2} withIcon /> : <Skeleton className={'w-16 h-6'} />}
						</div>
						<h2 className={'text-xs text-gray-500'}>{t('networkIncome')}</h2>
						<span
							className={
								'absolute right-4 top-2 border-2 text-gray-500 border-gray-500 font-semibold text-xs w-[18px] h-[18px] flex items-center justify-center rounded-full'
							}
						>
							<TooltipTrigger>?</TooltipTrigger>
						</span>
					</motion.div>
					<TooltipContent>
						<div className={'p-4 text-xs max-w-[90vw]'}>
							<p>{t('earningTooltip.content')}</p>
						</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default InfoCards;
