import {FC, useMemo} from 'react';
import {useAccount} from "wagmi";
import {ZeroAddress} from "@betfinio/hooks";
import {valueToNumber} from "@betfinio/hooks/dist/utils";
import {useEarningBalances} from "@/src/lib/query";
import {BetValue} from "betfinio_app/BetValue";
import {ResponsivePie} from "@nivo/pie"
import {PieCustomLayerProps} from "@nivo/pie/dist/types/types";

const PieChartInfo: FC = () => {
	const {address = ZeroAddress} = useAccount()
	const {data: balance} = useEarningBalances(address)
	const data = useMemo(() => {
		return [{
			color: '#292546',
			id: 'betting',
			label: "Betting",
			value: valueToNumber(balance.bets.total)
		}, {
			color: '#facc15',
			id: 'staking',
			label: "Staking",
			value: valueToNumber(balance.staking.total)
		}, {
			color: '#dd375f',
			id: 'matching',
			label: "Matching",
			value: valueToNumber(balance.matching.total)
		}].filter(e => !!e)
	}, [balance])
	return <div className={'flex w-full h-[400px] p-4 flex-col items-center justify-center'}>
		<div>Earnings overview</div>
		<ResponsivePie
			data={data}
			innerRadius={0.6}
			margin={{top: 60, right: 20, bottom: 10, left: 20}}
			padAngle={1}
			cornerRadius={5}
			tooltip={({datum}) => <div className={'bg-primaryLighter p-2 text-xs flex flex-row items-center gap-1 rounded-md'}>{datum.label}: <BetValue value={datum.value} withIcon/></div>}
			colors={{datum: 'data.color'}}
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
								itemOpacity: 50
							}
						}
					]
				}
			]}
			layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
			enableArcLabels={false}
			enableArcLinkLabels={false}
			arcLinkLabelsThickness={3}
			activeInnerRadiusOffset={2}
			activeOuterRadiusOffset={5}
		/>
	</div>
};

const CenteredMetric: React.FC<PieCustomLayerProps<any>> = ({dataWithArc, centerX, centerY}) => {
	let total = 0
	dataWithArc.forEach(datum => {
		total += datum.value
	})
	
	return (
		<foreignObject x={centerX - 50} y={centerY - 25} width={100} height={50}>
			<div className={'w-full h-full flex items-center justify-center'}>
				<BetValue value={total} withIcon/>
			</div>
		</foreignObject>
	)
}

export default PieChartInfo