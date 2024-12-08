'use client'

import { useState, useRef, useEffect } from 'react'
import { TextStyle } from '@/lib/plans'
import { ImageAdjustments } from './imageAdjustments'

interface ResultDisplayProps {
  originalImage: string;
  processedImage: string | null;
  textStyles: TextStyle[];
  selectedTextId: string | null;
  imageAdjustments: ImageAdjustments;
  onTextStyleChange: (style: TextStyle) => void;
  onTextSelect: (id: string | null) => void;
}

function generateFilterString(adjustments: ImageAdjustments): string {
  return `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) opacity(${adjustments.opacity}%)`
}

export function ResultDisplay({ 
  originalImage, 
  processedImage, 
  textStyles,
  selectedTextId,
  imageAdjustments,
  onTextStyleChange,
  onTextSelect
}: ResultDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })

  const handleDragStart = (e: React.MouseEvent, textStyle: TextStyle) => {
    e.stopPropagation()
    setIsDragging(true)
    setDragStartPos({
      x: e.clientX - (textStyle.x / 100) * containerRef.current!.offsetWidth,
      y: e.clientY - (textStyle.y / 100) * containerRef.current!.offsetHeight
    })
    onTextSelect(textStyle.id)
  }

  const handleDrag = (e: React.MouseEvent, textStyle: TextStyle) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current
    const newX = ((e.clientX - dragStartPos.x) / container.offsetWidth) * 100
    const newY = ((e.clientY - dragStartPos.y) / container.offsetHeight) * 100

    onTextStyleChange({
      ...textStyle,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY))
    })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent, textStyle: TextStyle) => {
    e.stopPropagation();
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStartPos({
      x: touch.clientX - (textStyle.x / 100) * containerRef.current!.offsetWidth,
      y: touch.clientY - (textStyle.y / 100) * containerRef.current!.offsetHeight
    });
    onTextSelect(textStyle.id);
  };

  const handleTouchMove = (e: React.TouchEvent, textStyle: TextStyle) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const container = containerRef.current;
    const newX = ((touch.clientX - dragStartPos.x) / container.offsetWidth) * 100;
    const newY = ((touch.clientY - dragStartPos.y) / container.offsetHeight) * 100;

    onTextStyleChange({
      ...textStyle,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY))
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEndGlobal = () => handleTouchEnd();
    
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEndGlobal);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEndGlobal);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="result-display-container relative w-full aspect-video bg-muted rounded-lg overflow-hidden"
      onClick={() => onTextSelect(null)}
    >
      {/* Layer 1: Original image (base) */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <img
          src={originalImage}
          alt="Original"
          className="w-full h-full object-contain"
          style={{ filter: generateFilterString(imageAdjustments) }}
        />
      </div>

      {/* Layer 2: Text layers */}
      {textStyles.map((style) => (
        <div
          key={style.id}
          className={`absolute cursor-move select-none
            ${selectedTextId === style.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
          style={{
            left: `${style.x}%`,
            top: `${style.y}%`,
            transform: `translate(-50%, -50%) rotate(${style.rotation}deg)`,
            color: style.color,
            fontFamily: style.fontFamily,
            fontSize: `${style.fontSize}px`,
            fontStyle: style.style.italic ? 'italic' : 'normal',
            fontWeight: style.style.bold ? 'bold' : 'normal',
            textDecoration: style.style.underline ? 'underline' : 'none',
            letterSpacing: `${style.letterSpacing}px`,
            opacity: style.opacity / 100,
            textAlign: style.align as any,
            minWidth: '50px',
            minHeight: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: style.align === 'center' ? 'center' : 
                          style.align === 'right' ? 'flex-end' : 'flex-start',
            zIndex: 2,  
            touchAction: 'none'  
          }}
          onMouseDown={(e) => handleDragStart(e, style)}
          onMouseMove={(e) => handleDrag(e, style)}
          onTouchStart={(e) => handleTouchStart(e, style)}
          onTouchMove={(e) => handleTouchMove(e, style)}
          onClick={(e) => {
            e.stopPropagation();
            onTextSelect(style.id);
          }}
        >
          {style.text}
        </div>
      ))}

      {/* Layer 3: Processed image (with transparency) */}
      {processedImage && (
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          <img
            src={processedImage}
            alt="Processed"
            className="w-full h-full object-contain"
            style={{ filter: generateFilterString(imageAdjustments) }}
          />
        </div>
      )}
    </div>
  )
}
