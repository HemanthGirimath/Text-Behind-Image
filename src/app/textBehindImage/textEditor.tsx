'use client'

import React, { useRef } from 'react'
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
  textStyle: TextStyle
  onTextStyleChange: (style: TextStyle) => void
  controlsOnly?: boolean
}

const TextEditor: React.FC<TextEditorProps> = ({
  textStyle,
  onTextStyleChange,
  controlsOnly = false
}) => {
  const textRef = useRef<HTMLDivElement>(null)

  if (controlsOnly) {
    return (
      <div className="space-y-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="text">
              <Type className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="transform">
              <Sliders className="h-4 w-4" />
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
                onChange={(e) => onTextStyleChange({ ...textStyle, text: e.target.value })}
              />
            </div>
            <div>
              <Label>Font Size</Label>
              <Slider
                value={[textStyle.fontSize]}
                min={12}
                max={200}
                step={1}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, fontSize: value[0] })}
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={textStyle.color}
                onChange={(e) => onTextStyleChange({ ...textStyle, color: e.target.value })}
              />
            </div>
            <div>
              <Label>Font Family</Label>
              <Select
                value={textStyle.fontFamily}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, fontFamily: value })}
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
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Opacity</Label>
              <Slider
                value={[textStyle.opacity]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, opacity: value[0] })}
              />
            </div>
            <div>
              <Label>Letter Spacing</Label>
              <Slider
                value={[textStyle.letterSpacing]}
                min={-5}
                max={20}
                step={0.5}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, letterSpacing: value[0] })}
              />
            </div>
          </TabsContent>

          <TabsContent value="transform" className="space-y-4">
            <div>
              <Label>Scale X</Label>
              <Slider
                value={[textStyle.transform.scale.x]}
                min={0.1}
                max={3}
                step={0.1}
                onValueChange={(value) => onTextStyleChange({
                  ...textStyle,
                  transform: {
                    ...textStyle.transform,
                    scale: { ...textStyle.transform.scale, x: value[0] }
                  }
                })}
              />
            </div>
            <div>
              <Label>Scale Y</Label>
              <Slider
                value={[textStyle.transform.scale.y]}
                min={0.1}
                max={3}
                step={0.1}
                onValueChange={(value) => onTextStyleChange({
                  ...textStyle,
                  transform: {
                    ...textStyle.transform,
                    scale: { ...textStyle.transform.scale, y: value[0] }
                  }
                })}
              />
            </div>
            <div>
              <Label>Rotation</Label>
              <Slider
                value={[textStyle.rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, rotation: value[0] })}
              />
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
                onValueChange={(value) => onTextStyleChange({ ...textStyle, x: value[0] })}
              />
            </div>
            <div>
              <Label>Y Position</Label>
              <Slider
                value={[textStyle.y]}
                min={0}
                max={600}
                step={1}
                onValueChange={(value) => onTextStyleChange({ ...textStyle, y: value[0] })}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t">
          <Button 
            className="w-full flex items-center gap-2 py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-200 hover:shadow-xl" 
            variant="default"
          >
            <ImageDown className="h-5 w-5" />
            Process Image
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={textRef}
      className="relative w-full h-full"
      style={{
        fontFamily: textStyle.fontFamily,
        fontSize: `${textStyle.fontSize}px`,
        color: textStyle.color,
        transform: `
          translate(${textStyle.x}px, ${textStyle.y}px)
          rotate(${textStyle.rotation}deg)
          scale(${textStyle.transform.scale.x}, ${textStyle.transform.scale.y})
        `,
        opacity: textStyle.opacity / 100,
        letterSpacing: `${textStyle.letterSpacing}px`,
      }}
    >
      {textStyle.text}
    </div>
  )
}

export default TextEditor
