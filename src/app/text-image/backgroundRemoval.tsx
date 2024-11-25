'use client'

import React, { createContext, useContext, useState } from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Alert, AlertDescription } from '@/components/UI/alert';
import { removeBackground } from "@imgly/background-removal";
import TextEditor from './text-editor';

interface ImageContextType {
  image: string | null;
  setImage: (image: string | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  processedImage: string | null;
  setProcessedImage: (image: string | null) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) throw new Error('useImage must be used within ImageContext');
  return context;
};

export default function TextImagePage() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Please upload a valid image file (PNG or JPEG)';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        setImage(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    };
  
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    };
  
    const removeImage = () => {
      setImage(null);
      setProcessedImage(null);
      setError(null);
    };
  
    const handleBackgroundRemoval = async () => {
      if (!image) return;
  
      setIsProcessing(true);
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        
        const processedBlob = await removeBackground(blob);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        setProcessedImage(processedUrl);
      } catch (err) {
        setError('Failed to process image');
        console.error('Background removal failed:', err);
      } finally {
        setIsProcessing(false);
      }
    };
  
    return (
      <ImageContext.Provider value={{ 
        image, 
        setImage, 
        isProcessing, 
        setIsProcessing,
        processedImage,
        setProcessedImage 
      }}>
        <div className="w-full max-w-4xl mx-auto p-4">
          {!image ? (
            <Card>
              <CardContent
                className={`p-6 border-2 border-dashed rounded-lg transition-colors
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept="image/png,image/jpeg"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="secondary" className="mb-2">
                        Select Image
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPEG up to 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={removeImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <img 
                  src={image} 
                  alt="Original" 
                  className="w-full h-auto rounded-lg"
                />
                <TextEditor onProcess={handleBackgroundRemoval} />
                {processedImage && (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                  />
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Processing image...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
  
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </ImageContext.Provider>
    );
  }