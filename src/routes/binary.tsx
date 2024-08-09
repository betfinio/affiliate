import BinaryTree from '@/src/components/network/BinaryTree.tsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/binary')({
	component: () => (
		<div className={'p-2 md:p-3 lg:p-4'}>
			<BinaryTree />
		</div>
	),
});
