import BigNode from '@/src/components/network/tree/BigNode';
import DotNode from '@/src/components/network/tree/DotNode';
import MiddleNode from '@/src/components/network/tree/MiddleNode';
import SmallNode from '@/src/components/network/tree/SmallNode';
import { ZeroAddress } from '@betfinio/abi';
import { useQueryClient } from '@tanstack/react-query';
import { useSupabase } from 'betfinio_app/supabase';
import cx from 'clsx';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Tree, { type TreeNodeDatum, type CustomNodeElementProps, type Point, type RawNodeDatum, type TreeLinkDatum } from 'react-d3-tree';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import Legend from './Legend';
import type { TreeOptionValue } from './tree/TreeLevelsMenu';

interface TreeMember {
	id: string;
	member: string;
	isInviting?: boolean;
	isMatching?: boolean;
	volume?: bigint;
	bets?: bigint;
}

type MembersState = Record<Address, Address[] | undefined>;
const BinaryTree: React.FC = () => {
	const handle = useFullScreenHandle();
	const [members, setMembers] = useState<MembersState>({});
	const { address: me = ZeroAddress } = useAccount();
	const address = me.toLowerCase() as Address;
	const { client } = useSupabase();
	const [zoom, setZoom] = useState<number>(1);
	const [translate, setTranslate] = useState<Point>({ x: 0, y: 500 });
	const [level] = useState<number>(1);
	const queryClient = useQueryClient();
	const [isFullScreen, setIsFullScreen] = useState(false);

	useEffect(() => {
		if (address) setMembers({ [address]: undefined });
		else setMembers({});
	}, [address]);

	const boxRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		setTranslate({ x: (boxRef.current?.clientWidth || 0) / 2, y: 500 });
		if (window.innerWidth < 800) setZoom(0.8);
	}, [boxRef]);

	const transform = (member: Address, m: Address[] | undefined): RawNodeDatum => {
		if (address === ZeroAddress) return { name: 'Loading...' };
		const l = m ? m[0] : ZeroAddress;
		const r = m ? m[1] : ZeroAddress;
		const left = members[l] || [];
		const right = members[r] || [];
		const children: RawNodeDatum[] = [];
		if (l) children.push(transform(l, left));
		if (r) children.push(transform(r, right));
		return { name: member, children: children };
	};

	const data = useMemo<RawNodeDatum>(() => {
		return transform(address, members[address] || []);
	}, [members, address]);

	const getNodeSize = (): { x: number; y: number } => {
		return { x: 300, y: 200 };
	};

	const getLevelChildren = async (member: Address) => {
		if (!client) return;
		const doc = await client.from('tree').select('id::text').eq('member', member.toLowerCase()).single<{ id: string }>();
		if (!doc.data) return;
		const id = BigInt(doc.data.id);
		const l = id * 2n + 1n;
		const r = id * 2n + 2n;

		const left = await client.from('tree').select('member').eq('id', l.toString()).single<{ member: string }>();
		const right = await client.from('tree').select('member').eq('id', r.toString()).single<{ member: string }>();

		return { left, right };
	};

	const expand = async (member: Address, lvl: number, direction: 'left' | 'right' | 'all' = 'all'): Promise<void> => {
		if (!client || lvl <= 0) return;

		const children = await getLevelChildren(member);
		if (!children) return;
		const { left, right } = children;
		const childrenData: Address[] = [];
		if (left.data) childrenData.push(left.data.member as Address);
		if (right.data) childrenData.push(right.data.member as Address);
		else if (left.data !== null) {
			childrenData.push(ZeroAddress as Address);
		}
		setMembers((mem) => ({
			...mem,
			[member.toLowerCase()]: childrenData,
			...Object.fromEntries(childrenData.map((key) => [key, undefined])),
		}));

		// for (const child of childrenData) {
		// 	if (child === ZeroAddress) continue;
		// 	 expand(child, lvl - 1);
		// }

		if (direction === 'left' || direction === 'all') {
			left.data?.member && expand(left.data.member as Address, lvl - 1, direction);
		}
		if (direction === 'right' || direction === 'all') {
			right.data?.member && expand(right.data.member as Address, lvl - 1, direction);
		}
	};

	const handleCollapseNode = (address: Address) => {
		console.log('[affilate]', address, 'address');

		const next = { ...members };
		delete next[address];
		setMembers(next);

		console.log('[affilate]', next, 'members');
	};

	const handleLevelSelect = (value: TreeOptionValue, address: Address) => {
		switch (value) {
			case 'left':
			case 'right':
				expand(address, 1000, value);
				return;
			case '1':
			case '5':
			case '10':
				expand(address, +value);
				return;
		}
	};

	const renderElement = (node: CustomNodeElementProps): JSX.Element => {
		const addr = node.nodeDatum.name.toLowerCase() as Address;

		if (zoom > 0.7) {
			if (addr !== address)
				return (
					<MiddleNode
						onLevelSelect={handleLevelSelect}
						showLevelSelect={false}
						isExpanded={!!members[addr]}
						data={addr}
						node={node}
						handleCollapseNode={handleCollapseNode}
					/>
				);
			return <BigNode isExpanded={!!members[addr]} data={addr} node={node} handleCollapseNode={handleCollapseNode} onLevelSelect={handleLevelSelect} />;
		}
		if (zoom > 0.5) {
			return (
				<MiddleNode
					data={addr}
					node={node}
					isExpanded={!!members[addr]}
					showLevelSelect={addr === address}
					onLevelSelect={handleLevelSelect}
					handleCollapseNode={handleCollapseNode}
				/>
			);
		}
		if (zoom > 0.2) {
			return (
				<SmallNode
					isExpanded={!!members[addr]}
					handleCollapseNode={handleCollapseNode}
					handleExpand={() => handleLevelSelect('1', addr)}
					data={addr}
					node={node}
				/>
			);
		}
		return (
			<DotNode data={addr} node={node} isExpanded={!!members[addr]} handleCollapseNode={handleCollapseNode} handleExpand={() => handleLevelSelect('1', addr)} />
		);
	};

	let t: NodeJS.Timeout | undefined = undefined;

	const handleUpdate = (data: { node: TreeNodeDatum | null; zoom: number; translate: Point }): void => {
		if (data.node) {
			if (members[data.node.name as Address] === undefined) expand(data.node.name as Address, level).then(undefined);
		}
		if (data.translate.x === translate.x && data.translate.y === translate.y && data.zoom === zoom) return;
		clearTimeout(t);
		t = setTimeout(() => {
			setTranslate(data.translate);
			setZoom(data.zoom);
		}, 500);
	};

	const getPathStyle = (linkData: TreeLinkDatum): string => {
		const source = linkData.source.data.name as Address;
		const target = linkData.target.data.name as Address;
		const data = queryClient.getQueryData<TreeMember>(['affiliate', 'members', 'tree', 'member', source]);

		return cx('stroke-2 stroke-purple-box', {
			'[stroke-dasharray:5] !stroke-opacity-70': target === ZeroAddress,
			'!stroke-0': target === ZeroAddress && zoom <= 0.5,
			'!stroke-red-roulette': data?.isInviting,
			'!stroke-yellow-400': data?.isMatching,
			'!stroke-green-500': (data?.volume ?? 0n) > 0n || ((data?.bets ?? 0n) > 0n && !data?.isInviting),
		});
	};

	const zoomPlus = (): void => {
		setZoom(zoom + 0.1);
	};

	const zoomMinus = (): void => {
		setZoom(zoom - 0.1);
	};

	return (
		<div>
			<div className="text-center text-xs font-semibold text-gray-500 italic px-5">
				Linear and binary view are two ways of displaying the same structure. <br />
				The only important for your matching bonus is binary tree. <br />s However, linear tree helps you to better recognize active inviters in your structure.
			</div>

			<Legend />
			<div className="border border-gray-800 rounded-md mt-2 md:mt-3 lg:mt-4 h-[80vh] relative" ref={boxRef}>
				<div className="absolute top-2 left-2 border border-gray-800 flex flex-row flex-nowrap rounded-xl bg-primaryLighter w-[100px] h-[50px]">
					<div className="w-[50px] h-[50px] text-xl flex border-r border-gray-800 items-center justify-center cursor-pointer" onClick={zoomPlus}>
						+
					</div>
					<div className="w-[50px] h-[45px] text-xl flex items-center justify-center cursor-pointer" onClick={zoomMinus}>
						-
					</div>
				</div>
				<div
					onClick={() => setIsFullScreen(true)}
					className="absolute top-2 right-2 border cursor-pointer bg-primaryLighter border-gray-800 flex flex-row items-center justify-center flex-nowrap rounded-xl w-[50px] h-[50px]"
				>
					⤢
				</div>
				<div className={cx('fixed  z-50 inset-0 bg-primaryLighter', { hidden: !isFullScreen })}>
					{
						<>
							<div className={cx('absolute top-2 left-2 border border-gray-800 flex flex-row flex-nowrap rounded-xl w-[100px] h-[50px] z-10')}>
								<div className={'w-[50px] h-[50px] text-xl flex border-r border-gray-800 items-center justify-center cursor-pointer'} onClick={zoomPlus}>
									+
								</div>
								<div className={'w-[50px] h-[45px] text-xl flex items-center justify-center cursor-pointer'} onClick={zoomMinus}>
									-
								</div>
								<div
									onClick={() => setIsFullScreen(false)}
									className="fixed top-2 right-2 border cursor-pointer bg-primaryLighter border-gray-800 flex flex-row items-center justify-center flex-nowrap rounded-xl w-[50px] h-[50px]"
								>
									⤢
								</div>
							</div>
							<Tree
								data={data}
								onUpdate={handleUpdate}
								pathFunc={'straight'}
								nodeSize={getNodeSize()}
								zoomable={true}
								collapsible={true}
								translate={translate}
								zoom={zoom}
								pathClassFunc={getPathStyle}
								renderCustomNodeElement={renderElement}
								orientation={'vertical'}
							/>
						</>
					}
				</div>
				<Tree
					data={data}
					onUpdate={handleUpdate}
					pathFunc={'straight'}
					nodeSize={getNodeSize()}
					zoomable={true}
					collapsible={true}
					translate={translate}
					zoom={zoom}
					pathClassFunc={getPathStyle}
					renderCustomNodeElement={renderElement}
					orientation={'vertical'}
				/>
			</div>
		</div>
	);
};

export default BinaryTree;
