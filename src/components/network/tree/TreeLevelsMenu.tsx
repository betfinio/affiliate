import type { DropdownMenuRadioGroupProps } from '@radix-ui/react-dropdown-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from 'betfinio_app/dropdown-menu';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';

export type TreeOptionValue = 'left' | 'right' | '1' | '5' | '10' | 'strong' | 'weak';
interface ITreeOption {
	value: TreeOptionValue;
}
const treeOptions: ITreeOption[] = [
	{
		value: 'strong',
	},
	{
		value: 'weak',
	},
	{
		value: 'left',
	},
	{
		value: 'right',
	},
	{
		value: '1',
	},
	{
		value: '5',
	},
	{
		value: '10',
	},
];

interface ITreeLevelsMenuProps {
	onLevelSelect: (value: TreeOptionValue, address: Address) => void;
	address: Address;
}
export const TreeLevelsMenu: FC<ITreeLevelsMenuProps> = ({ onLevelSelect, address }) => {
	const [position, setPosition] = useState<string>();
	const handleSetPosition: DropdownMenuRadioGroupProps['onValueChange'] = (value) => {
		setPosition(value);
		onLevelSelect(value as TreeOptionValue, address);
	};
	const { t } = useTranslation('affiliate', { keyPrefix: 'view.tree.expand' });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={'w-full h-full flex items-center justify-center'}>+</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup onClick={(e) => e.stopPropagation()} value={position} onValueChange={handleSetPosition}>
					{treeOptions.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value}>
							{t(option.value)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
