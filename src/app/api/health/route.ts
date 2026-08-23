import { NextResponse } from 'next/server';

export async function GET() {
  const firebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);

  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        firebase: firebaseConfigured ? 'configured' : 'missing_env',
        geminiAi: geminiConfigured ? 'configured' : 'missing_env',
      },
    },
    { status: 200 }
  );
}
