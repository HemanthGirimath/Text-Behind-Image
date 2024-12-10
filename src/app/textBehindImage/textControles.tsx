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
  isLocked: boolean
  children: React.ReactNode
}

function FeatureSection({ title, isLocked, children }: FeatureSectionProps) {
  return (
    <div className={`relative rounded-lg border p-4 ${isLocked ? 'pointer-events-none' : ''}`}>
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      {children}
      {isLocked && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Upgrade required</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function TextControls({ onTextChange, onRemoveBackground, isProcessing }: TextControlsProps) {
  const { data: session } = useSession()
  const userPlan = session?.user?.plan || 'free'

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
    position: { x: 50, y: 50 } // Center of the image
  })

  const updateConfig = (updates: Partial<TextConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onTextChange(newConfig)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
      {/* Free Features */}
      <FeatureSection title="Basic Text" isLocked={false}>
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

      {/* Basic Plan Features */}
      <FeatureSection title="Text Styling" isLocked={userPlan === 'free'}>
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

      {/* Premium Features */}
      <FeatureSection title="Advanced Styling" isLocked={userPlan !== 'premium'}>
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

      <div className="mt-4">
        <Button 
          onClick={onRemoveBackground}
          disabled={isProcessing}
          className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          {isProcessing ? 'Processing...' : 'Remove Background'}
        </Button>
      </div>
    </div>
  )
}
