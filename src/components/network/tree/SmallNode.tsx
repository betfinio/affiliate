import cx from "clsx";
import {CustomNodeElementProps} from "react-d3-tree";
import {useAccount} from "wagmi";
import {useTreeMember} from "@/src/lib/query";
import {ZeroAddress} from "@betfinio/abi";
import {Address} from "viem";


function SmallNode({data, node}: { data: Address, node: CustomNodeElementProps }) {
	const query = useTreeMember(data);
	const {address = ZeroAddress} = useAccount();
	const handleExpand = (e: any) => {
		e.stopPropagation();
		node.toggleNode();
	}
	if (data === ZeroAddress || !query.data || address === ZeroAddress) return null;
	return (<foreignObject width={'150px'} height={'150px'} x={-75} y={-75}>
			<div onClick={handleExpand} className={cx('w-full h-full rounded-full bg-purple-box flex justify-center items-center p-4', {
				'border-red-roulette bg-red-roulette': query.data?.isInviting,
				'!border-yellow-400 !bg-yellow-400': query.data?.isMatching,
				'!bg-green-500 !border-green-500': (query.data.volume > 0n || query.data.bets > 0n) && !query.data.isInviting,
				
			})}>
				<div className={cx('w-full h-full text-6xl font-bold flex flex-row rounded-full justify-center items-center')}>
					{query.data.count}
				</div>
			</div>
		</foreignObject>
	);
}


export default SmallNode;