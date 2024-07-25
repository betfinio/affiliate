import {Tabs, TabsContent, TabsList, TabsTrigger} from "betfinio_app/tabs";
import LinearTable from "@/src/components/network/LinearTable.tsx";
import {Link} from "@tanstack/react-router";

const TablesWrapper = () => {
	return <div className={'mt-4 overflow-x-hidden'}>
		<Tabs defaultValue={'linear'} className={'min-h-[40vh]'}>
			<TabsList>
				<TabsTrigger value={'linear'}>Linear table</TabsTrigger>
				<Link to={'/linear'}
				      className={'inline-flex items-center justify-center border border-gray-400  whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 '}>
					Linear tree
				</Link>
				<Link to={'/binary'}
				      className={'inline-flex items-center justify-center border border-gray-400  whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 '}>
					Binary tree
				</Link>
				{/*<TabsTrigger value={'signup'}>Signup list</TabsTrigger>*/}
			</TabsList>
			<TabsContent value={'linear'}>
				<LinearTable/>
			</TabsContent>
		</Tabs>
	</div>
}

export default TablesWrapper