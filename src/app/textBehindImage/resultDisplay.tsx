import { useEffect, useRef, useState } from 'react'
import { TextStyle } from './textEditor'
import { ImageAdjustments } from './imageAdjustments'

interface ResultDisplayProps {
  originalImage: string;
  processedImage: string | null;
  textStyles: TextStyle[];
  activeTextIndex: number;
  imageAdjustments: ImageAdjustments;
  onTextStyleChange: (style: TextStyle) => void;
  onTextClick: (index: number) => void;
}

function generateFilterString(adjustments: ImageAdjustments): string {
  return `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) opacity(${adjustments.opacity}%)`
}

export function ResultDisplay({ 
  originalImage, 
  processedImage, 
  textStyles,
  activeTextIndex,
  imageAdjustments,
  onTextStyleChange,
  onTextClick
}: ResultDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDraggingRef = useRef(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const lastTouchRef = useRef({ x: 0, y: 0 })
  const [showHighlight, setShowHighlight] = useState(false)
  const highlightTimeoutRef = useRef<NodeJS.Timeout>()

  // Update highlight state when text is selected
  useEffect(() => {
    if (activeTextIndex !== -1) {
      setShowHighlight(true)
      // Clear existing timeout
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
      // Set new timeout to hide highlight after 3 seconds
      highlightTimeoutRef.current = setTimeout(() => {
        setShowHighlight(false)
      }, 3000)
    }
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [activeTextIndex])

  // Function to convert screen coordinates to canvas coordinates
  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      scaleX,
      scaleY,
      rect
    }
  }

  // Function to check if a point is within text bounds
  const isPointInText = (x: number, y: number, style: TextStyle, ctx: CanvasRenderingContext2D) => {
    const textX = (style.x / 100) * ctx.canvas.width
    const textY = (style.y / 100) * ctx.canvas.height
    
    ctx.font = `${style.fontSize}px ${style.fontFamily}`
    const textWidth = ctx.measureText(style.text).width
    const textHeight = style.fontSize

    const padding = 10 // Add padding to make it easier to select on mobile
    return (
      x >= textX - padding &&
      x <= textX + textWidth + padding &&
      y >= textY - textHeight - padding &&
      y <= textY + padding
    )
  }

  // Function to update text position
  const updateTextPosition = (clientX: number, clientY: number, prevX: number, prevY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // Calculate the change in position in canvas coordinates
    const deltaX = (clientX - prevX) * scaleX
    const deltaY = (clientY - prevY) * scaleY

    const currentStyle = textStyles[activeTextIndex]
    
    // Convert current position from percentage to pixels
    const currentX = (currentStyle.x / 100) * canvas.width
    const currentY = (currentStyle.y / 100) * canvas.height

    // Calculate new position in pixels
    const newXPixels = currentX + deltaX
    const newYPixels = currentY + deltaY

    // Convert back to percentages
    const newX = (newXPixels / canvas.width) * 100
    const newY = (newYPixels / canvas.height) * 100

    // Ensure the text stays within canvas bounds
    const boundedX = Math.max(0, Math.min(100, newX))
    const boundedY = Math.max(0, Math.min(100, newY))

    onTextStyleChange({
      ...currentStyle,
      x: boundedX,
      y: boundedY
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawImages = async () => {
      const img1 = new Image()
      let processedImg: HTMLImageElement | null = null
      
      if (processedImage) {
        processedImg = new Image()
        processedImg.src = processedImage
        await new Promise((resolve) => {
          processedImg!.onload = resolve
        })
      }

      await new Promise((resolve) => {
        img1.onload = () => {
          const containerWidth = canvas.width
          const containerHeight = canvas.height
          const imgAspectRatio = img1.width / img1.height
          const containerAspectRatio = containerWidth / containerHeight
            
          let width, height, offsetX = 0, offsetY = 0
            
          if (imgAspectRatio > containerAspectRatio) {
            width = containerWidth
            height = width / imgAspectRatio
            offsetY = (containerHeight - height) / 2
          } else {
            height = containerHeight
            width = height * imgAspectRatio
            offsetX = (containerWidth - width) / 2
          }
            
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, containerWidth, containerHeight)
          ctx.filter = generateFilterString(imageAdjustments)
          ctx.drawImage(img1, offsetX, offsetY, width, height)
          if (processedImg) {
            ctx.drawImage(processedImg, offsetX, offsetY, width, height)
          }
          ctx.filter = 'none'
          drawText(ctx)
          resolve(null)
        }
        img1.src = originalImage
      })
    }

    drawImages()
  }, [originalImage, processedImage, textStyles, imageAdjustments])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => {
      const coords = getCanvasCoordinates(e.clientX, e.clientY)
      if (!coords) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Check from top to bottom layer
      for (let i = textStyles.length - 1; i >= 0; i--) {
        if (isPointInText(coords.x, coords.y, textStyles[i], ctx)) {
          onTextClick(i)
          isDraggingRef.current = true
          setMousePos({ x: e.clientX, y: e.clientY })
          return
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      updateTextPosition(e.clientX, e.clientY, mousePos.x, mousePos.y)
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const coords = getCanvasCoordinates(touch.clientX, touch.clientY)
      if (!coords) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      for (let i = textStyles.length - 1; i >= 0; i--) {
        if (isPointInText(coords.x, coords.y, textStyles[i], ctx)) {
          onTextClick(i)
          isDraggingRef.current = true
          lastTouchRef.current = { x: touch.clientX, y: touch.clientY }
          return
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!isDraggingRef.current) return

      const touch = e.touches[0]
      updateTextPosition(
        touch.clientX,
        touch.clientY,
        lastTouchRef.current.x,
        lastTouchRef.current.y
      )
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY }
    }

    const handleEnd = () => {
      isDraggingRef.current = false
    }

    // Convert canvas element to HTMLCanvasElement for event handling
    const canvasElement = canvas as HTMLCanvasElement

    // Add event listeners
    canvasElement.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    canvasElement.addEventListener('mouseleave', handleEnd)

    // Touch events
    canvasElement.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleEnd)
    canvasElement.addEventListener('touchcancel', handleEnd)

    return () => {
      // Remove event listeners
      canvasElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      canvasElement.removeEventListener('mouseleave', handleEnd)

      canvasElement.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
      canvasElement.removeEventListener('touchcancel', handleEnd)
    }
  }, [textStyles, activeTextIndex, onTextStyleChange, onTextClick, getCanvasCoordinates, isPointInText, updateTextPosition])

  const drawText = (ctx: CanvasRenderingContext2D, isForDownload: boolean = false) => {
    textStyles.forEach((style, index) => {
      ctx.save()
      
      // Convert percentage positions to actual canvas coordinates
      const canvasX = (style.x / 100) * ctx.canvas.width
      const canvasY = (style.y / 100) * ctx.canvas.height
      
      // Apply text styles
      const fontWeight = style.style.bold ? 'bold' : ''
      const fontStyle = style.style.italic ? 'italic' : ''
      ctx.font = `${fontStyle} ${fontWeight} ${style.fontSize}px ${style.fontFamily}`
      
      // Get text metrics for gradient and effects calculations
      const textMetrics = ctx.measureText(style.text)
      const textWidth = textMetrics.width
      const textHeight = style.fontSize

      // Apply transformations
      ctx.translate(canvasX + textWidth / 2, canvasY - textHeight / 2)
      ctx.rotate((style.rotation * Math.PI) / 180)
      ctx.scale(style.transform.scale.x, style.transform.scale.y)
      ctx.translate(-(canvasX + textWidth / 2), -(canvasY - textHeight / 2))
      
      // Apply shadow if enabled
      if (style.effects.shadow.enabled) {
        ctx.shadowColor = style.effects.shadow.color
        ctx.shadowBlur = style.effects.shadow.blur
        ctx.shadowOffsetX = style.effects.shadow.offsetX
        ctx.shadowOffsetY = style.effects.shadow.offsetY
      }

      // Apply stroke if enabled
      if (style.style.stroke.enabled) {
        ctx.strokeStyle = style.style.stroke.color
        ctx.lineWidth = style.style.stroke.width
        ctx.lineJoin = 'round'
        ctx.miterLimit = 2
      }
      
      // Apply color effects
      if (style.effects.gradient.enabled) {
        let gradient
        if (style.effects.gradient.type === 'linear') {
          const angle = (style.effects.gradient.angle * Math.PI) / 180
          const gradientLength = Math.max(textWidth, textHeight)
          
          const startX = canvasX - Math.cos(angle) * gradientLength / 2
          const startY = canvasY - Math.sin(angle) * gradientLength / 2
          const endX = canvasX + Math.cos(angle) * gradientLength / 2
          const endY = canvasY + Math.sin(angle) * gradientLength / 2
          
          gradient = ctx.createLinearGradient(startX, startY, endX, endY)
        } else {
          const radius = Math.max(textWidth, textHeight) / 2
          gradient = ctx.createRadialGradient(
            canvasX + textWidth / 2,
            canvasY - textHeight / 2,
            0,
            canvasX + textWidth / 2,
            canvasY - textHeight / 2,
            radius
          )
        }
        
        style.effects.gradient.colors.forEach((color, i) => {
          gradient.addColorStop(i / (style.effects.gradient.colors.length - 1), color)
        })
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = style.color
      }
      
      ctx.globalAlpha = style.opacity / 100

      // Draw text with letter spacing
      if (style.letterSpacing !== 0) {
        let x = canvasX
        const chars = style.text.split('')
        chars.forEach((char) => {
          if (style.style.stroke.enabled) {
            ctx.strokeText(char, x, canvasY)
          }
          ctx.fillText(char, x, canvasY)
          x += ctx.measureText(char).width + style.letterSpacing
        })
      } else {
        if (style.style.stroke.enabled) {
          ctx.strokeText(style.text, canvasX, canvasY)
        }
        ctx.fillText(style.text, canvasX, canvasY)
      }

      // Draw underline if enabled
      if (style.style.underline) {
        ctx.beginPath()
        ctx.lineWidth = Math.max(1, style.fontSize * 0.05)
        ctx.strokeStyle = style.color
        ctx.moveTo(canvasX, canvasY + 3)
        ctx.lineTo(canvasX + textWidth, canvasY + 3)
        ctx.stroke()
      }

      // Only show highlight if not downloading and highlight is active
      if (index === activeTextIndex && showHighlight && !isForDownload) {
        ctx.save()
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.fillRect(
          canvasX - 5,
          canvasY - textHeight - 5,
          textWidth + 10,
          textHeight + 10
        )
        ctx.restore()
      }
      
      ctx.restore()
    })
  }

  return <canvas ref={canvasRef} className="max-w-full h-auto" />
}
