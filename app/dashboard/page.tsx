
import { AdPopup } from '@/components/ad-pop-up'
import UserBookingsNew from './components/dashboard-page'

export default function HomeDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">

<UserBookingsNew />
<AdPopup />
    </div>
  )
}

