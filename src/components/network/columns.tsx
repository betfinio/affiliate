import type { TableMember } from '@/src/lib/types';
import { truncateEthAddress } from '@betfinio/abi';
import { Blackjack } from '@betfinio/ui/dist/icons';
import { createColumnHelper } from '@tanstack/react-table';
import { useRegistrationDate } from 'betfinio_app/lib/query/shared';
import { useCustomUsername } from 'betfinio_app/lib/query/username';
import cx from 'clsx';
import { Annoyed, ArrowLeft, ArrowRight, Dices, Layers3 } from 'lucide-react';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

export const sides = [
	{
		value: 'left',
		label: 'left',
		icon: ArrowLeft,
	},
	{
		value: 'right',
		label: 'right',
		icon: ArrowRight,
	},
];

export const activities = [
	{
		label: 'betting',
		value: 'betting',
		icon: Blackjack,
	},
	{
		label: 'staking',
		value: 'staking',
		icon: Layers3,
	},
];
export const categories = [
	{
		value: 'inviting',
		label: 'direct',
		icon: Blackjack,
		color: 'bg-red-500',
	},
	{
		value: 'matching',
		label: 'matching',
		icon: Layers3,
		color: 'bg-yellow-500',
	},
	{
		value: 'active',
		label: 'active',
		icon: Dices,
		color: 'bg-green-500',
	},
	{
		value: 'inactive',
		label: 'inactive',
		icon: Annoyed,
		color: 'bg-secondaryLight',
	},
];

export const columnHelper = createColumnHelper<TableMember>();
export const MemberAddress: FC<{ member: Address; username?: string }> = ({ member, username }) => {
	const { address } = useAccount();
	const { data: custom } = useCustomUsername(address, member);
	const { data: date = 0 } = useRegistrationDate(member);
	return (
		<div className={cx('flex flex-col text-xs')}>
			<span className={'text-sm'}>{custom ? custom : username ? username : truncateEthAddress(member)}</span>
			<span className={'text-gray-400'}>{date > 0 && DateTime.fromMillis(date).toFormat('DD')}</span>
		</div>
	);
};
