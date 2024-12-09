// import * as tf from '@tensorflow/tfjs';
// import * as bodyPix from '@tensorflow-models/body-pix';

// let model: bodyPix.BodyPix | null = null;

// async function loadModel() {
//   if (!model) {
//     model = await bodyPix.load({
//       architecture: 'MobileNetV1',
//       outputStride: 16,
//       multiplier: 0.75,
//       quantBytes: 2
//     });
//   }
//   return model;
// }

// export async function removeTensorFlowBackground(
//   imageElement: HTMLImageElement,
//   onProgress?: (progress: number) => void
// ): Promise<Blob> {
//   try {
//     // Load model
//     onProgress?.(10);
//     const segmentationModel = await loadModel();
//     onProgress?.(30);

//     // Run segmentation
//     const segmentation = await segmentationModel.segmentPerson(imageElement, {
//       flipHorizontal: false,
//       internalResolution: 'medium',
//       segmentationThreshold: 0.7
//     });
//     onProgress?.(60);

//     // Create canvas and get context
//     const canvas = document.createElement('canvas');
//     canvas.width = imageElement.width;
//     canvas.height = imageElement.height;
//     const ctx = canvas.getContext('2d');
    
//     if (!ctx) throw new Error('Could not get canvas context');

//     // Draw original image
//     ctx.drawImage(imageElement, 0, 0);

//     // Get image data
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const pixels = imageData.data;
    
//     // Apply mask
//     for (let i = 0; i < pixels.length; i += 4) {
//       const pixelIndex = i / 4;
//       if (!segmentation.data[pixelIndex]) {
//         pixels[i + 3] = 0; // Set alpha to 0 for background
//       }
//     }

//     // Put processed image back
//     ctx.putImageData(imageData, 0, 0);
//     onProgress?.(90);

//     // Convert to blob
//     return new Promise((resolve) => {
//       canvas.toBlob((blob) => {
//         if (!blob) throw new Error('Failed to convert canvas to blob');
//         onProgress?.(100);
//         resolve(blob);
//       }, 'image/png');
//     });
//   } catch (error) {
//     console.error('TensorFlow background removal error:', error);
//     throw error;
//   }
// }
