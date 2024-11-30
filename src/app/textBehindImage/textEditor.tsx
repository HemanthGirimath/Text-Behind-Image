'use client'

import React, { useState } from 'react'
import { Input } from '@/components/UI/input'
import { Label } from '@/components/UI/label'
import { Slider } from '@/components/UI/slider'
import { Button } from '@/components/UI/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Move,
  Palette,
  Sparkles,
  Lock,
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
  textStyle: TextStyle
  onTextStyleChange: (style: TextStyle) => void
  controlsOnly?: boolean
}

const TextEditor: React.FC<TextEditorProps> = ({
  textStyle,
  onTextStyleChange,
  controlsOnly = false
}) => {
  const [activeTab, setActiveTab] = useState('text')

  const updateStyle = (updates: Partial<TextStyle>) => {
    onTextStyleChange({ ...textStyle, ...updates })
  }

  if (controlsOnly) {
    return (
      <div className="space-y-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="text">
              <Type className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="style">
              <Palette className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="effects">
              <Sparkles className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="position">
              <Move className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Label>Text Content</Label>
              <Input
                value={textStyle.text}
                onChange={(e) => updateStyle({ text: e.target.value })}
                placeholder="Enter your text..."
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={textStyle.style.bold ? "default" : "outline"}
                size="icon"
                onClick={() => updateStyle({ 
                  style: { 
                    ...textStyle.style, 
                    bold: !textStyle.style.bold 
                  } 
                })}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={textStyle.style.italic ? "default" : "outline"}
                size="icon"
                onClick={() => updateStyle({ 
                  style: { 
                    ...textStyle.style, 
                    italic: !textStyle.style.italic 
                  } 
                })}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={textStyle.style.underline ? "default" : "outline"}
                size="icon"
                onClick={() => updateStyle({ 
                  style: { 
                    ...textStyle.style, 
                    underline: !textStyle.style.underline 
                  } 
                })}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={textStyle.align === 'left' ? "default" : "outline"}
                size="icon"
                onClick={() => updateStyle({ align: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={textStyle.align === 'center' ? "default" : "outline"}
                size="icon"
                onClick={() => updateStyle({ align: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={textStyle.align === 'right' ? "default" : "outline"}
                size="icon"
                onClick={() => updateStyle({ align: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div>
              <Label>Font Size</Label>
              <Slider
                value={[textStyle.fontSize]}
                min={12}
                max={200}
                step={1}
                onValueChange={(value) => updateStyle({ fontSize: value[0] })}
              />
            </div>

            <div>
              <Label>Font Family</Label>
              <Select
                value={textStyle.fontFamily}
                onValueChange={(value) => updateStyle({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={textStyle.color}
                onChange={(e) => updateStyle({ color: e.target.value })}
              />
            </div>

            <div>
              <Label>Opacity</Label>
              <Slider
                value={[textStyle.opacity]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => updateStyle({ opacity: value[0] })}
              />
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Pro Effects</Label>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2 opacity-50">
                <Button variant="outline" className="w-full" disabled>
                  Shadow Effect
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Glow Effect
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Gradient Text
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Text Outline
                </Button>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Upgrade to Pro to unlock advanced text effects
              </div>
            </div>
          </TabsContent>

          <TabsContent value="position" className="space-y-4">
            <div>
              <Label>X Position</Label>
              <Slider
                value={[textStyle.x]}
                min={0}
                max={800}
                step={1}
                onValueChange={(value) => updateStyle({ x: value[0] })}
              />
            </div>

            <div>
              <Label>Y Position</Label>
              <Slider
                value={[textStyle.y]}
                min={0}
                max={600}
                step={1}
                onValueChange={(value) => updateStyle({ y: value[0] })}
              />
            </div>

            <div>
              <Label>Rotation</Label>
              <Slider
                value={[textStyle.rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => updateStyle({ rotation: value[0] })}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-full"
      style={{
        fontFamily: textStyle.fontFamily,
        fontSize: `${textStyle.fontSize}px`,
        color: textStyle.color,
        transform: `translate(${textStyle.x}px, ${textStyle.y}px) rotate(${textStyle.rotation}deg)`,
        opacity: textStyle.opacity / 100,
        fontWeight: textStyle.style.bold ? 'bold' : 'normal',
        fontStyle: textStyle.style.italic ? 'italic' : 'normal',
        textDecoration: textStyle.style.underline ? 'underline' : 'none',
        textAlign: textStyle.align,
      }}
    >
      {textStyle.text}
    </div>
  )
}

export default TextEditor
