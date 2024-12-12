// import { removeTensorFlowBackground } from './tensorflow-removal';

export type RemovalMethod = 'api' | 'tensorflow';

interface RemovalResult {
  blob?: Blob;
  error?: string;
}

export async function removeBackground(
  input: File | string,
  onProgress?: (progress: number) => void,
  method: RemovalMethod = 'api'
): Promise<RemovalResult> {
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
      throw new Error('TensorFlow method not implemented');
    }

    // API method
    const formData = new FormData();
    if (input instanceof File) {
      formData.append('image', input);
    } else {
      // If input is a URL, fetch it first
      const response = await fetch(input);
      const blob = await response.blob();
      formData.append('image', blob);
    }

    const response = await fetch('/api/remove-background', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to remove background');
    }

    const blob = await response.blob();
    return { blob };
  } catch (err) {
    console.error('Error removing background:', err);
    return { 
      error: err instanceof Error ? err.message : 'Failed to remove background'
    };
  }
}
