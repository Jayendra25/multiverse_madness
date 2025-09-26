import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      environment: {
        GMAIL_USER: process.env.GMAIL_USER ? 'SET' : 'MISSING',
        GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'SET' : 'MISSING',
        NODE_ENV: process.env.NODE_ENV,
      },
      routes: {
        'register-sms-alerts': 'Available',
        'test-sms': 'Available', 
        'test-gmail': 'Available'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
