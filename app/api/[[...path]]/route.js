import { NextResponse } from 'next/server';

// Health check and API info endpoint
export async function GET(request) {
  const { pathname } = new URL(request.url);
  
  return NextResponse.json({
    status: 'ok',
    message: 'TA Personality Demo API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      info: '/api/'
    }
  });
}

export async function POST(request) {
  return NextResponse.json({
    status: 'ok',
    message: 'TA Personality Demo API - POST endpoint'
  });
}
