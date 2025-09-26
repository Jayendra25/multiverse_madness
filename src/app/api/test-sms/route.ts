import { NextRequest, NextResponse } from 'next/server';
import { AsteroidAlertSystem } from '../../../../lib/asteroid-alert-system';

let alertSystem: AsteroidAlertSystem | null = null;

function getAlertSystem() {
  if (!alertSystem) {
    try {
      alertSystem = new AsteroidAlertSystem();
    } catch (error) {
      console.error('Failed to initialize alert system:', error);
      return null;
    }
  }
  return alertSystem;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;
    
    console.log('🧪 Test API called with action:', action, 'params:', params);

    const system = getAlertSystem();

    if (!system) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Alert system not available - check server logs',
          message: 'System initialization failed'
        }, 
        { status: 503 }
      );
    }
    
    switch (action) {
      case 'simulate_threat':
        try {
          await system.simulateThreat(params);
          return NextResponse.json({ 
            success: true, 
            message: 'Emergency threat simulation triggered successfully! Check your email inbox for danger alerts.' 
          });
        } catch (error: any) {
          console.error('Simulate threat error:', error);
          return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Failed to simulate threat'
          }, { status: 500 });
        }
        
      case 'test_alert':
        try {
          if (!params.email) {
            return NextResponse.json({ 
              success: false,
              error: 'Email address required',
              message: 'No email provided for test'
            }, { status: 400 });
          }
          
          const testResult = await system.sendTestAlertToUser(params.email);
          return NextResponse.json({
            success: testResult.success,
            message: testResult.message,
            error: testResult.success ? undefined : testResult.message
          });
        } catch (error: any) {
          console.error('Test alert error:', error);
          return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Failed to send test alert'
          }, { status: 500 });
        }
        
      case 'get_stats':
        try {
          const stats = system.getStats();
          return NextResponse.json({
            success: true,
            ...stats
          });
        } catch (error: any) {
          console.error('Get stats error:', error);
          return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Failed to get system stats'
          }, { status: 500 });
        }
        
      default:
        return NextResponse.json({ 
          success: false,
          error: 'Unknown action',
          message: `Action '${action}' is not supported`
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: error.message,
      details: 'Check server console for full error details'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const system = getAlertSystem();
    
    if (!system) {
      return NextResponse.json({
        available: false,
        error: 'System not initialized'
      });
    }

    const stats = system.getStats();
    
    return NextResponse.json({
      available: true,
      ...stats
    });
  } catch (error: any) {
    return NextResponse.json({
      available: false,
      error: error.message
    });
  }
}
