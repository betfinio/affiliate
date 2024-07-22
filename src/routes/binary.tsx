import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/binary')({
  component: () => <div>Hello /binary!</div>
})