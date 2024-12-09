'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Loader2, Download, Trash2, Settings2, Wand2, Lock, Menu, X, Type } from 'lucide-react'
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
import { AuthGuard } from '@/components/auth-guard'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/drop-down"
import { DEFAULT_TEXT_STYLE, FeatureType } from '@/lib/plans'
import { useSession } from 'next-auth/react'
import { hasPermission } from '@/lib/permissions'


function EditorPageContent() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const userPlan = session?.user?.plan || 'free'

  const canUseFeature = (feature: FeatureType) => {
    return hasPermission(userPlan, feature)
  }

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [textStyles, setTextStyles] = useState<TextStyle[]>([])
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [imageAdjustments, setImageAdjustments] = useState(defaultAdjustments)

  const handleImageUpload = useCallback(async (file: File) => {
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImage(url)
    setProcessedImage(null)
    setError(null)
  }, [])

  const handleTextStyleChange = useCallback((style: Partial<TextStyle> & { id: string }) => {
    if (!canUseFeature('font_customization') && 
        (style.fontFamily !== DEFAULT_TEXT_STYLE.fontFamily || 
         style.fontSize !== DEFAULT_TEXT_STYLE.fontSize)) {
      toast({
        title: 'Premium Feature',
        description: 'Font customization is only available in paid plans. Please upgrade to use this feature.',
        variant: 'destructive',
      })
      return
    }

    if (!canUseFeature('text_effects') && 
        (style.shadow?.enabled || style.outline?.enabled)) {
      toast({
        title: 'Premium Feature',
        description: 'Text effects are only available in paid plans. Please upgrade to use this feature.',
        variant: 'destructive',
      })
      return
    }

    if (!canUseFeature('advanced_effects') && 
        (style.gradient?.enabled || style.glow?.enabled || style.transform?.enabled)) {
      toast({
        title: 'Premium Feature',
        description: 'Advanced effects are only available in premium plan. Please upgrade to use this feature.',
        variant: 'destructive',
      })
      return
    }

    setTextStyles(prevStyles => {
      if (style._delete) {
        return prevStyles.filter(s => s.id !== style.id)
      }
      const styleExists = prevStyles.some(s => s.id === style.id)
      if (styleExists) {
        return prevStyles.map(s => s.id === style.id ? { ...s, ...style } : s)
      }
      return [...prevStyles, { ...DEFAULT_TEXT_STYLE, ...style } as TextStyle]
    })
  }, [canUseFeature])

  const processImage = useCallback(async () => {
    if (!imageFile) return;
    try {
      setLoading(true);
      setError(null);
      const blob = await removeBackground(imageFile);
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error processing image:', err);
    } finally {
      setLoading(false);
    }
  }, [imageFile]);

  const renderText = useCallback((ctx: CanvasRenderingContext2D, style: TextStyle) => {
    ctx.save();
    
    // Position and rotation
    const x = (style.x / 100) * ctx.canvas.width;
    const y = (style.y / 100) * ctx.canvas.height;
    ctx.translate(x, y);
    ctx.rotate((style.rotation * Math.PI) / 180);

    // Transform (Premium)
    if (style.transform) {
      ctx.transform(
        style.transform.scaleX,  // scaleX
        style.transform.skewX * Math.PI / 180,  // skewX
        0,  // skewY
        style.transform.scaleY,  // scaleY
        0,  // translateX
        0   // translateY
      );
    }

    // Basic text styles
    const fontStyle = style.style.italic ? 'italic' : 'normal';
    const fontWeight = style.style.bold ? 'bold' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    ctx.textAlign = style.align;
    ctx.globalAlpha = style.opacity / 100;

    // Shadow (Premium)
    if (style.shadow?.enabled && style.shadow.blur > 0) {
      ctx.shadowBlur = style.shadow.blur;
      ctx.shadowColor = style.shadow.color;
      ctx.shadowOffsetX = style.shadow.offsetX;
      ctx.shadowOffsetY = style.shadow.offsetY;
    }

    // Outline (Premium)
    if (style.outline?.enabled && style.outline.width > 0) {
      ctx.strokeStyle = style.outline.color;
      ctx.lineWidth = style.outline.width;
      ctx.strokeText(style.text, 0, 0);
    }

    // Gradient (Premium)
    if (style.gradient?.enabled) {
      const gradient = ctx.createLinearGradient(0, -style.fontSize/2, 0, style.fontSize/2);
      style.gradient.colors.forEach((color, index) => {
        gradient.addColorStop(index / (style.gradient!.colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = style.color;
    }

    // Glow (Premium)
    if (style.glow?.enabled && style.glow.intensity > 0) {
      ctx.shadowBlur = style.glow.blur;
      ctx.shadowColor = style.glow.color;
    }

    // Draw the text
    ctx.fillText(style.text, 0, 0);
    
    ctx.restore();
  }, []);

  const handleDownload = useCallback(async (format: 'png' | 'jpeg' = 'png', quality: number = 1) => {
    try {
      const container = document.querySelector('.result-display-container');
      if (!container || !(container instanceof HTMLElement)) {
        console.error('Container not found or not an HTMLElement');
        setError('Failed to find image container');
        return;
      }

      // Create a canvas that includes all layers
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        setError('Failed to create canvas');
        return;
      }

      // Get the original image dimensions
      const originalImg = new Image();
      originalImg.crossOrigin = "anonymous";
      originalImg.src = image || '';
      await new Promise((resolve, reject) => {
        originalImg.onload = resolve;
        originalImg.onerror = reject;
      });

      // Set canvas size to match original image dimensions
      canvas.width = originalImg.naturalWidth;
      canvas.height = originalImg.naturalHeight;

      // Draw original image at its natural size
      ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);

      // Draw text layers
      for (const style of textStyles) {
        ctx.save();
        
        // Calculate scaled position
        const x = (style.x / 100) * canvas.width;
        const y = (style.y / 100) * canvas.height;
        
        // Scale font size relative to image size
        const scaledFontSize = style.fontSize * (canvas.width / container.offsetWidth);
        
        // Apply text styles
        ctx.translate(x, y);
        ctx.rotate((style.rotation * Math.PI) / 180);
        
        const fontStyle = style.style.italic ? 'italic' : 'normal';
        const fontWeight = style.style.bold ? 'bold' : 'normal';
        ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${style.fontFamily}`;
        ctx.fillStyle = style.color;
        ctx.textAlign = style.align;
        ctx.globalAlpha = style.opacity / 100;

        // Apply text effects
        if (style.shadow?.enabled) {
          ctx.shadowBlur = style.shadow.blur;
          ctx.shadowColor = style.shadow.color;
          ctx.shadowOffsetX = style.shadow.offsetX;
          ctx.shadowOffsetY = style.shadow.offsetY;
        }

        if (style.glow?.enabled) {
          ctx.shadowBlur = style.glow.blur;
          ctx.shadowColor = style.glow.color;
        }

        if (style.outline?.enabled) {
          ctx.strokeStyle = style.outline.color;
          ctx.lineWidth = style.outline.width;
          ctx.strokeText(style.text, 0, 0);
        }

        if (style.gradient?.enabled) {
          const gradient = ctx.createLinearGradient(0, -scaledFontSize/2, 0, scaledFontSize/2);
          style.gradient.colors.forEach((color, index) => {
            gradient.addColorStop(index / (style.gradient!.colors.length - 1), color);
          });
          ctx.fillStyle = gradient;
        }

        ctx.fillText(style.text, 0, 0);
        ctx.restore();
      }

      // Draw processed image on top if it exists
      if (processedImage) {
        const processedImg = new Image();
        processedImg.crossOrigin = "anonymous";
        processedImg.src = processedImage;
        await new Promise((resolve, reject) => {
          processedImg.onload = resolve;
          processedImg.onerror = reject;
        });
        ctx.drawImage(processedImg, 0, 0, canvas.width, canvas.height);
      }

      // Apply image adjustments
      if (imageAdjustments) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const brightness = imageAdjustments.brightness / 100;
        const contrast = imageAdjustments.contrast / 100;
        const saturation = imageAdjustments.saturation / 100;
        
        for (let i = 0; i < data.length; i += 4) {
          // Apply adjustments
          data[i] *= brightness;
          data[i + 1] *= brightness;
          data[i + 2] *= brightness;
          
          data[i] = ((data[i] - 128) * contrast) + 128;
          data[i + 1] = ((data[i + 1] - 128) * contrast) + 128;
          data[i + 2] = ((data[i + 2] - 128) * contrast) + 128;
          
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg + (data[i] - avg) * saturation;
          data[i + 1] = avg + (data[i + 1] - avg) * saturation;
          data[i + 2] = avg + (data[i + 2] - avg) * saturation;
        }
        
        ctx.putImageData(imageData, 0, 0);
      }

      // Convert to data URL and download
      const dataUrl = canvas.toDataURL(`image/${format}`, quality);
      const link = document.createElement('a');
      link.download = `text-behind-image.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download image. Please try again.');
    }
  }, [image, processedImage, textStyles, imageAdjustments]);

  const resetImage = useCallback(() => {
    setImageFile(null)
    setImage(null)
    setProcessedImage(null)
    setError(null)
    setTextStyles([])
    setSelectedTextId(null)
    setImageAdjustments(defaultAdjustments)
  }, [])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-8 flex flex-col">
        <div className="h-full flex items-center justify-center">
          {!image ? (
            <ImageUploader onImageUpload={handleImageUpload} />
          ) : (
            <div className="w-full space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="relative">
                <ResultDisplay 
                  originalImage={image}
                  processedImage={processedImage}
                  textStyles={textStyles}
                  selectedTextId={selectedTextId}
                  imageAdjustments={imageAdjustments}
                  onTextStyleChange={handleTextStyleChange}
                  onTextSelect={setSelectedTextId}
                />
                {loading && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="text-lg font-medium">Processing image...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={processImage}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Remove Background
                    </>
                  )}
                </Button>
                {processedImage && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDownload('png', 1)}>
                        High Quality PNG
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload('jpeg', 0.9)}>
                        High Quality JPEG
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload('jpeg', 0.7)}>
                        Medium Quality JPEG
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button
                  variant="outline"
                  onClick={resetImage}
                  disabled={loading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Panel */}
      {image && (
        <div className="w-full lg:w-80 border-t lg:border-l lg:border-t-0 bg-background p-4">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="text">
                <Type className="mr-2 h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="image">
                <Settings2 className="mr-2 h-4 w-4" />
                Image
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <div className="w-80 bg-background">
                <TextEditor
                  textStyles={textStyles}
                  selectedTextId={selectedTextId}
                  onTextStyleChange={handleTextStyleChange}
                  onTextSelect={setSelectedTextId}
                  onDelete={() => {
                    if (selectedTextId) {
                      setTextStyles(textStyles.filter(style => style.id !== selectedTextId));
                      setSelectedTextId(null);
                    }
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-4">
              <ImageAdjuster
                adjustments={imageAdjustments}
                onChange={setImageAdjustments}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default function EditorPage() {
  return (
    <AuthGuard>
      <EditorPageContent />
    </AuthGuard>
  )
}
