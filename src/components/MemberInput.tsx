import { useMemberSide, usePossibleAddresses, usePossibleUsernames } from '@/src/lib/query';
import type { MemberWithUsername } from '@/src/lib/types.ts';
import { truncateEthAddress } from '@betfinio/abi';
import { Badge } from 'betfinio_app/badge';
import { Button } from 'betfinio_app/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandLoading, CommandSeparator } from 'betfinio_app/command';
import { Drawer, DrawerContent, DrawerTrigger } from 'betfinio_app/drawer';
import { Popover, PopoverContent, PopoverTrigger } from 'betfinio_app/popover';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'usehooks-ts';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

const MemberInput: FC<{ value?: Address; onChange?: (value: Address) => void }> = ({ value = null, onChange }) => {
	const [address, setAddress] = useState<Address | null>(value);
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const handleChangeAddress = (val: Address) => {
		setAddress(val);
		onChange?.(val);
	};

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" className="w-full flex justify-between">
						<MemberInfo member={address} />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="md:min-w-[500px] p-0" align="start" side={'bottom'}>
					<StatusList setOpen={setOpen} onSelect={handleChangeAddress} />
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" className="w-full flex justify-between">
					<MemberInfo member={address} />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t border-gray-900">
					<StatusList setOpen={setOpen} onSelect={handleChangeAddress} />
				</div>
			</DrawerContent>
		</Drawer>
	);
};
export default MemberInput;

const MemberInfo: FC<{ member: Address | null }> = ({ member }) => {
	const { address } = useAccount();
	const { t } = useTranslation('affiliate', { keyPrefix: 'generate' });
	const { data: side } = useMemberSide(address, member || undefined);
	return (
		<>
			{member ? truncateEthAddress(member) : t('selectParent')}
			{side === 'right' && (
				<Badge className={'flex gap-1 bg-yellow-400 text-black'}>
					{t('right')} <ArrowRight className={'w-3 h-3'} />
				</Badge>
			)}
			{side === 'left' && (
				<Badge className={'flex gap-1 bg-yellow-400 text-black'}>
					{t('left')} <ArrowLeft className={'w-3 h-3'} />
				</Badge>
			)}
			{address?.toLowerCase() === member?.toLowerCase() && <Badge className={'text-black bg-yellow-400'}>{t('you')}</Badge>}
		</>
	);
};

function StatusList({
	setOpen,
	onSelect,
}: {
	setOpen: (open: boolean) => void;
	onSelect: (address: Address) => void;
}) {
	const { t } = useTranslation('affiliate', { keyPrefix: 'generate' });
	const [value, setValue] = useState('');
	const { data: possibleByUsername = [], isFetching: uFetching } = usePossibleUsernames(value);
	const { data: possibleByAddress = [], isFetching: aFetching } = usePossibleAddresses(value);
	const handleChange = async (val: string) => {
		setValue(val);
	};
	const handleSelect = (val: string) => {
		onSelect(val.split(':')[0] as Address);
		setOpen(false);
	};
	const isFetching = uFetching || aFetching;

	return (
		<Command onValueChange={handleSelect}>
			<CommandInput placeholder={t('filter')} onValueChange={handleChange} className={'lg:min-w-[500px]'} />
			<CommandList>
				{isFetching ? <CommandLoading>{t('loading')}</CommandLoading> : <CommandEmpty>{t('noMembers')}</CommandEmpty>}
				{possibleByUsername.length > 0 && (
					<CommandGroup heading={'By username'}>
						{possibleByUsername.map((member) => (
							<MemberItem key={member.member} {...member} onSelect={handleSelect} />
						))}
					</CommandGroup>
				)}
				<CommandSeparator />
				{possibleByAddress.length > 0 && (
					<CommandGroup heading={'By address'}>
						{possibleByAddress.map((member) => (
							<MemberItem key={member.member} {...member} onSelect={handleSelect} />
						))}
					</CommandGroup>
				)}
			</CommandList>
		</Command>
	);
}

const MemberItem: FC<MemberWithUsername & { onSelect: (value: string) => void }> = ({ member, username, onSelect }) => {
	const { address } = useAccount();
	const { data: side } = useMemberSide(address, member);
	const isDesktop = useMediaQuery('(min-width: 768px)');

	return (
		<CommandItem
			value={`${member}:${username}`}
			style={{ marginTop: '4px' }}
			onSelect={onSelect}
			className={'text-white flex flex-row items-center justify-between'}
		>
			<div className={'flex flex-row items-center gap-2'}>
				{isDesktop ? member : truncateEthAddress(member)} {username && <Badge variant={'destructive'}>{username}</Badge>}
			</div>
			{side === 'right' && (
				<Badge className={'flex gap-1 text-black bg-yellow-400'}>
					Right <ArrowRight className={'w-3 h-3'} />
				</Badge>
			)}
			{side === 'left' && (
				<Badge className={'flex gap-1 text-black bg-yellow-400'}>
					Left <ArrowLeft className={'w-3 h-3'} />
				</Badge>
			)}
			{address?.toLowerCase() === member.toLowerCase() && <Badge className={'text-black bg-yellow-400'}>You</Badge>}
		</CommandItem>
	);
};
