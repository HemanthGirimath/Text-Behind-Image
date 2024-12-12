'use client'

import { useState } from 'react'
import { Button } from "@/components/UI/button"
import { Input } from "@/components/UI/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select"
import { Slider } from "@/components/UI/slider"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface TextControlsProps {
  onTextChange: (config: TextConfig) => void
  onRemoveBackground: () => void
  isProcessing: boolean
}

export interface TextConfig {
  text: string
  font: string
  style: string
  size: number
  spacing: number
  alignment: 'left' | 'center' | 'right'
  opacity: number
  italic: boolean
  underline: boolean
  position: { x: number, y: number }
}

interface FeatureSectionProps {
  title: string
  children: React.ReactNode
}

function FeatureSection({ title, children }: FeatureSectionProps) {
  return (
    <div className="relative rounded-lg border p-4">
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      {children}
    </div>
  )
}

export function TextControls({ onTextChange, onRemoveBackground, isProcessing }: TextControlsProps) {
  const [config, setConfig] = useState<TextConfig>({
    text: 'Click to add text',
    font: 'Arial',
    style: 'Regular',
    size: 72,
    spacing: 0,
    alignment: 'center',
    opacity: 100,
    italic: false,
    underline: false,
    position: { x: 50, y: 50 }
  })

  const updateConfig = (updates: Partial<TextConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onTextChange(newConfig)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
      {/* Text Input */}
      <FeatureSection title="Basic Text">
        <Input
          placeholder="Enter your text"
          value={config.text}
          onChange={(e) => updateConfig({ text: e.target.value })}
        />
        
        <div className="flex gap-4 mt-4">
          <Select value={config.font} onValueChange={(value) => updateConfig({ font: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
            </SelectContent>
          </Select>

          <Select value={config.style} onValueChange={(value) => updateConfig({ style: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Regular">Regular</SelectItem>
              <SelectItem value="Bold">Bold</SelectItem>
              <SelectItem value="Light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FeatureSection>

      {/* Text Styling */}
      <FeatureSection title="Text Styling">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm">Size</span>
            <Slider
              value={[config.size]}
              onValueChange={(value) => updateConfig({ size: value[0] })}
              min={12}
              max={200}
              step={1}
              className="w-32"
            />
            <span className="text-sm min-w-[60px]">{config.size}px</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={config.italic ? "default" : "outline"}
                size="icon"
                onClick={() => updateConfig({ italic: !config.italic })}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={config.underline ? "default" : "outline"}
                size="icon"
                onClick={() => updateConfig({ underline: !config.underline })}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* Advanced Styling */}
      <FeatureSection title="Advanced Styling">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm">Spacing</span>
            <Slider
              value={[config.spacing]}
              onValueChange={(value) => updateConfig({ spacing: value[0] })}
              min={0}
              max={20}
              step={1}
              className="w-32"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm">Opacity</span>
            <Slider
              value={[config.opacity]}
              onValueChange={(value) => updateConfig({ opacity: value[0] })}
              min={0}
              max={100}
              step={1}
              className="w-32"
            />
            <span className="text-sm min-w-[60px]">{config.opacity}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={config.alignment === 'left' ? "default" : "outline"}
                size="icon"
                onClick={() => updateConfig({ alignment: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={config.alignment === 'center' ? "default" : "outline"}
                size="icon"
                onClick={() => updateConfig({ alignment: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={config.alignment === 'right' ? "default" : "outline"}
                size="icon"
                onClick={() => updateConfig({ alignment: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </FeatureSection>

      <Button 
        className="w-full" 
        onClick={onRemoveBackground}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Remove Background'}
      </Button>
    </div>
  )
}
