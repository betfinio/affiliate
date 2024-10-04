import BinaryTree from '@/src/components/network/BinaryTree.tsx';
import LinearTree from '@/src/components/network/LinearTree.tsx';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger } from 'betfinio_app/tabs';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/binary')({
	component: () => {
		const { t } = useTranslation('affiliate', { keyPrefix: 'view.tree' });
		return (
			<div className={'p-2 md:p-3 lg:p-4'}>
				<Tabs defaultValue={'binary'}>
					<TabsList>
						<TabsTrigger value={'linear'}>
							<Link to={'/affiliate/linear'}>{t('linear')}</Link>
						</TabsTrigger>
						<TabsTrigger value={'binary'}>{t('binary')}</TabsTrigger>
					</TabsList>
				</Tabs>

				<BinaryTree />
			</div>
		);
	},
});
