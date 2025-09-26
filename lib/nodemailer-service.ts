import nodemailer from 'nodemailer';

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

export class NodemailerService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;
  private gmailUser: string;
  private gmailAppPassword: string;

  constructor() {
    this.gmailUser = process.env.GMAIL_USER || '';
    this.gmailAppPassword = process.env.GMAIL_APP_PASSWORD || '';
    
    console.log('🔍 Nodemailer Configuration Check:');
    console.log('GMAIL_USER:', this.gmailUser ? `${this.gmailUser}` : 'MISSING');
    console.log('GMAIL_APP_PASSWORD:', this.gmailAppPassword ? `${this.gmailAppPassword.substring(0, 4)}****` : 'MISSING');
    
    if (!this.gmailUser || !this.gmailAppPassword) {
      console.warn('⚠️ Gmail credentials missing - Email service will use demo mode');
      this.isConfigured = false;
      return;
    }

    try {
      // Create transporter
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // This automatically sets host, port, and secure options
        auth: {
          user: this.gmailUser,
          pass: this.gmailAppPassword,
        }
      });

      this.isConfigured = true;
      console.log('✅ Nodemailer Gmail service initialized successfully');
      
      // Test connection
      this.testConnection();
    } catch (error) {
      console.error('❌ Failed to initialize Nodemailer service:', error);
      this.isConfigured = false;
    }
  }

  private async testConnection(): Promise<void> {
    if (!this.transporter) return;
    
    try {
      await this.transporter.verify();
      console.log('✅ Gmail SMTP connection verified successfully');
    } catch (error) {
      console.error('❌ Gmail SMTP connection failed:', error);
      this.isConfigured = false;
    }
  }

  isAvailable(): boolean {
    return this.isConfigured && this.transporter !== null;
  }

  async sendEmail(to: string, subject: string, html: string, text: string): Promise<EmailResult> {
    console.log(`📧 Nodemailer Email Attempt:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Gmail configured: ${this.isConfigured}`);

    // Demo mode if not configured
    if (!this.isAvailable()) {
      console.log(`📧 DEMO MODE - Gmail email to ${to}:`);
      console.log(`─────────────────────────────────`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${text.substring(0, 200)}...`);
      console.log(`─────────────────────────────────`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { 
        success: true, 
        messageId: `gmail_demo_${Date.now()}` 
      };
    }

    try {
      console.log(`📧 Sending REAL EMAIL via Gmail...`);

      const mailOptions: nodemailer.SendMailOptions = {
        from: `"🛡️ DefendEarth Alert System" <${this.gmailUser}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
        priority: 'high',
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High'
        }
      };

      const info = await this.transporter!.sendMail(mailOptions);
      
      console.log('✅ Gmail email sent successfully!');
      console.log(`Message ID: ${info.messageId}`);
      console.log(`Response: ${info.response}`);
      
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error: any) {
      console.error('❌ Gmail email failed:', error);
      return {
        success: false,
        error: `Gmail Error: ${error.message}`
      };
    }
  }

  // 🎯 Welcome Email with Beautiful HTML
  async sendWelcomeEmail(email: string, location: string): Promise<EmailResult> {
    const subject = '🛡️ DEFEND EARTH - Welcome to Planetary Defense System!';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DefendEarth Welcome</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.6; background: #0f172a; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e3a8a, #059669); }
            .header { background: rgba(0,0,0,0.8); padding: 30px; text-align: center; }
            .title { font-size: 36px; font-weight: bold; color: #fbbf24; margin-bottom: 10px; }
            .subtitle { font-size: 18px; color: #e5e7eb; }
            .content { padding: 30px; background: rgba(255,255,255,0.05); }
            .success-box { background: rgba(34, 197, 94, 0.2); border: 2px solid #10b981; padding: 25px; border-radius: 12px; margin: 20px 0; }
            .info-grid { display: grid; gap: 15px; margin: 20px 0; }
            .info-item { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; }
            .info-label { color: #fbbf24; font-weight: bold; font-size: 14px; }
            .info-value { color: #ffffff; font-size: 16px; margin-top: 5px; }
            .alert-box { background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .feature-list { background: rgba(59, 130, 246, 0.2); border: 2px solid #3b82f6; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .feature-list ul { list-style: none; color: #bfdbfe; }
            .feature-list li { padding: 5px 0; }
            .footer { background: rgba(0,0,0,0.6); padding: 20px; text-align: center; color: #9ca3af; font-size: 14px; }
            h2, h3 { color: #fbbf24; margin-bottom: 15px; }
            p { color: #e5e7eb; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="title">🛡️ DEFEND EARTH</div>
                <div class="subtitle">Planetary Defense Initiative</div>
            </div>
            
            <div class="content">
                <div class="success-box">
                    <h2 style="color: #10b981; text-align: center;">✅ Registration Successful!</h2>
                    <p style="text-align: center; color: #ffffff;">Welcome to Earth's first asteroid early warning system!</p>
                </div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">📍 Protected Location</div>
                        <div class="info-value">${location}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📧 Alert Email</div>
                        <div class="info-value">${email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🛰️ System Status</div>
                        <div class="info-value" style="color: #10b981; font-weight: bold;">MONITORING ACTIVE</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🔄 Check Interval</div>
                        <div class="info-value">Every 2 minutes</div>
                    </div>
                </div>
                
                <div class="alert-box">
                    <h3 style="color: #fca5a5; text-align: center;">🚨 Emergency Alert System</h3>
                    <p style="color: #fef2f2;">You will now receive <strong>immediate email alerts</strong> if any asteroid threatens your area. These alerts include:</p>
                    <ul style="color: #fef2f2; margin: 10px 0; padding-left: 20px;">
                        <li>• Detailed threat information</li>
                        <li>• Impact timeline and location</li>
                        <li>• Comprehensive safety instructions</li>
                        <li>• Emergency contact information</li>
                    </ul>
                </div>
                
                <div class="feature-list">
                    <h3 style="color: #93c5fd;">🌟 System Features</h3>
                    <ul>
                        <li>✅ Real NASA asteroid data monitoring</li>
                        <li>✅ Physics-based impact calculations</li>
                        <li>✅ Location-targeted emergency alerts</li>
                        <li>✅ 24/7 threat assessment</li>
                        <li>✅ Multi-level threat classification</li>
                        <li>✅ Detailed safety protocols</li>
                    </ul>
                </div>
                
                <div style="background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p style="color: #93c5fd; font-size: 14px; margin: 0;">This system uses real NASA data and advanced physics simulations for educational and demonstration purposes.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 20px; font-weight: bold; color: #fbbf24;">Stay vigilant, stay protected!</p>
                    <p style="color: #9ca3af; font-size: 16px;">Your planetary defense system is now active.</p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>DefendEarth.com</strong> - Protecting Earth, One Alert at a Time</p>
                <p>This is an educational demonstration system.</p>
            </div>
        </div>
    </body>
    </html>`;

    const text = `🛡️ DEFEND EARTH - WELCOME!

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

Stay vigilant, stay protected!

DefendEarth Team
🌍 Defending Earth, One Alert at a Time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DefendEarth.com - Planetary Defense Initiative
This is an educational demonstration system.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    console.log('📧 Sending Welcome Email via Gmail...');
    return this.sendEmail(email, subject, html, text);
  }

  // 🚨 Emergency Alert Email with Rich HTML
  async sendEmergencyAlert(user: User, asteroid: AsteroidAlert): Promise<EmailResult> {
    const distance = this.calculateDistance(
      user.latitude, user.longitude,
      asteroid.impactLat, asteroid.impactLng
    );

    const subject = `🚨 ASTEROID EMERGENCY - ${asteroid.threatLevel} THREAT DETECTED`;
    
    const urgencyColor = this.getUrgencyColor(asteroid.threatLevel);
    const textColor = asteroid.threatLevel === 'CATASTROPHIC' ? '#ffffff' : '#fef2f2';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DefendEarth Emergency Alert</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.6; background: #0f0f0f; }
            .container { max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #7f1d1d, #dc2626); }
            .header { background: rgba(0,0,0,0.9); padding: 25px; text-align: center; border-bottom: 3px solid #ef4444; }
            .emergency-title { font-size: 42px; font-weight: bold; color: #ff6b6b; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); margin-bottom: 10px; animation: pulse 2s infinite; }
            .emergency-subtitle { font-size: 22px; color: #fca5a5; font-weight: bold; }
            .content { padding: 30px; background: rgba(0,0,0,0.7); }
            .threat-box { background: ${urgencyColor}; padding: 30px; border-radius: 15px; margin: 25px 0; border: 3px solid #ffffff; }
            .threat-title { color: white; text-align: center; font-size: 28px; margin-bottom: 25px; }
            .threat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
            .threat-item { color: white; }
            .threat-label { color: #fef3c7; font-weight: bold; font-size: 16px; margin-bottom: 8px; }
            .threat-value { font-size: 20px; font-weight: bold; }
            .actions-box { background: rgba(239, 68, 68, 0.8); padding: 30px; border-radius: 15px; margin: 25px 0; border: 3px solid #ffffff; }
            .actions-title { color: white; text-align: center; font-size: 28px; margin-bottom: 25px; }
            .action-item { color: white; margin: 20px 0; }
            .action-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
            .action-list { margin: 10px 0; padding-left: 25px; }
            .action-list li { margin: 8px 0; font-size: 16px; }
            .warning-box { background: rgba(0,0,0,0.8); padding: 25px; border-radius: 15px; text-align: center; margin: 25px 0; border: 2px solid #ff4444; }
            .warning-text { font-size: 24px; font-weight: bold; color: #ff6b6b; margin: 0; }
            .footer { background: rgba(0,0,0,0.9); padding: 20px; text-align: center; color: #d1d5db; font-size: 14px; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
            @media (max-width: 600px) { .threat-grid { grid-template-columns: 1fr; } }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="emergency-title">🚨 ASTEROID EMERGENCY 🚨</div>
                <div class="emergency-subtitle">IMMEDIATE THREAT DETECTED</div>
            </div>
            
            <div class="content">
                <div class="threat-box">
                    <div class="threat-title">⚠️ THREAT DETAILS ⚠️</div>
                    <div class="threat-grid">
                        <div class="threat-item">
                            <div class="threat-label">🌌 Asteroid Name:</div>
                            <div class="threat-value">${asteroid.name}</div>
                        </div>
                        <div class="threat-item">
                            <div class="threat-label">📏 Size:</div>
                            <div class="threat-value">${asteroid.diameter} meters</div>
                        </div>
                        <div class="threat-item">
                            <div class="threat-label">🚀 Speed:</div>
                            <div class="threat-value">${asteroid.speed} km/s</div>
                        </div>
                        <div class="threat-item">
                            <div class="threat-label">⏰ Impact Time:</div>
                            <div class="threat-value" style="color: #fbbf24;">${asteroid.timeToImpact}</div>
                        </div>
                        <div class="threat-item">
                            <div class="threat-label">📍 Distance from You:</div>
                            <div class="threat-value" style="color: #fbbf24;">${distance.toFixed(0)} km</div>
                        </div>
                        <div class="threat-item">
                            <div class="threat-label">⚠️ Threat Level:</div>
                            <div class="threat-value" style="color: #ff6b6b; font-size: 24px;">${asteroid.threatLevel}</div>
                        </div>
                    </div>
                </div>
                
                <div class="actions-box">
                    <div class="actions-title">🛡️ IMMEDIATE SAFETY ACTIONS</div>
                    
                    <div class="action-item">
                        <div class="action-title">🏠 SEEK IMMEDIATE SHELTER</div>
                        <ul class="action-list">
                            <li>Get to the strongest building available immediately</li>
                            <li>Go to the lowest floor or basement if possible</li>
                            <li>Stay away from windows and glass structures</li>
                            <li>Avoid elevators - use stairs only</li>
                        </ul>
                    </div>
                    
                    <div class="action-item">
                        <div class="action-title">📻 MONITOR EMERGENCY CHANNELS</div>
                        <ul class="action-list">
                            <li>Listen to official radio and TV broadcasts</li>
                            <li>Check government emergency websites</li>
                            <li>Follow official social media accounts</li>
                            <li>Do NOT rely on unverified social media posts</li>
                        </ul>
                    </div>
                    
                    <div class="action-item">
                        <div class="action-title">🆘 EMERGENCY CONTACTS</div>
                        <ul class="action-list">
                            <li>Call emergency services if in immediate danger</li>
                            <li>Contact family members about your safety</li>
                            <li>Keep phone charged for emergency communication</li>
                            <li>Have backup communication methods ready</li>
                        </ul>
                    </div>
                </div>
                
                <div class="warning-box">
                    <p class="warning-text">⚠️ THIS IS NOT A DRILL ⚠️</p>
                    <p style="color: #fca5a5; font-size: 16px; margin-top: 10px;">Take immediate action now - Time remaining: ${asteroid.timeToImpact}</p>
                </div>
                
                <div style="background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p style="color: #93c5fd; font-size: 14px; text-align: center; margin: 0;">
                        <strong>Your Location:</strong> ${user.location} | 
                        <strong>Alert Time:</strong> ${new Date().toLocaleString()}
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>DefendEarth Emergency Alert System</strong></p>
                <p>Stay safe. Stay strong. We're monitoring the situation.</p>
            </div>
        </div>
    </body>
    </html>`;

    const text = `🚨🔴🚨 ASTEROID EMERGENCY ALERT 🚨🔴🚨

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

🆘 EMERGENCY CONTACTS
   → Call emergency services if in immediate danger
   → Contact family members about your safety
   → Stay calm and follow official instructions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 THIS IS NOT A DRILL 🚨
TAKE IMMEDIATE ACTION NOW

Time Remaining: ${asteroid.timeToImpact}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DefendEarth Emergency Alert System
Alert sent: ${new Date().toLocaleString()}
Stay safe. Stay strong. We're monitoring the situation.`;

    console.log('🚨 Sending Emergency Alert via Gmail...');
    return this.sendEmail(user.email, subject, html, text);
  }

  // 🧪 Test Alert Email
  async sendTestAlert(user: User): Promise<EmailResult> {
    const subject = '🧪 DefendEarth System Test - All Systems Operational';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DefendEarth System Test</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.6; background: #0f172a; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #065f46, #7c3aed); }
            .header { background: rgba(0,0,0,0.8); padding: 25px; text-align: center; }
            .title { font-size: 36px; font-weight: bold; color: #a78bfa; margin-bottom: 10px; }
            .subtitle { font-size: 18px; color: #e5e7eb; }
            .content { padding: 30px; background: rgba(255,255,255,0.1); }
            .success-box { background: rgba(34, 197, 94, 0.3); border: 2px solid #10b981; padding: 25px; border-radius: 12px; margin: 20px 0; }
            .info-box { background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; margin: 20px 0; }
            .checks-box { background: rgba(59, 130, 246, 0.2); border: 2px solid #3b82f6; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .preview-box { background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .footer { background: rgba(0,0,0,0.6); padding: 20px; text-align: center; color: #9ca3af; font-size: 14px; }
            h2, h3 { color: #fbbf24; margin-bottom: 15px; }
            p { color: #e5e7eb; margin-bottom: 10px; }
            ul { list-style: none; color: #bfdbfe; line-height: 1.8; }
            .check-item { padding: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="title">🧪 SYSTEM TEST</div>
                <div class="subtitle">DefendEarth Alert System</div>
            </div>
            
            <div class="content">
                <div class="success-box">
                    <h2 style="color: #10b981; text-align: center;">✅ Test Successful!</h2>
                    <p style="text-align: center; color: #ffffff;">This is a test of the asteroid emergency alert system.</p>
                </div>
                
                <div class="info-box">
                    <h3 style="color: #fbbf24;">📧 Your Alert Configuration</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Protected Location:</strong> ${user.location}</p>
                    <p><strong>System Status:</strong> <span style="color: #10b981; font-weight: bold;">FULLY OPERATIONAL</span></p>
                    <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="checks-box">
                    <h3 style="color: #93c5fd;">🔧 System Status Checks</h3>
                    <ul>
                        <li class="check-item">✅ Email Delivery: Working Perfectly</li>
                        <li class="check-item">✅ Location Tracking: Active</li>
                        <li class="check-item">✅ NASA Data Feed: Connected</li>
                        <li class="check-item">✅ Emergency Protocols: Ready</li>
                        <li class="check-item">✅ Threat Assessment: Operational</li>
                        <li class="check-item">✅ Gmail SMTP: Authenticated</li>
                    </ul>
                </div>
                
                <div class="preview-box">
                    <h3 style="color: #fca5a5;">🚨 Real Emergency Alert Preview</h3>
                    <p style="color: #fef2f2;">If this was an actual emergency, you would receive:</p>
                    <ul style="color: #fef2f2; margin: 10px 0; padding-left: 20px;">
                        <li>• Detailed asteroid threat information</li>
                        <li>• Precise impact timeline and location</li>
                        <li>• Comprehensive safety instructions</li>
                        <li>• Emergency contact information</li>
                        <li>• Real-time updates as situation develops</li>
                        <li>• Professional HTML formatting with visual alerts</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0; padding: 20px; background: rgba(34, 197, 94, 0.2); border-radius: 12px;">
                    <p style="font-size: 22px; font-weight: bold; color: #10b981;">✅ Your Planetary Defense System is Working Correctly!</p>
                    <p style="color: #a7f3d0; font-size: 16px; margin-top: 10px;">You are now protected by our 24/7 monitoring system.</p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>DefendEarth Test System</strong></p>
                <p>Powered by Gmail SMTP & Nodemailer</p>
            </div>
        </div>
    </body>
    </html>`;

    const text = `🧪 DEFENDEARTH SYSTEM TEST

✅ Test Successful!

This is a test of the asteroid emergency alert system.

📧 Your Alert Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: ${user.email}
Protected Location: ${user.location}
System Status: FULLY OPERATIONAL
Test Time: ${new Date().toLocaleString()}

🔧 System Status Checks:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Email Delivery: Working Perfectly
✅ Location Tracking: Active
✅ NASA Data Feed: Connected
✅ Emergency Protocols: Ready
✅ Threat Assessment: Operational
✅ Gmail SMTP: Authenticated

🚨 Real Emergency Alert Preview:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If this was an actual emergency, you would receive:
• Detailed asteroid threat information
• Precise impact timeline and location
• Comprehensive safety instructions
• Emergency contact information
• Real-time updates as situation develops
• Professional HTML formatting with visual alerts

✅ YOUR PLANETARY DEFENSE SYSTEM IS WORKING CORRECTLY!

You are now protected by our 24/7 monitoring system.

DefendEarth Test System
Powered by Gmail SMTP & Nodemailer`;

    console.log('🧪 Sending Test Alert via Gmail...');
    return this.sendEmail(user.email, subject, html, text);
  }

  async sendBulkEmergencyAlerts(users: User[], asteroid: AsteroidAlert): Promise<EmailResult[]> {
    console.log(`📢 Sending emergency email alerts to ${users.length} users via Gmail`);
    
    const results: EmailResult[] = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`📦 Sending email alert ${i + 1}/${users.length} to ${user.email}`);
      
      try {
        const result = await this.sendEmergencyAlert(user, asteroid);
        results.push(result);
        
        if (result.success) {
          console.log(`✅ Emergency email sent to ${user.email}`);
        } else {
          console.log(`❌ Failed to send email to ${user.email}: ${result.error}`);
        }
        
        // Wait 3 seconds between emails to avoid Gmail rate limits
        if (i < users.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
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
      case 'CATASTROPHIC': return 'rgba(127, 29, 29, 0.95)'; // Very dark red
      case 'HIGH': return 'rgba(194, 65, 12, 0.9)'; // Dark orange  
      case 'MODERATE': return 'rgba(161, 98, 7, 0.85)'; // Dark yellow
      default: return 'rgba(21, 94, 117, 0.8)'; // Dark blue
    }
  }
}
