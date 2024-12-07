import React, { useRef, useState } from 'react'
import { useSubscription } from '@/hooks/useSubscription'
import { UpgradeModal } from '@/components/UI/upgrade-modal'
import type { FeatureKey } from '@/lib/subscription'
import { canUseFontFamily, FREE_TIER_FONTS } from '@/lib/subscription'
import { UserPlan } from '@/lib/utils'
import { Input } from '@/components/UI/input'
import { Label } from '@/components/UI/label'
import { Slider } from '@/components/UI/slider'
import { Button } from '@/components/UI/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs'
import { useEditor } from '@/contexts/editor-context'
import { useToast } from '@/components/UI/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select'
import { Checkbox } from '@/components/UI/checkbox'
import {
  Type,
  Move,
  Palette,
  Sliders,
  ImageDown
} from 'lucide-react'

export interface TextStyle {
  text: string
  fontSize: number
  fontFamily: string
  color: string
  x: number
  y: number
  letterSpacing: number
  opacity: number
  rotation: number
  direction: 'horizontal' | 'vertical'
  align: 'left' | 'center' | 'right'
  verticalAlign: 'top' | 'middle' | 'bottom'
  transform: {
    scale: { x: number; y: number }
    skew: { x: number; y: number }
  }
  style: {
    bold: boolean
    italic: boolean
    underline: boolean
    stroke: {
      enabled: boolean
      width: number
      color: string
    }
  }
  effects: {
    shadow: {
      enabled: boolean
      blur: number
      color: string
      offsetX: number
      offsetY: number
    }
    glow: {
      enabled: boolean
      blur: number
      color: string
      strength: number
    }
    gradient: {
      enabled: boolean
      type: 'linear' | 'radial'
      colors: string[]
      angle: number
    }
    outline: {
      enabled: boolean
      width: number
      color: string
      blur: number
    }
  }
  watermark: {
    enabled: boolean
    text: string
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    fontSize: number
  }
}

interface TextEditorProps {
  textStyles: TextStyle[];
  activeTextIndex: number;
  onTextStyleChange: (newStyle: TextStyle) => void;
  onAddText?: () => void;
  onDeleteText?: () => void;
  onTextSelect: (index: number) => void;
  controlsOnly?: boolean;
  onProcessImage?: () => void;
}

