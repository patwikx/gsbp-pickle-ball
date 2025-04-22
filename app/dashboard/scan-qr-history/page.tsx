
import { ScanHistoryView } from '../scan-qr/components/scan-history'

export default function SettingsPage() {
  return (
    <div className="min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
                  <div className='mx-auto mt-4 mb-4'>
            <h1 className="text-3xl font-bold tracking-tight">Member Scan Logs</h1>
            <p className="text-muted-foreground mt-1">Monitor your member logs here</p>
          </div>
      <div className="text-center">
        <ScanHistoryView />
      </div>
    </div>
  )
}

