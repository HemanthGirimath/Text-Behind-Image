import { useEffect, useRef, useState } from 'react'
import { TextStyle } from './textEditor'
import { ImageAdjustments } from './imageAdjustments'

interface ResultDisplayProps {
  originalImage: string;
  processedImage: string | null;
  textStyle: TextStyle;
  imageAdjustments: ImageAdjustments;
  onTextStyleChange: (style: TextStyle) => void;
}

function generateFilterString(adjustments: ImageAdjustments): string {
  return `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) opacity(${adjustments.opacity}%)`
}

export function ResultDisplay({ 
  originalImage, 
  processedImage, 
  textStyle, 
  imageAdjustments,
  onTextStyleChange 
}: ResultDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDraggingRef = useRef(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img1 = new Image()

    const drawImages = async () => {
      await new Promise((resolve) => {
        img1.onload = () => {
          // Calculate aspect ratio
          const containerWidth = 800
          const containerHeight = 600
          const imgAspectRatio = img1.width / img1.height
          const containerAspectRatio = containerWidth / containerHeight
          
          let width, height, offsetX = 0, offsetY = 0
          
          // Calculate dimensions while preserving aspect ratio
          if (imgAspectRatio > containerAspectRatio) {
            // Image is wider
            width = containerWidth
            height = width / imgAspectRatio
            offsetY = (containerHeight - height) / 2
          } else {
            // Image is taller
            height = containerHeight
            width = height * imgAspectRatio
            offsetX = (containerWidth - width) / 2
          }
          
          // Set canvas to container size
          canvas.width = containerWidth
          canvas.height = containerHeight
          
          // Clear canvas and draw with proper centering
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, containerWidth, containerHeight)
          ctx.filter = generateFilterString(imageAdjustments)
          ctx.drawImage(img1, offsetX, offsetY, width, height)
          ctx.filter = 'none'
          drawText(ctx)

          resolve(null)
        }
        img1.src = originalImage
      })

      if (processedImage) {
        const img2 = new Image()
        await new Promise((resolve) => {
          img2.onload = () => {
            // Maintain the same dimensions and positioning for processed image
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            const imgAspectRatio = img2.width / img2.height
            const containerAspectRatio = canvas.width / canvas.height
            
            let width, height, offsetX = 0, offsetY = 0
            
            if (imgAspectRatio > containerAspectRatio) {
              width = canvas.width
              height = width / imgAspectRatio
              offsetY = (canvas.height - height) / 2
            } else {
              height = canvas.height
              width = height * imgAspectRatio
              offsetX = (canvas.width - width) / 2
            }
            
            ctx.filter = generateFilterString(imageAdjustments)
            ctx.drawImage(img1, offsetX, offsetY, width, height)
            ctx.filter = 'none'
            drawText(ctx)
            ctx.drawImage(img2, offsetX, offsetY, width, height)
            resolve(null)
          }
          img2.src = processedImage
        })
      }
    }

    drawImages()
  }, [originalImage, processedImage, textStyle, imageAdjustments])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const getCanvasCoordinates = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      const x = (clientX - rect.left) * scaleX
      const y = (clientY - rect.top) * scaleY

      return { x, y, rect, scaleX, scaleY }
    }

    const isWithinTextBounds = (x: number, y: number) => {
      const textX = (textStyle.x / 100) * canvas.width
      const textY = (textStyle.y / 100) * canvas.height
      const hitArea = textStyle.fontSize * 2
      return Math.abs(x - textX) < hitArea && Math.abs(y - textY) < hitArea
    }

    const updateTextPosition = (clientX: number, clientY: number) => {
      const { x, y, rect } = getCanvasCoordinates(clientX, clientY)
      
      // Convert to percentage
      const newX = Math.max(0, Math.min(100, (x / canvas.width) * 100))
      const newY = Math.max(0, Math.min(100, (y / canvas.height) * 100))
      
      onTextStyleChange({
        ...textStyle,
        x: newX,
        y: newY
      })

      setMousePos({ x: clientX - rect.left, y: clientY - rect.top })
    }

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      const { x, y } = getCanvasCoordinates(e.clientX, e.clientY)
      if (isWithinTextBounds(x, y)) {
        isDraggingRef.current = true
        updateTextPosition(e.clientX, e.clientY)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      updateTextPosition(e.clientX, e.clientY)
    }

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault() // Prevent scrolling while dragging
      const touch = e.touches[0]
      const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY)
      if (isWithinTextBounds(x, y)) {
        isDraggingRef.current = true
        updateTextPosition(touch.clientX, touch.clientY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return
      e.preventDefault() // Prevent scrolling while dragging
      const touch = e.touches[0]
      updateTextPosition(touch.clientX, touch.clientY)
    }

    const handleEnd = () => {
      isDraggingRef.current = false
    }

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    canvas.addEventListener('mouseleave', handleEnd)

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleEnd)
    canvas.addEventListener('touchcancel', handleEnd)

    return () => {
      // Remove event listeners
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      canvas.removeEventListener('mouseleave', handleEnd)

      canvas.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
      canvas.removeEventListener('touchcancel', handleEnd)
    }
  }, [textStyle, onTextStyleChange])

  const drawText = (ctx: CanvasRenderingContext2D) => {
    const { text, fontSize, fontFamily, color, x, y, rotation, align, letterSpacing, opacity, style, effects, watermark } = textStyle
    
    // Convert percentage positions to actual canvas coordinates
    const canvasX = (x / 100) * ctx.canvas.width
    const canvasY = (y / 100) * ctx.canvas.height
    
    // Save the current context state
    ctx.save()
    
    // Set basic text properties
    const fontWeight = style.bold ? 'bold' : 'normal'
    const fontStyle = style.italic ? 'italic' : 'normal'
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.textAlign = align
    ctx.textBaseline = 'middle'
    ctx.globalAlpha = opacity / 100
    
    // Apply rotation
    if (rotation !== 0) {
      ctx.translate(canvasX, canvasY)
      ctx.rotate(rotation * Math.PI / 180)
      ctx.translate(-canvasX, -canvasY)
    }

    // Apply letter spacing
    if (letterSpacing !== 0) {
      const chars = text.split('')
      let currentX = canvasX
      const metrics = ctx.measureText(text)
      const totalWidth = metrics.width + (letterSpacing * (chars.length - 1))
      
      // Adjust starting position based on text alignment
      switch(align) {
        case 'center':
          currentX -= totalWidth / 2
          break
        case 'right':
          currentX -= totalWidth
          break
      }

      chars.forEach((char, i) => {
        // Draw effects for each character
        if (effects.shadow.enabled) {
          ctx.shadowBlur = effects.shadow.blur
          ctx.shadowColor = effects.shadow.color
          ctx.shadowOffsetX = effects.shadow.offsetX
          ctx.shadowOffsetY = effects.shadow.offsetY
        }

        if (effects.glow.enabled) {
          const alpha = effects.glow.strength * 0.3
          for (let j = 0; j < 3; j++) {
            ctx.shadowBlur = effects.glow.blur * (j + 1)
            ctx.shadowColor = effects.glow.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
            ctx.fillStyle = color
            ctx.fillText(char, currentX, canvasY)
          }
          ctx.shadowBlur = 0
          ctx.shadowColor = 'transparent'
        }

        if (effects.outline.enabled) {
          ctx.lineWidth = effects.outline.width
          ctx.strokeStyle = effects.outline.color
          if (effects.outline.blur > 0) {
            ctx.shadowBlur = effects.outline.blur
            ctx.shadowColor = effects.outline.color
          }
          ctx.strokeText(char, currentX, canvasY)
          ctx.shadowBlur = 0
          ctx.shadowColor = 'transparent'
        }

        // Draw gradient if enabled
        if (effects.gradient.enabled) {
          let gradient
          if (effects.gradient.type === 'linear') {
            const angle = effects.gradient.angle * Math.PI / 180
            const x1 = currentX - Math.cos(angle) * fontSize
            const y1 = canvasY - Math.sin(angle) * fontSize
            const x2 = currentX + Math.cos(angle) * fontSize
            const y2 = canvasY + Math.sin(angle) * fontSize
            gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          } else {
            gradient = ctx.createRadialGradient(currentX, canvasY, 0, currentX, canvasY, fontSize)
          }
          gradient.addColorStop(0, effects.gradient.colors[0])
          gradient.addColorStop(1, effects.gradient.colors[1])
          ctx.fillStyle = gradient
        } else {
          ctx.fillStyle = color
        }

        // Draw the character
        ctx.fillText(char, currentX, canvasY)

        // Move to next character position
        const charWidth = ctx.measureText(char).width
        currentX += charWidth + letterSpacing
      })
    } else {
      // Draw effects for whole text
      if (effects.shadow.enabled) {
        ctx.shadowBlur = effects.shadow.blur
        ctx.shadowColor = effects.shadow.color
        ctx.shadowOffsetX = effects.shadow.offsetX
        ctx.shadowOffsetY = effects.shadow.offsetY
      }

      if (effects.glow.enabled) {
        const alpha = effects.glow.strength * 0.3
        for (let i = 0; i < 3; i++) {
          ctx.shadowBlur = effects.glow.blur * (i + 1)
          ctx.shadowColor = effects.glow.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
          ctx.fillStyle = color
          ctx.fillText(text, canvasX, canvasY)
        }
        ctx.shadowBlur = 0
        ctx.shadowColor = 'transparent'
      }

      if (effects.outline.enabled) {
        ctx.lineWidth = effects.outline.width
        ctx.strokeStyle = effects.outline.color
        if (effects.outline.blur > 0) {
          ctx.shadowBlur = effects.outline.blur
          ctx.shadowColor = effects.outline.color
        }
        ctx.strokeText(text, canvasX, canvasY)
        ctx.shadowBlur = 0
        ctx.shadowColor = 'transparent'
      }

      // Draw gradient if enabled
      if (effects.gradient.enabled) {
        let gradient
        if (effects.gradient.type === 'linear') {
          const angle = effects.gradient.angle * Math.PI / 180
          const x1 = canvasX - Math.cos(angle) * fontSize
          const y1 = canvasY - Math.sin(angle) * fontSize
          const x2 = canvasX + Math.cos(angle) * fontSize
          const y2 = canvasY + Math.sin(angle) * fontSize
          gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        } else {
          gradient = ctx.createRadialGradient(canvasX, canvasY, 0, canvasX, canvasY, fontSize)
        }
        gradient.addColorStop(0, effects.gradient.colors[0])
        gradient.addColorStop(1, effects.gradient.colors[1])
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = color
      }

      // Draw the main text
      ctx.fillText(text, canvasX, canvasY)
    }

    // Draw underline if enabled
    if (style.underline) {
      const metrics = ctx.measureText(text)
      const lineY = canvasY + fontSize * 0.1
      ctx.beginPath()
      ctx.moveTo(canvasX - metrics.width / 2, lineY)
      ctx.lineTo(canvasX + metrics.width / 2, lineY)
      ctx.strokeStyle = color
      ctx.lineWidth = fontSize * 0.05
      ctx.stroke()
    }

    // Restore the context state
    ctx.restore()

    // Draw watermark if enabled
    if (watermark?.enabled) {
      ctx.save()
      
      // Set watermark properties
      const watermarkSize = watermark.fontSize
      ctx.font = `${watermarkSize}px ${fontFamily}`
      ctx.fillStyle = `rgba(255, 255, 255, 0.5)` // Semi-transparent white
      
      // Calculate watermark position
      const padding = 20
      const metrics = ctx.measureText(watermark.text)
      let watermarkX, watermarkY
      
      switch (watermark.position) {
        case 'top-left':
          watermarkX = padding
          watermarkY = padding + watermarkSize
          ctx.textAlign = 'left'
          break
        case 'top-right':
          watermarkX = ctx.canvas.width - padding
          watermarkY = padding + watermarkSize
          ctx.textAlign = 'right'
          break
        case 'bottom-left':
          watermarkX = padding
          watermarkY = ctx.canvas.height - padding
          ctx.textAlign = 'left'
          break
        case 'bottom-right':
          watermarkX = ctx.canvas.width - padding
          watermarkY = ctx.canvas.height - padding
          ctx.textAlign = 'right'
          break
      }
      
      ctx.fillText(watermark.text, watermarkX, watermarkY)
      ctx.restore()
    }
  }

  return <canvas ref={canvasRef} className="max-w-full h-auto" />
}
