import { useEarningBalances } from '@/src/lib/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { type MayHaveLabel, ResponsivePie } from '@nivo/pie';
import type { PieCustomLayerProps } from '@nivo/pie/dist/types/types';
import { BetValue } from 'betfinio_app/BetValue';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

const PieChartInfo: FC = () => {
	const { t } = useTranslation('affiliate', { keyPrefix: 'earnings' });
	const { address = ZeroAddress } = useAccount();
	const { data: balance } = useEarningBalances(address);
	const zero = balance.staking.total + balance.bets.total + balance.matching.total === 0n;

	const data = useMemo(() => {
		return [
			{
				color: '#dd375f',
				id: 'betting',
				label: t('betting'),
				value: zero ? 30 : valueToNumber(balance.bets.total),
			},
			{
				color: '#4ade80',
				id: 'staking',
				label: t('staking'),
				value: zero ? 30 : valueToNumber(balance.staking.total),
			},
			{
				color: '#facc15',
				id: 'matching',
				label: t('matching'),
				value: zero ? 30 : valueToNumber(balance.matching.total),
			},
		].filter((e) => !!e);
	}, [balance]);
	return (
		<div className={'flex w-full h-[430px] p-4 flex-col items-center justify-center'}>
			<div>{t('overview')}</div>
			<ResponsivePie
				data={data}
				innerRadius={0.6}
				margin={{ top: 60, right: 20, bottom: 10, left: 20 }}
				padAngle={1}
				cornerRadius={5}
				tooltip={({ datum }) => (
					<div className={'bg-primaryLighter p-2 text-xs flex flex-row items-center gap-1 rounded-md'}>
						{datum.label}: <BetValue value={zero ? 0 : datum.value} withIcon />
					</div>
				)}
				colors={{ datum: 'data.color' }}
				legends={[
					{
						anchor: 'top',
						direction: 'row',
						justify: false,
						translateX: 0,
						translateY: -40,
						itemsSpacing: 0,
						toggleSerie: true,
						itemWidth: 100,
						itemHeight: 18,
						itemTextColor: '#999',
						itemDirection: 'left-to-right',
						itemOpacity: 1,
						symbolSize: 18,
						symbolShape: 'circle',
						effects: [
							{
								on: 'hover',
								style: {
									itemOpacity: 50,
								},
							},
						],
					},
				]}
				layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', !zero ? CenteredMetric : ZeroMetrics]}
				enableArcLabels={false}
				enableArcLinkLabels={false}
				arcLinkLabelsThickness={3}
				activeInnerRadiusOffset={2}
				activeOuterRadiusOffset={5}
			/>
		</div>
	);
};

const CenteredMetric: FC<PieCustomLayerProps<MayHaveLabel>> = ({ dataWithArc, centerX, centerY }) => {
	let total = 0;
	for (const datum of dataWithArc) {
		total += datum.value;
	}
	return (
		<foreignObject x={centerX - 60} y={centerY - 25} width={120} height={50}>
			<div className={'w-full h-full flex items-center justify-center text-2xl'}>
				<BetValue value={total} withIcon iconClassName={'w-5 h-5'} />
			</div>
		</foreignObject>
	);
};

const ZeroMetrics: FC<PieCustomLayerProps<MayHaveLabel>> = ({ centerX, centerY }) => {
	return (
		<foreignObject x={centerX - 50} y={centerY - 25} width={100} height={50}>
			<div className={'w-full h-full flex items-center justify-center text-2xl'}>
				<BetValue value={0} withIcon iconClassName={'w-5 h-5'} />
			</div>
		</foreignObject>
	);
};

export default PieChartInfo;
