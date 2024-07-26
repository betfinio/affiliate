import {createFileRoute} from '@tanstack/react-router'
import LinearTree from "@/src/components/network/LinearTree.tsx";

export const Route = createFileRoute('/linear')({
	component: () => <div className={'p-2 md:p-3 lg:p-4'}>
		<LinearTree/>
	</div>
})