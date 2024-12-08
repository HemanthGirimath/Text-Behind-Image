'use client'

import { useCallback, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/UI/card'
import { Upload } from 'lucide-react'
import { useToast } from "@/components/UI/use-toast"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png']

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG or PNG image.",
        variant: "destructive",
      })
      return
    }
    onImageUpload(file)
  }, [onImageUpload, toast])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <Card 
      className="w-full max-w-3xl mx-auto cursor-pointer group"
      onClick={() => inputRef.current?.click()}
    >
      <CardContent>
        <div
          className={`
            flex flex-col items-center justify-center p-12 text-center
            border-2 border-dashed rounded-lg
            ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}
            ${!isDragging && 'group-hover:border-primary/50'}
          `}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 mb-4 text-muted-foreground group-hover:text-primary" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Drop your image here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPEG and PNG up to 5MB
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  )
}
