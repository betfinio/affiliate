import { columnHelper, getColumns } from '@/src/components/network/columns.tsx';
import { useLinearMembers, useMember, useMemberSide } from '@/src/lib/query';
import type { TableMember } from '@/src/lib/types.ts';
import { ZeroAddress, truncateEthAddress } from '@betfinio/abi';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from 'betfinio_app/breadcrumb';
import { Button } from 'betfinio_app/button';
import { useTreeMember } from 'betfinio_app/compiled-types/lib/query/affiliate';
import { defaultTreeMember } from 'betfinio_app/compiled-types/lib/types/affiliate';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'betfinio_app/dropdown-menu';
import { useOpenProfile } from 'betfinio_app/lib/query/shared';
import { useCustomUsername, useUsername } from 'betfinio_app/lib/query/username';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import cx from 'clsx';
import { ArrowLeft, ArrowRight, Loader, MoreHorizontal } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { DataTable } from './Table';

const LinearTable = () => {
	const { address = ZeroAddress } = useAccount();
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
		console.log('row click');
		open(row.member);
	};
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
							<DropdownMenuItem onClick={() => handleOpenProfile(row.original.member)}>Display profile</DropdownMenuItem>
							{row.original.direct_count > 0 && <DropdownMenuItem onClick={() => handleExpandMember(row.original.member)}>Show structure</DropdownMenuItem>}
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
							<DropdownMenu className={'affiliate'}>
								<DropdownMenuTrigger className="flex items-center gap-1">
									<BreadcrumbEllipsis className="h-4 w-4" />
									<span className="sr-only">Toggle menu</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{path
										.slice(1, path.length - 1)
										.reverse()
										.map((member, index) => (
											<DropdownMenuItem key={index}>
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
