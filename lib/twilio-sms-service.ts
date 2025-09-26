import twilio from 'twilio';

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
}

export interface User {
  id: string;
  phone: string;
  latitude: number;
  longitude: number;
  location: string;
  verified: boolean;
}

export interface AsteroidAlert {
  name: string;
  diameter: number;
  speed: number;
  impactLat: number;
  impactLng: number;
  timeToImpact: string;
  dangerRadius: number;
  threatLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CATASTROPHIC';
}

export class TwilioSMSService {
  private client: twilio.Twilio | null = null;
  private fromNumber: string;
  private isConfigured: boolean = false;

  constructor() {
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER ?? '';
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      
      console.log('🔍 Checking Twilio configuration...');

      if (!accountSid || !authToken || !this.fromNumber) {
        console.warn('⚠️ Twilio credentials missing - SMS service will use demo mode');
        this.isConfigured = false;
        return;
      }

      this.client = twilio(accountSid, authToken);
      this.isConfigured = true;
      console.log('✅ Twilio SMS service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Twilio service:', error);
      this.isConfigured = false;
    }
  }

  isAvailable(): boolean {
    return this.isConfigured && this.client !== null;
  }

  async sendSMS(to: string, message: string): Promise<SMSResult> {
    // Demo mode - simulate SMS sending
    if (!this.isAvailable()) {
      console.log(`📱 DEMO MODE - Would send SMS to ${to}:`);
      console.log(`📄 Message: ${message}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        messageId: `demo_${Date.now()}`,
        cost: 0
      };
    }

    try {
      console.log(`📱 Sending SMS to ${to}`);
      
      const result = await this.client!.messages.create({
        body: message,
        from: this.fromNumber,
        to: to,
      });

      console.log(`✅ SMS sent successfully. SID: ${result.sid}`);
      
      return {
        success: true,
        messageId: result.sid,
        cost: parseFloat(result.price || '0')
      };
    } catch (error: any) {
      console.error('❌ SMS failed:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  // 🎯 NEW: Welcome/Registration Success SMS
  async sendWelcomeSMS(phone: string, location: string): Promise<SMSResult> {
    const message = `🛡️ DEFEND EARTH - Registration Successful! 

Welcome to the Planetary Defense Alert System!

📍 Location: ${location}
📱 Phone: ${phone}
🛰️ Status: MONITORING ACTIVE

You will now receive emergency alerts if any asteroid threatens your area. Stay safe!

⚠️ This is an automated system for educational purposes.

DefendEarth.com`;

    return this.sendSMS(phone, message);
  }

  // 🚨 Enhanced Danger Alert SMS
  async sendEmergencyAlert(user: User, asteroid: AsteroidAlert): Promise<SMSResult> {
    const distance = this.calculateDistance(
      user.latitude, user.longitude,
      asteroid.impactLat, asteroid.impactLng
    );

    const urgencyEmoji = this.getUrgencyEmoji(asteroid.threatLevel);
    const timeWarning = this.formatTimeWarning(asteroid.timeToImpact);
    
    const message = `${urgencyEmoji} ASTEROID EMERGENCY ALERT ${urgencyEmoji}

🚨 IMMEDIATE THREAT DETECTED 🚨

Asteroid: ${asteroid.name}
Size: ${asteroid.diameter}m diameter
Speed: ${asteroid.speed} km/s
Impact Time: ${timeWarning}
Distance from you: ${distance.toFixed(0)}km
Threat Level: ${asteroid.threatLevel}

⚠️ EMERGENCY ACTIONS ⚠️
🏠 SEEK IMMEDIATE SHELTER
🚪 Stay indoors, away from windows
📱 Monitor official emergency channels
🆘 Contact emergency services if needed

This is NOT a drill!

DefendEarth Emergency System`;

    return this.sendSMS(user.phone, message);
  }

  // 🧪 Test Alert SMS
  async sendTestAlert(user: User): Promise<SMSResult> {
    const message = `🧪 TEST ALERT - DefendEarth System

This is a TEST of the asteroid emergency alert system.

📍 Your location: ${user.location}
📱 Phone: ${user.phone}
🛰️ System status: OPERATIONAL

If this was a real emergency, you would receive:
• Asteroid details
• Impact timeline
• Safety instructions
• Emergency contacts

System is working correctly! ✅

DefendEarth Test System`;

    return this.sendSMS(user.phone, message);
  }

  async sendBulkEmergencyAlerts(users: User[], asteroid: AsteroidAlert): Promise<SMSResult[]> {
    console.log(`📢 Sending emergency alerts to ${users.length} users`);
    
    const batchSize = 10;
    const results: SMSResult[] = [];
    
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const batchPromises = batch.map(user => 
        this.sendEmergencyAlert(user, asteroid)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            success: false,
            error: `Failed for user ${batch[index].phone}: ${result.reason}`
          });
        }
      });
      
      // Wait 1 second between batches to respect rate limits
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  // Helper methods
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private getUrgencyEmoji(threatLevel: string): string {
    switch (threatLevel) {
      case 'CATASTROPHIC': return '🚨🔴🚨';
      case 'HIGH': return '🚨⚠️🚨';
      case 'MODERATE': return '⚠️🟡⚠️';
      default: return '🟢ℹ️🟢';
    }
  }

  private formatTimeWarning(timeToImpact: string): string {
    return timeToImpact.replace(/(\d+\.?\d*)\s*(hours?|minutes?|seconds?)/gi, (match, num, unit) => {
      const number = parseFloat(num);
      const singular = unit.toLowerCase().replace('s', '');
      return `${number} ${number === 1 ? singular : singular + 's'}`;
    });
  }
}
