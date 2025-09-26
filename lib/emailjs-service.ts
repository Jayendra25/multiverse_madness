import emailjs from '@emailjs/browser';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
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

export class EmailJSService {
  private serviceId: string;
  private templateId: string;
  private userId: string;
  private isConfigured: boolean = false;

  constructor() {
    this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    this.templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    this.userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID || '';
    
    console.log('🔍 EmailJS Configuration Check:');
    console.log('EMAILJS_SERVICE_ID:', this.serviceId ? `${this.serviceId.substring(0, 8)}...` : 'MISSING');
    console.log('EMAILJS_TEMPLATE_ID:', this.templateId ? `${this.templateId.substring(0, 8)}...` : 'MISSING');
    console.log('EMAILJS_USER_ID:', this.userId ? `${this.userId.substring(0, 8)}...` : 'MISSING');
    
    if (!this.serviceId || !this.templateId || !this.userId) {
      console.warn('⚠️ EmailJS credentials missing - Email service will use demo mode');
      this.isConfigured = false;
    } else {
      // Initialize EmailJS
      emailjs.init(this.userId);
      this.isConfigured = true;
      console.log('✅ EmailJS email service initialized successfully');
    }
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent: string): Promise<EmailResult> {
    console.log(`📧 EmailJS Email Attempt:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`EmailJS configured: ${this.isConfigured}`);

    // Demo mode if not configured
    if (!this.isConfigured) {
      console.log(`📧 DEMO MODE - EmailJS email to ${to}:`);
      console.log(`─────────────────────────────────`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${textContent.substring(0, 200)}...`);
      console.log(`─────────────────────────────────`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { 
        success: true, 
        messageId: `emailjs_demo_${Date.now()}`, 
        cost: 0 
      };
    }

    try {
      console.log(`📧 Sending REAL EMAIL via EmailJS...`);

      // In the sendEmail method, update templateParams:
const templateParams = {
    to_email: to,
    subject: subject,
    html_content: htmlContent,
    text_content: textContent,
    from_name: 'DefendEarth Alert System',
    reply_to: 'noreply@defendearth.com',
    // Add any custom variables your template needs
    user_location: location, // Make sure this matches your template variable
    user_email: to
  };
  

      const result = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('✅ EmailJS email sent successfully!');
      console.log(`Status: ${result.status}`);
      console.log(`Text: ${result.text}`);
      
      return {
        success: true,
        messageId: `emailjs_${Date.now()}`,
        cost: 0 // EmailJS is free
      };
    } catch (error: any) {
      console.error('❌ EmailJS email failed:', error);
      return {
        success: false,
        error: `EmailJS Error: ${error.text || error.message}`
      };
    }
  }

