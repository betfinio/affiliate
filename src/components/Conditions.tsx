import {Bonus, Check, Letter, Staking, Warning} from "@betfinio/ui/dist/icons";
import cx from "clsx";
import {useAccount} from "wagmi";
import {valueToNumber} from "@betfinio/hooks/dist/utils";
import {AnimatePresence, motion} from "framer-motion";
import {Lock, LockOpen} from "lucide-react";
import {ZeroAddress} from "@betfinio/abi";
import {useAffiliateConditions, useMember} from "@/src/lib/query";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "betfinio_app/tooltip";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "betfinio_app/tabs";
import {BetValue} from "betfinio_app/BetValue";


function Conditions() {
	const {address = ZeroAddress} = useAccount();
	const {data: member} = useMember(address);
	const {data: conditions = []} = useAffiliateConditions();
	const stakedInviting: boolean = member ? member.volume.member >= conditions[0] : false;
	const stakedMatching: boolean = member ? member.volume.member >= conditions[1] : false;
	const stakedInvitees: boolean = member ? member.is.matching : false;
	
	return <div>
		<p className={'text-center text-[18px] font-semibold'}>
			Affiliate conditions overview
		</p>
		<TooltipProvider>
			<Tabs className="mt-5" defaultValue="tab1">
				<TabsList className={'flex text-sm gap-2'}>
					<TabsTrigger value="tab1" className={'flex flex-roe items-center gap-1'}>
						<Lock width={16}/> Direct affiliate
					</TabsTrigger>
					<TabsTrigger className={'flex flex-roe items-center gap-1'} value="tab2">
						<LockOpen width={16}/> Binary matching
					</TabsTrigger>
				</TabsList>
				
				<div className={'p-3 mt-2 border border-gray-800 md:p-5 h-[200px]  py-3 xl:px-10 bg-primaryLighter shadow-2xl rounded-md w-full transition-all duration-300'}>
					<AnimatePresence>
						<TabsContent value="tab1">
							<motion.div initial={{opacity: 0,}}
							            animate={{opacity: 1,}}
							            exit={{opacity: 0,}} key={'tab1'} className={'flex flex-col gap-8 text-sm'}>
								
								<div className={'grid grid-cols-2'}>
									<div className={'flex items-center gap-2'}>
										<Letter className={'text-yellow-400'}/>
										<span>Conditions</span>
									</div>
									
									<div className={' flex items-center gap-2 text-sm whitespace-nowrap'}>
										<Check className={cx('w-6 h-6 bg-secondaryLight p-1 rounded-md text-secondaryLight', stakedInviting && '!text-green-500')}/>
										Stake for <BetValue className={'text-sm'} value={valueToNumber(conditions[0])} withIcon/>
									</div>
								</div>
								
								<div className={'grid grid-cols-2'}>
									<div className={'flex items-center gap-2'}>
										<Bonus className={'text-yellow-400'}/>
										<span>Bonus</span>
									</div>
									<div className={'flex flex-col text-sm text-[#FFC800] '}>
										<span>7% direct stake</span>
										<span>0.5% direct bet</span>
									</div>
								</div>
								
								<div className={'grid grid-cols-2'}>
									<div className={'flex items-center gap-2'}>
										<Warning className={'text-yellow-400'}/>
										<span>Limitations</span>
									</div>
									<div className={'font-semibold text-left text-sm'}>
										No limit!
									</div>
								</div>
							
							
							</motion.div>
						</TabsContent>
					</AnimatePresence>
					<AnimatePresence mode={'wait'}>
						<TabsContent value="tab2">
							
							<motion.div initial={{opacity: 0}}
							            animate={{opacity: 1}}
							            exit={{opacity: 0}} key={'tab2'} className={'flex flex-col gap-4 text-sm'}>
								<Tooltip>
									<div className={'grid grid-cols-2'}>
										<div className={'flex items-center gap-2'}>
											<Letter className={'text-yellow-400'}/>
											<span>Conditions</span>
										</div>
										
										<div className={'flex flex-col gap-1 text-base'}>
											<div className={'flex flex-row items-center gap-1'}>
												<Check
													className={cx('w-6 h-6 bg-secondaryLight p-1 rounded-md text-secondaryLight', stakedMatching && '!text-green-500')}/>
												Stake for <BetValue value={valueToNumber(conditions[1])} withIcon/>
											</div>
											<div className={'flex flex-row items-center gap-1 mt-2'}>
												<Check
													className={cx('w-6 h-6 bg-secondaryLight p-1 rounded-md text-secondaryLight', stakedInvitees && '!text-green-500')}/>
												<div className={'flex gap-2 items-center'}>
													Invite 2 users
													<TooltipTrigger>
														<span
															className={' border-2 text-[#FFC800] border-[#FFC800] font-bold text-xs w-[18px] h-[18px] flex items-center justify-center rounded-full'}>?</span>
													</TooltipTrigger>
												
												</div>
											</div>
										</div>
									</div>
									<TooltipContent className={cx('text-white border-2 border-[#FFC800] bg-transparent')}>
										<div className={'px-8 py-5 text-xs bg-black bg-opacity-75'}>
											<p className={'font-bold'}>
												Both of your invitees should stake for at least {valueToNumber(conditions[2])} BET each
											</p>
										
										</div>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<div className={'grid grid-cols-2'}>
										<div className={'flex items-center gap-2'}>
											<Bonus className={'text-yellow-400'}/>
											<span>Bonus</span>
										</div>
										<div className={'flex flex-col text-sm items-start'}>
											<span className={'text-[#FFC800]'}>8% weak leg volume*</span>
											<span className={'text-gray-500 text-xs whitespace-nowrap'}>* 100% stakes + 1% bets</span>
										</div>
									</div>
									
									<div className={'grid grid-cols-2'}>
										<div className={'flex items-center gap-2'}>
											<Warning className={'text-yellow-400'}/>
											<span>Limitations</span>
										</div>
										<div className={'font-semibold text-sm flex gap-1 whitespace-nowrap'}>
											12k$ <span className={'text-gray-500'}>or</span>
											<TooltipTrigger>
												<div className={'flex gap-1 items-start'}>10% <Staking
													className={'w-4 -translate-y-1 text-yellow-400 cursor-pointer'}/></div>
											</TooltipTrigger>
											/ day
										</div>
									</div>
									<TooltipContent
										className={cx('z-50 border-2 border-[#FFC800] bg-transparent text-white')}>
										<div className={'px-8 py-5 text-xs bg-black bg-opacity-75'}>
											<p className={'font-bold italic'}>
												Sum of conservative + dynamic staking
											</p>
										</div>
									</TooltipContent>
								</Tooltip>
							</motion.div>
						</TabsContent>
					</AnimatePresence>
				</div>
			</Tabs>
		</TooltipProvider>
	
	
	</div>
}

export default Conditions;