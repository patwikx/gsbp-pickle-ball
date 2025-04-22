import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

interface FeatureCardProps {
  feature: Feature
  isActive: boolean
  onClick: () => void
}

export function FeatureCard({ feature, isActive, onClick }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={`transition-all cursor-pointer hover:shadow-lg ${isActive ? 'border-blue-600 bg-blue-50' : ''}`}
        onClick={onClick}
      >
        <CardContent className="flex items-center p-6">
          <div className={`mr-4 p-3 rounded-full ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
            {feature.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

