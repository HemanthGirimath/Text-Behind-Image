'use client'

import React, { useState } from 'react'
import { Loader2, Type, Palette, RotateCw, MoveVertical, 
  AlignLeft, AlignCenter, AlignRight, 
  ArrowUpDown, ArrowLeftRight, Bold, Italic, Underline,
  Settings2
} from 'lucide-react'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { Slider } from '@/components/UI/slider'
import { Card, CardContent } from '@/components/UI/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/UI/popover'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/UI/collapsible"
import { Lock, ChevronDown, Crown } from 'lucide-react'
import { Switch } from "@/components/UI/switch"
import { Label } from "@/components/UI/label"
import { ImageAdjustments, defaultAdjustments } from './imageAdjustments'

interface TextEditorProps {
  image: string | null
  processedImage: string | null
  onProcess: () => Promise<void>
  isProcessing: boolean
  textStyle: TextStyle
  onTextStyleChange: (style: TextStyle) => void
  imageAdjustments: ImageAdjustments
  onImageAdjustmentsChange: (adjustments: ImageAdjustments) => void
}

interface TextStyle {
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
      type: 'linear'
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

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier',
  'Verdana',
  'Georgia',
  'Palatino',
  'Garamond',
  'Bookman',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Impact'
]

const defaultTextStyle: TextStyle = {
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
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  image, 
  processedImage, 
  onProcess, 
  isProcessing, 
  textStyle, 
  onTextStyleChange,
  imageAdjustments,
  onImageAdjustmentsChange
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTextStyleChange({
      ...textStyle,
      text: e.target.value
    })
  }

  return (
    <div className="w-[320px] border-l bg-background overflow-y-auto h-full">
      <div className="px-4 py-6 space-y-4">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="font-medium">Text</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-3">
            <Input
              value={textStyle.text}
              onChange={handleTextChange}
              placeholder="Enter your text"
              className="font-medium"
            />

            <div className="space-y-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onTextStyleChange(defaultTextStyle)}
              >
                Reset All Settings
              </Button>

              <Select
                value={textStyle.fontFamily}
                onValueChange={(fontFamily) => onTextStyleChange({ ...textStyle, fontFamily })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Font Family" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={textStyle.style.bold ? "default" : "outline"}
                  size="icon"
                  onClick={() => onTextStyleChange({
                    ...textStyle,
                    style: { ...textStyle.style, bold: !textStyle.style.bold }
                  })}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={textStyle.style.italic ? "default" : "outline"}
                  size="icon"
                  onClick={() => onTextStyleChange({
                    ...textStyle,
                    style: { ...textStyle.style, italic: !textStyle.style.italic }
                  })}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Size</Label>
                    <span className="text-xs text-muted-foreground">{textStyle.fontSize}px</span>
                  </div>
                  <Slider
                    value={[textStyle.fontSize]}
                    min={12}
                    max={800}
                    step={1}
                    onValueChange={([fontSize]) => onTextStyleChange({ ...textStyle, fontSize })}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Width Scale</Label>
                    <span className="text-xs text-muted-foreground">
                      {(textStyle.transform.scale.x * 100).toFixed(0)}%
                      {textStyle.transform.scale.x === 1 && " (Normal)"}
                    </span>
                  </div>
                  <Slider
                    value={[textStyle.transform.scale.x * 100]}
                    min={50}
                    max={200}
                    step={1}
                    onValueChange={([scale]) => onTextStyleChange({
                      ...textStyle,
                      transform: {
                        ...textStyle.transform,
                        scale: { ...textStyle.transform.scale, x: scale / 100 }
                      }
                    })}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Height Scale</Label>
                    <span className="text-xs text-muted-foreground">
                      {(textStyle.transform.scale.y * 100).toFixed(0)}%
                      {textStyle.transform.scale.y === 1 && " (Normal)"}
                    </span>
                  </div>
                  <Slider
                    value={[textStyle.transform.scale.y * 100]}
                    min={50}
                    max={200}
                    step={1}
                    onValueChange={([scale]) => onTextStyleChange({
                      ...textStyle,
                      transform: {
                        ...textStyle.transform,
                        scale: { ...textStyle.transform.scale, y: scale / 100 }
                      }
                    })}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Letter Spacing</Label>
                  <Slider
                    value={[textStyle.letterSpacing]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={([letterSpacing]) => onTextStyleChange({ ...textStyle, letterSpacing })}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Opacity</Label>
                  <Slider
                    value={[textStyle.opacity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([opacity]) => onTextStyleChange({ ...textStyle, opacity })}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Rotation</Label>
                  <Slider
                    value={[textStyle.rotation]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={([rotation]) => onTextStyleChange({ ...textStyle, rotation })}
                    className="py-2"
                  />
                </div>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: textStyle.color }}
                      />
                      <span>Color</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-2">
                      {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map((color) => (
                        <Button
                          key={color}
                          variant="outline"
                          className="w-full h-8 p-0"
                          style={{ backgroundColor: color }}
                          onClick={() => onTextStyleChange({ ...textStyle, color })}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={textStyle.color}
                      onChange={(e) => onTextStyleChange({ ...textStyle, color: e.target.value })}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="font-medium">Text Effects</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-3">
            {/* Shadow Effect */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={textStyle.effects.shadow.enabled}
                  onCheckedChange={(enabled) => onTextStyleChange({
                    ...textStyle,
                    effects: {
                      ...textStyle.effects,
                      shadow: { ...textStyle.effects.shadow, enabled }
                    }
                  })}
                />
                <Label>Shadow Effect</Label>
              </div>
              {textStyle.effects.shadow.enabled && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label className="text-xs">Blur</Label>
                    <Slider
                      value={[textStyle.effects.shadow.blur]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={([blur]) => onTextStyleChange({
                        ...textStyle,
                        effects: {
                          ...textStyle.effects,
                          shadow: { ...textStyle.effects.shadow, blur }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Offset X</Label>
                    <Slider
                      value={[textStyle.effects.shadow.offsetX]}
                      min={-20}
                      max={20}
                      step={1}
                      onValueChange={([offsetX]) => onTextStyleChange({
                        ...textStyle,
                        effects: {
                          ...textStyle.effects,
                          shadow: { ...textStyle.effects.shadow, offsetX }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Offset Y</Label>
                    <Slider
                      value={[textStyle.effects.shadow.offsetY]}
                      min={-20}
                      max={20}
                      step={1}
                      onValueChange={([offsetY]) => onTextStyleChange({
                        ...textStyle,
                        effects: {
                          ...textStyle.effects,
                          shadow: { ...textStyle.effects.shadow, offsetY }
                        }
                      })}
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: textStyle.effects.shadow.color }}
                          />
                          <span>Shadow Color</span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <Input
                        type="color"
                        value={textStyle.effects.shadow.color}
                        onChange={(e) => onTextStyleChange({
                          ...textStyle,
                          effects: {
                            ...textStyle.effects,
                            shadow: { ...textStyle.effects.shadow, color: e.target.value }
                          }
                        })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Glow Effect */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={textStyle.effects.glow.enabled}
                  onCheckedChange={(enabled) => onTextStyleChange({
                    ...textStyle,
                    effects: {
                      ...textStyle.effects,
                      glow: { ...textStyle.effects.glow, enabled }
                    }
                  })}
                />
                <Label>Glow Effect</Label>
              </div>
              {textStyle.effects.glow.enabled && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label className="text-xs">Blur</Label>
                    <Slider
                      value={[textStyle.effects.glow.blur]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={([blur]) => onTextStyleChange({
                        ...textStyle,
                        effects: {
                          ...textStyle.effects,
                          glow: { ...textStyle.effects.glow, blur }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Strength</Label>
                    <Slider
                      value={[textStyle.effects.glow.strength]}
                      min={0}
                      max={2}
                      step={0.1}
                      onValueChange={([strength]) => onTextStyleChange({
                        ...textStyle,
                        effects: {
                          ...textStyle.effects,
                          glow: { ...textStyle.effects.glow, strength }
                        }
                      })}
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: textStyle.effects.glow.color }}
                          />
                          <span>Glow Color</span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <Input
                        type="color"
                        value={textStyle.effects.glow.color}
                        onChange={(e) => onTextStyleChange({
                          ...textStyle,
                          effects: {
                            ...textStyle.effects,
                            glow: { ...textStyle.effects.glow, color: e.target.value }
                          }
                        })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Gradient Effect */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={textStyle.effects.gradient.enabled}
                  onCheckedChange={(enabled) => onTextStyleChange({
                    ...textStyle,
                    effects: {
                      ...textStyle.effects,
                      gradient: { ...textStyle.effects.gradient, enabled }
                    }
                  })}
                />
                <Label>Gradient Effect</Label>
              </div>
              {textStyle.effects.gradient.enabled && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label className="text-xs">Angle</Label>
                    <Slider
                      value={[textStyle.effects.gradient.angle]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={([angle]) => onTextStyleChange({
                        ...textStyle,
                        effects: {
                          ...textStyle.effects,
                          gradient: { ...textStyle.effects.gradient, angle }
                        }
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Color 1</Label>
                      <Input
                        type="color"
                        value={textStyle.effects.gradient.colors[0]}
                        onChange={(e) => onTextStyleChange({
                          ...textStyle,
                          effects: {
                            ...textStyle.effects,
                            gradient: { 
                              ...textStyle.effects.gradient, 
                              colors: [e.target.value, textStyle.effects.gradient.colors[1]] 
                            }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Color 2</Label>
                      <Input
                        type="color"
                        value={textStyle.effects.gradient.colors[1]}
                        onChange={(e) => onTextStyleChange({
                          ...textStyle,
                          effects: {
                            ...textStyle.effects,
                            gradient: { 
                              ...textStyle.effects.gradient, 
                              colors: [textStyle.effects.gradient.colors[0], e.target.value] 
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Outline Effect */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={textStyle.effects.outline.enabled}
                  onCheckedChange={(enabled) => onTextStyleChange({
                    ...textStyle,
                    effects: {
                      ...textStyle.effects,
                      outline: { ...textStyle.effects.outline, enabled }
                    }
                  })}
                />
                <Label>Outline Effect</Label>
              </div>
              {textStyle.effects.outline.enabled && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label className="text-xs">Width</Label>
                    <Slider
                      value={[textStyle.effects.outline.width]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([width]) => onTextStyleChange({
                        ...textStyle,
                        effects: {
                          ...textStyle.effects,
                          outline: { ...textStyle.effects.outline, width }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Blur</Label>
                    <Slider
                      value={[textStyle.effects.outline.blur]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={([blur]) => onTextStyleChange({
                        ...textStyle,
                        effects: {
                          ...textStyle.effects,
                          outline: { ...textStyle.effects.outline, blur }
                        }
                      })}
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: textStyle.effects.outline.color }}
                          />
                          <span>Outline Color</span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <Input
                        type="color"
                        value={textStyle.effects.outline.color}
                        onChange={(e) => onTextStyleChange({
                          ...textStyle,
                          effects: {
                            ...textStyle.effects,
                            outline: { ...textStyle.effects.outline, color: e.target.value }
                          }
                        })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              <span className="font-medium">Image Adjustments</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-3">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Brightness</Label>
                  <span className="text-xs text-muted-foreground">{imageAdjustments.brightness}%</span>
                </div>
                <Slider
                  value={[imageAdjustments.brightness]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={([brightness]) => onImageAdjustmentsChange({ ...imageAdjustments, brightness })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Contrast</Label>
                  <span className="text-xs text-muted-foreground">{imageAdjustments.contrast}%</span>
                </div>
                <Slider
                  value={[imageAdjustments.contrast]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={([contrast]) => onImageAdjustmentsChange({ ...imageAdjustments, contrast })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Saturation</Label>
                  <span className="text-xs text-muted-foreground">{imageAdjustments.saturation}%</span>
                </div>
                <Slider
                  value={[imageAdjustments.saturation]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={([saturation]) => onImageAdjustmentsChange({ ...imageAdjustments, saturation })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Blur</Label>
                  <span className="text-xs text-muted-foreground">{imageAdjustments.blur}px</span>
                </div>
                <Slider
                  value={[imageAdjustments.blur]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={([blur]) => onImageAdjustmentsChange({ ...imageAdjustments, blur })}
                />
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onImageAdjustmentsChange(defaultAdjustments)}
              >
                Reset Adjustments
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <span className="font-medium">Watermark</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={textStyle.watermark?.enabled || false}
                onCheckedChange={(enabled) => onTextStyleChange({
                  ...textStyle,
                  watermark: {
                    enabled,
                    text: textStyle.watermark?.text || '',
                    position: textStyle.watermark?.position || 'bottom-right',
                    fontSize: textStyle.watermark?.fontSize || 24
                  }
                })}
              />
              <Label>Enable Watermark</Label>
            </div>
            {textStyle.watermark?.enabled && textStyle.watermark && (
              <>
                <Input
                  value={textStyle.watermark.text}
                  onChange={(e) => onTextStyleChange({
                    ...textStyle,
                    watermark: {
                      ...textStyle.watermark,
                      enabled: true,
                      text: e.target.value,
                      position: textStyle.watermark.position,
                      fontSize: textStyle.watermark.fontSize
                    }
                  })}
                  placeholder="Watermark text"
                />
                <Select
                  value={textStyle.watermark.position}
                  onValueChange={(position) => onTextStyleChange({
                    ...textStyle,
                    watermark: {
                      ...textStyle.watermark,
                      enabled: true,
                      position: position as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
                      text: textStyle.watermark.text,
                      fontSize: textStyle.watermark.fontSize
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                      <SelectItem key={pos} value={pos}>
                        {pos.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">AI Enhancements</span>
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Premium</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-3">
            <div className="space-y-4 blur-sm pointer-events-none">
              <Button className="w-full" variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Smart Text Suggestions
              </Button>
              <Button className="w-full" variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Style Templates
              </Button>
            </div>
            <Button className="w-full" variant="outline">
              Upgrade to Premium
            </Button>
          </CollapsibleContent>
        </Collapsible>

        <Button 
          onClick={onProcess} 
          disabled={isProcessing || !image}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Remove Background'
          )}
        </Button>
      </div>
    </div>
  )
}

export type { TextStyle }
export default TextEditor
