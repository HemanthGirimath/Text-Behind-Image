'use client'

import React, { useState, useCallback } from 'react'
import { removeBackground } from '@imgly/background-removal'
import { Upload, Loader2, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/UI/button'
import { Card, CardContent } from '@/components/UI/card'
import { Alert, AlertDescription } from '@/components/UI/alert'
import TextEditor, { TextStyle } from '@/app/textBehindImage/textEditor'
import { ResultDisplay } from '@/app/textBehindImage/resultDisplay'
import { TextConfig } from '@/app/textBehindImage/textControles'

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
    watermark: {
      enabled: false,
      text: '',
      position: 'bottom-right',
      fontSize: 24
    }
  })

  const handleFile = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

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

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

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
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    
    try {
      // Convert the canvas (including text) to a blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, 'image/png', 1.0)
      })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'text-behind-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
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
            <Card>
              <CardContent
                className={`p-6 border-2 border-dashed rounded-lg transition-colors
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFile(file)
                      }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="secondary" className="mb-2">
                        Select Image
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="relative w-[800px] h-[600px] mx-auto rounded-lg overflow-hidden">
              <ResultDisplay 
                originalImage={image}
                processedImage={processedImage}
                textStyle={textStyle}
                onTextStyleChange={setTextStyle}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                {processedImage && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleDownload}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDeleteImage}
                  title="Delete"
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
        />
      </div>
    </main>
  )
}

