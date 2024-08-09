import { columnHelper, getColumns } from '@/src/components/network/columns.tsx';
import { useLinearMembers } from '@/src/lib/query';
import { ZeroAddress, truncateEthAddress } from '@betfinio/abi';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from 'betfinio_app/breadcrumb';
import { Button } from 'betfinio_app/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'betfinio_app/dropdown-menu';
import { useOpenProfile } from 'betfinio_app/lib/query/shared';
import { useCustomUsername, useUsername } from 'betfinio_app/lib/query/username';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import { MoreHorizontal } from 'lucide-react';
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
			<DataTable columns={columnsWithActions} data={data} />
		</div>
	);
};

export default LinearTable;

export const Path: FC<{ path: Address[]; onChange: (path: Address[]) => void }> = ({ path, onChange }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList className={'p-2'}>
				<BreadcrumbItem className={'cursor-pointer bg-yellow-400 text-black rounded-md px-2 '} onClick={() => onChange([path[0]])}>
					<UsernameOrAddress member={path[0]} />
					(me)
				</BreadcrumbItem>
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
											<DropdownMenuItem key={index} onClick={() => onChange(path.slice(0, path.length - 1 - index))}>
												<UsernameOrAddress member={member} />
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
						<BreadcrumbItem className={'cursor-pointer bg-secondaryLight text-white rounded-md px-2 '} onClick={() => onChange(path.slice(0, 2))}>
							<UsernameOrAddress member={path[1]} />
						</BreadcrumbItem>
					</>
				)}
				{path.length > 1 && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem className={'cursor-pointer bg-secondaryLight text-white rounded-md px-2 '}>
							<UsernameOrAddress member={path[path.length - 1]} />
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export const UsernameOrAddress: FC<{ member: Address }> = ({ member }) => {
	const { address } = useAccount();
	const { data: username } = useUsername(member);
	const { data: customUsername } = useCustomUsername(address, member);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{customUsername || username || truncateEthAddress(member)}</TooltipTrigger>
				<TooltipContent>{member}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
