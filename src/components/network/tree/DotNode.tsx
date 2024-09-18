import { useTreeMember } from '@/src/lib/query';
import { ZeroAddress } from '@betfinio/abi';
import cx from 'clsx';
import type { MouseEvent } from 'react';
import type { CustomNodeElementProps } from 'react-d3-tree';
import type { Address } from 'viem';

function DotNode({
	data,
	node,
	handleCollapseNode,
	isExpanded,
	handleExpand,
}: { data: Address; node: CustomNodeElementProps; handleCollapseNode: (address: Address) => void; isExpanded: boolean; handleExpand: () => void }) {
	const query = useTreeMember(data);
	const handleNodeExpand = (e: MouseEvent) => {
		e.stopPropagation();

		isExpanded ? handleCollapseNode(data) : handleExpand();
	};
	if (data === ZeroAddress || !query.data) return null;
	return (
		<foreignObject width={50} height={50} x={-25} y={-25}>
			<div
				onClick={handleNodeExpand}
				className={cx('w-full h-full border-2 border-purple-box rounded-full bg-purple-box flex justify-center items-center p-4', {
					'border-red-roulette bg-red-roulette': query.data.isInviting,
					'!border-yellow-400 bg-yellow-400': query.data.isMatching,
					'!bg-green-500 !border-green-500': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
				})}
			/>
		</foreignObject>
	);
}

export default DotNode;
