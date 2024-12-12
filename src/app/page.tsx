'use client'

import { Button } from "@/components/UI/button"
import Link from "next/link"
import Image from "next/image"
import { ImageIcon, Download, Share2, Upload, Type } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-slide-up">
            Transform Your Images with Text
          </h1>
          <p className="text-xl mb-8 text-muted-foreground animate-slide-up delay-200">
            Create stunning visuals by adding beautiful text effects behind your images
          </p>
          <div className="animate-slide-up delay-300">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/editor">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Create Beautiful Text Effects in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Image</h3>
              <p className="text-muted-foreground">
                Drag and drop or click to upload your image. We support JPEG and PNG formats.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Type className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Add Text</h3>
              <p className="text-muted-foreground">
                Add and style your text with our powerful text editor. Choose fonts, colors, and effects.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Download</h3>
              <p className="text-muted-foreground">
                Export your creation in high quality. Perfect for social media and marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Stunning Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src="/examples/text-behind-1.jpg"
                alt="Example 1"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/editor">Try It Now</Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src="/examples/text-behind-2.jpg"
                alt="Example 2"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/editor">Try It Now</Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src="/examples/text-behind-3.jpg"
                alt="Example 3"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/editor">Try It Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Amazing Text Effects?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Choose a plan that works for you and start creating today.
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link href="/pricing">View Plans</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}