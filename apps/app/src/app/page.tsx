import { AppLayout } from "~/components/app-layout"
import { MicrotaskDashboard } from "~/components/microtask-dashboard"

export default function Home() {
  return (
    <AppLayout>
      <MicrotaskDashboard />
    </AppLayout>
  )
}
