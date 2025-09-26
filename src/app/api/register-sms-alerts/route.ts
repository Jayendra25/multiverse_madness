import { NextRequest, NextResponse } from 'next/server';
import { AsteroidAlertSystem } from '../../../../lib/asteroid-alert-system';

let alertSystem: AsteroidAlertSystem | null = null;

function getAlertSystem() {
  if (!alertSystem) {
    try {
      alertSystem = new AsteroidAlertSystem();
      if (alertSystem.isAvailable()) {
        alertSystem.startMonitoring(2);
        console.log('🚀 Email Alert system started successfully');
      } else {
        console.log('⚠️ Alert system running in demo mode');
      }
    } catch (error) {
      console.error('Failed to initialize alert system:', error);
      // Don't return null, create a basic response
    }
  }
  return alertSystem;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, latitude, longitude, location } = body;
    
    console.log('📧 Registration request received:', { email, phone, latitude, longitude });
    
    // Support both email and phone registration
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Location coordinates are required' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const system = getAlertSystem();
    
    if (!system) {
      return NextResponse.json(
        { error: 'Alert system initialization failed' },
        { status: 500 }
      );
    }

    const result = await system.registerUser({
      email: email,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      location: location || `${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}`
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        verificationSent: result.verificationSent,
        demoMode: result.demoMode
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const system = getAlertSystem();
    
    if (!system) {
      return NextResponse.json({
        status: 'error',
        message: 'System not initialized',
        totalUsers: 0,
        verifiedUsers: 0,
        monitoringActive: false,
        demoMode: true,
        emailProvider: 'None',
        emailAvailable: false
      });
    }

    const stats = system.getStats();
    
    return NextResponse.json({
      status: 'active',
      ...stats
    });
  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to get system status',
      error: error.message,
      totalUsers: 0,
      verifiedUsers: 0,
      monitoringActive: false,
      demoMode: true,
      emailProvider: 'None',
      emailAvailable: false
    });
  }
}
