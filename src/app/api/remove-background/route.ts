import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert Blob to base64
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString('base64');

    // Call remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || '',
      },
      body: JSON.stringify({
        image_file_b64: base64Image,
        size: 'auto',
        type: 'auto',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Remove.bg API error:', error);
      throw new Error(error.errors?.[0]?.title || 'Failed to remove background');
    }

    // Get the processed image
    const processedBuffer = await response.arrayBuffer();

    // Return the processed image
    return new NextResponse(processedBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove background' },
      { status: 500 }
    );
  }
}
