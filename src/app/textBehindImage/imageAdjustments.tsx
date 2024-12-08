'use client'

import React from 'react'
import { Slider } from '@/components/UI/slider'
import { Label } from '@/components/UI/label'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/UI/collapsible"
import { ChevronDown, Settings2 } from 'lucide-react'

interface ImageAdjustmentsProps {
  adjustments: ImageAdjustments
  onAdjustmentsChange: (adjustments: ImageAdjustments) => void
}

export interface ImageAdjustments {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  opacity: number
  filters: {
    grayscale: boolean
    sepia: boolean
    invert: boolean
  }
}

export const defaultAdjustments: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  opacity: 100,
  filters: {
    grayscale: false,
    sepia: false,
    invert: false
  }
}

export function ImageAdjustments({ adjustments, onAdjustmentsChange }: ImageAdjustmentsProps) {
  return (
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
              <span className="text-xs text-muted-foreground">{adjustments.brightness}%</span>
            </div>
            <Slider
              value={[adjustments.brightness]}
              min={0}
              max={200}
              step={1}
              onValueChange={([brightness]) => onAdjustmentsChange({ ...adjustments, brightness })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Contrast</Label>
              <span className="text-xs text-muted-foreground">{adjustments.contrast}%</span>
            </div>
            <Slider
              value={[adjustments.contrast]}
              min={0}
              max={200}
              step={1}
              onValueChange={([contrast]) => onAdjustmentsChange({ ...adjustments, contrast })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Saturation</Label>
              <span className="text-xs text-muted-foreground">{adjustments.saturation}%</span>
            </div>
            <Slider
              value={[adjustments.saturation]}
              min={0}
              max={200}
              step={1}
              onValueChange={([saturation]) => onAdjustmentsChange({ ...adjustments, saturation })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Blur</Label>
              <span className="text-xs text-muted-foreground">{adjustments.blur}px</span>
            </div>
            <Slider
              value={[adjustments.blur]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={([blur]) => onAdjustmentsChange({ ...adjustments, blur })}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}