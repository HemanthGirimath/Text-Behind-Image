import React from 'react';
import { useSession } from 'next-auth/react';
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
import { Lock } from 'lucide-react';

const BASIC_FONTS = [
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Helvetica',
  'Courier New',
  'Trebuchet MS',
  'Impact'
];

interface EditorControlsProps {
  textLayer: TextStyle;
  onUpdate: (updates: Partial<TextStyle>) => void;
}

interface SectionProps {
  title: string;
  isLocked: boolean;
  children: React.ReactNode;
}

function Section({ title, isLocked, children }: SectionProps) {
  return (
    <div className={`relative rounded-lg border p-4 ${isLocked ? 'pointer-events-none' : ''}`}>
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      {children}
      {isLocked && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Upgrade required</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function EditorControls({ textLayer, onUpdate }: EditorControlsProps) {
  const { data: session } = useSession();
  const userPlan = session?.user?.plan || 'free';

  return (
    <div className="space-y-4">
      {/* Basic Text Controls - Available to all */}
      <Section title="Basic Text" isLocked={false}>
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <Label>Text</Label>
            <Input
              placeholder="Enter text..."
              value={textLayer.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
            />
          </div>

          {/* Font Selection */}
          <div>
            <Label>Font</Label>
            <Select value={textLayer.fontFamily} onValueChange={(value) => onUpdate({ fontFamily: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {BASIC_FONTS.slice(0, 5).map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Positioning */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>X Position</Label>
              <Slider
                value={[textLayer.x]}
                onValueChange={([value]) => onUpdate({ x: value })}
                min={0}
                max={100}
                step={1}
              />
            </div>
            <div>
              <Label>Y Position</Label>
              <Slider
                value={[textLayer.y]}
                onValueChange={([value]) => onUpdate({ y: value })}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>

          {/* Basic Color Selection */}
          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={textLayer.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="h-10 w-full"
            />
          </div>
        </div>
      </Section>

      {/* Text Styling - Basic Plan and above */}
      <Section title="Text Styling" isLocked={userPlan === 'free'}>
        <div className="space-y-4">
          <div>
            <Label>Font Size</Label>
            <Slider
              value={[textLayer.fontSize]}
              onValueChange={([value]) => onUpdate({ fontSize: value })}
              min={8}
              max={200}
              step={1}
            />
          </div>
          <div>
            <Label>Letter Spacing</Label>
            <Slider
              value={[textLayer.letterSpacing]}
              onValueChange={([value]) => onUpdate({ letterSpacing: value })}
              min={-5}
              max={20}
              step={0.5}
            />
          </div>
        </div>
      </Section>

      {/* Advanced Features - Premium Only */}
      <Section title="Advanced Styling" isLocked={userPlan !== 'premium'}>
        <div className="space-y-4">
          <div>
            <Label>Opacity</Label>
            <Slider
              value={[textLayer.opacity]}
              onValueChange={([value]) => onUpdate({ opacity: value })}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label>Rotation</Label>
            <Slider
              value={[textLayer.rotation]}
              onValueChange={([value]) => onUpdate({ rotation: value })}
              min={-180}
              max={180}
              step={1}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
