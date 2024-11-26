import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useToast } from "@/components/UI/use-toast"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png']

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
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
      preProcessImage(file)
        .then(onImageSelected)
        .catch((error) => {
          console.error('Error pre-processing image:', error)
          toast({
            title: "Error",
            description: "Failed to process the image. Please try again.",
            variant: "destructive",
          })
        })
    }
  }, [onImageSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag 'n' drop an image here, or click to select one</p>
      )}
    </div>
  )
}

async function preProcessImage(file: File): Promise<File> {
  // Convert to WebP, resize, and compress
  const img = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Resize if necessary (e.g., max width of 1920px)
  const MAX_WIDTH = 1920
  let width = img.width
  let height = img.height
  if (width > MAX_WIDTH) {
    height *= MAX_WIDTH / width
    width = MAX_WIDTH
  }
  
  canvas.width = width
  canvas.height = height
  ctx?.drawImage(img, 0, 0, width, height)
  
  const webpBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to create blob'))
    }, 'image/webp', 0.8)
  })
  return new File([webpBlob], file.name.replace(/\.[^/.]+$/, ".webp"), { type: 'image/webp' })
}

