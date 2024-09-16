import BinaryTree from '@/src/components/network/BinaryTree.tsx';
import LinearTable from '@/src/components/network/LinearTable.tsx';
import LinearTree from '@/src/components/network/LinearTree.tsx';
import {Tabs, TabsContent, TabsList, TabsTrigger} from 'betfinio_app/tabs';

const TablesWrapper = () => {
	return (
		<div className={'mt-4 overflow-x-hidden max-w-[98vw] w-full'}>
			<Tabs defaultValue={'linear_table'} className={'min-h-[40vh]'}>
				<TabsList>
					<TabsTrigger value={'linear_table'}>Linear table</TabsTrigger>
					<TabsTrigger value={'linear_tree'}>Linear tree</TabsTrigger>
					<TabsTrigger value={'binary_tree'}>Binary tree</TabsTrigger>
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
			</Tabs>
		</div>
	);
};

export default TablesWrapper;
