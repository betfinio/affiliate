import { DataTableColumnHeader } from '@/src/components/network/ColumnHeader.tsx';
import { MemberAddress, categories, columnHelper, sides } from '@/src/components/network/columns.tsx';
import { useLinearMembers, useMember, useMemberSide } from '@/src/lib/query';
import type { TableMember } from '@/src/lib/types.ts';
import { ZeroAddress, truncateEthAddress } from '@betfinio/abi';
import { BetValue } from 'betfinio_app/BetValue';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from 'betfinio_app/breadcrumb';
import { Button } from 'betfinio_app/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'betfinio_app/dropdown-menu';
import { useOpenProfile } from 'betfinio_app/lib/query/shared';
import { useCustomUsername, useUsername } from 'betfinio_app/lib/query/username';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import cx from 'clsx';
import { ArrowLeft, ArrowLeftCircle, ArrowRight, ArrowRightCircle, Loader, MoreHorizontal } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { DataTable } from './Table';

const LinearTable = () => {
	const { address = ZeroAddress } = useAccount();
	const { t } = useTranslation('affiliate', { keyPrefix: 'view.table' });
	const [path, setPath] = useState<Address[]>([address]);
	const { data = [] } = useLinearMembers(path[path.length - 1]);
	const { open } = useOpenProfile();

	useEffect(() => {
		setPath([address]);
	}, [address]);

	const handleOpenProfile = (member: Address) => {
		open(member);
	};
	const handleExpandMember = (member: Address) => {
		setPath((p) => [...p, member]);
	};
	const handleRowClick = (row: TableMember) => {
		open(row.member);
	};

	const getColumns = (depth: number) => [
		columnHelper.group({
			id: 'memberInfo',
			header: () => <div className={'w-full text-center border-x border-gray-800'}>{t('memberData')}</div>,
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
							<MemberAddress member={getValue()} username={row.original.username || undefined} />
						</div>
					),
					enableSorting: false,
					enableHiding: false,
				}),
				depth > 0
					? columnHelper.accessor('level', {
							id: 'lvl',
							header: ({ column }) => <DataTableColumnHeader column={column} title="LVL" />,
							cell: () => {
								return (
									<div className="flex items-center justify-center">
										<div className={'border border-gray-500 rounded-full px-1 py-0.5 lg:min-w-[40px] flex justify-center'}>{depth + 1}</div>
									</div>
								);
							},
						})
					: null,
				columnHelper.accessor('side', {
					header: ({ column }) => (
						<div className={'border-r border-gray-800'}>
							<DataTableColumnHeader column={column} title={t('side')} />
						</div>
					),
					cell: ({ row }) => {
						const side = sides.find((status) => status.value === row.getValue('side'));
						if (!side) {
							return null;
						}
						const classNames = {
							'text-green-400': row.original.category === 'active',
							'text-red-roulette': row.original.category === 'inviting',
							'text-yellow-400': row.original.category === 'matching',
							'text-gray-400': row.original.category === 'inactive',
						};
						return (
							<div className="flex items-center justify-center  border-gray-800 border-r">
								{row.original.side === 'left' ? (
									<ArrowLeftCircle className={cx('w-6 h-6', classNames)} />
								) : (
									<ArrowRightCircle className={cx('w-6 h-6', classNames)} />
								)}
							</div>
						);
					},
					filterFn: (row, id, value) => {
						return value.includes(row.getValue(id));
					},
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

	const columnsWithActions = [
		...getColumns(path.length - 1),
		columnHelper.display({
			id: 'action',
			meta: {
				className: 'w-10',
			},
			cell: ({ row }) => {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleOpenProfile(row.original.member)}>{t('display')}</DropdownMenuItem>
							{row.original.direct_count > 0 && <DropdownMenuItem onClick={() => handleExpandMember(row.original.member)}>{t('show')}</DropdownMenuItem>}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		}),
	];
	return (
		<div className={'flex flex-col gap-2'}>
			{path.length > 1 && (
				<div className={'border border-gray-600 rounded-lg'}>
					<Path path={path} onChange={setPath} />
				</div>
			)}
			<DataTable columns={columnsWithActions} data={data} onRowClick={handleRowClick} />
		</div>
	);
};

export default LinearTable;

export const Path: FC<{ path: Address[]; onChange: (path: Address[]) => void }> = ({ path, onChange }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList className={'p-2'}>
				<UsernameOrAddress member={path[0]} onClick={() => onChange([path[0]])} />
				{path.length > 3 && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-1">
									<BreadcrumbEllipsis className="h-4 w-4" />
									<span className="sr-only">Toggle menu</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{path
										.slice(1, path.length - 1)
										.reverse()
										.map((member, index) => (
											<DropdownMenuItem key={index} className={'affiliate'}>
												<UsernameOrAddress member={member} onClick={() => onChange(path.slice(0, path.length - 1 - index))} />
											</DropdownMenuItem>
										))}
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
					</>
				)}
				{path.length === 3 && (
					<>
						<BreadcrumbSeparator />
						<UsernameOrAddress member={path[1]} onClick={() => onChange(path.slice(0, 2))} />
					</>
				)}
				{path.length > 1 && (
					<>
						<BreadcrumbSeparator />
						<UsernameOrAddress member={path[path.length - 1]} onClick={() => {}} />
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

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
