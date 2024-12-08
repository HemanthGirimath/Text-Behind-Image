'use client'

import React, { useCallback } from 'react'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { Label } from '@/components/UI/label'
import { Slider } from '@/components/UI/slider'
import { ScrollArea } from '@/components/UI/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Trash2,
  Type,
  Sliders,
  RotateCw,
  Plus,
} from 'lucide-react'
import { generateId } from '@/lib/utils'
import { FeatureGroup } from '@/components/editor/FeatureGroup'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { useToast } from '@/components/UI/use-toast'
import { TextStyle } from '@/lib/types'
import { Switch } from '@/components/UI/switch'

interface TextEditorProps {
  textStyles: TextStyle[]
  selectedTextId: string | null
  onTextStyleChange: (style: Partial<TextStyle> & { id: string }) => void
  onTextSelect: (id: string | null) => void
  onDelete: () => void
  controlsOnly?: boolean
}

const BASIC_FONTS = [
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Helvetica',
  'Courier New',
  'Trebuchet MS',
  'Impact'
]

const DEFAULT_TEXT_STYLE: TextStyle = {
  id: '',
  // Free Plan Features
  text: 'New Text',
  fontFamily: 'Arial',
  fontSize: 120,
  color: '#000000',
  x: 50,
  y: 50,
  letterSpacing: 0,

  // Basic Plan Features
  opacity: 100,
  rotation: 0,
  style: {
    bold: false,
    italic: false,
    underline: false
  },

  // Other properties
  align: 'center',

  // Premium Plan Features
  shadow: {
    enabled: false,
    blur: 0,
    color: '#000000',
    offsetX: 2,
    offsetY: 2
  },
  gradient: {
    enabled: false,
    colors: ['#000000', '#ffffff']
  },
  glow: {
    enabled: false,
    blur: 10,
    color: '#ffffff',
    intensity: 0
  },
  outline: {
    enabled: false,
    width: 0,
    color: '#000000'
  },
  transform: {
    enabled: false,
    skewX: 0,
    skewY: 0,
    scaleX: 1,
    scaleY: 1
  }
};

const initialStyle: TextStyle = {
  id: '',
  text: '',
  x: 50,
  y: 50,
  fontSize: 24,
  fontFamily: 'Arial',
  color: '#000000',
  align: 'center',
  style: {
    bold: false,
    italic: false,
    underline: false
  },
  opacity: 100,
  rotation: 0,
  letterSpacing: 0,
  transform: {
    enabled: false,
    skewX: 0,
    skewY: 0,
    scaleX: 1,
    scaleY: 1
  },
};

