import {ChangeEvent, FC, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "betfinio_app/dialog";
import {ScrollArea} from "betfinio_app/scroll-area";
import {Input} from "betfinio_app/input";
import {Address, isAddress} from "viem";
import MemberInput from "@/src/components/MemberInput.tsx";
import {CircleAlert, CircleCheck, CirclePlus, Trash2} from "lucide-react";
import {Button} from "betfinio_app/button";
import {useIsMember} from "betfinio_app/lib/query/pass";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "betfinio_app/tooltip";
import {truncateEthAddress, ZeroAddress} from "@betfinio/abi";

const MintModal: FC<{ open: boolean, onClose: () => void }> = ({open, onClose}) => {
	const [members, setMembers] = useState<NewMemberProps[]>([{}])
	const handleRemove = (id: number) => {
		setMembers(members.filter((_, i) => i !== id))
	}
	const handleAdd = () => {
		setMembers([...members, {}])
	}
	const handleAddressChange = (id: number, val: Address) => {
		const newMembers = [...members]
		newMembers[id].address = val
		setMembers(newMembers)
	}
	
	const handleParentChange = (id: number, val: Address) => {
		const newMembers = [...members]
		newMembers[id].parent = val
		setMembers(newMembers)
	}
	
	const handleMint = () => {
		console.log('mint')
	}
	return <Dialog open={open} onOpenChange={() => onClose()}>
		<DialogContent className={'affiliate text-white p-4 '} aria-describedby={undefined}>
			<DialogHeader className={''}>
				<DialogTitle>
					Invite new users to the platform
				</DialogTitle>
				<ScrollArea className={'max-h-[80vh]'}>
					{members.map((row, id) => <NewMemberRow key={id} {...row}
					                                        onRemove={() => handleRemove(id)}
					                                        onAddressChange={(val) => handleAddressChange(id, val)}
					                                        onParentChange={(val) => handleParentChange(id, val)}
					/>)}
				</ScrollArea>
				<Button onClick={handleAdd} variant='secondary' className={'flex flex-row items-center justify-center bg-transparent p-0 hover:bg-transparent'}>
					<CirclePlus className={'w-6 h-6'}/>
				</Button>
				<div className={'flex flex-row items-center justify-end'}>
					<Button onClick={handleMint} disabled={members.length === 0}>Mint Pass{members.length > 1 && 'es'}</Button>
				</div>
			</DialogHeader>
		</DialogContent>
	</Dialog>
}
export default MintModal;

interface NewMemberProps {
	address?: Address;
	parent?: Address,
}

const NewMemberRow: FC<NewMemberProps & {
	onRemove?: () => void,
	onParentChange?: (val: Address) => void,
	onAddressChange?: (val: Address) => void
}> = ({address, parent, onRemove, onParentChange, onAddressChange}) => {
	const [value, setValue] = useState(address)
	const {data: isMember} = useIsMember(value)
	const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value as Address)
		onAddressChange && onAddressChange(e.target.value as Address)
	}
	const handleParentChange = (val: Address) => {
		onParentChange && onParentChange(val)
	}
	
	const renderIcon = () => {
		if (!parent) {
			return <Tooltip>
				<TooltipTrigger>
					<CircleAlert className={'text-red-500 w-6 h-6'}/>
				</TooltipTrigger>
				<TooltipContent>
					Parent is required
				</TooltipContent>
			</Tooltip>
		}
		if (!value || value.length !== 42 || !value.startsWith('0x') || !isAddress(value.toLowerCase())) {
			return <Tooltip>
				<TooltipTrigger>
					<CircleAlert className={'text-red-500 w-6 h-6'}/>
				</TooltipTrigger>
				<TooltipContent>
					Address is invalid
				</TooltipContent>
			</Tooltip>
		}
		if (isMember) {
			return <Tooltip>
				<TooltipTrigger>
					<CircleAlert className={'text-red-500 w-6 h-6'}/>
				</TooltipTrigger>
				<TooltipContent>
					{truncateEthAddress(value || ZeroAddress)} is already a member
				</TooltipContent>
			</Tooltip>
		}
		return <Tooltip>
			<TooltipTrigger>
				<CircleCheck className={'text-green-400 w-6 h-6'}/>
			</TooltipTrigger>
			<TooltipContent>
				Everything is fine
			</TooltipContent>
		</Tooltip>
	}
	
	return <div className={'grid grid-cols-6 md:grid-cols-12 items-center justify-center py-1 gap-2'}>
		<div className={'col-span-4 flex flex-row items-center gap-2 w-full h-full'}>
			<div className={'flex flex-col items-start justify-between w-full'}>
				<span className={'text-xs'}>Parent:</span>
				<MemberInput value={parent} onChange={handleParentChange}/>
			</div>
		</div>
		<div className={'flex flex-col col-span-8 items-baseline  '}>
			<span className={'text-xs'}>Member:</span>
			<div className={'flex flex-row items-center gap-2 w-full'}>
				<Input onChange={handleValueChange} type="text" value={value} className={'w-full'}/>
				<TooltipProvider>
					{renderIcon()}
				</TooltipProvider>
				<Button variant='secondary' className={'bg-transparent p-0 hover:bg-transparent'} onClick={onRemove}>
					<Trash2 className={'h-6 w-6  text-red-500'}/>
				</Button>
			</div>
		</div>
	</div>
}