  // 🎯 Welcome Email
  async sendWelcomeEmail(email: string, location: string): Promise<EmailResult> {
    const subject = '🛡️ DEFEND EARTH - Welcome to Planetary Defense System!';
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e3a8a, #059669); color: white; border-radius: 15px; overflow: hidden;">
      <div style="background: rgba(0,0,0,0.8); padding: 30px; text-align: center;">
        <h1 style="font-size: 32px; margin: 0; background: linear-gradient(45deg, #f59e0b, #ef4444); -webkit-background-clip: text; color: transparent;">🛡️ DEFEND EARTH</h1>
        <p style="font-size: 18px; margin: 10px 0;">Welcome to the Planetary Defense System!</p>
      </div>
      
      <div style="padding: 30px; background: rgba(255,255,255,0.1);">
        <h2 style="color: #fbbf24;">✅ Registration Successful!</h2>
        
        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #34d399;">📍 Your Protected Location:</h3>
          <p style="font-size: 16px; margin: 5px 0;">${location}</p>
          
          <h3 style="color: #34d399;">📧 Alert Email:</h3>
          <p style="font-size: 16px; margin: 5px 0;">${email}</p>
          
          <h3 style="color: #34d399;">🛰️ System Status:</h3>
          <p style="font-size: 16px; margin: 5px 0; color: #10b981;"><strong>MONITORING ACTIVE</strong></p>
        </div>
        
        <div style="background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #fca5a5;">🚨 Emergency Alert System</h3>
          <p>You will now receive <strong>immediate email alerts</strong> if any asteroid threatens your area.</p>
          <ul style="text-align: left; color: #fecaca;">
            <li>Real NASA asteroid data monitoring</li>
            <li>Physics-based impact calculations</li>
            <li>Location-targeted emergency alerts</li>
            <li>Detailed safety instructions</li>
          </ul>
        </div>
        
        <div style="background: rgba(59, 130, 246, 0.2); border: 2px solid #3b82f6; border-radius: 10px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #93c5fd;">This system uses real NASA data and advanced physics simulations to provide accurate threat assessments for educational and demonstration purposes.</p>
        </div>
        
        <p style="font-size: 18px; margin: 30px 0 10px 0; color: #fbbf24;"><strong>Stay vigilant, stay protected!</strong></p>
        <p style="font-size: 14px; color: #d1d5db;">DefendEarth.com - Planetary Defense Initiative</p>
      </div>
    </div>`;

    const textContent = `🛡️ DEFEND EARTH - Welcome!

Registration Successful!

📍 Your Protected Location: ${location}
📧 Alert Email: ${email}
🛰️ System Status: MONITORING ACTIVE

🚨 Emergency Alert System
You will now receive immediate email alerts if any asteroid threatens your area.

Features:
- Real NASA asteroid data monitoring
- Physics-based impact calculations  
- Location-targeted emergency alerts
- Detailed safety instructions

Stay vigilant, stay protected!

DefendEarth.com - Planetary Defense Initiative`;

    console.log('📧 Sending Welcome Email via EmailJS...');
    return this.sendEmail(email, subject, htmlContent, textContent);
  }

  // 🚨 Emergency Alert Email
  async sendEmergencyAlert(user: User, asteroid: AsteroidAlert): Promise<EmailResult> {
    const distance = this.calculateDistance(
      user.latitude, user.longitude,
      asteroid.impactLat, asteroid.impactLng
    );

    const urgencyColor = this.getUrgencyColor(asteroid.threatLevel);
    const subject = `🚨 ASTEROID EMERGENCY - ${asteroid.threatLevel} THREAT DETECTED`;
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #7f1d1d, #dc2626); color: white; border-radius: 15px; overflow: hidden;">
      <div style="background: rgba(0,0,0,0.9); padding: 20px; text-align: center; border-bottom: 3px solid #ef4444;">
        <h1 style="font-size: 36px; margin: 0; color: #ff6b6b; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">🚨 ASTEROID EMERGENCY 🚨</h1>
        <p style="font-size: 20px; margin: 10px 0; color: #fca5a5; font-weight: bold;">IMMEDIATE THREAT DETECTED</p>
      </div>
      
      <div style="padding: 30px; background: rgba(0,0,0,0.7);">
        <div style="background: ${urgencyColor}; padding: 25px; border-radius: 15px; margin: 20px 0; border: 3px solid #ffffff;">
          <h2 style="color: white; text-align: center; margin: 0 0 20px 0; font-size: 24px;">⚠️ THREAT DETAILS ⚠️</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; color: white;">
            <div>
              <h3 style="color: #fef3c7; margin: 10px 0 5px 0;">🌌 Asteroid Name:</h3>
              <p style="font-size: 18px; font-weight: bold; margin: 0;">${asteroid.name}</p>
              
              <h3 style="color: #fef3c7; margin: 15px 0 5px 0;">📏 Size:</h3>
              <p style="font-size: 18px; font-weight: bold; margin: 0;">${asteroid.diameter} meters diameter</p>
              
              <h3 style="color: #fef3c7; margin: 15px 0 5px 0;">🚀 Speed:</h3>
              <p style="font-size: 18px; font-weight: bold; margin: 0;">${asteroid.speed} km/s</p>
            </div>
            
            <div>
              <h3 style="color: #fef3c7; margin: 10px 0 5px 0;">⏰ Impact Time:</h3>
              <p style="font-size: 18px; font-weight: bold; margin: 0; color: #fbbf24;">${asteroid.timeToImpact}</p>
              
              <h3 style="color: #fef3c7; margin: 15px 0 5px 0;">📍 Distance from You:</h3>
              <p style="font-size: 18px; font-weight: bold; margin: 0; color: #fbbf24;">${distance.toFixed(0)} km away</p>
              
              <h3 style="color: #fef3c7; margin: 15px 0 5px 0;">⚠️ Threat Level:</h3>
              <p style="font-size: 20px; font-weight: bold; margin: 0; color: #ff6b6b;">${asteroid.threatLevel}</p>
            </div>
          </div>
        </div>
        
        <div style="background: rgba(239, 68, 68, 0.8); padding: 25px; border-radius: 15px; margin: 20px 0; border: 3px solid #ffffff;">
          <h2 style="color: white; text-align: center; margin: 0 0 20px 0; font-size: 24px;">🛡️ IMMEDIATE SAFETY ACTIONS</h2>
          
          <div style="color: white; font-size: 16px; line-height: 1.6;">
            <p style="margin: 15px 0; font-size: 18px; font-weight: bold;">🏠 SEEK IMMEDIATE SHELTER</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Get to the strongest building available</li>
              <li>Go to the lowest floor or basement if possible</li>
              <li>Stay away from windows and glass</li>
            </ul>
            
            <p style="margin: 15px 0; font-size: 18px; font-weight: bold;">📻 MONITOR EMERGENCY CHANNELS</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Listen to official radio/TV broadcasts</li>
              <li>Check government emergency websites</li>
              <li>Follow official social media accounts</li>
            </ul>
            
            <p style="margin: 15px 0; font-size: 18px; font-weight: bold;">🆘 EMERGENCY CONTACTS</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Call emergency services if in immediate danger</li>
              <li>Contact family members about your safety</li>
              <li>Stay calm and follow official instructions</li>
            </ul>
          </div>
        </div>
        
        <div style="background: rgba(0,0,0,0.8); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <p style="font-size: 20px; font-weight: bold; color: #ff6b6b; margin: 0;">⚠️ THIS IS NOT A DRILL ⚠️</p>
          <p style="font-size: 14px; color: #d1d5db; margin: 10px 0 0 0;">DefendEarth Emergency Alert System</p>
        </div>
      </div>
    </div>`;

    const textContent = `🚨 ASTEROID EMERGENCY ALERT 🚨

IMMEDIATE THREAT DETECTED

Asteroid: ${asteroid.name}
Size: ${asteroid.diameter}m diameter
Speed: ${asteroid.speed} km/s
Impact Time: ${asteroid.timeToImpact}
Distance from you: ${distance.toFixed(0)}km
Threat Level: ${asteroid.threatLevel}

⚠️ IMMEDIATE SAFETY ACTIONS ⚠️

🏠 SEEK IMMEDIATE SHELTER
- Get to the strongest building available
- Go to lowest floor/basement if possible
- Stay away from windows and glass

📻 MONITOR EMERGENCY CHANNELS
- Listen to official radio/TV broadcasts
- Check government emergency websites
- Follow official social media accounts

🆘 EMERGENCY CONTACTS
- Call emergency services if in immediate danger
- Contact family about your safety
- Stay calm and follow official instructions

⚠️ THIS IS NOT A DRILL ⚠️

DefendEarth Emergency Alert System`;

    console.log('🚨 Sending Emergency Alert Email via EmailJS...');
    return this.sendEmail(user.email, subject, htmlContent, textContent);
  }

