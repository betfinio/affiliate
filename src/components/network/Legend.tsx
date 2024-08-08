import {Button} from "betfinio_app/button";
import {ArrowLeft, ArrowRight, Layers3} from "lucide-react";
import {Blackjack} from "@betfinio/ui/dist/icons";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "betfinio_app/tooltip";

const Legend = () => {
	return <div className={'flex flex-row items-center gap-2 my-2 flex-wrap'}>
		<TooltipProvider>
			<Button variant={'outline'} className={'gap-2'} size={'sm'}>
				<ArrowLeft className={'w-5 h-5'}/> Left
			</Button>
			<Button variant={'outline'} className={'gap-2'} size={'sm'}>
				<ArrowRight className={'w-5 h-5'}/> Right
			</Button>
			<Button variant={'outline'} className={'gap-2'} size={'sm'}>
				<Blackjack className={'w-5 h-5'}/> Betting
			</Button>
			<Button variant={'outline'} className={'gap-2'} size={'sm'}>
				<Layers3 className={'w-5 h-5'}/> Staking
			</Button>
			<Button variant={'outline'} className={'gap-2'} size={'sm'}>
				<div className={'w-5 h-5 flex items-center justify-center rounded-full border border-white'}>D</div>
				Direct
			</Button>
			<Button variant={'outline'} className={'gap-2'} size={'sm'}>
				<div className={'w-5 h-5 flex items-center justify-center rounded-full border border-white'}>B</div>
				Binary
			</Button>
			<Button variant={'outline'} className={'gap-2'} size={'sm'}>
				<div className={'w-5 h-5 flex items-center justify-center rounded-full bg-red-roulette'}></div>
				Direct active
			</Button>
			<Button variant={'outline'} className={'gap-2'} size={'sm'}>
				<div className={'w-5 h-5 flex items-center justify-center rounded-full bg-yellow-400'}></div>
				Binary active
			</Button>
			<Tooltip>
				<TooltipTrigger>
					<Button variant={'outline'} className={'gap-2'} size={'sm'}>
						<div className={'w-5 h-5 flex items-center justify-center rounded-full bg-green-400'}></div>
						Active
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					Active, not eligible to invite
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>
}

export default Legend