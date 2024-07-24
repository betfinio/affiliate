import {FC} from 'react';
import cx from "clsx";
import {useAccount} from "wagmi";
import {ArrowLongLeftIcon, ArrowLongRightIcon} from "@heroicons/react/24/solid";
import {valueToNumber} from "@betfinio/hooks/dist/utils";
import {withClick} from "@/src/components/utils.tsx";
import {ZeroAddress} from "@betfinio/abi";
import {useMember} from "@/src/lib/query";
import {BetValue} from "betfinio_app/BetValue";

const VolumeInfo: FC = () => {
	const LeftCard = withClick(UnmatchedLeftVolume, MatchedLeftVolume)
	const RightCard = withClick(UnmatchedRightVolume, MatchedRightVolume)
	const {address = ZeroAddress} = useAccount()
	const {data: member} = useMember(address);
	if (!member) return null;
	const left = valueToNumber(member.volume.left + (member.bets.left / 100n))
	const right = valueToNumber(member.volume.right + (member.bets.right / 100n))
	const leftPer = left / (left + right) * 100 || 0
	const rightPer = right / (left + right) * 100 || 0
	return (
		<div className={cx('grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 ')}>
			<div className={'h-[120px] lg:h-[210px] relative'}>
				<LeftCard/>
				<div
					className={' hidden absolute w-full md:flex text-sm flex-row justify-center text-gray-400 -bottom-0 gap-1'}>
					Cumulative left volume is <BetValue value={left} withIcon/> = {leftPer.toFixed(2)}% of total volume
				</div>
			</div>
			<div className={'h-[120px] lg:h-[210px] relative'}>
				<RightCard/>
				<div
					className={'hidden absolute w-full md:flex text-sm flex-row justify-center text-gray-400 -bottom-0  gap-1'}>
					Cumulative right volume is <BetValue value={right} withIcon/> = {rightPer.toFixed(2)}% of total
					volume
				</div>
			</div>
		</div>
	);
};

