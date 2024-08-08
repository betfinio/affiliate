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
	return (
		<div className={cx('grid grid-cols-2 gap-4 ')}>
			<div className={'h-[120px] lg:h-[160px] relative'}>
				<LeftCard/>
			</div>
			<div className={'h-[120px] lg:h-[160px] relative'}>
				<RightCard/>
			</div>
			<div className={'text-center col-span-2 text-lg mb-6  flex flex-row items-center justify-center gap-1'}>
				Bring
				<BetValue
					value={Math.abs(right - left)} className={'text-yellow-400 font-semibold'} withIcon={true}/>
				to <span className={'text-red-roulette'}>weak leg</span>
				& earn
				<BetValue
					value={Math.abs(right - left) / 100 * 8} className={'text-yellow-400 font-semibold'}
					withIcon={true}/>
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
	const leftPer = valueToNumber(left / (left + right)) * 100 || 0
	return <div
		className='relative cursor-pointer border border-gray-800 px-6 lg:px-0 py-6 lg:py-8 flex flex-col gap-2 items-center bg-primaryLighter rounded-lg'>
		<div className={'grid grid-cols-3 items-center'}>
			<ArrowLongLeftIcon
				className={'hidden lg:block w-16 h-16 text-yellow-400 col-span-1 border-2 border-yellow-400 rounded-full p-2'}/>
			<div className={'col-span-2 text-sm lg:text-xl whitespace-nowrap'}>
				<div>Unmatched <b className={'text-yellow-400'}>Left</b> volume</div>
				<div className={cx('text-xl font-semibold', {'blur-sm animate-pulse': !isMemberFetched})}>
					<BetValue value={valueToNumber(isMemberFetched ? left : 12345n * 10n ** 18n)} withIcon/>
				</div>
				{
					left > right ? (
						<div
							className={cx('text-green-400 font-semibold mt-1 text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
							Strong leg
						</div>
					) : (
						<div
							className={cx('text-red-roulette font-semibold mt-1 text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
							Weak leg
						</div>
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
	const rightPer = valueToNumber(right / (left + right)) * 100 || 0
	console.log(right, left)
	return <div
		className='relative cursor-pointer border border-gray-800 py-6 lg:py-8 flex flex-col px-6 gap-2 items-center bg-primaryLighter rounded-lg'>
		<div className={'grid grid-cols-3 items-center gap-4'}>
			<div className={'col-span-2 text-sm lg:text-xl'}>
				<div className={'whitespace-nowrap'}>Unmatched <b className={'text-yellow-400'}>Right</b> volume</div>
				<div className={cx('text-xl font-semibold', {'animate-pulse blur-sm': !isMemberFetched})}>
					<BetValue value={valueToNumber(isMemberFetched ? right : 12345n * 10n ** 18n)} withIcon/>
				</div>
				{
					right > left ? (
						<div
							className={cx('text-green-400 font-semibold mt-1 text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
							Strong leg
						</div>
					) : (
						<div
							className={cx('text-red-roulette font-semibold mt-1 text-sm lg:text-base', {'blur-sm animate-pulse': !isMemberFetched})}>
							Weak leg
						</div>
					)
				}
			</div>
			<div className={'hidden lg:flex flex-row justify-end'}>
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
	const left = member.volume.left;
	const leftPer = (valueToNumber(member.volume.left) / valueToNumber(member.volume.left + member.volume.right)) * 100 || 0
	return <div
		className='relative cursor-pointer  py-6 lg:py-10 flex flex-col px-8 gap-2 items-center bg-primaryLight rounded-lg border border-gray-800'>
		<div className={'grid grid-cols-3 items-center w-full'}>
			<ArrowLongLeftIcon
				className={'w-16 h-16 text-primary col-span-1 bg-yellow-400 border-2 border-yellow-400 rounded-full p-2'}/>
			<div className={'col-span-2 text-sm lg:text-xl'}>
				<div>Total <b className={'text-yellow-400'}>Left</b> volume</div>
				<div className={'text-sm lg:text-base'}><BetValue value={valueToNumber(left)} withIcon/></div>
				<div className={'hidden w-full lg:flex text-sm flex-row justify-start text-gray-400 gap-1'}>
					Represents {leftPer.toFixed(2)}% of total volume
				</div>
			</div>
		</div>
	
	</div>
}
const MatchedRightVolume: FC = () => {
	const {address = ZeroAddress} = useAccount()
	const {data: member} = useMember(address)
	if (!member) return null;
	const right = member.volume.right;
	const rightPer = (valueToNumber(member.volume.right) / valueToNumber(member.volume.left + member.volume.right)) * 100 || 0
	return <div
		className='relative cursor-pointer   py-6 lg:py-10 px-6 flex flex-col gap-2 items-center bg-primaryLight rounded-lg border border-gray-800'>
		<div className={'grid grid-cols-3 items-center gap-4 w-full'}>
			<div className={'col-span-2 text-sm lg:text-xl'}>
				<div className={'whitespace-nowrap'}>Total <b className={'text-yellow-400'}>Right</b> volume</div>
				<div className={'text-sm lg:text-base'}><BetValue value={valueToNumber(right)} withIcon/></div>
				<div className={'hidden w-full lg:flex text-sm flex-row justify-start text-gray-400 gap-1 whitespace-nowrap'}>
					Represents {rightPer.toFixed(2)}% of total volume
				</div>
			</div>
			<div className={'flex flex-row justify-end'}>
				<ArrowLongRightIcon className={'w-16 h-16 text-primary col-span-1 bg-yellow-400 border-2 border-yellow-400 rounded-full p-2'}/>
			</div>
		</div>
	
	
	</div>
}

export default VolumeInfo