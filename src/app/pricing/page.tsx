import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { ReactNode } from 'react'

interface FeatureProps {
  children: ReactNode;
  available?: boolean;
}

const PricingPage = () => {
  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your creative needs. All plans include access to our core image editing features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="relative rounded-2xl bg-background p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground">Perfect for getting started</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <Feature available>Basic image editing tools</Feature>
              <Feature available>Single text layer</Feature>
              <Feature available>5 basic templates</Feature>
              <Feature available>Standard export formats (PNG, JPEG)</Feature>
              <Feature>Multiple text layers</Feature>
              <Feature>Advanced image enhancement</Feature>
              <Feature>Cloud storage</Feature>
            </ul>
            <Link 
              href="/editor" 
              className="block w-full py-3 px-6 rounded-lg text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-2xl bg-background p-8 shadow-lg border border-primary hover:shadow-xl transition-shadow">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground">For serious creators</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <Feature available>Everything in Free</Feature>
              <Feature available>Multiple text layers</Feature>
              <Feature available>Advanced image enhancement</Feature>
              <Feature available>All export formats (PNG, JPEG, SVG)</Feature>
              <Feature available>Premium templates</Feature>
              <Feature available>10GB cloud storage</Feature>
              <Feature available>Priority support</Feature>
            </ul>
            <Link 
              href="/editor" 
              className="block w-full py-3 px-6 rounded-lg text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Pro Trial
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="relative rounded-2xl bg-background p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground">For teams and businesses</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <Feature available>Everything in Pro</Feature>
              <Feature available>Unlimited cloud storage</Feature>
              <Feature available>API access</Feature>
              <Feature available>Custom templates</Feature>
              <Feature available>Team collaboration</Feature>
              <Feature available>Analytics dashboard</Feature>
              <Feature available>Dedicated support</Feature>
            </ul>
            <Link 
              href="/contact" 
              className="block w-full py-3 px-6 rounded-lg text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground">
            Have questions? Check out our{' '}
            <Link href="/faq" className="text-primary hover:underline">
              FAQ
            </Link>
            {' '}or{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Feature component with proper TypeScript types
const Feature = ({ children, available = false }: FeatureProps) => (
  <li className="flex items-center gap-3">
    {available ? (
      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    )}
    <span className={available ? '' : 'text-muted-foreground'}>
      {children}
    </span>
  </li>
)

export default PricingPage