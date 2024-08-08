import {createColumnHelper} from "@tanstack/react-table"
import {DataTableColumnHeader} from "@/src/components/network/ColumnHeader.tsx";
import {TableMember} from "@/src/lib/types";
import {Annoyed, ArrowLeft, ArrowLeftCircle, ArrowRight, ArrowRightCircle, Dices, Layers3} from "lucide-react";
import {Blackjack} from "@betfinio/ui/dist/icons";
import {truncateEthAddress} from "@betfinio/abi";
import {BetValue} from "betfinio_app/BetValue";
import cx from "clsx";
import {Address} from "viem";
import {FC} from "react";
import {useCustomUsername} from "betfinio_app/lib/query/username";
import {useAccount} from "wagmi";
import { useRegistrationDate } from "betfinio_app/lib/query/shared";
import {DateTime} from "luxon";

export const sides = [
	{
		value: "left",
		label: "Left",
		icon: ArrowLeft,
	},
	{
		value: "right",
		label: "Right",
		icon: ArrowRight,
	}
]

export const activities = [
	{
		label: "Betting",
		value: "betting",
		icon: Blackjack,
	},
	{
		label: "Staking",
		value: "staking",
		icon: Layers3,
	},
]
export const categories = [
	{
		value: "inviting",
		label: "Direct affiliate active",
		icon: Blackjack,
	},
	{
		value: "matching",
		label: "Binary matching active",
		icon: Layers3,
	},
	{
		value: "active",
		label: "Active member",
		icon: Dices,
	},
	{
		value: "inactive",
		label: "Inactive member",
		icon: Annoyed,
	},
]

export const columnHelper = createColumnHelper<TableMember>()

export const columns = [
	columnHelper.accessor('member', {
		meta: {
			className: "min-w-[120px]",
		},
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Member"/>
		),
		cell: ({getValue, row}) => <div className={'flex flex-row items-center gap-2'}>
			<div className={cx('!w-6 aspect-square !h-6 rounded-full', {
				'bg-green-400': row.original.category === 'active',
				'bg-red-roulette': row.original.category === 'inviting',
				'bg-yellow-400': row.original.category === 'matching',
				'bg-[#292546]': row.original.category === 'inactive',
			})}/>
			<MemberAddress member={getValue()} username={row.original.username || undefined}/>
		</div>,
		enableSorting: false,
		enableHiding: false,
	}),
	columnHelper.accessor('level', {
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="LVL"/>
		),
		cell: ({getValue}) => {
			return (
				<div className="flex items-center justify-center">
					<div className={'border border-gray-500 rounded-full px-1 py-0.5 lg:min-w-[40px] flex justify-center'}>
						{getValue()}
					</div>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	}),
	columnHelper.accessor('side', {
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Side"/>
		),
		cell: ({row}) => {
			const side = sides.find(
				(status) => status.value === row.getValue("side")
			)
			if (!side) {
				return null
			}
			const classNames = {
				'text-green-400': row.original.category === 'active',
				'text-red-roulette': row.original.category === 'inviting',
				'text-yellow-400': row.original.category === 'matching',
				'text-gray-400': row.original.category === 'inactive',
			}
			return (
				<div className="flex items-center justify-center">
					{row.original.side === 'left' ?
						<ArrowLeftCircle className={cx('w-6 h-6', classNames)}/> :
						<ArrowRightCircle className={cx('w-6 h-6', classNames)}/>}
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	}),
	columnHelper.accessor('staking', {
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Staking"/>
		),
		meta: {
			className: 'hidden lg:table-cell '
		},
		cell: ({getValue}) => {
			return (
				<div className="flex items-center justify-center">
					<BetValue value={getValue()} withIcon/>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	}),
	
	columnHelper.accessor('betting', {
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Betting"/>
		),
		meta: {
			className: 'hidden lg:table-cell '
		},
		cell: ({getValue}) => {
			return (
				<div className="flex items-center justify-center">
					<BetValue value={getValue()} withIcon/>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	}),
	columnHelper.accessor('activity', {
		id: 'activity',
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Activity"/>
		),
		enableHiding: true,
		cell: () => null,
		filterFn: (row, id, value) => {
			return value.some((v: string) => (row.getValue(id) as string[]).includes(v))
		},
	}),
	columnHelper.accessor('category', {
		id: 'category',
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Category"/>
		),
		enableHiding: true,
		cell: ({row}) => {
			const category = categories.find(
				(priority) => priority.value === row.getValue("category")
			)
			
			if (!category) {
				return null
			}
			
			return (
				<div className="flex items-center justify-center">
					{category.icon && (
						<category.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
					)}
					<span>{category.label}</span>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	}),
	columnHelper.accessor('direct_count', {
		id: 'count',
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Direct(total)"/>
		),
		cell: ({row}) => {
			return (
				<div className="flex items-center justify-center">
					{Number(row.original.direct_count)} ({Number(row.original.binary_count)})
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	}),
	columnHelper.accessor('staking_volume', {
		id: 'staking_volume',
		meta: {
			className: 'hidden xl:table-cell '
		},
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Staking volume"/>
		),
		cell: ({getValue}) => {
			return (
				<div className="flex items-center justify-center">
					<BetValue value={getValue()} withIcon/>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	}),
	columnHelper.accessor('betting_volume', {
		id: 'betting_volume',
		meta: {
			className: 'hidden xl:table-cell '
		},
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Betting volume"/>
		),
		cell: ({getValue}) => {
			return (
				<div className="flex items-center justify-center">
					<BetValue value={getValue()} withIcon/>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	}),
	columnHelper.accessor('betting_volume', {
		id: 'total_volume',
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Total volume"/>
		),
		cell: ({row}) => {
			return (
				<div className="flex items-center justify-center">
					<BetValue value={row.original.betting_volume + row.original.staking_volume} withIcon/>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	})
]


export const MemberAddress: FC<{ member: Address, username?: string }> = ({member, username}) => {
	const {address} = useAccount();
	const {data: custom} = useCustomUsername(address, member)
	const {data: date = 0} = useRegistrationDate(member)
	return <div className={cx('flex flex-col text-xs')}>
		<span className={'text-sm'}>{custom ? custom : username ? username : truncateEthAddress(member)}</span>
		<span className={'text-gray-400'}>{DateTime.fromMillis(date).toFormat('DD')}</span>
	</div>
}