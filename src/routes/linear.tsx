import LinearTree from '@/src/components/network/LinearTree.tsx';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger } from 'betfinio_app/tabs';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/linear')({
	component: () => {
		const { t } = useTranslation('affiliate', { keyPrefix: 'view.tree' });
		return (
			<div className={'p-2 md:p-3 lg:p-4'}>
				<Tabs defaultValue={'linear'}>
					<TabsList>
						<TabsTrigger value={'linear'}>{t('linear')}</TabsTrigger>
						<TabsTrigger value={'binary'}>
							<Link to={'/affiliate/binary'}>{t('binary')}</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<LinearTree />
			</div>
		);
	},
});