export function TextEditor({
  textStyles,
  activeTextIndex,
  onTextStyleChange,
  onAddText,
  onDeleteText,
  onTextSelect,
  controlsOnly = false,
  onProcessImage,
}: TextEditorProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const { state, dispatch } = useEditor()
  const activeTextStyle = textStyles[activeTextIndex]
  const { currentPlan, canUseFeature, getRemainingImages, canProcessImage, refreshSession } = useSubscription()
  const { toast } = useToast()
  const [processingImage, setProcessingImage] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState<FeatureKey>('basicEffects')

  const canUseAdvancedEffects = canUseFeature('advancedEffects')
  const canUseBasicEffects = canUseFeature('basicEffects')

  const handleFeatureUse = (feature: FeatureKey, action: () => void) => {
    if (!canUseFeature(feature)) {
      setUpgradeFeature(feature)
      setShowUpgradeModal(true)
      return
    }
    action()
  }

  const handleStyleChange = (changes: Partial<TextStyle>) => {
    const updatedStyle = { ...activeTextStyle, ...changes }
    onTextStyleChange(updatedStyle)
  }

  const handleAddText = () => {
    handleFeatureUse('multipleTextLayers', () => {
      const newTextStyle: TextStyle = {
        text: '',
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000',
        x: 0,
        y: 0,
        letterSpacing: 0,
        opacity: 100,
        rotation: 0,
        direction: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
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
            width: 1,
            color: '#000000'
          }
        },
        effects: {
          shadow: {
            enabled: false,
            blur: 0,
            color: '#000000',
            offsetX: 0,
            offsetY: 0
          },
          glow: {
            enabled: false,
            blur: 0,
            color: '#000000',
            strength: 0
          },
          gradient: {
            enabled: false,
            type: 'linear',
            colors: [],
            angle: 0
          },
          outline: {
            enabled: false,
            width: 1,
            color: '#000000',
            blur: 0
          }
        },
        watermark: {
          enabled: false,
          text: '',
          position: 'top-left',
          fontSize: 12
        }
      }
      onAddText?.()
    })
  }

  const handleDeleteText = () => {
    if (textStyles.length > 1) {
      onDeleteText?.()
    }
  }

  const handleTextSelect = (index: number) => {
    onTextSelect(index)
  }

  const handleProcessImage = async () => {
    if (!onProcessImage) return

    if (!canProcessImage()) {
      setUpgradeFeature('basicEffects')
      setShowUpgradeModal(true)
      return
    }

    setProcessingImage(true)
    try {
      // Update image count
      const response = await fetch('/api/images/update-count', {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      // Process the image
      await onProcessImage()
      
      // Refresh session to update image count
      await refreshSession()
      
      toast({
        title: 'Success',
        description: 'Image processed successfully!'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process image',
        variant: 'destructive'
      })
    } finally {
      setProcessingImage(false)
    }
  }

  const canUseGradient = () => {
    return currentPlan === 'premium' || (currentPlan === 'basic' && canUseFeature('basicEffects'))
  }

  const handleFontChange = (font: string) => {
    handleFeatureUse('customFonts', () => {
      handleStyleChange({ fontFamily: font })
    })
  }

  const renderUpgradeModal = () => (
    <UpgradeModal
      show={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
      feature={upgradeFeature}
      currentPlan={currentPlan}
    />
  )

  if (controlsOnly) {
    return (
      <div className={`${controlsOnly ? 'editor-sidebar' : 'editor-container'}`}>
        <div className="space-y-4">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="text">
                <Type className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="transform">
                <Sliders className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="position">
                <Move className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="effects">
                <Palette className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Text Elements</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddText}
                    >
                      Add Text
                    </Button>
                    {textStyles.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteText}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                  {textStyles.map((style, index) => (
                    <Button
                      key={index}
                      variant={index === activeTextIndex ? "default" : "outline"}
                      className="justify-start text-left truncate"
                      onClick={() => {
                        handleTextSelect(index)
                      }}
                    >
                      {style.text || 'Empty text'}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Text Content</Label>
                <Input
                  value={activeTextStyle.text}
                  onChange={(e) => handleStyleChange({ text: e.target.value })}
                  placeholder="Enter your text"
                />
              </div>
              <div>
                <Label>Font Size</Label>
                <Slider
                  value={[activeTextStyle.fontSize]}
                  min={12}
                  max={200}
                  step={1}
                  onValueChange={(value) => handleStyleChange({ fontSize: value[0] })}
                />
              </div>
              <div>
                <Label>Color</Label>
                <Input
                  type="color"
                  value={activeTextStyle.color}
                  onChange={(e) => handleStyleChange({ color: e.target.value })}
                />
              </div>
              <div className="select-trigger-container">
                <Select
                  value={activeTextStyle.fontFamily}
                  onValueChange={(value) => {
                    handleFontChange(value)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="select-content-fixed" position="popper" sideOffset={5}>
                    {/* Free Tier Fonts */}
                    <div className="font-group">
                      <div className="px-2 py-1 text-xs text-muted-foreground">
                        {currentPlan === 'free' ? 'Available Fonts' : 'Basic Fonts'}
                      </div>
                      {FREE_TIER_FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </div>

                    {/* Premium Fonts - Only shown for paid plans */}
                    {currentPlan !== 'free' && (
                      <>
                        <div className="font-group">
                          <div className="px-2 py-1 text-xs text-muted-foreground">Premium Fonts</div>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        </div>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Opacity</Label>
                <Slider
                  value={[activeTextStyle.opacity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleStyleChange({ opacity: value[0] })}
                />
              </div>
              <div>
                <Label>Letter Spacing</Label>
                <Slider
                  value={[activeTextStyle.letterSpacing]}
                  min={-5}
                  max={20}
                  step={0.5}
                  onValueChange={(value) => handleStyleChange({ letterSpacing: value[0] })}
                />
              </div>
            </TabsContent>

            <TabsContent value="transform" className="space-y-4">
              <div>
                <Label>Scale X</Label>
                <Slider
                  disabled={!canUseAdvancedEffects}
                  value={[activeTextStyle.transform.scale.x]}
                  min={0.1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => handleStyleChange({
                    transform: {
                      ...activeTextStyle.transform,
                      scale: { ...activeTextStyle.transform.scale, x: value[0] }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Scale Y</Label>
                <Slider
                  disabled={!canUseAdvancedEffects}
                  value={[activeTextStyle.transform.scale.y]}
                  min={0.1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => handleStyleChange({
                    transform: {
                      ...activeTextStyle.transform,
                      scale: { ...activeTextStyle.transform.scale, y: value[0] }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Rotation</Label>
                <Slider
                  disabled={!canUseAdvancedEffects}
                  value={[activeTextStyle.rotation]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => handleStyleChange({ rotation: value[0] })}
                />
              </div>
            </TabsContent>

            <TabsContent value="position" className="space-y-4">
              <div>
                <Label>X Position</Label>
                <Slider
                  value={[activeTextStyle.x]}
                  min={0}
                  max={800}
                  step={1}
                  onValueChange={(value) => handleStyleChange({ x: value[0] })}
                />
              </div>
              <div>
                <Label>Y Position</Label>
                <Slider
                  value={[activeTextStyle.y]}
                  min={0}
                  max={600}
                  step={1}
                  onValueChange={(value) => handleStyleChange({ y: value[0] })}
                />
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              {!canUseAdvancedEffects && (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md mb-4">
                  ⭐ Upgrade to access advanced effects like gradients, shadows, and glow effects!
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="gradient"
                    disabled={!canUseGradient()}
                    checked={activeTextStyle.effects.gradient.enabled}
                    onCheckedChange={(checked) => {
                      handleFeatureUse('advancedEffects', () => {
                        handleStyleChange({
                          effects: {
                            ...activeTextStyle.effects,
                            gradient: {
                              ...activeTextStyle.effects.gradient,
                              enabled: checked === true
                            }
                          }
                        })
                      })
                    }}
                  />
                  <Label htmlFor="gradient">Gradient</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="shadow"
                    disabled={!canUseAdvancedEffects}
                    checked={activeTextStyle.effects.shadow.enabled}
                    onCheckedChange={(checked) => {
                      handleFeatureUse('advancedEffects', () => {
                        handleStyleChange({
                          effects: {
                            ...activeTextStyle.effects,
                            shadow: {
                              ...activeTextStyle.effects.shadow,
                              enabled: checked === true
                            }
                          }
                        })
                      })
                    }}
                  />
                  <Label htmlFor="shadow">Shadow</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="glow"
                    disabled={!canUseAdvancedEffects}
                    checked={activeTextStyle.effects.glow.enabled}
                    onCheckedChange={(checked) => {
                      handleFeatureUse('advancedEffects', () => {
                        handleStyleChange({
                          effects: {
                            ...activeTextStyle.effects,
                            glow: {
                              ...activeTextStyle.effects.glow,
                              enabled: checked === true
                            }
                          }
                        })
                      })
                    }}
                  />
                  <Label htmlFor="glow">Glow</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-4 border-t">
            <Button 
              className="w-full flex items-center gap-2 py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-200 hover:shadow-xl" 
              variant="default"
              onClick={handleProcessImage}
            >
              <ImageDown className="h-5 w-5" />
              Process Image
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            <p>Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</p>
            <p>Images remaining: {getRemainingImages()}</p>
            {!canUseAdvancedEffects && (
              <p className="text-yellow-600">⭐ Upgrade to access advanced effects</p>
            )}
            {!canUseFeature('customFonts') && (
              <p className="text-yellow-600">⭐ Upgrade to access premium fonts</p>
            )}
          </div>

          {renderUpgradeModal()}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={textRef}
      className="relative w-full h-full"
      style={{
        fontFamily: activeTextStyle.fontFamily,
        fontSize: `${activeTextStyle.fontSize}px`,
        color: activeTextStyle.effects.gradient.enabled 
          ? 'transparent'
          : activeTextStyle.color,
        background: activeTextStyle.effects.gradient.enabled 
          ? `${activeTextStyle.effects.gradient.type}-gradient(${
              activeTextStyle.effects.gradient.type === 'linear' 
                ? `${activeTextStyle.effects.gradient.angle}deg`
                : 'circle'
            }, ${activeTextStyle.effects.gradient.colors.join(', ')})`
          : 'none',
        WebkitBackgroundClip: activeTextStyle.effects.gradient.enabled ? 'text' : 'none',
        backgroundClip: activeTextStyle.effects.gradient.enabled ? 'text' : 'none',
        transform: `
          translate(${activeTextStyle.x}px, ${activeTextStyle.y}px)
          rotate(${activeTextStyle.rotation}deg)
          scale(${activeTextStyle.transform.scale.x}, ${activeTextStyle.transform.scale.y})
        `,
        opacity: activeTextStyle.opacity / 100,
        letterSpacing: `${activeTextStyle.letterSpacing}px`,
      }}
    >
      {activeTextStyle.text}
    </div>
  )
}
