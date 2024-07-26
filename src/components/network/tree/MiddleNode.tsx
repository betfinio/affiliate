import cx from "clsx";
import {truncateEthAddress, valueToNumber} from "@betfinio/hooks/dist/utils";
import {CustomNodeElementProps} from "react-d3-tree";
import {useAccount} from "wagmi";
import {ArrowLongLeftIcon, ArrowLongRightIcon, Square3Stack3DIcon, UsersIcon} from "@heroicons/react/24/solid";
import {useMemo} from "react";
import {Blackjack} from "@betfinio/ui/dist/icons";
import * as Tooltip from "@radix-ui/react-tooltip"
import {Address} from "viem";
import {useTreeMember} from "@/src/lib/query";
import {useCustomUsername, useUsername} from "betfinio_app/lib/query/username";
import {ZeroAddress} from "@betfinio/abi";
import {getSide} from "@/src/lib/utils.ts";
import {useQueryClient} from "@tanstack/react-query";
import {UserPlus} from "lucide-react";
import {BetValue} from "betfinio_app/BetValue";

function MiddleNode({data, node, horizontal = false}: {
	data: Address,
	node: CustomNodeElementProps,
	horizontal?: boolean
}) {
	const query = useTreeMember(data);
	const {data: username} = useUsername(data);
	const {address = ZeroAddress} = useAccount();
	const {data: customUsername} = useCustomUsername(address, data as Address);
	const queryClient = useQueryClient();
	const {data: me} = useTreeMember(address);
	const icons = useMemo(() => {
		if (!query.data) return []
		const badges = []
		const side = getSide(query.data.index || 0n, me?.index || 0n)
		badges.push(side ? 'right' : 'left')
		if (query.data.bets > 0n) badges.push('betting')
		if (query.data.volume > 0n) badges.push('staking')
		return badges
	}, [query.data])
	
	
	const handleInvite = (e: any, parent: string) => {
		e.stopPropagation();
		queryClient.setQueryData(['affiliate', 'inviteMember'], parent);
	}
	
	if (query.isFetching || query.isRefetching || !query.data) return <foreignObject width={'270px'} height={'90px'} x={-135} y={-45}>
		<div className={'w-full h-full border border-purple-box bg-purple-box rounded-md flex justify-center items-center'}>
			Loading...
		</div>
	</foreignObject>;
	
	if (data === ZeroAddress) return <foreignObject width={'300px'} height={'110px'} x={-135} y={-45}>
		<div onClick={(e) => handleInvite(e, node.hierarchyPointNode.parent?.data.name ?? ZeroAddress)}
		     className={cx('border-2 border-dashed border-opacity-45  border-purple-box bg-primaryLight p-4 w-[270px] h-[90px] rounded-xl flex flex-col items-center justify-start gap-1', {})}>
			<UserPlus className={'h-full text-gray-400'} size={40}/>
		</div>
	</foreignObject>
	
	
	const hasChildren = horizontal ? query.data.count > 0 : query.data.left !== ZeroAddress || query.data.right !== ZeroAddress;
	const handleExpand = (e: any) => {
		e.stopPropagation();
		node.toggleNode();
	}
	
	const handleClick = (e: any) => {
		e.stopPropagation();
		queryClient.setQueryData(['affiliate', 'memberProfile'], query.data.member);
	}
	
	const renderIcon = (icon: string, index: number) => {
		return <div key={index}
		            className={cx('rounded-full bg-purple-box text-primary aspect-square w-[25px] h-[25px] flex items-center justify-center',
			            {
				            '!bg-yellow-400 border-yellow-400 text-black': query.data.isMatching,
				            '!bg-red-roulette border-red-roulette ': query.data.isInviting,
				            '!bg-green-500 !border-green-500': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
			            }
		            )}>
			{icon === 'betting' && renderBetting()}
			{icon === 'staking' && renderStaking()}
			{icon === 'left' && renderLeft()}
			{icon === 'right' && renderRight()}
		</div>
	}
	
	const renderBetting = () => {
		return <Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div className={'w-full flex justify-center'}>
						<Blackjack className={'w-1/2 stroke-0'}/>
					</div>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade text-white bg-black data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]">
						<Tooltip.Arrow/>
						<p className={'font-semibold'}>User bets volume:</p>
						<p className={'text-yellow-400'}>
							{valueToNumber(query.data.bets).toLocaleString() + " BET"}
						</p>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
		
		
	}
	const renderLeft = () => {
		return <ArrowLongLeftIcon className={'w-2/3'}/>
	}
	const renderRight = () => {
		return <ArrowLongRightIcon className={'w-2/3'}/>
	}
	const renderStaking = () => {
		return <Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div className={'w-full flex justify-center'}>
						<Square3Stack3DIcon className={'w-2/3 stroke-0'}/>
					</div>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] bg-black text-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]">
						<Tooltip.Arrow/>
						<p className={'font-semibold'}>User staking volume:</p>
						<p className={'text-yellow-400'}>
							{valueToNumber(query.data.volume).toLocaleString() + " BET"}
						</p>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	}
	
	const volume = query.data.volumeLeft + query.data.volumeRight + query.data.betsLeft / 100n + query.data.betsRight / 100n
	return <foreignObject width={300} height={110} x={-135} y={-45} className={''}>
		<div className={cx(horizontal && 'w-full h-full flex flex-row flex-nowrap')}>
			
			<div className={cx('border-2  border-purple-box bg-primaryLight p-4 w-[270px] h-[90px] rounded-xl flex flex-col items-center justify-start gap-1', {
				'border-red-roulette': query.data.isInviting,
				'!border-yellow-400': query.data.isMatching,
				'!border-green-500': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
				
			})} onClick={handleClick}>
				<div className={'w-full flex flex-row justify-between items-center'}>
					{customUsername || username || truncateEthAddress(query.data.member || ZeroAddress)}
					{address.toLowerCase() === query.data.inviter.toLowerCase() ?
						<div
							className={cx('border w-6 h-6 flex items-center justify-center rounded-full border-purple-box text-purple-box', {
								'border-red-roulette text-red-roulette': query.data.isInviting,
								'!border-yellow-400 !text-yellow-400': query.data.isMatching,
								'!bg-green-500 !border-green-500 !text-white': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
							})}>{horizontal ? query.data.count : (
							<span className={'text-sm'}>D</span>
						)}</div> : address.toLowerCase() === data.toLowerCase() ?
							null :
							<div
								className={cx('border w-6 h-6 flex items-center justify-center rounded-full border-purple-box text-purple-box', {
									'border-red-roulette text-red-roulette': query.data.isInviting,
									'!border-yellow-400 !text-yellow-400': query.data.isMatching,
									'!bg-green-600 !border-green-600': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
									
								})}>{horizontal ? query.data.count : (
								<span className={'text-sm'}>B</span>
							)}</div>}
				</div>
				<div className={'w-full flex flex-row justify-between items-end'}>
				<span
					className={'text-purple-box underline text-sm'}>{truncateEthAddress(query.data.member || ZeroAddress)}</span>
					<div className={'flex gap-1 font-thin'}>
						<BetValue className={'font-semibold'} prefix={'Total volume: '} withIcon
						          value={valueToNumber(volume)}/> /
						<div className={'flex flex-row items-center gap-[1px]'}>
							<BetValue prefix={"Binary network size: "} postfix={""}
							          value={valueToNumber(query.data.countLeft + query.data.countRight, 0, 0)}/>
							<UsersIcon className={'w-4 h-4 text-yellow-400'}/>
						</div>
					</div>
				</div>
				<div className={' -bottom-[12.5px] left-[15px] h-[25px] grid grid-cols-3 w-full gap-1'}>
					<div className={'col-span-1 flex flex-row items-center gap-1'}>
						{icons.map(renderIcon)}
					</div>
					<div className={cx('flex justify-center')}>
						{hasChildren ? <div onClick={handleExpand}
						                    className={cx('w-6 h-6 rounded-full border-2 border-purple-box bg-purple-box flex flex-row items-center justify-center text-xl', {
							                    '!bg-yellow-400 border-yellow-400 text-black': query.data.isMatching,
							                    '!bg-red-roulette border-red-roulette': query.data.isInviting,
							                    '!bg-green-500 !border-green-500 !text-white': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
							                    'hidden': horizontal,
						                    })}>+
						</div> : <div onClick={(e) => handleInvite(e, data)}
						              className={cx('w-6 h-6 rounded-full border-2 border-purple-box bg-purple-box flex flex-row items-center justify-center text-xl', {
							              '!bg-yellow-400 border-yellow-400 text-black': query.data.isMatching,
							              '!bg-red-roulette border-red-roulette': query.data.isInviting,
							              '!bg-green-500 !border-green-500 !text-white': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
							              'hidden': horizontal,
						              })}>
							<UserPlus className={'h-full'} size={13} onClick={(e) => handleInvite(e, data)}/>
						</div>}
					</div>
				</div>
			</div>
			<div className={cx('flex justify-center h-[90px] items-center -ml-3', !horizontal && 'hidden')}>
				{hasChildren && <div onClick={handleExpand}
				                     className={cx('w-6 h-6 rounded-full border-2 border-purple-box bg-purple-box flex flex-row items-center justify-center text-xl', {
					                     '!bg-yellow-400 border-yellow-400 text-black': query.data.isMatching,
					                     '!bg-red-roulette border-red-roulette': query.data.isInviting,
					                     '!bg-green-500 !border-green-500 !text-white': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
					                     '': horizontal,
				                     })}>+
				</div>}
			</div>
		</div>
	
	</foreignObject>
}


export default MiddleNode;