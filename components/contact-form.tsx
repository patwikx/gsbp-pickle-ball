import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="first-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First name</label>
          <Input id="first-name" placeholder="Enter your first name" className="w-full" />
        </div>
        <div className="space-y-2">
          <label htmlFor="last-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last name</label>
          <Input id="last-name" placeholder="Enter your last name" className="w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
        <Input id="email" placeholder="Enter your email" type="email" className="w-full" />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
        <Textarea id="message" placeholder="Enter your message" className="w-full" />
      </div>
      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">Send Message</Button>
    </form>
  )
}

