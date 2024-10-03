import BinaryTable from '@/src/components/network/BinaryTable.tsx';
import BinaryTree from '@/src/components/network/BinaryTree.tsx';
import LinearTable from '@/src/components/network/LinearTable.tsx';
import LinearTree from '@/src/components/network/LinearTree.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'betfinio_app/tabs';
import { useTranslation } from 'react-i18next';

const TablesWrapper = () => {
	const { t } = useTranslation('affiliate', { keyPrefix: 'view.tabs' });
	return (
		<div className={'mt-4 overflow-x-hidden max-w-[98vw] w-full'}>
			<Tabs defaultValue={'linear_table'} className={'min-h-[40vh]'}>
				<TabsList>
					<TabsTrigger value={'linear_table'}>{t('linearTable')}</TabsTrigger>
					<TabsTrigger value={'linear_tree'}>{t('linearTree')}</TabsTrigger>
					<TabsTrigger value={'binary_tree'}>{t('binaryTree')}</TabsTrigger>
					<TabsTrigger value={'binary_table'}>{t('binaryTable')}</TabsTrigger>
				</TabsList>
				<TabsContent value={'linear_table'}>
					<LinearTable />
				</TabsContent>
				<TabsContent value={'linear_tree'}>
					<LinearTree />
				</TabsContent>
				<TabsContent value={'binary_tree'}>
					<BinaryTree />
				</TabsContent>
				<TabsContent value={'binary_table'}>
					<BinaryTable />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default TablesWrapper;
