import {FC, useState} from 'react';
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import {Doughnut} from "react-chartjs-2";
import {useAccount} from "wagmi";
import {ZeroAddress} from "@betfinio/hooks";
import {valueToNumber} from "@betfinio/hooks/dist/utils";
import {motion} from 'framer-motion';
import cx from "clsx";
import {useEarningBalances} from "@/src/lib/query";
import {BetValue} from "betfinio_app/BetValue";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartInfo: FC = () => {
	const {address = ZeroAddress} = useAccount()
	const {data} = useEarningBalances(address)
	
	const [enabled, setEnabled] = useState(['staking', 'betting', 'matching'])
	const parts = []
	const colors = []
	if (enabled.includes('staking')) {
		parts.push(data.staking.total)
		colors.push('#AB3152')
	}
	if (enabled.includes('betting')) {
		parts.push(data.bets.total)
		colors.push('#6A6A9F')
	}
	if (enabled.includes('matching')) {
		parts.push(data.matching.total)
		colors.push('#facc15')
	}
	
	const toggleStaking = () => {
		if (enabled.includes('staking')) {
			setEnabled(enabled.filter(e => e != 'staking'))
		} else {
			setEnabled([...enabled, 'staking'])
		}
	}
	const toggleBetting = () => {
		if (enabled.includes('betting')) {
			setEnabled(enabled.filter(e => e != 'betting'))
		} else {
			setEnabled([...enabled, 'betting'])
		}
	}
	const toggleMatching = () => {
		if (enabled.includes('matching')) {
			setEnabled(enabled.filter(e => e != 'matching'))
		} else {
			setEnabled([...enabled, 'matching'])
		}
	}
	if (address === ZeroAddress) {
		return <div className={'h-full w-full'}>
			<Doughnut data={{
				labels: ['Direct Staking', 'Direct Betting', 'Matching Bonus'], datasets: [
					{
						circular: true,
						borderAlign: 'center',
						data: [33, 33, 33],
						backgroundColor: ['#AB315250', '#201C3F50', '#facc1550'],
						borderColor: ['#AB315290', '#201C3F90', '#facc1590'],
					},
				]
			}} options={{
				responsive: true,
				plugins: {
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'Earning Overview',
					}
				}
			}}/>
		</div>
	}
	
	return <div className={'h-full w-full relative'}>
		<div>
			<div className={'text-center font-medium text-lg'}>Earnings overview</div>
			<div className={'flex flex-row my-2 gap-2'}>
				<motion.div whileHover={{scale: 1.03}} onClick={toggleStaking} whileTap={{scale: 0.97}}
				            className={cx('flex cursor-pointer flex-row items-center gap-1 text-sm', !enabled.includes('staking') && 'opacity-20')}>
					<div className={'rounded-full w-5 h-5 bg-red-roulette'}></div>
					Direct Staking
				</motion.div>
				<motion.div whileHover={{scale: 1.03}} onClick={toggleBetting} whileTap={{scale: 0.97}}
				            className={cx('flex cursor-pointer flex-row items-center gap-1 text-sm', !enabled.includes('betting') && 'opacity-20')}>
					<div className={'rounded-full w-5 h-5 bg-[#6A6A9F]'}></div>
					Direct Betting
				</motion.div>
				<motion.div whileHover={{scale: 1.03}} onClick={toggleMatching} whileTap={{scale: 0.97}}
				            className={cx('flex cursor-pointer flex-row items-center gap-1 text-sm', !enabled.includes('matching') && 'opacity-20')}>
					<div className={'rounded-full w-5 h-5 bg-yellow-400'}></div>
					Matching Bonus
				</motion.div>
			</div>
		</div>
		<div className={'absolute left-1/2 top-1/2  -translate-x-1/2 text-xl font-semibold'}>
			<BetValue value={valueToNumber(parts.reduce((a, b) => a + b, 0n))} withIcon/>
		</div>
		<Doughnut className={'m-5 p-4'} data={{
			labels: ['Direct Staking', 'Direct Betting', 'Matching Bonus'], datasets: [
				{
					circular: true,
					borderAlign: 'center',
					data: parts.map((e) => valueToNumber(e)),
					backgroundColor: colors,
					borderColor: colors,
				},
			]
		}} options={{
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
				}
			}
		}}/>
	</div>
};

export default PieChartInfo