import {Tabs, TabsContent, TabsList, TabsTrigger} from "betfinio_app/tabs";
import LinearTable from "@/src/components/network/LinearTable.tsx";
import {Link} from "@tanstack/react-router";
import LinearTree from "@/src/components/network/LinearTree.tsx";
import BinaryTree from "@/src/components/network/BinaryTree.tsx";

const TablesWrapper = () => {
	return <div className={'mt-4 overflow-x-hidden'}>
		<Tabs defaultValue={'linear_tree'} className={'min-h-[40vh]'}>
			<TabsList>
				<TabsTrigger value={'linear'}>Linear table</TabsTrigger>
				<TabsTrigger value={'linear_tree'}>Linear tree</TabsTrigger>
				<TabsTrigger value={'binary_tree'}>Binary tree</TabsTrigger>
			</TabsList>
			<TabsContent value={'linear'}>
				<LinearTable/>
			</TabsContent>
			<TabsContent value={'linear_tree'}>
				<LinearTree/>
			</TabsContent>
			<TabsContent value={'binary_tree'}>
				<BinaryTree/>
			</TabsContent>
		</Tabs>
	</div>
}

export default TablesWrapper