import UsernameOrAddress from '@/src/components/UsernameOrAddress.tsx';
import { DataTableColumnHeader } from '@/src/components/network/ColumnHeader.tsx';
import { categories, columnHelper } from '@/src/components/network/columns.tsx';
import { useBinaryMembers } from '@/src/lib/query';
import type { TableMember } from '@/src/lib/types.ts';
import { ZeroAddress } from '@betfinio/abi';
import { BetValue } from 'betfinio_app/BetValue';
import { useOpenProfile } from 'betfinio_app/lib/query/shared';
import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { DataTable } from './Table';

const BinaryTable = () => {
	const { address = ZeroAddress } = useAccount();
	const { t } = useTranslation('affiliate', { keyPrefix: 'view.table' });
	const { data = [] } = useBinaryMembers(address);
	const { open } = useOpenProfile();

	const handleRowClick = (row: TableMember) => {
		open(row.member);
	};

	const getColumns = () => [
		columnHelper.group({
			id: 'memberInfo',
			header: () => <div className={'w-full text-center border-r border-gray-800'}>{t('memberData')}</div>,
			columns: [
				columnHelper.accessor('member', {
					meta: {
						className: 'min-w-[130px]',
					},
					header: ({ column }) => <DataTableColumnHeader column={column} title={t('member')} />,
					cell: ({ getValue, row }) => (
						<div className={'flex whitespace-nowrap flex-row items-center gap-2'}>
							<div
								className={cx('!w-6 aspect-square !h-6 rounded-full', {
									'bg-green-400': row.original.category === 'active',
									'bg-red-roulette': row.original.category === 'inviting',
									'bg-yellow-400': row.original.category === 'matching',
									'bg-[#292546]': row.original.category === 'inactive',
								})}
							/>
							<UsernameOrAddress member={getValue()} onClick={() => {}} />
						</div>
					),
					enableSorting: false,
					enableHiding: false,
				}),
			].filter((e) => e !== null),
		}),
		columnHelper.group({
			meta: {
				className: 'hidden lg:table-cell ',
			},
			id: 'activity',
			header: () => <div className={'w-full text-center border-r border-gray-800'}>{t('activity')}</div>,
			columns: [
				columnHelper.accessor('staking', {
					header: ({ column }) => <DataTableColumnHeader column={column} title={t('staking')} />,
					meta: {
						className: 'hidden lg:table-cell ',
					},
					cell: ({ getValue }) => {
						return (
							<div className="flex items-center justify-center">
								<BetValue value={getValue()} withIcon />
							</div>
						);
					},
					filterFn: (row, id, value) => {
						return value.includes(row.getValue(id));
					},
				}),

				columnHelper.accessor('betting', {
					header: ({ column }) => (
						<div className={'border-r border-gray-800'}>
							<DataTableColumnHeader column={column} title={t('betting')} />
						</div>
					),
					meta: {
						className: 'hidden lg:table-cell ',
					},
					cell: ({ getValue }) => {
						return (
							<div className="flex items-center justify-center border-gray-800 border-r">
								<BetValue value={getValue()} withIcon />
							</div>
						);
					},
					filterFn: (row, id, value) => {
						return value.includes(row.getValue(id));
					},
				}),
			],
		}),
		columnHelper.group({
			id: 'network',
			header: () => <div className={'w-full text-center'}>{t('network')}</div>,
			columns: [
				columnHelper.accessor('activity', {
					id: 'activity',
					header: ({ column }) => <DataTableColumnHeader column={column} title="Activity" />,
					enableHiding: true,
					cell: () => null,
					filterFn: (row, id, value) => {
						return value.some((v: string) => (row.getValue(id) as string[]).includes(v));
					},
				}),
				columnHelper.accessor('category', {
					id: 'category',
					header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
					enableHiding: true,
					cell: ({ row }) => {
						const category = categories.find((priority) => priority.value === row.getValue('category'));

						if (!category) {
							return null;
						}

						return (
							<div className="flex items-center justify-center">
								{category.icon && <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
								<span>{category.label}</span>
							</div>
						);
					},
					filterFn: (row, id, value) => {
						return value.includes(row.getValue(id));
					},
				}),
				columnHelper.accessor('direct_count', {
					id: 'count',
					header: ({ column }) => <DataTableColumnHeader column={column} title={t('direct')} />,
					cell: ({ row }) => {
						return (
							<div className="flex items-center justify-center">
								{Number(row.original.direct_count)} ({Number(row.original.binary_count)})
							</div>
						);
					},
					filterFn: (row, id, value) => {
						return value.includes(row.getValue(id));
					},
				}),
				columnHelper.accessor('staking_volume', {
					id: 'staking_volume',
					meta: {
						className: 'hidden xl:table-cell ',
					},
					header: ({ column }) => <DataTableColumnHeader column={column} title={t('stakingVolume')} />,
					cell: ({ getValue }) => {
						return (
							<div className="flex items-center justify-center">
								<BetValue value={getValue()} withIcon />
							</div>
						);
					},
					filterFn: (row, id, value) => {
						return value.includes(row.getValue(id));
					},
				}),
				columnHelper.accessor('betting_volume', {
					id: 'betting_volume',
					meta: {
						className: 'hidden xl:table-cell ',
					},
					header: ({ column }) => <DataTableColumnHeader column={column} title={t('bettingVolume')} />,
					cell: ({ getValue }) => {
						return (
							<div className="flex items-center justify-center">
								<BetValue value={getValue()} withIcon />
							</div>
						);
					},
					filterFn: (row, id, value) => {
						return value.includes(row.getValue(id));
					},
				}),
				columnHelper.accessor('betting_volume', {
					id: 'total_volume',
					header: ({ column }) => <DataTableColumnHeader column={column} title={t('totalVolume')} />,
					cell: ({ row }) => {
						return (
							<div className="flex items-center justify-center">
								<BetValue value={row.original.betting_volume / 100n + row.original.staking_volume} withIcon />
							</div>
						);
					},
					filterFn: (row, id, value) => {
						return value.includes(row.getValue(id));
					},
				}),
			],
		}),
	];

	return (
		<div className={'flex flex-col gap-2'}>
			<DataTable columns={getColumns()} data={data} onRowClick={handleRowClick} />
		</div>
	);
};

export default BinaryTable;
