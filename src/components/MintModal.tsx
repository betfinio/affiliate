import MemberInput from '@/src/components/MemberInput.tsx';
import { useMultimint } from '@/src/lib/query';
import { ZeroAddress } from '@betfinio/abi';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from 'betfinio_app/DataTable';
import { Button } from 'betfinio_app/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'betfinio_app/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'betfinio_app/dropdown-menu';
import { Input } from 'betfinio_app/input';
import { getAcademyUrl } from 'betfinio_app/lib';
import { ScrollArea } from 'betfinio_app/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import { toast } from 'betfinio_app/use-toast';
import cx from 'clsx';
import { CircleAlert, Link2Icon, Loader, MoreHorizontal, Trash, X } from 'lucide-react';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Address, isAddress, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';

interface NewMemberProps {
	address?: Address;
	parent?: Address;
}

const columnHelper = createColumnHelper<NewMemberProps>();

const MintModal: FC<{ open: boolean; onClose: () => void; initialMembers?: NewMemberProps[] }> = ({ open, onClose, initialMembers = [] }) => {
	const { t } = useTranslation('', { keyPrefix: 'affiliate.generate' });

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
				className: 'lg:p-2 py-1',
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
				className: 'w-[150px] md:w-[200px] lg:p-2 py-1',
			},
			cell: (props) => <MemberInput value={props.getValue()} onChange={(val) => handleParentChange(props.row.index, val)} />,
		}),
		columnHelper.display({
			id: 'actions',
			meta: {
				className: 'lg:w-[60px]',
			},
			cell: ({ row }) => {
				return <Trash className={'cursor-pointer w-4 h-4'} onClick={() => handleRemove(row.index)} />;
			},
		}),
	];

	const [linkButtonDisabled, setLinkButtonDisabled] = useState(false);

	const invitingParent = useMemo(() => {
		setLinkButtonDisabled(false);
		let parent = members[0]?.parent;
		for (const member of members) {
			if (member.parent !== parent) {
				parent = zeroAddress;
				setLinkButtonDisabled(true);
			}
		}

		return parent;
	}, [members]);

	const handleAcademyLink = async () => {
		const code = me + (invitingParent || me);
		console.log(code);
		await navigator.clipboard.writeText(`${getAcademyUrl('/new')}/?code=${code}`);
		toast({
			title: 'Link copied',
			description: 'The invitation link has been copied to your clipboard',
			variant: 'default',
		});
	};

	return (
		<Dialog open={open} onOpenChange={() => onClose()}>
			<DialogContent className={'affiliate text-white p-4'}>
				<div onClick={onClose} className={'absolute right-4 top-4 cursor-pointer hover:text-red-roulette duration-300 z-10'}>
					<X className="h-5 w-5" />
				</div>
				<ScrollArea className={'max-h-[90vh] lg:min-w-[800px]'}>
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
						<div className={'flex flex-row items-center gap-2 mt-2'}>
							<Button
								variant={'outline'}
								disabled={linkButtonDisabled}
								onClick={handleAcademyLink}
								className={'flex-grow px-4 gap-2 flex justify-center items-center whitespace-nowrap '}
							>
								<Link2Icon className={'w-3 h-3'} />
								{t('academy_link')}
							</Button>
							<Button onClick={handleMint} disabled={members.length === 0} className={'w-[100px]'}>
								{isPending ? <Loader className={'animate-spin'} /> : <>Mint Pass{members.length > 1 && 'es'}</>}
							</Button>
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
export default MintModal;
