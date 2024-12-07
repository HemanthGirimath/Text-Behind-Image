'use client'

import React from 'react'
import { Slider } from '@/components/UI/slider'
import { Label } from '@/components/UI/label'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/UI/collapsible"
import { ChevronDown, Settings2 } from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'
import { UpgradeModal } from '@/components/UI/upgrade-modal'
import type { FeatureKey } from '@/lib/subscription'
import { useEditor } from '@/contexts/editor-context'
import { UserPlan } from '@/lib/utils'

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

export interface ImageAdjustmentsProps {
  adjustments: ImageAdjustments;
  onAdjustmentsChange: (adjustments: ImageAdjustments) => void;
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
  const { canUseFeature, currentPlan } = useSubscription()
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false)
  const [restrictedFeature, setRestrictedFeature] = React.useState<FeatureKey>('basicEffects')

  const canUseBasicEffects = canUseFeature('basicEffects')
  const canUseAdvancedEffects = canUseFeature('advancedEffects')

  const handleAdjustmentChange = (newAdjustments: Partial<ImageAdjustments>) => {
    if (!canUseBasicEffects) {
      setRestrictedFeature('basicEffects')
      setShowUpgradeModal(true)
      return
    }

    if (newAdjustments.filters && !canUseAdvancedEffects) {
      setRestrictedFeature('advancedEffects')
      setShowUpgradeModal(true)
      return
    }

    onAdjustmentsChange({ ...adjustments, ...newAdjustments })
  }

  return (
    <>
      <Collapsible className="w-full space-y-2">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 hover:bg-accent hover:text-accent-foreground">
          <div className="flex items-center space-x-2">
            <Settings2 className="h-4 w-4" />
            <span>Image Adjustments</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 px-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Brightness</Label>
              <Slider
                min={0}
                max={200}
                step={1}
                value={[adjustments.brightness]}
                onValueChange={([value]) => handleAdjustmentChange({ brightness: value })}
                disabled={!canUseBasicEffects}
              />
            </div>
            <div className="space-y-2">
              <Label>Contrast</Label>
              <Slider
                min={0}
                max={200}
                step={1}
                value={[adjustments.contrast]}
                onValueChange={([value]) => handleAdjustmentChange({ contrast: value })}
                disabled={!canUseBasicEffects}
              />
            </div>
            <div className="space-y-2">
              <Label>Saturation</Label>
              <Slider
                min={0}
                max={200}
                step={1}
                value={[adjustments.saturation]}
                onValueChange={([value]) => handleAdjustmentChange({ saturation: value })}
                disabled={!canUseBasicEffects}
              />
            </div>
            <div className="space-y-2">
              <Label>Blur</Label>
              <Slider
                min={0}
                max={20}
                step={1}
                value={[adjustments.blur]}
                onValueChange={([value]) => handleAdjustmentChange({ blur: value })}
                disabled={!canUseBasicEffects}
              />
            </div>
            <div className="space-y-2">
              <Label>Opacity</Label>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[adjustments.opacity]}
                onValueChange={([value]) => handleAdjustmentChange({ opacity: value })}
                disabled={!canUseBasicEffects}
              />
            </div>
            <div className="space-y-2">
              <Label>Filters</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={adjustments.filters.grayscale}
                    onChange={(e) => handleAdjustmentChange({ filters: { ...adjustments.filters, grayscale: e.target.checked } })}
                    disabled={!canUseAdvancedEffects}
                  />
                  <Label>Grayscale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={adjustments.filters.sepia}
                    onChange={(e) => handleAdjustmentChange({ filters: { ...adjustments.filters, sepia: e.target.checked } })}
                    disabled={!canUseAdvancedEffects}
                  />
                  <Label>Sepia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={adjustments.filters.invert}
                    onChange={(e) => handleAdjustmentChange({ filters: { ...adjustments.filters, invert: e.target.checked } })}
                    disabled={!canUseAdvancedEffects}
                  />
                  <Label>Invert</Label>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <UpgradeModal
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={restrictedFeature}
        currentPlan={currentPlan as UserPlan}
      />
    </>
  )
}