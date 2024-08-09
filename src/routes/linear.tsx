import LinearTree from '@/src/components/network/LinearTree.tsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/linear')({
	component: () => (
		<div className={'p-2 md:p-3 lg:p-4'}>
			<LinearTree />
		</div>
	),
});
