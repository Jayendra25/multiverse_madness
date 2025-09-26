import { NextRequest, NextResponse } from 'next/server';
import { AsteroidAlertSystem } from '../../../../lib/asteroid-alert-system';

let alertSystem: AsteroidAlertSystem | null = null;

function getAlertSystem() {
  if (!alertSystem) {
    alertSystem = new AsteroidAlertSystem();
  }
  return alertSystem;
}

export async function GET() {
  try {
    const system = getAlertSystem();
    const stats = system.getStats();
    
    return NextResponse.json({
      stats,
      message: 'Debug info retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}
