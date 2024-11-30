import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ImageIcon, Type, Wand2, Download, Layers, Sparkles, Upload, Palette, FileImage } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Create Stunning{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Text Behind Images
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your images with our powerful text-behind-image editor. Perfect for creating unique social media posts, memes, and artistic compositions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/editor" 
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Creating <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#examples" 
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              View Examples
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-background shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload & Remove Background</h3>
              <p className="text-muted-foreground">Upload your image and our AI will automatically remove the background with precision.</p>
            </div>

            <div className="p-6 rounded-lg bg-background shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Add Multiple Text Layers</h3>
              <p className="text-muted-foreground">Add multiple text layers with different styles, fonts, and effects for complex designs.</p>
            </div>

            <div className="p-6 rounded-lg bg-background shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Style & Enhance</h3>
              <p className="text-muted-foreground">Customize text styles, add effects, and enhance image quality with our AI tools.</p>
            </div>

            <div className="p-6 rounded-lg bg-background shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Apply Effects</h3>
              <p className="text-muted-foreground">Add shadows, gradients, and special effects to make your text stand out beautifully.</p>
            </div>

            <div className="p-6 rounded-lg bg-background shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5. Fine-tune</h3>
              <p className="text-muted-foreground">Adjust brightness, contrast, and other image properties for the perfect look.</p>
            </div>

            <div className="p-6 rounded-lg bg-background shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileImage className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">6. Export & Share</h3>
              <p className="text-muted-foreground">Download in multiple formats (PNG, JPEG, SVG) or share directly to social media.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="examples" className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative w-full h-[400px] rounded-2xl overflow-hidden bg-background shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src="/showcase/showcase1.png"
                alt="Text behind image example 1"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">Creative Design</h3>
                  <p className="text-white/80 text-sm">Perfect for social media posts</p>
                </div>
              </div>
            </div>
            
            <div className="group relative w-full h-[400px] rounded-2xl overflow-hidden bg-background shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src="/showcase/showcase2.png"
                alt="Text behind image example 2"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">Artistic Expression</h3>
                  <p className="text-white/80 text-sm">Blend text and images seamlessly</p>
                </div>
              </div>
            </div>
            
            <div className="group relative w-full h-[400px] rounded-2xl overflow-hidden bg-background shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src="/showcase/showcase3.png"
                alt="Text behind image example 3"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">Professional Touch</h3>
                  <p className="text-white/80 text-sm">Create stunning marketing materials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started for free or unlock premium features with our Pro plan. No credit card required for free tier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/pricing" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              View Pricing Plans
            </Link>
            <Link 
              href="/editor" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Try for Free
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start creating your own stunning text-behind-image compositions today.
          </p>
          <Link 
            href="/editor" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}