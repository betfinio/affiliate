import BinaryTable from '@/src/components/network/BinaryTable.tsx';
import BinaryTree from '@/src/components/network/BinaryTree.tsx';
import LinearTable from '@/src/components/network/LinearTable.tsx';
import LinearTree from '@/src/components/network/LinearTree.tsx';
import { Affiliate } from '@betfinio/ui/dist/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'betfinio_app/tabs';
import { GitCommitVertical, GitFork, Grid2x2CheckIcon, MergeIcon, Network, WorkflowIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TablesWrapper = () => {
	const { t } = useTranslation('affiliate', { keyPrefix: 'view.tabs' });
	return (
		<div className={'mt-4 overflow-x-hidden max-w-[98vw] w-full'}>
			<Tabs defaultValue={'linear_table'} className={'min-h-[40vh]'}>
				<TabsList>
					<TabsTrigger value={'linear_table'} className="flex flex-row items-center gap-2">
						<Affiliate className={'w-4 h-4'} />
						{t('linearTable')}
					</TabsTrigger>
					<TabsTrigger value={'binary_table'} className="flex flex-row items-center gap-2">
						<Grid2x2CheckIcon className="w-4 h-4" />
						{t('binaryTable')}
					</TabsTrigger>
					<TabsTrigger value={'linear_tree'} className="flex flex-row items-center gap-2">
						<WorkflowIcon className="w-4 h-4" />
						{t('linearTree')}
					</TabsTrigger>
					<TabsTrigger value={'binary_tree'} className="flex flex-row items-center gap-2">
						<Network className="w-4 h-4" />
						{t('binaryTree')}
					</TabsTrigger>
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