const UnmatchedLeftVolume: FC = () => {
	const {address = ZeroAddress} = useAccount()
	const {data: member, isFetched: isMemberFetched} = useMember(address);
	if (!member) return null;
	const left = member.volume.left + (member.bets.left / 100n) - member.matched.left;
	const right = member.volume.right + (member.bets.right / 100n) - member.matched.right;
	return <div
		className='relative cursor-pointer border border-gray-800 py-6 lg:py-8 flex flex-col gap-2 items-center bg-primaryLighter rounded-lg'>
		<div className={'grid grid-cols-3 items-center'}>
			<ArrowLongLeftIcon
				className={'w-16 h-16 text-yellow-400 col-span-1 border-2 border-yellow-400 rounded-full p-2'}/>
			<div className={'col-span-2 text-sm lg:text-xl'}>
				<h1>Unmatched <b className={'text-yellow-400'}>Left</b> volume </h1>
				<div className={cx('text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
					<BetValue value={valueToNumber(isMemberFetched ? left : 12345n * 10n ** 18n)} withIcon/>
				</div>
				{
					left > right ? (
						<>
							<div
								className={cx('text-green-400 font-semibold mt-1 text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
								Strong leg
							</div>
							<div className={'text-xs text-[#9BA9B4] font-normal italic flex gap-1'}>Dominates for <BetValue
								value={valueToNumber(left - right)} className={'text-yellow-400 font-bold'} withIcon={true}/></div>
						</>
					) : (
						<>
							<div
								className={cx('text-red-roulette font-semibold mt-1 text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
								Weak leg
							</div>
							<div className={'text-xs text-[#9BA9B4] font-normal italic flex gap-1'}>
								Match
								<BetValue
									value={valueToNumber(right - left)} className={'text-yellow-400 font-bold'} withIcon={true}/>
								and earn
								<BetValue
									value={valueToNumber(right - left) / 100 * 8} className={'text-yellow-400 font-bold'}
									withIcon={true}/>
							</div>
						</>
					)
				}
			
			</div>
		</div>
	
	</div>
}
const UnmatchedRightVolume: FC = () => {
	const {address = ZeroAddress} = useAccount()
	const {data: member, isFetched: isMemberFetched} = useMember(address);
	if (!member) return null;
	const left = member.volume.left + (member.bets.left / 100n) - member.matched.left;
	const right = member.volume.right + (member.bets.right / 100n) - member.matched.right;
	return <div
		className='relative cursor-pointer border border-gray-800 py-6 lg:py-8 flex flex-col px-6 gap-2 items-center bg-primaryLighter rounded-lg'>
		<div className={'grid grid-cols-3 items-center gap-4'}>
			<div className={'col-span-2 text-sm lg:text-xl'}>
				<div className={'whitespace-nowrap'}>Unmatched <b className={'text-yellow-400'}>Right</b> volume</div>
				<div className={cx('text-sm lg:text-base', {'animate-pulse blur-sm': !isMemberFetched})}>
					<BetValue value={valueToNumber(isMemberFetched ? right : 12345n * 10n ** 18n)} withIcon/>
				</div>
				{
					right > left ? (
						<>
							<div
								className={cx('text-green-400 font-semibold mt-1 text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
								Strong leg
							</div>
							<div className={'text-xs text-[#9BA9B4] font-normal italic flex gap-1'}>Dominates for <BetValue
								value={valueToNumber(right - left)} className={'text-yellow-400 font-bold'} withIcon={true}/></div>
						</>
					) : (
						<>
							<div
								className={cx('text-red-roulette font-semibold mt-1 text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
								Weak leg
							</div>
							<div className={'text-xs text-[#9BA9B4] font-normal italic flex gap-1'}>
								Match
								<BetValue
									value={valueToNumber(left - right)} className={'text-yellow-400 font-bold'} withIcon={true}/>
								and earn
								<BetValue
									value={valueToNumber(left - right) / 100 * 8} className={'text-yellow-400 font-bold'}
									withIcon={true}/>
							</div>
						</>
					)
				}
			</div>
			<div className={'flex flex-row justify-end'}>
				<ArrowLongRightIcon
					className={'w-16 h-16 text-yellow-400 col-span-1 border-2 border-yellow-400 rounded-full p-2'}/>
			</div>
		</div>
	
	</div>
}
const MatchedLeftVolume: FC = () => {
	const {address = ZeroAddress} = useAccount()
	const {data: member} = useMember(address)
	if (!member) return null;
	const left = member.matched.left;
	return <div
		className='relative cursor-pointer  py-6 lg:py-12 flex flex-col px-8 gap-2 items-center bg-primaryLight rounded-lg border border-gray-800'>
		<div className={'grid grid-cols-3 items-center w-full'}>
			<ArrowLongLeftIcon
				className={'w-16 h-16 text-primary col-span-1 bg-yellow-400 border-2 border-yellow-400 rounded-full p-2'}/>
			<div className={'col-span-2 text-sm lg:text-xl'}>
				<h1>Matched <b className={'text-yellow-400'}>Left</b> volume </h1>
				<div className={'text-sm lg:text-base'}><BetValue value={valueToNumber(left)} withIcon/></div>
			</div>
		</div>
	
	
	</div>
}
const MatchedRightVolume: FC = () => {
	const {address = ZeroAddress} = useAccount()
	const {data: member} = useMember(address)
	if (!member) return null;
	const right = member.matched.right;
	return <div
		className='relative cursor-pointer   py-6 lg:py-12 px-6 flex flex-col gap-2 items-center bg-primaryLight rounded-lg border border-gray-800'>
		<div className={'grid grid-cols-3 items-center gap-4 w-full'}>
			<div className={'col-span-2 text-sm lg:text-xl'}>
				<div className={'whitespace-nowrap'}>Matched <b className={'text-yellow-400'}>Right</b> volume</div>
				<div className={'text-sm lg:text-base'}><BetValue value={valueToNumber(right)} withIcon/></div>
			</div>
			<div className={'flex flex-row justify-end'}>
				<ArrowLongRightIcon
					className={'w-16 h-16 text-primary col-span-1 bg-yellow-400 border-2 border-yellow-400 rounded-full p-2'}/>
			</div>
		</div>
	
	
	</div>
}

export default VolumeInfo