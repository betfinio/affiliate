import MemberInput from '@/src/components/MemberInput.tsx';
import { useMultimint } from '@/src/lib/query';
import { ZeroAddress } from '@betfinio/abi';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from 'betfinio_app/DataTable';
import { Button } from 'betfinio_app/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'betfinio_app/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'betfinio_app/dropdown-menu';
import { Input } from 'betfinio_app/input';
import { ScrollArea } from 'betfinio_app/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import cx from 'clsx';
import { CircleAlert, Loader, MoreHorizontal, Trash } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { type Address, isAddress } from 'viem';
import { useAccount } from 'wagmi';

interface NewMemberProps {
	address?: Address;
	parent?: Address;
}

const columnHelper = createColumnHelper<NewMemberProps>();

const MintModal: FC<{ open: boolean; onClose: () => void; initialMembers?: NewMemberProps[] }> = ({ open, onClose, initialMembers = [] }) => {
	const { address: me } = useAccount();
	const [members, setMembers] = useState<NewMemberProps[]>(initialMembers);
	const { mutate: multimint, isPending } = useMultimint();

	const handleMint = async () => {
		multimint({ members: members.map((e) => e.address || ZeroAddress), parents: members.map((e) => e.parent || me || ('' as Address)) });
	};

	const handleRemove = (id: number) => {
		setMembers(members.filter((_, i) => i !== id));
	};
	const handleAdd = () => {
		setMembers([...members, { parent: me }]);
	};
	const handleAddressChange = (id: number, val: Address) => {
		const newMembers = [...members];
		newMembers[id].address = val;
		setMembers(newMembers);
	};

	const handleParentChange = (id: number, val: Address) => {
		const newMembers = [...members];
		newMembers[id].parent = val;
		setMembers(newMembers);
	};

	const columns = [
		columnHelper.accessor('address', {
			header: 'Address',
			meta: {
				className: 'p-2 py-1',
			},
			cell: ({ getValue, row: { index } }) => {
				const initialValue = getValue();
				const [value, setValue] = useState<Address | undefined>(initialValue);
				const onBlur = () => {
					handleAddressChange(index, value || ('' as Address));
				};
				useEffect(() => {
					setValue(initialValue);
				}, [initialValue]);

				const isValid = isAddress(value || '');

				return (
					<div className={'relative max-h-[40px]'}>
						<Input
							className={cx(!isValid && 'border-red-roulette pr-10')}
							value={value || ''}
							onChange={(e) => setValue(e.target.value as Address)}
							onBlur={onBlur}
						/>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<CircleAlert className={cx(!isValid ? 'absolute top-2 right-2 w-6 h-6 text-red-roulette' : 'hidden')} />
								</TooltipTrigger>
								<TooltipContent>Invalid address</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				);
			},
		}),
		columnHelper.accessor('parent', {
			header: 'Parent',
			meta: {
				className: 'w-[150px] md:w-[200px] p-2 py-1',
			},
			cell: (props) => <MemberInput value={props.getValue()} onChange={(val) => handleParentChange(props.row.index, val)} />,
		}),
		columnHelper.display({
			id: 'actions',
			meta: {
				className: 'w-[60px]',
			},
			cell: ({ row }) => {
				return <Trash className={'cursor-pointer w-4 h-4'} onClick={() => handleRemove(row.index)} />;
			},
		}),
	];
	return (
		<Dialog open={open} onOpenChange={() => onClose()}>
			<DialogContent className={'affiliate text-white p-4 '}>
				<ScrollArea className={'max-h-[90vh]'}>
					<DialogHeader>
						<DialogTitle className={'text-xl'}>Mint new passes</DialogTitle>
						<DialogDescription className={'text-sm text-gray-400'}>
							Please enter the address of the new member(s) you would like to mint a pass for.
						</DialogDescription>
					</DialogHeader>
					{/*// @ts-ignore*/}
					<DataTable columns={columns} data={members} />
					<div className={'flex flex-row items-center justify-between mt-2'}>
						<Button onClick={handleAdd} variant={'outline'}>
							Add more
						</Button>
						<Button onClick={handleMint} disabled={members.length === 0} className={'w-[100px]'}>
							{isPending ? <Loader className={'animate-spin'} /> : <>Mint Pass{members.length > 1 && 'es'}</>}
						</Button>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
export default MintModal;
