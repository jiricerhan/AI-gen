import { processInteraction } from '@/modules/any-application/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Convert FormData to plain object
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const html = await processInteraction(data);

    // Return HTML directly for htmx to swap
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error processing interaction:', error);
    return new Response(
      '<p class="text-red-500">Error processing interaction</p>',
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}
