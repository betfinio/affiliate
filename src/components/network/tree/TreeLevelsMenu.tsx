import type { DropdownMenuRadioGroupProps } from '@radix-ui/react-dropdown-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from 'betfinio_app/dropdown-menu';
import { useState } from 'react';

export type TreeOptionValue = 'left' | 'right' | '1' | '5' | '10';
interface ITreeOption {
	value: TreeOptionValue;
	label: string;
}
const treeOptions: ITreeOption[] = [
	{
		value: 'left',
		label: 'Expand Left',
	},
	{
		value: 'right',
		label: 'Expand Right',
	},
	{
		value: '1',
		label: 'Expand 1',
	},
	{
		value: '5',
		label: 'Expand 5',
	},
	{
		value: '10',
		label: 'Expand 10',
	},
];

interface ITreeLevelsMenuProps {
	onLevelSelect: (value: TreeOptionValue) => void;
}
export const TreeLevelsMenu: React.FC<ITreeLevelsMenuProps> = ({ onLevelSelect }) => {
	const [position, setPosition] = useState<string>();
	const handleSetPosition: DropdownMenuRadioGroupProps['onValueChange'] = (value) => {
		setPosition(value);
		onLevelSelect(value as TreeOptionValue);
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>+</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup onClick={(e) => e.stopPropagation()} value={position} onValueChange={handleSetPosition}>
					{treeOptions.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value}>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