export const TextEditor = ({
  textStyles,
  selectedTextId,
  onTextStyleChange,
  onTextSelect,
  onDelete,
  controlsOnly = false,
}: TextEditorProps) => {
  const { toast } = useToast()
  const { hasAccess } = useFeatureAccess()
  const selectedStyle = selectedTextId 
    ? textStyles.find(style => style.id === selectedTextId) 
    : null

  const handleAddText = useCallback(() => {
    const maxLayers = 10
    if (textStyles.length >= maxLayers) {
      toast({
        title: "Layer limit reached",
        description: "Upgrade your plan to add more text layers",
        variant: "destructive"
      })
      return
    }
    const newStyle: TextStyle = {
      ...DEFAULT_TEXT_STYLE,
      id: generateId(),
      text: 'New Text',
      fontFamily: 'Arial',
      fontSize: 120,
      color: '#000000',
      x: 50,
      y: 50,
      opacity: 100,
      align: 'center',
      rotation: 0,
      style: {
        bold: true,
        italic: false,
        underline: false
      },
      letterSpacing: 0
    }
    onTextStyleChange(newStyle)
    onTextSelect(newStyle.id)
  }, [textStyles, onTextStyleChange, onTextSelect, toast])

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 p-4">
        <h3 className="font-semibold">Text Layer</h3>
        <Button onClick={handleAddText} variant="secondary" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Text
        </Button>
      </div>

      {textStyles.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-muted-foreground">
            No text layers yet. Click the "Add Text" button above to create one.
          </p>
        </div>
      ) : selectedStyle ? (
        <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
          <div className="space-y-6">
            {/* FREE PLAN FEATURES */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Free Plan Features</h3>
              
              {/* Basic Text Input */}
              <FeatureGroup feature="basic_text">
                <div className="space-y-2">
                  <Label>Text Content</Label>
                  <Input
                    value={selectedStyle.text}
                    onChange={(e) => onTextStyleChange({ ...selectedStyle, text: e.target.value })}
                    placeholder="Enter text..."
                  />
                </div>
              </FeatureGroup>

              {/* Font Size */}
              <FeatureGroup feature="font_size">
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Slider
                    value={[selectedStyle.fontSize]}
                    onValueChange={([value]) => onTextStyleChange({ ...selectedStyle, fontSize: value })}
                    min={12}
                    max={500}
                    step={1}
                  />
                </div>
              </FeatureGroup>

              {/* Letter Spacing */}
              <FeatureGroup feature="letter_spacing">
                <div className="space-y-2">
                  <Label>Letter Spacing</Label>
                  <Slider
                    value={[selectedStyle.letterSpacing]}
                    onValueChange={([value]) => onTextStyleChange({ ...selectedStyle, letterSpacing: value })}
                    min={-5}
                    max={20}
                    step={0.5}
                  />
                </div>
              </FeatureGroup>

              {/* Basic Font Selection */}
              <FeatureGroup feature="basic_fonts">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={selectedStyle.fontFamily}
                    onValueChange={(value) => onTextStyleChange({ ...selectedStyle, fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue>{selectedStyle.fontFamily}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {BASIC_FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FeatureGroup>

              {/* Basic Position */}
              <FeatureGroup feature="basic_position">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>X Position</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[selectedStyle.x]}
                        onValueChange={([value]) => onTextStyleChange({ ...selectedStyle, x: value })}
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span className="text-sm text-gray-600 w-12 text-right">{selectedStyle.x}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[selectedStyle.y]}
                        onValueChange={([value]) => onTextStyleChange({ ...selectedStyle, y: value })}
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span className="text-sm text-gray-600 w-12 text-right">{selectedStyle.y}%</span>
                    </div>
                  </div>
                </div>
              </FeatureGroup>

              {/* Basic Color */}
              <FeatureGroup feature="basic_color">
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <input
                    type="color"
                    value={selectedStyle.color}
                    onChange={(e) => onTextStyleChange({ ...selectedStyle, color: e.target.value })}
                    className="w-full h-10 rounded-md cursor-pointer"
                  />
                </div>
              </FeatureGroup>
            </div>

            {/* BASIC PLAN FEATURES */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Basic Plan Features</h3>

              {/* Text Styles */}
              <FeatureGroup feature="text_styles">
                <div className="space-y-2">
                  <Label>Text Styles</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedStyle.style.bold ? "default" : "outline"}
                      size="icon"
                      onClick={() => onTextStyleChange({
                        ...selectedStyle,
                        style: { ...selectedStyle.style, bold: !selectedStyle.style.bold }
                      })}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedStyle.style.italic ? "default" : "outline"}
                      size="icon"
                      onClick={() => onTextStyleChange({
                        ...selectedStyle,
                        style: { ...selectedStyle.style, italic: !selectedStyle.style.italic }
                      })}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedStyle.style.underline ? "default" : "outline"}
                      size="icon"
                      onClick={() => onTextStyleChange({
                        ...selectedStyle,
                        style: { ...selectedStyle.style, underline: !selectedStyle.style.underline }
                      })}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </FeatureGroup>

              {/* Opacity */}
              <FeatureGroup feature="opacity">
                <div className="space-y-2">
                  <Label>Opacity</Label>
                  <Slider
                    value={[selectedStyle.opacity]}
                    onValueChange={([value]) => onTextStyleChange({ ...selectedStyle, opacity: value })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </FeatureGroup>

              {/* Rotation */}
              <FeatureGroup feature="rotation">
                <div className="space-y-2">
                  <Label>Rotation</Label>
                  <Slider
                    value={[selectedStyle.rotation]}
                    onValueChange={([value]) => onTextStyleChange({ ...selectedStyle, rotation: value })}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>
              </FeatureGroup>
            </div>

            {/* PREMIUM PLAN FEATURES */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Premium Plan Features</h3>

              {/* Shadows */}
              <FeatureGroup feature="shadows">
                <div className="space-y-2">
                  <Label>Text Shadow</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Blur</Label>
                      <Slider
                        value={[selectedStyle.shadow?.blur || 0]}
                        onValueChange={([value]) => onTextStyleChange({
                          ...selectedStyle,
                          shadow: {
                            enabled: true,
                            blur: value,
                            color: selectedStyle.shadow?.color || '#000000',
                            offsetX: selectedStyle.shadow?.offsetX || 2,
                            offsetY: selectedStyle.shadow?.offsetY || 2
                          }
                        })}
                        min={0}
                        max={20}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Color</Label>
                      <input
                        type="color"
                        value={selectedStyle.shadow?.color || '#000000'}
                        onChange={(e) => onTextStyleChange({
                          ...selectedStyle,
                          shadow: {
                            enabled: true,
                            blur: selectedStyle.shadow?.blur || 0,
                            color: e.target.value,
                            offsetX: selectedStyle.shadow?.offsetX || 2,
                            offsetY: selectedStyle.shadow?.offsetY || 2
                          }
                        })}
                        className="w-full h-8 rounded"
                      />
                    </div>
                  </div>
                </div>
              </FeatureGroup>

              {/* Gradients */}
              <FeatureGroup feature="gradients">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Gradient</Label>
                    <Switch
                      checked={selectedStyle.gradient?.enabled ?? false}
                      onCheckedChange={(checked) => {
                        const currentColors = selectedStyle.gradient?.colors ?? ['#000000', '#ffffff'];
                        onTextStyleChange({
                          ...selectedStyle,
                          gradient: {
                            enabled: checked,
                            colors: currentColors
                          },
                        });
                      }}
                    />
                  </div>
                  {selectedStyle.gradient?.enabled && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Start Color</Label>
                        <input
                          type="color"
                          value={selectedStyle.gradient?.colors[0] ?? '#000000'}
                          onChange={(e) => {
                            const currentColors = selectedStyle.gradient?.colors ?? ['#000000', '#ffffff'];
                            onTextStyleChange({
                              ...selectedStyle,
                              gradient: {
                                enabled: true,
                                colors: [e.target.value, currentColors[1]]
                              },
                            });
                          }}
                          className="w-full h-10 rounded-md cursor-pointer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Color</Label>
                        <input
                          type="color"
                          value={selectedStyle.gradient?.colors[1] ?? '#ffffff'}
                          onChange={(e) => {
                            const currentColors = selectedStyle.gradient?.colors ?? ['#000000', '#ffffff'];
                            onTextStyleChange({
                              ...selectedStyle,
                              gradient: {
                                enabled: true,
                                colors: [currentColors[0], e.target.value]
                              },
                            });
                          }}
                          className="w-full h-10 rounded-md cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </FeatureGroup>

              {/* Glow */}
              <FeatureGroup feature="glow">
                <div className="space-y-2">
                  <Label>Text Glow</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Intensity</Label>
                      <Slider
                        value={[selectedStyle.glow?.intensity || 0]}
                        onValueChange={([value]) => onTextStyleChange({
                          ...selectedStyle,
                          glow: {
                            enabled: true,
                            intensity: value,
                            blur: selectedStyle.glow?.blur || 10,
                            color: selectedStyle.glow?.color || '#ffffff'
                          }
                        })}
                        min={0}
                        max={20}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Color</Label>
                      <input
                        type="color"
                        value={selectedStyle.glow?.color || '#ffffff'}
                        onChange={(e) => onTextStyleChange({
                          ...selectedStyle,
                          glow: {
                            enabled: true,
                            intensity: selectedStyle.glow?.intensity || 0,
                            blur: selectedStyle.glow?.blur || 10,
                            color: e.target.value
                          }
                        })}
                        className="w-full h-8 rounded"
                      />
                    </div>
                  </div>
                </div>
              </FeatureGroup>

              {/* Outline */}
              <FeatureGroup feature="outlines">
                <div className="space-y-2">
                  <Label>Text Outline</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Width</Label>
                      <Slider
                        value={[selectedStyle.outline?.width || 0]}
                        onValueChange={([value]) => onTextStyleChange({
                          ...selectedStyle,
                          outline: {
                            enabled: true,
                            width: value,
                            color: selectedStyle.outline?.color || '#000000'
                          }
                        })}
                        min={0}
                        max={10}
                        step={0.5}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Color</Label>
                      <input
                        type="color"
                        value={selectedStyle.outline?.color || '#000000'}
                        onChange={(e) => onTextStyleChange({
                          ...selectedStyle,
                          outline: {
                            enabled: true,
                            width: selectedStyle.outline?.width || 0,
                            color: e.target.value
                          }
                        })}
                        className="w-full h-8 rounded"
                      />
                    </div>
                  </div>
                </div>
              </FeatureGroup>

              {/* Transform */}
              <FeatureGroup feature="transform">
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Transform</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Scale X</Label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={selectedStyle.transform?.scaleX || 1}
                        onChange={(e) =>
                          onTextStyleChange({
                            ...selectedStyle,
                            transform: {
                              enabled: true,
                              scaleX: Number(e.target.value),
                              scaleY: selectedStyle.transform?.scaleY ?? 1,
                              skewX: selectedStyle.transform?.skewX ?? 0,
                              skewY: selectedStyle.transform?.skewY ?? 0
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Scale Y</Label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={selectedStyle.transform?.scaleY || 1}
                        onChange={(e) =>
                          onTextStyleChange({
                            ...selectedStyle,
                            transform: {
                              enabled: true,
                              scaleX: selectedStyle.transform?.scaleX ?? 1,
                              scaleY: Number(e.target.value),
                              skewX: selectedStyle.transform?.skewX ?? 0,
                              skewY: selectedStyle.transform?.skewY ?? 0
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </FeatureGroup>
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center p-4">
          <p className="text-muted-foreground">
            Select a text layer to edit or click the "Add Text" button above to create one
          </p>
        </div>
      )}
    </div>
  )
}

export default TextEditor
