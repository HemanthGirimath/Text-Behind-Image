'use client'

import React, { useState, useCallback } from 'react'
import { removeBackground } from '@imgly/background-removal'
import { Loader2, Download, Trash2, Settings2 } from 'lucide-react'
import { Button } from '@/components/UI/button'
import { Alert, AlertDescription } from '@/components/UI/alert'
import { ImageUploader } from './textBehindImage/imageUploder'
import { ResultDisplay } from './textBehindImage/resultDisplay'
import { defaultAdjustments, type ImageAdjustments } from './textBehindImage/imageAdjustments'
import TextEditor, { type TextStyle } from './textBehindImage/textEditor'

export default function Home() {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
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
    <main className="h-screen overflow-hidden">
      <h1 className="text-3xl font-bold p-4">Text Behind Image</h1>
      <div className="flex h-[calc(100vh-5rem)]">
        <div className="flex-1 p-4 overflow-y-auto">
          {!image ? (
            <ImageUploader onImageSelected={handleImageSelect} />
          ) : (
            <div className="relative w-[800px] h-[600px] mx-auto rounded-lg overflow-hidden">
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
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleBackgroundRemoval}
                  disabled={isProcessing}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDeleteImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <TextEditor 
          image={image}
          processedImage={processedImage}
          onProcess={handleBackgroundRemoval}
          isProcessing={isProcessing}
          textStyle={textStyle}
          onTextStyleChange={setTextStyle}
          imageAdjustments={imageAdjustments}
          onImageAdjustmentsChange={setImageAdjustments}
        />
      </div>
    </main>
  )
}
