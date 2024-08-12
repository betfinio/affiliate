import { useClaimDirect, useClaimMatching, useDailyLimit, useEarningBalances, usePendingMatchingBonus } from '@/src/lib/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { Blackjack, DepthAffiliate, DirectAffiliate, MoneyUp } from '@betfinio/ui/dist/icons';
import { BetValue } from 'betfinio_app/BetValue';
import { Button } from 'betfinio_app/button';
import { getStakingUrl } from 'betfinio_app/lib';
import { Skeleton } from 'betfinio_app/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import cx from 'clsx';
import { motion } from 'framer-motion';
import { Layers3, Loader } from 'lucide-react';
import { DateTime } from 'luxon';
import millify from 'millify';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

const EarningOverview: FC = () => {
	const { t } = useTranslation('', { keyPrefix: 'affiliate.earnings' });
	const { address = ZeroAddress } = useAccount();
	const { data: limit = 0n } = useDailyLimit(address);
	const { data: pending = 0n } = usePendingMatchingBonus(address);
	const { data: balance } = useEarningBalances(address);
	const { mutate: claimDirect, isPending: isPendingClaimDirect } = useClaimDirect();
	const { mutate: claimMatching, isPending: isPendingClaimMatching } = useClaimMatching();

	const time = useMemo(() => {
		const now = DateTime.now().toUTC();

		const tomorrow = now.plus({ days: now.hour >= 0 ? 1 : 0 }).set({
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
		});
		const diff = tomorrow.diff(now, ['hours', 'minutes']);
		return diff.toFormat("hh'h':mm'm'");
	}, []);

	const handleClaimDirect = () => {
		claimDirect();
	};
	const handleClaimMatching = () => {
		claimMatching();
	};

	return (
		<div className={'flex flex-col gap-2 md:gap-3 lg:gap-4'}>
			<div className={'rounded-lg bg-primaryLighter border border-gray-800 flex flex-col gap-6'}>
				<div className={'flex flex-col gap-6 my-3'}>
					<h1 className={'hidden lg:block text-left px-3 md:px-7 text-xl font-semibold'}>{t('title')}</h1>
					<table className={'w-full text-sm border-separate border-spacing-y-[2px] px-3 md:px-7'}>
						<thead>
							<tr className={'text-gray-500 text-left font-medium'}>
								<th className={'pb-3 font-medium'}>{t('table.source')}</th>
								<th className={'pb-3 text-right font-medium '}>
									<div className={'flex flex-row items-center justify-end gap-1'}>
										<DirectAffiliate className={'w-4 h-4'} />
										Direct <span className={'hidden md:block'}>bonus</span>
									</div>
								</th>
								<th className={'pb-3 text-right font-medium'}>
									<div className={'flex flex-row items-center justify-end gap-1'}>
										<DepthAffiliate className={'w-4 h-4'} />
										Matching <span className={'hidden md:block'}>bonus</span>
									</div>
								</th>
							</tr>
						</thead>
						<tbody className={'font-semibold'}>
							<tr>
								<td className={'text-left  py-2'}>
									<div className={'flex flex-row items-center gap-1'}>
										<Layers3 className={'w-4 h-4 text-yellow-400'} />
										{t('table.staking')}
									</div>
								</td>
								<td className={cx('text-right py-2', { 'animate-pulse blur-sm': !balance })}>
									<div className={'flex justify-end'}>
										<BetValue value={valueToNumber(!balance ? 12345n * 10n ** 18n : balance.staking.total)} withIcon precision={2} place={'right'} />
									</div>
								</td>
								<td rowSpan={2} className={cx('text-right py-2', { 'animate-pulse blur-sm': !balance })}>
									<div className={'flex justify-end'}>
										<BetValue value={valueToNumber(!balance ? 12345n * 10n ** 18n : balance.matching.total)} withIcon precision={2} place={'right'} />
									</div>
								</td>
							</tr>
							<tr>
								<td className={'text-left  py-2'}>
									<div className={'flex flex-row items-center gap-1'}>
										<Blackjack color={'white'} className={'w-4 h-4 text-yellow-400'} />
										{t('table.bets')}
									</div>
								</td>
								<td className={cx('text-right py-2 flex justify-end', { 'animate-pulse blur-sm': !balance })}>
									<BetValue value={valueToNumber(!balance ? 12345n * 10n ** 18n : balance.bets.total)} withIcon precision={2} place={'right'} />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div
				style={{ backgroundImage: 'radial-gradient(circle, #201C40, rgba(115, 102, 255, 0.5) 0%, #201C40 50%)' }}
				className={'p-3 md:px-7 md:py-6 flex items-center gap-5 justify-between rounded-lg'}
			>
				<div>
					<h1 className={'text-sm md:text-xl text-gray-300 flex gap-1 items-center'}>
						<MoneyUp className={'w-5 h-5'} />
						{t('claimDirect')}:
						{!balance ? (
							<Skeleton className={'w-16 h-6'} />
						) : (
							<BetValue className={'text-white font-semibold'} value={valueToNumber(balance.bets.claimable + balance.staking.claimable)} withIcon />
						)}
					</h1>
					<h3 className={'text-gray-500 text-xs mt-2'}>
						{t('claimed', { claimed: millify(valueToNumber(!balance ? 0n : balance.bets.claimed + balance.staking.claimed)) })}
					</h3>
				</div>
				<Button
					size={'lg'}
					className={
						'bg-green-600 self-end text-lg text-white min-w-[120px] hover:bg-green-600/50 font-semibold disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500'
					}
					onClick={handleClaimDirect}
					disabled={(!balance ? 0n : balance.bets.claimable + balance.staking.claimable) === 0n}
				>
					{isPendingClaimDirect ? <Loader className={'w-4 h-4 animate-spin'} /> : t('claim')}
				</Button>
			</div>
			<div
				style={{ backgroundImage: 'radial-gradient(circle, #201C40, rgba(115, 102, 255, 0.5) 0%, #201C40 50%)' }}
				className={'rounded-lg p-3 md:px-7 md:py-6 flex flex-row items-center justify-between'}
			>
				<div className={' flex flex-col gap-1 md:gap-5 justify-between '}>
					<div>
						<h1 className={'text-sm md:text-xl text-gray-300  flex flex-row items-center gap-1'}>
							<DepthAffiliate className={'w-6 h-6'} />
							{t('claimMatching')}:
							<BetValue className={'text-white font-semibold'} value={valueToNumber(!balance ? 0n : balance.matching.claimable)} withIcon />
						</h1>
						<div className={'text-gray-500 text-xs mt-1 flex items-start gap-1'}>
							{t('limit', { limit: millify(valueToNumber(limit), { precision: 3 }) })}
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger>
										<span
											className={
												'border text-yellow-500 border-yellow-500 font-semibold text-[10px] w-[14px] h-[14px] flex items-center justify-center rounded-full'
											}
										>
											?
										</span>
									</TooltipTrigger>
									<TooltipContent className={cx('border-2 rounded-md border-[#FFC800] bg-primary text-white max-w-screen')}>
										<div className={'px-8 py-5 text-xs max-w-[90vw] leading-5'}>
											<span className={'font-semibold text-yellow-400'}>10%</span> of your
											<a className={'font-semibold underline text-yellow-400'} href={getStakingUrl()}>
												staking
											</a>{' '}
											volume or
											<span className={'font-semibold text-yellow-400'}>12000$</span> per day
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
					<div className={'text-xs'}>
						<div className={'flex'}>
							<div className={'rounded-lg p-2 bg-yellow-400 bg-opacity-15 flex  gap-3 items-center mt-2'}>
								<div className={'flex flex-row gap-1 items-center'}>
									+<BetValue value={valueToNumber(pending)} className={'font-semibold'} withIcon iconClassName={'w-[12px] h-[12px]'} /> in
									<span className={'font-semibold'}>{time}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Button
					onClick={handleClaimMatching}
					size={'lg'}
					className={
						'bg-green-600 text-lg text-white h-[60px] w-[120px] hover:bg-green-600/50 flex flex-col items-center font-semibold  disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500'
					}
					disabled={!balance || balance.matching.claimable === 0n || balance.matching.claimableDaily === 0n}
				>
					{isPendingClaimMatching ? (
						<Loader className={'w-4 h-4 animate-spin'} />
					) : (
						<>
							{t('claim')}{' '}
							{!balance ? (
								<Skeleton className="w-16 h-6" />
							) : (
								<BetValue className={'text-sm font-semibold'} value={valueToNumber(balance.matching.claimableDaily)} withIcon />
							)}
						</>
					)}
				</Button>
			</div>
		</div>
	);
};

export default EarningOverview;
