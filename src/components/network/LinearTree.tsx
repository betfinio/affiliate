import BigNode from '@/src/components/network/tree/BigNode.tsx';
import DotNode from '@/src/components/network/tree/DotNode.tsx';
import MiddleNode from '@/src/components/network/tree/MiddleNode.tsx';
import SmallNode from '@/src/components/network/tree/SmallNode.tsx';
import { ZeroAddress } from '@betfinio/abi';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'betfinio_app/accordion';
import { useSupabase } from 'betfinio_app/supabase';
import { TooltipProvider } from 'betfinio_app/tooltip';
import cx from 'clsx';
import { Expand, LocateFixed, Shrink } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Tree, { type CustomNodeElementProps, type Point, type RawNodeDatum, type TreeNodeDatum } from 'react-d3-tree';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import Legend from './Legend';

const LinearTree = () => {
	const { t } = useTranslation('affiliate', { keyPrefix: 'view.tree' });
	const handle = useFullScreenHandle();
	const [members, setMembers] = useState<Record<Address, Address[] | undefined>>({});
	const { address: me = ZeroAddress } = useAccount();
	const address = me.toLowerCase() as Address;
	const { client } = useSupabase();
	const [zoom, setZoom] = useState(1);
	const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });

	useEffect(() => {
		if (address) setMembers({ [address]: undefined });
		else setMembers({});
	}, [address]);

	const boxRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		centerTranslate();
		if (window.innerWidth < 800) setZoom(0.8);
	}, [boxRef]);

	const centerTranslate = useCallback(() => {
		setTranslate({ x: (boxRef.current?.clientWidth || 0) / 2, y: 500 });
	}, [boxRef.current]);

	const transform = (member: Address, m: Address[] | undefined): RawNodeDatum => {
		if (address === ZeroAddress) return { name: 'Loading...' };
		if (m === undefined) return { name: member };
		return {
			name: member,
			children: m.map((e) => transform(e, members[e])),
		};
	};
	const data = useMemo(() => {
		return transform(address, members[address] || []);
	}, [members, address]);

	const expand = async (member: string) => {
		if (!client) return;
		const { data } = await client.from('members').select('member').eq('inviter', member.toLowerCase());
		const childrenData = data?.map((e) => e.member.toLowerCase()) || [];
		setMembers((mem) => ({ ...mem, [member.toLowerCase()]: childrenData, ...Object.fromEntries(childrenData.map((key) => [key, undefined])) }));
	};

	const getNodeSize = () => {
		return { x: 350, y: 200 };
	};
	const renderElement = (node: CustomNodeElementProps) => {
		const addr = node.nodeDatum.name.toLowerCase() as Address;
		if (zoom > 0.7) {
			if (addr !== address) return <MiddleNode data={addr} node={node} horizontal />;
			return <BigNode data={addr} node={node} horizontal />;
		}
		if (zoom > 0.5) {
			return <MiddleNode data={addr} node={node} horizontal />;
		}
		if (zoom > 0.2) {
			return <SmallNode data={addr} node={node} />;
		}
		return <DotNode data={addr} node={node} />;
	};

	let timeout: NodeJS.Timeout | undefined = undefined;

	const handleUpdate = (data: {
		node: TreeNodeDatum | null;
		zoom: number;
		translate: Point;
	}) => {
		if (data.node) {
			if (members[data.node.name as Address] === undefined) expand(data.node.name).then(undefined);
		}
		if (data.translate.x === translate.x && data.translate.y === translate.y && data.zoom === zoom) return;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			setTranslate(data.translate);
			setZoom(data.zoom);
		}, 500);
	};
	const [isFullScreen, setIsFullScreen] = useState(false);

	const zoomPlus = () => {
		setZoom(zoom + 0.1);
	};

	const zoomMinus = () => {
		setZoom(zoom - 0.1);
	};

	return (
		<div>
			<TooltipProvider>
				<Accordion type="single" collapsible>
					<AccordionItem value="item-1">
						<AccordionTrigger>Tree Legend</AccordionTrigger>
						<AccordionContent>
							<div>
								<div className={'text-center text-xs font-semibold text-gray-500 italic px-5 flex flex-col'}>
									<span>{t('description.overview')}</span>
									<span>{t('description.matching')}</span>
									<span>{t('description.tree')}</span>
								</div>
								<Legend />
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<div className={' border border-gray-800 rounded-md mt-2 md:mt-3 lg:mt-4 h-[80vh] relative'} ref={boxRef}>
					<div className={cx('absolute top-2 left-2 border border-gray-800 flex flex-row flex-nowrap rounded-xl bg-primaryLighter w-[100px] h-[50px]')}>
						<div className={'w-[50px] h-[50px] text-xl flex border-r border-gray-800 items-center justify-center cursor-pointer'} onClick={zoomPlus}>
							+
						</div>
						<div className={'w-[50px] h-[45px] text-xl flex items-center justify-center cursor-pointer'} onClick={zoomMinus}>
							-
						</div>
					</div>
					<div className={'absolute top-2 right-2 flex items-center gap-2'}>
						<div
							onClick={() => centerTranslate()}
							className="border cursor-pointer bg-primaryLighter border-gray-800 flex flex-row items-center justify-center flex-nowrap rounded-xl w-[50px] h-[50px]"
						>
							<LocateFixed className={'w-6 h-6'} />
						</div>
						<div
							onClick={() => setIsFullScreen(true)}
							className="border cursor-pointer bg-primaryLighter border-gray-800 flex flex-row items-center justify-center flex-nowrap rounded-xl w-[50px] h-[50px]"
						>
							<Expand className={'w-6 h-6'} />
						</div>
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

									<div className={'fixed top-2 right-2 flex items-center gap-2'}>
										<div
											onClick={() => centerTranslate()}
											className="border cursor-pointer bg-primaryLighter border-gray-800 flex flex-row items-center justify-center flex-nowrap rounded-xl w-[50px] h-[50px]"
										>
											<LocateFixed className={'w-6 h-6'} />
										</div>
										<div
											onClick={() => setIsFullScreen(false)}
											className="border cursor-pointer bg-primaryLighter border-gray-800 flex flex-row items-center justify-center flex-nowrap rounded-xl w-[50px] h-[50px]"
										>
											<Shrink className={'w-6 h-6'} />
										</div>
									</div>
								</div>
								<Tree
									data={data}
									onUpdate={handleUpdate}
									pathFunc={'step'}
									nodeSize={getNodeSize()}
									zoomable={true}
									collapsible={true}
									translate={translate}
									zoom={zoom}
									pathClassFunc={() => '!stroke-purple-box stroke-2'}
									renderCustomNodeElement={renderElement}
									orientation={'horizontal'}
								/>
							</>
						}
					</div>
					<Tree
						data={data}
						onUpdate={handleUpdate}
						pathFunc={'step'}
						nodeSize={getNodeSize()}
						zoomable={true}
						collapsible={true}
						translate={translate}
						zoom={zoom}
						pathClassFunc={() => '!stroke-purple-box stroke-2'}
						renderCustomNodeElement={renderElement}
						orientation={'horizontal'}
					/>
				</div>
			</TooltipProvider>
		</div>
	);
};

export default LinearTree;
