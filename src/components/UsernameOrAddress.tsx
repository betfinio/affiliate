import { useMember, useMemberSide } from '@/src/lib/query';
import { truncateEthAddress } from '@betfinio/abi';
import { BreadcrumbItem } from 'betfinio_app/breadcrumb';
import { useCustomUsername, useUsername } from 'betfinio_app/lib/query/username';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import cx from 'clsx';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import type { FC } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

export const UsernameOrAddress: FC<{ member: Address; onClick: () => void }> = ({ member, onClick }) => {
	const { address } = useAccount();
	const { data: username } = useUsername(member);
	const { data: customUsername } = useCustomUsername(address, member);
	const { data: side } = useMemberSide(address, member);
	const { data: memberInfo } = useMember(member);
	if (!memberInfo) {
		return (
			<BreadcrumbItem>
				<Loader className={'w-3 h-3 animate-spin'} />
			</BreadcrumbItem>
		);
	}
	return (
		<BreadcrumbItem
			className={cx('cursor-pointer rounded-md px-2 ', {
				'bg-yellow-400 text-black': memberInfo.is.matching,
				'bg-red-roulette text-white': memberInfo.is.inviting && !memberInfo.is.matching,
				'bg-green-roulette text-white': (memberInfo.volume.member > 0n || memberInfo.bets.member > 0n) && !memberInfo.is.inviting,
			})}
			onClick={onClick}
		>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className={'flex flex-row items-center gap-2'}>
						{customUsername || username || truncateEthAddress(member)}
						<div className={cx('bg-secondary rounded-full text-white p-0.5', member === address && 'hidden')}>
							{side === 'left' ? <ArrowLeft className={'w-3 h-3'} /> : <ArrowRight className={'w-3 h-3'} />}
						</div>
					</TooltipTrigger>
					<TooltipContent>{member}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</BreadcrumbItem>
	);
};

export default UsernameOrAddress;
