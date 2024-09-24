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
		label: 'Left',
		icon: ArrowLeft,
	},
	{
		value: 'right',
		label: 'Right',
		icon: ArrowRight,
	},
];

export const activities = [
	{
		label: 'Betting',
		value: 'betting',
		icon: Blackjack,
	},
	{
		label: 'Staking',
		value: 'staking',
		icon: Layers3,
	},
];
export const categories = [
	{
		value: 'inviting',
		label: 'Direct affiliate active',
		icon: Blackjack,
	},
	{
		value: 'matching',
		label: 'Binary matching active',
		icon: Layers3,
	},
	{
		value: 'active',
		label: 'Active member',
		icon: Dices,
	},
	{
		value: 'inactive',
		label: 'Inactive member',
		icon: Annoyed,
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
