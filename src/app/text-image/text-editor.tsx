// text-editor.tsx
import React, { useState } from 'react';
import { 
  Type, 
  Palette, 
  Loader2, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Slider } from '@/components/UI/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/UI/popover';
import { Card, CardContent } from '@/components/UI/card';
import { useImage } from './page';

interface TextEditorProps {
  onProcess: () => Promise<void>;
}

interface TextStyle {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  x: number;
  y: number;
  italic: boolean;
  underline: boolean;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  textShadow: boolean;
  opacity: number;
}

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Roboto',
  'Montserrat',
  'Open Sans',
  'Playfair Display',
  'Pacifico',
  'Impact',
  'Comic Sans MS',
  'Courier New',
  'Trebuchet MS',
  'Arial Black'
];

const FONT_WEIGHTS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' }
];

const TextEditor: React.FC<TextEditorProps> = ({ onProcess }) => {
  const { isProcessing } = useImage();
  const [textStyle, setTextStyle] = useState<TextStyle>({
    text: '',
    fontSize: 72,
    fontFamily: 'Arial',
    fontWeight: '400',
    color: '#000000',
    x: 50,
    y: 50,
    italic: false,
    underline: false,
    letterSpacing: 0,
    textAlign: 'center',
    textShadow: false,
    opacity: 100
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const container = e.currentTarget.parentElement?.getBoundingClientRect();
    if (container) {
      setDragStart({
        x: e.clientX - (container.width * textStyle.x / 100),
        y: e.clientY - (container.height * textStyle.y / 100)
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - dragStart.x) / container.width) * 100;
    const y = ((e.clientY - dragStart.y) / container.height) * 100;

    setTextStyle(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100)),
    }));
  };

  return (
    <>
      <div
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className="absolute cursor-move"
          style={{
            left: `${textStyle.x}%`,
            top: `${textStyle.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: textStyle.opacity / 100,
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            style={{
              fontSize: `${textStyle.fontSize}px`,
              fontFamily: textStyle.fontFamily,
              fontWeight: textStyle.fontWeight,
              color: textStyle.color,
              fontStyle: textStyle.italic ? 'italic' : 'normal',
              textDecoration: textStyle.underline ? 'underline' : 'none',
              letterSpacing: `${textStyle.letterSpacing}px`,
              textShadow: textStyle.textShadow ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
              textAlign: textStyle.textAlign,
              minWidth: '100px',
              padding: '4px',
              userSelect: 'none'
            }}
          >
            {textStyle.text || 'Click to add text'}
          </div>
        </div>
      </div>

      <Card className="bg-white/95 backdrop-blur fixed bottom-4 left-4 right-4 max-w-4xl mx-auto">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Text Input and Font Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  value={textStyle.text}
                  onChange={(e) => setTextStyle(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter your text"
                  className="w-full"
                />
              </div>

              <Select
                value={textStyle.fontFamily}
                onValueChange={(value) => setTextStyle(prev => ({ ...prev, fontFamily: value }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Font Family" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={textStyle.fontWeight}
                onValueChange={(value) => setTextStyle(prev => ({ ...prev, fontWeight: value }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Weight" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHTS.map((weight) => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <Input
                    type="color"
                    value={textStyle.color}
                    onChange={(e) => setTextStyle(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Font Size, Letter Spacing, and Style Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 min-w-[200px]">
                <Type className="h-4 w-4" />
                <div className="w-full">
                  <Slider
                    value={[textStyle.fontSize]}
                    min={12}
                    max={300}
                    step={1}
                    onValueChange={([value]) => setTextStyle(prev => ({ ...prev, fontSize: value }))}
                  />
                </div>
                <span className="text-sm text-gray-500 w-16">{textStyle.fontSize}px</span>
              </div>

              <div className="flex items-center gap-2 min-w-[150px]">
                <span className="text-sm text-gray-500">Spacing</span>
                <Slider
                  value={[textStyle.letterSpacing]}
                  min={-5}
                  max={20}
                  step={0.5}
                  onValueChange={([value]) => setTextStyle(prev => ({ ...prev, letterSpacing: value }))}
                />
              </div>

              <div className="flex gap-1">
                <Button
                  variant={textStyle.italic ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTextStyle(prev => ({ ...prev, italic: !prev.italic }))}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={textStyle.underline ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTextStyle(prev => ({ ...prev, underline: !prev.underline }))}
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 min-w-[150px]">
                <span className="text-sm text-gray-500">Opacity</span>
                <Slider
                  value={[textStyle.opacity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setTextStyle(prev => ({ ...prev, opacity: value }))}
                />
                <span className="text-sm text-gray-500 w-12">{textStyle.opacity}%</span>
              </div>
            </div>

            {/* Text Alignment and Process Button */}
            <div className="flex items-center gap-4 flex-wrap justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500 mr-2">Align Text:</span>
                <Button
                  variant={textStyle.textAlign === 'left' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTextStyle(prev => ({ ...prev, textAlign: 'left' }))}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={textStyle.textAlign === 'center' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTextStyle(prev => ({ ...prev, textAlign: 'center' }))}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={textStyle.textAlign === 'right' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTextStyle(prev => ({ ...prev, textAlign: 'right' }))}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={onProcess}
                disabled={isProcessing || !textStyle.text}
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
        </CardContent>
      </Card>
    </>
  );
};

export default TextEditor;