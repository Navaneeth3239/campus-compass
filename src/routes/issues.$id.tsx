import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/issues/$id')({
  component: () => <div className="p-12 text-center text-xl">Coming Soon</div>
})
