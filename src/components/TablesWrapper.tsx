import {Tabs, TabsContent, TabsList, TabsTrigger} from "betfinio_app/tabs";
import LinearTable from "@/src/components/network/LinearTable.tsx";

const TablesWrapper = () => {
	return <div className={'mt-4 overflow-x-hidden'}>
		<Tabs defaultValue={'linear'} className={'min-h-[40vh]'}>
			<TabsList>
				<TabsTrigger value={'linear'}>Linear table</TabsTrigger>
				<TabsTrigger value={'linear_tree'}>Linear tree</TabsTrigger>
				<TabsTrigger value={'binary_tree'}>Binary tree</TabsTrigger>
				{/*<TabsTrigger value={'signup'}>Signup list</TabsTrigger>*/}
			</TabsList>
			<TabsContent value={'linear'}>
				<LinearTable/>
			</TabsContent>
			<TabsContent value={'linear_tree'}>
				linear tree
			</TabsContent>
			<TabsContent value={'binary_tree'}>
				binary tree
			</TabsContent>
			<TabsContent value={'signup'}>
				signup list
			</TabsContent>
		</Tabs>
	</div>
}

export default TablesWrapper