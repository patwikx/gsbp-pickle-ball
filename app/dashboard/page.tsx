

import { AdPopup1 } from '@/components/ad-pop-up1'
import UserBookingsNew from './components/dashboard-page'
import { AdPopup2 } from '@/components/ad-pop-up2'


export default function HomeDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">

<UserBookingsNew />
<AdPopup1 />
<AdPopup2  />
    </div>
  )
}

