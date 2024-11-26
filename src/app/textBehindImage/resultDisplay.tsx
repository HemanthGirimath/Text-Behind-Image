import { useEffect, useRef, useState } from 'react'
import { TextStyle } from './textEditor'

interface ResultDisplayProps {
  originalImage: string;
  processedImage: string | null;
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
}

export function ResultDisplay({ originalImage, processedImage, textStyle, onTextStyleChange }: ResultDisplayProps) {
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
          ctx.drawImage(img1, offsetX, offsetY, width, height)
          resolve(null)
        }
        img1.src = originalImage
      })

      drawText(ctx)

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
            
            ctx.drawImage(img1, offsetX, offsetY, width, height)
            drawText(ctx)
            ctx.drawImage(img2, offsetX, offsetY, width, height)
            resolve(null)
          }
          img2.src = processedImage
        })
      }
    }

    drawImages()
  }, [originalImage, processedImage, textStyle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      
      const textX = (textStyle.x / 100) * canvas.width
      const textY = (textStyle.y / 100) * canvas.height
      
      const hitArea = textStyle.fontSize * 3
      if (Math.abs(x - textX) < hitArea && Math.abs(y - textY) < hitArea) {
        isDraggingRef.current = true
        setMousePos({ x, y })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      
      const newX = (x / canvas.width) * 100
      const newY = (y / canvas.height) * 100
      
      const clampedX = Math.max(0, Math.min(100, newX))
      const clampedY = Math.max(0, Math.min(100, newY))
      
      onTextStyleChange({ ...textStyle, x: clampedX, y: clampedY })
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [textStyle, onTextStyleChange])

  const drawText = (ctx: CanvasRenderingContext2D) => {
    const baseWidth = 800
    const scaleFactor = Math.max(1, ctx.canvas.width / baseWidth)
    const fontScaleFactor = textStyle.fontSize > 200 ? 0.75 : 1
    
    const scaledFontSize = textStyle.fontSize * scaleFactor * fontScaleFactor
    const scaledSpacing = textStyle.letterSpacing * scaleFactor
    
    // Save the current context state
    ctx.save()
    
    // Set the transformation point to text position
    const x = (textStyle.x / 100) * ctx.canvas.width
    const y = (textStyle.y / 100) * ctx.canvas.height
    ctx.translate(x, y)
    
    // Apply rotation if any
    if (textStyle.rotation) {
      ctx.rotate((textStyle.rotation * Math.PI) / 180)
    }
    
    // Apply scaling
    if (textStyle.transform?.scale) {
      ctx.scale(textStyle.transform.scale.x, textStyle.transform.scale.y)
    }
    
    // Apply skewing
    if (textStyle.transform?.skew) {
      ctx.transform(1, textStyle.transform.skew.y, textStyle.transform.skew.x, 1, 0, 0)
    }
    
    // Set up text properties
    let fontString = `${scaledFontSize}px ${textStyle.fontFamily}`
    if (textStyle.style?.italic) fontString = `italic ${fontString}`
    if (textStyle.style?.bold) fontString = `bold ${fontString}`
    
    ctx.font = fontString
    ctx.textAlign = textStyle.align
    ctx.textBaseline = textStyle.verticalAlign === 'top' ? 'top' : 
                       textStyle.verticalAlign === 'bottom' ? 'bottom' : 'middle'
    
    // Fix color application
    const color = textStyle.color.startsWith('#') 
      ? hexToRgba(textStyle.color, textStyle.opacity / 100)
      : textStyle.color
    ctx.fillStyle = color
    
    // Draw text based on direction
    const text = textStyle.text
    if (textStyle.direction === 'vertical') {
      const chars = text.split('')
      let currentY = 0
      chars.forEach(char => {
        ctx.fillText(char, 0, currentY)
        currentY += scaledFontSize + scaledSpacing
      })
    } else {
      // Horizontal text with letter spacing
      let currentX = 0
      const chars = text.split('')
      chars.forEach(char => {
        // Add stroke if enabled
        if (textStyle.style?.stroke?.enabled) {
          ctx.strokeStyle = textStyle.style.stroke.color
          ctx.lineWidth = textStyle.style.stroke.width * scaleFactor
          ctx.strokeText(char, currentX, 0)
        }
        
        // Draw the fill
        ctx.fillText(char, currentX, 0)
        currentX += ctx.measureText(char).width + scaledSpacing
      })
    }
    
    // Draw underline if enabled
    if (textStyle.style?.underline) {
      const metrics = ctx.measureText(text)
      ctx.beginPath()
      ctx.lineWidth = scaledFontSize * 0.05
      ctx.moveTo(-metrics.width / 2, scaledFontSize * 0.2)
      ctx.lineTo(metrics.width / 2, scaledFontSize * 0.2)
      ctx.stroke()
    }
    
    // Restore the context state
    ctx.restore()
  }

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return <canvas ref={canvasRef} className="max-w-full h-auto" />
}