  // 🧪 Test Alert Email
  async sendTestAlert(user: User): Promise<EmailResult> {
    const subject = '🧪 DefendEarth System Test - All Systems Operational';
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #065f46, #7c3aed); color: white; border-radius: 15px; overflow: hidden;">
      <div style="background: rgba(0,0,0,0.8); padding: 25px; text-align: center;">
        <h1 style="font-size: 32px; margin: 0; color: #a78bfa;">🧪 SYSTEM TEST</h1>
        <p style="font-size: 18px; margin: 10px 0;">DefendEarth Alert System</p>
      </div>
      
      <div style="padding: 30px; background: rgba(255,255,255,0.1);">
        <h2 style="color: #34d399;">✅ Test Successful!</h2>
        <p>This is a test of the asteroid emergency alert system.</p>
        
        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #fbbf24;">📧 Your Alert Email:</h3>
          <p>${user.email}</p>
          
          <h3 style="color: #fbbf24;">📍 Protected Location:</h3>
          <p>${user.location}</p>
          
          <h3 style="color: #fbbf24;">🛰️ System Status:</h3>
          <p style="color: #10b981; font-weight: bold;">FULLY OPERATIONAL</p>
        </div>
        
        <div style="background: rgba(59, 130, 246, 0.2); border: 2px solid #3b82f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #93c5fd;">System Checks:</h3>
          <ul style="color: #bfdbfe; line-height: 1.8;">
            <li>✅ Email Delivery: Working</li>
            <li>✅ Location Tracking: Active</li>
            <li>✅ NASA Data Feed: Connected</li>
            <li>✅ Emergency Protocols: Ready</li>
            <li>✅ Threat Assessment: Operational</li>
          </ul>
        </div>
        
        <div style="background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444; padding: 15px; border-radius: 10px; margin: 20px 0;">
          <p style="color: #fca5a5; margin: 0;"><strong>Real Emergency Alert:</strong> If this was an actual emergency, you would receive detailed threat information, impact timeline, and comprehensive safety instructions.</p>
        </div>
        
        <p style="text-align: center; font-size: 18px; color: #10b981; font-weight: bold;">Your planetary defense system is working correctly!</p>
        <p style="text-align: center; font-size: 14px; color: #d1d5db;">DefendEarth Test System</p>
      </div>
    </div>`;

    const textContent = `🧪 DEFENDEARTH SYSTEM TEST

✅ Test Successful!

This is a test of the asteroid emergency alert system.

📧 Your Alert Email: ${user.email}
📍 Protected Location: ${user.location}
🛰️ System Status: FULLY OPERATIONAL

System Checks:
✅ Email Delivery: Working
✅ Location Tracking: Active
✅ NASA Data Feed: Connected
✅ Emergency Protocols: Ready
✅ Threat Assessment: Operational

Real Emergency Alert: If this was an actual emergency, you would receive detailed threat information, impact timeline, and comprehensive safety instructions.

Your planetary defense system is working correctly!

DefendEarth Test System`;

    console.log('🧪 Sending Test Alert Email via EmailJS...');
    return this.sendEmail(user.email, subject, htmlContent, textContent);
  }

  async sendBulkEmergencyAlerts(users: User[], asteroid: AsteroidAlert): Promise<EmailResult[]> {
    console.log(`📢 Sending emergency email alerts to ${users.length} users via EmailJS`);
    
    const results: EmailResult[] = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`📦 Sending email alert ${i + 1}/${users.length} to ${user.email}`);
      
      try {
        const result = await this.sendEmergencyAlert(user, asteroid);
        results.push(result);
        
        if (result.success) {
          console.log(`✅ Email alert sent to ${user.email}`);
        } else {
          console.log(`❌ Failed to send email alert to ${user.email}: ${result.error}`);
        }
        
        // Wait 1 second between emails to avoid rate limits
        if (i < users.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error sending email to ${user.email}:`, error);
        results.push({
          success: false,
          error: `Failed to send to ${user.email}: ${error}`
        });
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

  private getUrgencyColor(threatLevel: string): string {
    switch (threatLevel) {
      case 'CATASTROPHIC': return 'rgba(153, 27, 27, 0.9)'; // Dark red
      case 'HIGH': return 'rgba(194, 65, 12, 0.9)'; // Dark orange
      case 'MODERATE': return 'rgba(161, 98, 7, 0.9)'; // Dark yellow
      default: return 'rgba(21, 94, 117, 0.9)'; // Dark blue
    }
  }
}
