'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Loader2, Download, Trash2, Settings2, Wand2, Type, Plus } from 'lucide-react'
import { Button } from '@/components/UI/button'
import { Alert, AlertDescription } from '@/components/UI/alert'
import { ImageUploader } from '../textBehindImage/imageUploder'
import { ResultDisplay } from '../textBehindImage/resultDisplay'
import { ImageAdjustments as ImageAdjuster, defaultAdjustments } from '../textBehindImage/imageAdjustments'
import { TextEditor } from '../textBehindImage/textEditor'
import { TextStyle } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs'
import { removeBackground } from '@/lib/background-removal'
import { useToast } from '@/components/UI/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DEFAULT_TEXT_STYLE } from '@/lib/plans'

export default function EditorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [textStyles, setTextStyles] = useState<TextStyle[]>([])
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [imageAdjustments, setImageAdjustments] = useState(defaultAdjustments)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  const handleImageUpload = useCallback(async (file: File) => {
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImage(url)
    setProcessedImage(null)
    setError(null)
    
    // Add default text layer when image is uploaded
    const defaultText: TextStyle = {
      ...DEFAULT_TEXT_STYLE,
      id: Math.random().toString(36).substring(7),
      text: 'Add your text here'
    }
    setTextStyles([defaultText])
    setSelectedTextId(defaultText.id)
  }, [])

  const handleTextStyleChange = useCallback((style: Partial<TextStyle> & { id: string }) => {
    setTextStyles(prevStyles => {
      const index = prevStyles.findIndex(s => s.id === style.id)
      if (index === -1) return prevStyles
      
      const newStyles = [...prevStyles]
      newStyles[index] = { ...newStyles[index], ...style }
      return newStyles
    })
  }, [])

  const handleAddText = useCallback(() => {
    const newStyle: TextStyle = {
      ...DEFAULT_TEXT_STYLE,
      id: Math.random().toString(36).substring(7),
      text: 'New Text Layer'
    }
    setTextStyles(prev => [...prev, newStyle])
    setSelectedTextId(newStyle.id)
  }, [])

  const handleRemoveText = useCallback((id: string) => {
    setTextStyles(prev => prev.filter(style => style.id !== id))
    if (selectedTextId === id) {
      setSelectedTextId(null)
    }
  }, [selectedTextId])

  const handleImageAdjustmentChange = useCallback((adjustments: typeof defaultAdjustments) => {
    setImageAdjustments(adjustments)
  }, [])

  const handleRemoveBackground = useCallback(async () => {
    if (!imageFile) return

    setLoading(true)
    setError(null)

    try {
      const result = await removeBackground(imageFile)
      if (result.error) {
        throw new Error(result.error)
      }
      if (!result.blob) {
        throw new Error('Failed to process image')
      }
      setProcessedImage(URL.createObjectURL(result.blob))
    } catch (err: any) {
      setError(err.message || 'Failed to process image')
      toast({
        title: 'Error',
        description: err.message || 'Failed to process image',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [imageFile, toast])

  const handleDownload = useCallback(async () => {
    if (!processedImage && !image) return;

    try {
      // Get the canvas from ResultDisplay
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Create a new image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = processedImage || image || '';
      });

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Draw text layers
      textStyles.forEach(style => {
        ctx.save();
        
        // Set text styles
        ctx.font = `${style.style.bold ? 'bold' : ''} ${style.fontSize}px ${style.fontFamily}`;
        ctx.fillStyle = style.color;
        ctx.textAlign = 'center';
        
        // Position text
        const x = (style.x / 100) * canvas.width;
        const y = (style.y / 100) * canvas.height;
        
        // Apply transforms
        ctx.translate(x, y);
        if (style.rotation) ctx.rotate((style.rotation * Math.PI) / 180);
        
        // Draw text
        ctx.fillText(style.text, 0, 0);
        ctx.restore();
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'text-behind-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Image downloaded successfully!',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Error',
        description: 'Failed to download image',
        variant: 'destructive',
      });
    }
  }, [processedImage, image, textStyles, toast]);

  const handleReset = useCallback(() => {
    setImageFile(null)
    setImage(null)
    setProcessedImage(null)
    setError(null)
    setTextStyles([])
    setSelectedTextId(null)
    setImageAdjustments(defaultAdjustments)
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 px-2 sm:py-8 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* Left Column - Image Upload/Display */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm h-full">
              {!image ? (
                <div className="h-[400px] sm:h-[600px] flex items-center justify-center">
                  <ImageUploader onImageUpload={handleImageUpload} />
                </div>
              ) : (
                <>
                  <ResultDisplay
                    originalImage={image}
                    processedImage={processedImage}
                    textStyles={textStyles}
                    selectedTextId={selectedTextId}
                    imageAdjustments={imageAdjustments}
                    onTextStyleChange={handleTextStyleChange}
                    onTextSelect={setSelectedTextId}
                  />
                  
                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant="secondary"
                        onClick={handleRemoveBackground}
                        disabled={loading}
                        className="flex-1 sm:flex-none"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 mr-2" />
                        )}
                        Remove Background
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={handleDownload}
                        className="flex-1 sm:flex-none"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={handleReset}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Editor Panel */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm">
              <Tabs defaultValue="text">
                <TabsList className="w-full sticky top-0 bg-background z-10">
                  <TabsTrigger value="text" className="flex-1">
                    <Type className="w-4 h-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="adjustments" className="flex-1">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Adjustments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <Button
                    onClick={handleAddText}
                    className="w-full"
                    variant="secondary"
                    disabled={!image}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Text Layer
                  </Button>
                  <TextEditor
                    styles={textStyles}
                    selectedId={selectedTextId}
                    onChange={handleTextStyleChange}
                    onSelect={setSelectedTextId}
                    onDelete={handleRemoveText}
                  />
                </TabsContent>

                <TabsContent value="adjustments">
                  <ImageAdjuster
                    adjustments={imageAdjustments}
                    onChange={handleImageAdjustmentChange}
                  />
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
