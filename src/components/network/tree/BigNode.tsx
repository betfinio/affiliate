import { useTreeMember } from '@/src/lib/query';
import { ZeroAddress } from '@betfinio/abi';
import { truncateEthAddress, valueToNumber } from '@betfinio/hooks/dist/utils';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { BetValue } from 'betfinio_app/BetValue';
import { useUsername } from 'betfinio_app/lib/query/username';
import cx from 'clsx';
import { UserPlus } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { CustomNodeElementProps } from 'react-d3-tree';
import type { Address } from 'viem';

function BigNode({ data, node, horizontal = false }: { data: Address; node: CustomNodeElementProps; horizontal?: boolean }) {
	const { data: username } = useUsername(data);
	const query = useTreeMember(data);
	const queryClient = useQueryClient();
	if (query.isFetching || query.isRefetching || !query.data)
		return (
			<foreignObject width={'270px'} height={'90px'} x={-135}>
				<div className={'w-full h-full border border-gray-800 rounded-md flex justify-center items-center'}>Loading...</div>
			</foreignObject>
		);
	const hasChildren = query.data.left !== ZeroAddress || query.data.right !== ZeroAddress;
	const handleExpand = (e: MouseEvent) => {
		e.stopPropagation();
		node.toggleNode();
	};

	const handleInvite = (e: MouseEvent, parent: string) => {
		e.stopPropagation();
		queryClient.setQueryData(['affiliate', 'inviteMember'], parent);
	};

	return (
		<foreignObject width={horizontal ? '285px' : '270px'} height={'300px'} x={horizontal ? -270 : -135} y={horizontal ? -150 : -270}>
			<div className={'w-full h-full flex flex-row flex-nowrap'}>
				<div
					className={cx('border-2 border-purple-box flex flex-col w-[270px] h-[270px] items-center justify-between  bg-primaryLight p-4 rounded-xl', {
						'border-red-roulette': query.data?.isInviting,
						'!border-yellow-400': query.data?.isMatching,
					})}
				>
					<div className={'flex flex-col items-center'}>
						<img src="/favicon.svg" alt="logo" className={'w-20 h-20 rounded-full'} />
						<div className={'text-yellow-400 font-medium text-xl'}>{username || truncateEthAddress(query.data.member || ZeroAddress)}</div>
						<span className={'text-[10px] font-thin text-gray-400'}>{query.data.member}</span>
					</div>
					<div className={'flex flex-col items-center w-full gap-2'}>
						<div className={'w-full text-center'}>
							Total volume in <span className={'text-yellow-400'}>BET</span>
						</div>
						<div className={'w-full flex flex-row items-center justify-between'}>
							<div className={'flex flex-col items-center gap-2'}>
								<div className={'font-medium'}>
									<BetValue withIcon value={valueToNumber(query.data.volumeLeft + query.data.betsLeft / 100n)} />
								</div>
								<div className={'text-gray-400 flex flex-row gap-3 items-center border border-gray-400 px-2 rounded-md'}>
									<ArrowLeftIcon className={'w-4 h-4'} /> Left
								</div>
								<div className={'text-xs'}>{Number(query.data.countLeft)} users</div>
							</div>
							<div className={'flex flex-col items-center gap-2'}>
								<div className={'font-medium'}>
									<BetValue withIcon value={valueToNumber(query.data.volumeRight + query.data.betsRight / 100n)} />
								</div>
								<div className={'text-gray-400 flex flex-row gap-3 items-center border border-gray-400 px-2 rounded-md'}>
									<ArrowRightIcon className={'w-4 h-4'} /> Right
								</div>
								<div className={'text-xs'}>{Number(query.data.countRight)} users</div>
							</div>
						</div>
					</div>
					{hasChildren ? (
						<div
							onClick={handleExpand}
							className={cx('w-6 h-6 border-2 text-lg flex justify-center items-center border-purple-box bg-purple-box text-white rounded-full', {
								'bg-yellow-400 border-yellow-400 text-black': query.data.isMatching,
								'bg-red-roulette border-red-roulette': query.data.isInviting && !query.data.isMatching,
								hidden: horizontal,
							})}
						>
							+
						</div>
					) : (
						<div
							onClick={(e) => handleInvite(e, data)}
							className={cx('w-6 h-6 border-2  text-lg flex justify-center items-center border-purple-box bg-purple-box text-white rounded-full', {
								'bg-red-roulette border-red-roulette': query.data.isInviting && !query.data.isMatching,
								'bg-yellow-400 border-yellow-400 !text-black': query.data.isMatching,
								hidden: horizontal,
							})}
						>
							<UserPlus className={'h-full'} size={20} onClick={(e) => handleInvite(e, data)} />
						</div>
					)}
				</div>
				<div className={'flex items-center justify-center -ml-3'}>
					<div
						onClick={handleExpand}
						className={cx('w-6 h-6 border-2 text-lg flex justify-center items-center border-purple-box bg-purple-box text-white rounded-full', {
							'!bg-yellow-400 border-yellow-400 !text-black': query.data.isMatching,
							'!bg-red-roulette border-red-roulette': query.data.isInviting && !query.data.isMatching,
							hidden: !horizontal,
						})}
					>
						+
					</div>
				</div>
			</div>
		</foreignObject>
	);
}

export default BigNode;
