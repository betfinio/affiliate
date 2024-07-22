import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/linear')({
	component: () => <div>Hello /linear!</div>
})