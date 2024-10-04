import { Blackjack } from '@betfinio/ui/dist/icons';
import { Button } from 'betfinio_app/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import { ArrowLeft, ArrowRight, Layers3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Legend = () => {
	const { t } = useTranslation('affiliate', { keyPrefix: 'view.tree.legend' });

	return (
		<div className={'flex flex-row items-center gap-2 my-2 flex-wrap'}>
			<TooltipProvider>
				<Button variant={'outline'} className={'gap-2 pointer-events-none'} size={'sm'}>
					<ArrowLeft className={'w-5 h-5'} /> {t('left')}
				</Button>
				<Button variant={'outline'} className={'gap-2 pointer-events-none'} size={'sm'}>
					<ArrowRight className={'w-5 h-5'} /> {t('right')}
				</Button>
				<Button variant={'outline'} className={'gap-2 pointer-events-none'} size={'sm'}>
					<Blackjack className={'w-5 h-5'} /> {t('betting')}
				</Button>
				<Button variant={'outline'} className={'gap-2 pointer-events-none'} size={'sm'}>
					<Layers3 className={'w-5 h-5'} /> {t('staking')}
				</Button>
				<Button variant={'outline'} className={'gap-2 pointer-events-none'} size={'sm'}>
					<div className={'w-5 h-5 flex items-center justify-center rounded-full border border-white'}>D</div>
					{t('direct')}
				</Button>
				<Button variant={'outline'} className={'gap-2 pointer-events-none'} size={'sm'}>
					<div className={'w-5 h-5 flex items-center justify-center rounded-full border border-white'}>B</div>
					{t('binary')}
				</Button>
				<Button variant={'outline'} className={'gap-2 pointer-events-none'} size={'sm'}>
					<div className={'w-5 h-5 flex items-center justify-center rounded-full bg-red-roulette'} />
					{t('directActive')}
				</Button>
				<Button variant={'outline'} className={'gap-2 pointer-events-none'} size={'sm'}>
					<div className={'w-5 h-5 flex items-center justify-center rounded-full bg-yellow-400'} />
					{t('binaryActive')}
				</Button>
				<Tooltip>
					<TooltipTrigger>
						<Button variant={'outline'} className={'gap-2'} size={'sm'}>
							<div className={'w-5 h-5 flex items-center justify-center rounded-full bg-green-400'} />
							{t('active')}
						</Button>
					</TooltipTrigger>
					<TooltipContent>{t('activeTooltip')}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default Legend;
