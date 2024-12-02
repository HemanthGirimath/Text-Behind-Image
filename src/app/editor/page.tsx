'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { removeBackground } from '@imgly/background-removal'
import { Loader2, Download, Trash2, Settings2, Wand2, Lock, Menu, X } from 'lucide-react'
import { Button } from '@/components/UI/button'
import { Alert, AlertDescription } from '@/components/UI/alert'
import { ImageUploader } from '../textBehindImage/imageUploder'
import { ResultDisplay } from '../textBehindImage/resultDisplay'
import { defaultAdjustments, type ImageAdjustments, ImageAdjustments as ImageAdjuster } from '../textBehindImage/imageAdjustments'
import TextEditor, { type TextStyle } from '../textBehindImage/textEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs'

export default function EditorPage() {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('text')
  const [textStyle, setTextStyle] = useState<TextStyle>({
    text: 'Your text here',
    fontSize: 72,
    fontFamily: 'Arial',
    color: '#ffffff',
    x: 50,
    y: 50,
    letterSpacing: 0,
    opacity: 100,
    rotation: 0,
    direction: 'horizontal',
    align: 'center',
    verticalAlign: 'middle',
    transform: {
      scale: { x: 1, y: 1 },
      skew: { x: 0, y: 0 }
    },
    style: {
      bold: false,
      italic: false,
      underline: false,
      stroke: {
        enabled: false,
        width: 2,
        color: '#000000'
      }
    },
    effects: {
      shadow: {
        enabled: false,
        blur: 5,
        color: '#000000',
        offsetX: 2,
        offsetY: 2
      },
      glow: {
        enabled: false,
        blur: 10,
        color: '#ffffff',
        strength: 1
      },
      gradient: {
        enabled: false,
        type: 'linear',
        colors: ['#ff0000', '#00ff00'],
        angle: 0
      },
      outline: {
        enabled: false,
        width: 2,
        color: '#000000',
        blur: 0
      }
    },
    watermark: {
      enabled: false,
      text: '',
      position: 'bottom-right',
      fontSize: 24
    }
  })
  const [imageAdjustments, setImageAdjustments] = useState<ImageAdjustments>(defaultAdjustments)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSidebarOpen])

  const handleImageSelect = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        setImage(result)
        setProcessedImage(null)
        setError(null)
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleBackgroundRemoval = useCallback(async () => {
    if (!image) return

    setIsProcessing(true)
    try {
      const response = await fetch(image)
      const blob = await response.blob()
      
      const processedBlob = await removeBackground(blob)
      const processedUrl = URL.createObjectURL(processedBlob)
      
      setProcessedImage(processedUrl)
    } catch (err) {
      setError('Failed to process image')
      console.error('Background removal failed:', err)
    } finally {
      setIsProcessing(false)
    }
  }, [image])

  const handleDeleteImage = useCallback(() => {
    setImage(null)
    setProcessedImage(null)
    setError(null)
  }, [])

  const handleDownload = useCallback(async () => {
    try {
      const canvas = document.querySelector('canvas')
      if (!canvas) return

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'text-behind-image.png'
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Download failed:', err)
      setError('Failed to download image')
    }
  }, [])

  return (
    <main className="h-screen overflow-hidden relative">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl md:text-3xl font-bold">Text Behind Image</h1>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
        <div className="flex-1 p-2 md:p-4 overflow-y-auto">
          {!image ? (
            <ImageUploader onImageSelected={handleImageSelect} />
          ) : (
            <div className="space-y-4">
              <div className="relative w-full max-w-[800px] h-auto aspect-[4/3] mx-auto rounded-lg overflow-hidden">
                <ResultDisplay 
                  originalImage={image}
                  processedImage={processedImage}
                  textStyle={textStyle}
                  imageAdjustments={imageAdjustments}
                  onTextStyleChange={setTextStyle}
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
                <div className="absolute top-2 md:top-4 right-2 md:right-4 flex gap-1 md:gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 md:h-10 md:w-10"
                    onClick={handleBackgroundRemoval}
                    disabled={isProcessing}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 md:h-10 md:w-10"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 md:h-10 md:w-10"
                    onClick={handleDeleteImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Mobile Editor */}
          <div className="lg:hidden mt-4">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="w-full grid grid-cols-3 p-1">
                <TabsTrigger value="text" className="py-3">Text</TabsTrigger>
                <TabsTrigger value="image" className="py-3">Image</TabsTrigger>
                <TabsTrigger value="ai" className="py-3">AI</TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <TextEditor 
                  textStyle={textStyle}
                  onTextStyleChange={setTextStyle}
                  controlsOnly={true}
                  onProcessImage={handleBackgroundRemoval}
                />
              </TabsContent>

              <TabsContent value="image">
                <ImageAdjuster
                  adjustments={imageAdjustments}
                  onAdjustmentsChange={setImageAdjustments}
                />
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">AI Features</h3>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2 opacity-50">
                    <Button variant="outline" className="w-full" disabled>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Text Styles
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Smart Image Enhancement
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <Wand2 className="h-4 w-4 mr-2" />
                      AI Background Removal
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Upgrade to Pro to unlock AI-powered features
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Desktop Sidebar */}
        <div 
          ref={sidebarRef}
          className={`
            fixed lg:relative top-0 right-0 h-full w-[85vw] md:w-[300px]
            bg-background/95 backdrop-blur-sm border-l p-4 
            overflow-y-auto transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            z-50 shadow-lg lg:shadow-none
          `}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 p-1">
              <TabsTrigger value="text" className="py-3">Text</TabsTrigger>
              <TabsTrigger value="image" className="py-3">Image</TabsTrigger>
              <TabsTrigger value="ai" className="py-3">AI</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <TextEditor 
                textStyle={textStyle}
                onTextStyleChange={setTextStyle}
                controlsOnly={true}
                onProcessImage={handleBackgroundRemoval}
              />
            </TabsContent>

            <TabsContent value="image">
              <ImageAdjuster
                adjustments={imageAdjustments}
                onAdjustmentsChange={setImageAdjustments}
              />
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">AI Features</h3>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-2 opacity-50">
                  <Button variant="outline" className="w-full" disabled>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Text Styles
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Smart Image Enhancement
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI Background Removal
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Upgrade to Pro to unlock AI-powered features
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
