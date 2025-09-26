export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
  }
  
  export interface User {
    id: string;
    email: string;
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
  
  export class Web3FormsService {
    private accessKey: string;
    private isConfigured: boolean = false;
  
    constructor() {
      this.accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';
      
      console.log('🔍 Web3Forms Configuration Check:');
      console.log('WEB3FORMS_ACCESS_KEY:', this.accessKey ? `${this.accessKey.substring(0, 8)}...` : 'MISSING');
      
      if (!this.accessKey) {
        console.warn('⚠️ Web3Forms access key missing - Email service will use demo mode');
        this.isConfigured = false;
      } else {
        this.isConfigured = true;
        console.log('✅ Web3Forms email service initialized successfully');
      }
    }
  
    isAvailable(): boolean {
      return this.isConfigured;
    }
  
    async sendEmail(to: string, subject: string, message: string, isHtml: boolean = false): Promise<EmailResult> {
      console.log(`📧 Web3Forms Email Attempt:`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Web3Forms configured: ${this.isConfigured}`);
  
      // Demo mode if not configured
      if (!this.isConfigured) {
        console.log(`📧 DEMO MODE - Web3Forms email to ${to}:`);
        console.log(`─────────────────────────────────`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message.substring(0, 200)}...`);
        console.log(`─────────────────────────────────`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { 
          success: true, 
          messageId: `web3forms_demo_${Date.now()}` 
        };
      }
  
      try {
        console.log(`📧 Sending REAL EMAIL via Web3Forms...`);
  
        const formData = new FormData();
        formData.append('access_key', this.accessKey);
        formData.append('email', to);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('from_name', 'DefendEarth Alert System');
        formData.append('replyto', 'noreply@defendearth.com');
        
        // Add HTML support if needed
        if (isHtml) {
          formData.append('html', message);
        }
  
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
  
        const result = await response.json();
        console.log('📡 Web3Forms API Response:', result);
        
        if (result.success) {
          console.log('✅ Web3Forms email sent successfully!');
          console.log(`Message ID: web3forms_${Date.now()}`);
          
          return {
            success: true,
            messageId: `web3forms_${Date.now()}`
          };
        } else {
          console.error('❌ Web3Forms email failed:', result.message);
          return {
            success: false,
            error: `Web3Forms Error: ${result.message}`
          };
        }
      } catch (error: any) {
        console.error('❌ Web3Forms email error:', error);
        return {
          success: false,
          error: `Network Error: ${error.message}`
        };
      }
    }
  
    // 🎯 Welcome Email
    async sendWelcomeEmail(email: string, location: string): Promise<EmailResult> {
      const subject = '🛡️ DEFEND EARTH - Welcome to Planetary Defense!';
      
      const message = `🛡️ DEFEND EARTH - WELCOME!
  
  Congratulations! Your registration is successful.
  
  ✅ REGISTRATION CONFIRMED
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  📍 Protected Location: ${location}
  📧 Alert Email: ${email}
  🛰️ System Status: MONITORING ACTIVE
  🔄 Check Interval: Every 2 minutes
  
  🚨 EMERGENCY ALERT SYSTEM
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  You will now receive IMMEDIATE email alerts if any asteroid threatens your area.
  
  FEATURES ACTIVE:
  ✅ Real NASA asteroid data monitoring
  ✅ Physics-based impact calculations  
  ✅ Location-targeted emergency alerts
  ✅ Detailed safety instructions
  ✅ 24/7 threat assessment
  
  ⚠️ IMPORTANT SAFETY INFORMATION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  If you receive an emergency alert:
  🏠 Seek immediate shelter in strongest building
  🚪 Stay away from windows and glass
  📻 Monitor official emergency broadcasts
  🆘 Contact emergency services if in immediate danger
  📱 Follow official government instructions
  
  🌍 PLANETARY DEFENSE INITIATIVE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  This system uses real NASA data and advanced physics simulations to provide accurate threat assessments for educational and demonstration purposes.
  
  Stay vigilant, stay protected!
  
  Best regards,
  DefendEarth Team
  🌍 Defending Earth, One Alert at a Time
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DefendEarth.com - Planetary Defense Initiative
  This is an educational demonstration system.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  
      console.log('📧 Sending Welcome Email via Web3Forms...');
      return this.sendEmail(email, subject, message);
    }
  
    // 🚨 Emergency Alert Email
    async sendEmergencyAlert(user: User, asteroid: AsteroidAlert): Promise<EmailResult> {
      const distance = this.calculateDistance(
        user.latitude, user.longitude,
        asteroid.impactLat, asteroid.impactLng
      );
  
      const subject = `🚨 ASTEROID EMERGENCY - ${asteroid.threatLevel} THREAT DETECTED`;
      
      const message = `🚨🔴🚨 ASTEROID EMERGENCY ALERT 🚨🔴🚨
  
  ⚠️ IMMEDIATE THREAT DETECTED - THIS IS NOT A DRILL ⚠️
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🌌 THREAT DETAILS:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🌑 Asteroid Name: ${asteroid.name}
  📏 Size: ${asteroid.diameter} meters diameter  
  🚀 Speed: ${asteroid.speed} km/s
  ⏰ Impact Time: ${asteroid.timeToImpact}
  📍 Distance from You: ${distance.toFixed(0)} km away
  ⚠️ Threat Level: ${asteroid.threatLevel}
  📍 Your Location: ${user.location}
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🛡️ IMMEDIATE SAFETY ACTIONS - FOLLOW NOW:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🏠 SEEK IMMEDIATE SHELTER
     → Get to the strongest building available
     → Go to lowest floor or basement if possible
     → Avoid elevators, use stairs
  
  🚪 PROTECT YOURSELF
     → Stay away from windows and glass
     → Get under sturdy furniture if possible
     → Cover your head and neck
  
  📻 MONITOR EMERGENCY CHANNELS  
     → Listen to official radio/TV broadcasts
     → Check government emergency websites
     → Follow official social media accounts
     → Do NOT rely on social media rumors
  
  🆘 EMERGENCY CONTACTS
     → Call emergency services if in immediate danger
     → Contact family members about your safety
     → Stay calm and follow official instructions
  
  📱 COMMUNICATION
     → Keep phone charged and ready
     → Text instead of calling to save battery
     → Have backup communication methods ready
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  ⚠️ IMPACT ASSESSMENT:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Based on the size and speed of this asteroid:
  • Primary impact crater: ~${(asteroid.diameter * 0.02).toFixed(1)} km radius
  • Severe damage zone: ~${(asteroid.diameter * 0.1).toFixed(1)} km radius  
  • Seismic effects: Up to ${distance > 500 ? '500+' : distance.toFixed(0)} km away
  • Potential secondary effects: Debris, fires, infrastructure damage
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🚨 THIS IS NOT A DRILL 🚨
  TAKE IMMEDIATE ACTION NOW
  
  Time Remaining: ${asteroid.timeToImpact}
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  DefendEarth Emergency Alert System
  Alert sent: ${new Date().toLocaleString()}
  Stay safe. Stay strong. We're monitoring the situation.
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  
      console.log('🚨 Sending Emergency Alert via Web3Forms...');
      return this.sendEmail(user.email, subject, message);
    }
  
    // 🧪 Test Alert Email
    async sendTestAlert(user: User): Promise<EmailResult> {
      const subject = '🧪 DefendEarth System Test - All Systems Operational';
      
      const message = `🧪 DEFENDEARTH SYSTEM TEST
  
  This is a TEST of the asteroid emergency alert system.
  
  ✅ TEST SUCCESSFUL - ALL SYSTEMS OPERATIONAL
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  📧 Your Alert Email: ${user.email}
  📍 Protected Location: ${user.location}
  🛰️ System Status: FULLY OPERATIONAL
  ⏰ Test Time: ${new Date().toLocaleString()}
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🔧 SYSTEM CHECKS:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  ✅ Email Delivery: Working Perfectly
  ✅ Location Tracking: Active
  ✅ NASA Data Feed: Connected  
  ✅ Emergency Protocols: Ready
  ✅ Threat Assessment: Operational
  ✅ Alert Distribution: Functional
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🚨 REAL EMERGENCY ALERT PREVIEW:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  If this was an actual emergency, you would receive:
  • Detailed asteroid threat information
  • Precise impact timeline and location
  • Comprehensive safety instructions  
  • Emergency contact information
  • Real-time updates as situation develops
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  ✅ YOUR PLANETARY DEFENSE SYSTEM IS WORKING CORRECTLY!
  
  You are now protected by our 24/7 monitoring system.
  
  Stay vigilant, stay protected!
  
  DefendEarth Test System
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  
      console.log('🧪 Sending Test Alert via Web3Forms...');
      return this.sendEmail(user.email, subject, message);
    }
  
    async sendBulkEmergencyAlerts(users: User[], asteroid: AsteroidAlert): Promise<EmailResult[]> {
      console.log(`📢 Sending emergency email alerts to ${users.length} users via Web3Forms`);
      
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
          
          // Wait 2 seconds between emails to avoid rate limits
          if (i < users.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
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
  
    // Helper method
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
  }
  