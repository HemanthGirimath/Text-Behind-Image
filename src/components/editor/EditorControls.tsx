import React, { useState } from 'react';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Slider } from '@/components/UI/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import { TextStyle } from '@/lib/types';
import { Button } from '@/components/UI/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  ChevronDown,
  ChevronUp,
  Languages,
  Sparkles,
  Palette,
  Box,
  Type
} from 'lucide-react';
import { Switch } from '@/components/UI/switch';
import { usePlanFeatures } from '@/hooks/usePlanFeatures'

const FONTS = [
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Helvetica',
  'Roboto',
  'Open Sans',
  'Montserrat'
];

interface EditorControlsProps {
  textLayer: TextStyle;
  onUpdate: (updates: Partial<TextStyle>) => void;
}

interface PlanContainerProps {
  title: string;
  children: React.ReactNode;
}

function PlanContainer({ title, children }: PlanContainerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <button
        className="flex items-center justify-between w-full"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isExpanded && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface ControlSectionProps {
  title: string;
  children: React.ReactNode;
}

function ControlSection({ title, children }: ControlSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{title}</Label>
      {children}
    </div>
  );
}

export function EditorControls({ textLayer, onUpdate }: EditorControlsProps) {
  const { canAccessPlanFeatures } = usePlanFeatures()

  return (
    <div className="space-y-6">
      {/* Free Plan Features */}
      <PlanContainer title="Free">
        <ControlSection title="Text">
          <Input
            value={textLayer.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Enter your text..."
          />
        </ControlSection>

        <ControlSection title="Font">
          <Select
            value={textLayer.fontFamily}
            onValueChange={(value) => onUpdate({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlSection>

        <ControlSection title="Size">
          <div className="flex items-center gap-4">
            <Slider
              value={[textLayer.fontSize]}
              onValueChange={([value]) => onUpdate({ fontSize: value })}
              min={8}
              max={200}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-sm">{textLayer.fontSize}px</span>
          </div>
        </ControlSection>

        <ControlSection title="Letter Spacing">
          <div className="flex items-center gap-4">
            <Slider
              value={[textLayer.letterSpacing]}
              onValueChange={([value]) => onUpdate({ letterSpacing: value })}
              min={-5}
              max={20}
              step={0.5}
              className="flex-1"
            />
            <span className="w-12 text-sm">{textLayer.letterSpacing}px</span>
          </div>
        </ControlSection>

        <ControlSection title="Style">
          <div className="flex gap-2">
            <Button
              variant={textLayer.style.bold ? "default" : "outline"}
              size="icon"
              onClick={() => onUpdate({ style: { ...textLayer.style, bold: !textLayer.style.bold } })}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={textLayer.style.italic ? "default" : "outline"}
              size="icon"
              onClick={() => onUpdate({ style: { ...textLayer.style, italic: !textLayer.style.italic } })}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={textLayer.style.underline ? "default" : "outline"}
              size="icon"
              onClick={() => onUpdate({ style: { ...textLayer.style, underline: !textLayer.style.underline } })}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </ControlSection>

        <ControlSection title="Color">
          <Input
            type="color"
            value={textLayer.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-full h-10"
          />
        </ControlSection>

        <ControlSection title="Blur">
          <div className="flex items-center gap-4">
            <Slider
              value={[textLayer.blur || 0]}
              onValueChange={([value]) => onUpdate({ blur: value })}
              min={0}
              max={20}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-sm">{textLayer.blur || 0}px</span>
          </div>
        </ControlSection>

        <ControlSection title="Opacity">
          <div className="flex items-center gap-4">
            <Slider
              value={[textLayer.opacity]}
              onValueChange={([value]) => onUpdate({ opacity: value })}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-sm">{textLayer.opacity}%</span>
          </div>
        </ControlSection>

        <ControlSection title="Position">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="w-8">X:</Label>
              <Slider
                value={[textLayer.x]}
                onValueChange={([value]) => onUpdate({ x: value })}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-sm">{textLayer.x}%</span>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-8">Y:</Label>
              <Slider
                value={[textLayer.y]}
                onValueChange={([value]) => onUpdate({ y: value })}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-sm">{textLayer.y}%</span>
            </div>
          </div>
        </ControlSection>

        <ControlSection title="Rotation">
          <div className="flex items-center gap-4">
            <Slider
              value={[textLayer.rotation]}
              onValueChange={([value]) => onUpdate({ rotation: value })}
              min={-180}
              max={180}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-sm">{textLayer.rotation}°</span>
          </div>
        </ControlSection>
      </PlanContainer>

      {/* Basic Plan Features */}
      {canAccessPlanFeatures('basic') ? (
        <PlanContainer title="Basic">
          <ControlSection title="Shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Shadow</Label>
                <Switch
                  checked={textLayer.shadow?.enabled || false}
                  onCheckedChange={(checked) => onUpdate({
                    shadow: {
                      ...textLayer.shadow,
                      enabled: checked,
                      color: textLayer.shadow?.color || '#000000',
                      blur: textLayer.shadow?.blur || 4,
                      offsetX: textLayer.shadow?.offsetX || 0,
                      offsetY: textLayer.shadow?.offsetY || 4
                    }
                  })}
                />
              </div>

              {textLayer.shadow?.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Shadow Color:</Label>
                    <Input
                      type="color"
                      value={textLayer.shadow?.color || '#000000'}
                      onChange={(e) => onUpdate({ 
                        shadow: { 
                          ...textLayer.shadow,
                          color: e.target.value 
                        } 
                      })}
                      className="w-full h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Blur:</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[textLayer.shadow?.blur || 4]}
                        onValueChange={([value]) => onUpdate({
                          shadow: {
                            ...textLayer.shadow,
                            blur: value
                          }
                        })}
                        min={0}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm">{textLayer.shadow?.blur || 4}px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Offset X:</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[textLayer.shadow?.offsetX || 0]}
                        onValueChange={([value]) => onUpdate({
                          shadow: {
                            ...textLayer.shadow,
                            offsetX: value
                          }
                        })}
                        min={-20}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm">{textLayer.shadow?.offsetX || 0}px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Offset Y:</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[textLayer.shadow?.offsetY || 4]}
                        onValueChange={([value]) => onUpdate({
                          shadow: {
                            ...textLayer.shadow,
                            offsetY: value
                          }
                        })}
                        min={-20}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm">{textLayer.shadow?.offsetY || 4}px</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ControlSection>

          <ControlSection title="Gradient">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Gradient</Label>
                <Switch
                  checked={textLayer.gradient?.enabled || false}
                  onCheckedChange={(checked) => onUpdate({
                    gradient: {
                      ...textLayer.gradient,
                      enabled: checked,
                      startColor: textLayer.gradient?.startColor || '#ff0000',
                      endColor: textLayer.gradient?.endColor || '#00ff00',
                      angle: textLayer.gradient?.angle || 0
                    }
                  })}
                />
              </div>

              {textLayer.gradient?.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Start Color:</Label>
                    <Input
                      type="color"
                      value={textLayer.gradient?.startColor || '#ff0000'}
                      onChange={(e) => onUpdate({
                        gradient: {
                          ...textLayer.gradient,
                          startColor: e.target.value
                        }
                      })}
                      className="w-full h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End Color:</Label>
                    <Input
                      type="color"
                      value={textLayer.gradient?.endColor || '#00ff00'}
                      onChange={(e) => onUpdate({
                        gradient: {
                          ...textLayer.gradient,
                          endColor: e.target.value
                        }
                      })}
                      className="w-full h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Angle:</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[textLayer.gradient?.angle || 0]}
                        onValueChange={([value]) => onUpdate({
                          gradient: {
                            ...textLayer.gradient,
                            angle: value
                          }
                        })}
                        min={0}
                        max={360}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm">{textLayer.gradient?.angle || 0}°</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ControlSection>

          <ControlSection title="Transform">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="w-20">Skew X:</Label>
                <Slider
                  value={[textLayer.transform?.skewX || 0]}
                  onValueChange={([value]) => onUpdate({
                    transform: {
                      skewX: value,
                      skewY: textLayer.transform?.skewY || 0,
                      scale: textLayer.transform?.scale || 1
                    }
                  })}
                  min={-45}
                  max={45}
                  step={1}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-20">Skew Y:</Label>
                <Slider
                  value={[textLayer.transform?.skewY || 0]}
                  onValueChange={([value]) => onUpdate({
                    transform: {
                      skewX: textLayer.transform?.skewX || 0,
                      skewY: value,
                      scale: textLayer.transform?.scale || 1
                    }
                  })}
                  min={-45}
                  max={45}
                  step={1}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-20">Scale:</Label>
                <Slider
                  value={[textLayer.transform?.scale || 1]}
                  onValueChange={([value]) => onUpdate({
                    transform: {
                      skewX: textLayer.transform?.skewX || 0,
                      skewY: textLayer.transform?.skewY || 0,
                      scale: value
                    }
                  })}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
              </div>
            </div>
          </ControlSection>
        </PlanContainer>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="text-center text-muted-foreground">
            <h3 className="font-semibold mb-2">Basic Plan Features</h3>
            <p className="text-sm">Upgrade to access advanced text styling features</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.href = '/upgrade'}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Premium Plan Features */}
      {canAccessPlanFeatures('premium') ? (
        <PlanContainer title="Premium">
          <ControlSection title="Text Effect Templates">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neon">Neon Effect</SelectItem>
                <SelectItem value="retro">Retro Style</SelectItem>
                <SelectItem value="3d">3D Text</SelectItem>
              </SelectContent>
            </Select>
          </ControlSection>

          <ControlSection title="Multi-language Support">
            <Button className="w-full" variant="outline">
              <Languages className="w-4 h-4 mr-2" />
              Translate Text
            </Button>
          </ControlSection>

          <ControlSection title="AI Text Generation">
            <Button className="w-full" variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Text
            </Button>
          </ControlSection>
        </PlanContainer>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="text-center text-muted-foreground">
            <h3 className="font-semibold mb-2">Premium Plan Features</h3>
            <p className="text-sm">Upgrade to access AI-powered features and effects</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.href = '/upgrade'}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
