'use client'

import { useState, useRef, useEffect } from 'react'
import { TextStyle } from '@/lib/types'
import { ImageAdjustments } from './imageAdjustments'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResultDisplayProps {
  originalImage: string
  processedImage: string | null
  textStyles: TextStyle[]
  selectedTextId: string | null
  imageAdjustments: ImageAdjustments
  onTextStyleChange: (style: Partial<TextStyle> & { id: string }) => void
  onTextSelect: (id: string) => void
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
  const [showTextBox, setShowTextBox] = useState<boolean>(false)

  // Hide text box after selection
  useEffect(() => {
    if (selectedTextId) {
      setShowTextBox(true)
      const timer = setTimeout(() => {
        setShowTextBox(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [selectedTextId])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, textStyle: TextStyle) => {
    e.preventDefault() // Prevent default touch behavior
    e.stopPropagation()
    if (!containerRef.current) return

    setIsDragging(true)
    const pos = 'touches' in e ? {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    } : {
      x: (e as React.MouseEvent).pageX,
      y: (e as React.MouseEvent).pageY
    }
    setDragStartPos(pos)
    onTextSelect(textStyle.id)
  }

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    e.preventDefault() // Prevent scrolling on mobile
    if (!isDragging || !containerRef.current || !selectedTextId) return

    const rect = containerRef.current.getBoundingClientRect()
    const pos = 'touches' in e ? {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    } : {
      x: (e as MouseEvent).pageX,
      y: (e as MouseEvent).pageY
    }

    const deltaX = pos.x - dragStartPos.x
    const deltaY = pos.y - dragStartPos.y

    const selectedStyle = textStyles.find(style => style.id === selectedTextId)
    if (selectedStyle) {
      const newX = selectedStyle.x + (deltaX / rect.width) * 100
      const newY = selectedStyle.y + (deltaY / rect.height) * 100

      onTextStyleChange({
        id: selectedStyle.id,
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY))
      })
    }

    setDragStartPos(pos)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag, { passive: false })
      window.addEventListener('touchmove', handleDrag, { passive: false })
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchend', handleDragEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('touchmove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging])

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden"
    >
      {/* Original Image - Bottom Layer */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        {originalImage && (
          <Image
            src={originalImage}
            alt="Original"
            fill
            className="object-contain"
            style={{
              filter: `brightness(${imageAdjustments.brightness}%) contrast(${imageAdjustments.contrast}%) saturate(${imageAdjustments.saturation}%)`
            }}
          />
        )}
      </div>

      {/* Text Layers - Middle Layer */}
      <div className="absolute inset-0 touch-none" style={{ zIndex: 2 }}>
        {textStyles.map((style) => (
          <div
            key={style.id}
            className={cn(
              "absolute cursor-move select-none touch-none",
              selectedTextId === style.id && showTextBox && "ring-2 ring-primary ring-offset-2"
            )}
            style={{
              left: `${style.x}%`,
              top: `${style.y}%`,
              opacity: style.opacity / 100,
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              fontWeight: style.style.bold ? 'bold' : 'normal',
              fontStyle: style.style.italic ? 'italic' : 'normal',
              textDecoration: style.style.underline ? 'underline' : 'none',
              letterSpacing: `${style.letterSpacing}px`,
              ...(style.gradient?.enabled ? {
                background: `linear-gradient(${style.gradient.angle}deg, ${style.gradient.startColor}, ${style.gradient.endColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              } : {
                color: style.color
              }),
              ...(style.shadow?.enabled ? {
                textShadow: `${style.shadow.offsetX}px ${style.shadow.offsetY}px ${style.shadow.blur}px ${style.shadow.color}`
              } : {}),
              transform: [
                'translate(-50%, -50%)',
                `rotate(${style.rotation}deg)`,
                style.transform?.skewX ? `skewX(${style.transform.skewX}deg)` : '',
                style.transform?.skewY ? `skewY(${style.transform.skewY}deg)` : '',
                style.transform?.scale ? `scale(${style.transform.scale})` : ''
              ].filter(Boolean).join(' '),
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'none',
              pointerEvents: 'auto',
              minWidth: '50px',
              minHeight: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: `blur(${style.blur}px)`,
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseDown={(e) => handleDragStart(e, style)}
            onTouchStart={(e) => handleDragStart(e, style)}
            onClick={(e) => {
              e.stopPropagation()
              onTextSelect(style.id)
            }}
          >
            {style.text}
          </div>
        ))}
      </div>

      {/* Background Removed Image - Top Layer */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        {processedImage && (
          <Image
            src={processedImage}
            alt="Processed"
            fill
            className="object-contain"
            style={{
              filter: `brightness(${imageAdjustments.brightness}%) contrast(${imageAdjustments.contrast}%) saturate(${imageAdjustments.saturation}%)`
            }}
          />
        )}
      </div>
    </div>
  )
}
