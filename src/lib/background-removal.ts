// import { removeTensorFlowBackground } from './tensorflow-removal';

export type RemovalMethod = 'api' | 'tensorflow';

export async function removeBackground(
  input: File | string,
  onProgress?: (progress: number) => void,
  method: RemovalMethod = 'api'
): Promise<Blob> {
  try {
    if (method === 'tensorflow') {
      // Convert input to image element
      const imageUrl = input instanceof File ? URL.createObjectURL(input) : input;
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });
      
      // return removeTensorFlowBackground(img, onProgress);
    }

    // API method (existing code)
    // Convert input to FormData
    const formData = new FormData();
    if (input instanceof File) {
      formData.append('image', input);
    } else {
      // If input is a URL, fetch it first
      const response = await fetch(input);
      const blob = await response.blob();
      formData.append('image', blob);
    }

    // Call our API route
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to remove background');
    }

    return response.blob();
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
}
