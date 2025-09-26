import { NodemailerService, User, AsteroidAlert, EmailResult } from './nodemailer-service';
import { NASAService } from './nasa-service';

// Global user storage
const globalUsers: User[] = [];

export class AsteroidAlertSystem {
  private emailService: NodemailerService;
  private nasaService: NASAService;
  private monitoringActive = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor() {
    try {
      this.emailService = new NodemailerService();
      this.nasaService = new NASAService();
      this.isInitialized = true;
      console.log('✅ Asteroid Alert System initialized with Nodemailer + Gmail');
    } catch (error) {
      console.error('❌ Failed to initialize Alert System:', error);
      this.isInitialized = false;
    }
  }

  isAvailable(): boolean {
    return this.isInitialized;
  }

  getDemoMode(): boolean {
    return !this.emailService.isAvailable();
  }

  get users(): User[] {
    return globalUsers;
  }

  async registerUser(userData: {
    email: string;
    latitude: number;
    longitude: number;
    location?: string;
  }): Promise<{ success: boolean; message: string; verificationSent?: boolean; demoMode?: boolean }> {
    try {
      if (!this.isInitialized) {
        return {
          success: false,
          message: 'Alert system is not properly initialized'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      console.log(`🔍 Registering user with email: "${userData.email}"`);

      // Check if user already exists
      const existingUser = globalUsers.find(u => u.email === userData.email);
      if (existingUser) {
        console.log(`⚠️ User already exists: ${userData.email}`);
        return { 
          success: false, 
          message: 'Email address already registered' 
        };
      }

      // Create new user
      const locationStr = userData.location || `${userData.latitude.toFixed(4)}, ${userData.longitude.toFixed(4)}`;
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        latitude: userData.latitude,
        longitude: userData.longitude,
        location: locationStr,
        verified: true
      };

      // Send Welcome Email
      console.log(`📧 Sending welcome email via Gmail to: ${userData.email}`);
      const welcomeResult = await this.emailService.sendWelcomeEmail(userData.email, locationStr);
      
      if (welcomeResult.success) {
        globalUsers.push(newUser);
        console.log(`✅ User registered successfully: ${userData.email}${this.getDemoMode() ? ' (DEMO MODE)' : ''}`);
        console.log(`👥 Total users: ${globalUsers.length}`);
        
        return {
          success: true,
          message: this.getDemoMode() 
            ? 'Registration successful! Welcome email simulated in demo mode.' 
            : 'Registration successful! Beautiful welcome email sent via Gmail to your inbox.',
          verificationSent: true,
          demoMode: this.getDemoMode()
        };
      } else {
        console.error(`❌ Failed to send welcome email: ${welcomeResult.error}`);
        return {
          success: false,
          message: `Registration failed: ${welcomeResult.error}`
        };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed due to technical error'
      };
    }
  }

  startMonitoring(intervalMinutes: number = 2): void {
    if (this.monitoringActive) {
      console.log('⚠️ Monitoring already active');
      return;
    }

    const mode = this.getDemoMode() ? ' (DEMO MODE)' : ' (Gmail/Nodemailer)';
    console.log(`🛰️ Starting asteroid monitoring${mode} (checking every ${intervalMinutes} minutes)`);
    console.log(`👥 Currently monitoring ${globalUsers.length} users`);
    this.monitoringActive = true;
    
    // Initial check after 30 seconds
    setTimeout(() => this.checkForThreats(), 30000);
    
    this.monitoringInterval = setInterval(() => {
      this.checkForThreats();
    }, intervalMinutes * 60 * 1000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.monitoringActive = false;
    console.log('🛑 Asteroid monitoring stopped');
  }

  private async checkForThreats(): Promise<void> {
    try {
      console.log(`🔍 Checking for asteroid threats... (${globalUsers.length} users registered)`);
      
      if (globalUsers.length === 0) {
        console.log('👥 No users registered yet, skipping threat check');
        return;
      }
      
      const asteroids = await this.nasaService.getNearEarthObjects();
      
      for (const asteroid of asteroids) {
        const threat = this.evaluateThreat(asteroid);
        
        if (threat && threat.threatLevel !== 'LOW') {
          await this.handleThreat(threat);
          break;
        }
      }
    } catch (error) {
      console.error('❌ Threat monitoring error:', error);
    }
  }

  private evaluateThreat(asteroid: any): AsteroidAlert | null {
    try {
      const diameter = asteroid.estimated_diameter?.meters?.estimated_diameter_max || 100;
      const velocity = parseFloat(asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || '20');
      const missDistance = parseFloat(asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || '1000000');
      
      const isCloseApproach = missDistance < 100000;
      const isLargeAsteroid = diameter > 50;
      
      // 20% chance for demo
      const shouldTriggerDemo = Math.random() < 0.2;
      
      if ((isCloseApproach && isLargeAsteroid) || shouldTriggerDemo) {
        let threatLevel: AsteroidAlert['threatLevel'] = 'MODERATE';
        if (diameter > 1000) threatLevel = 'CATASTROPHIC';
        else if (diameter > 500) threatLevel = 'HIGH';
        else if (diameter > 100) threatLevel = 'MODERATE';
        
        // Generate impact location near registered users
        let impactLat = (Math.random() - 0.5) * 180;
        let impactLng = (Math.random() - 0.5) * 360;
        
        if (globalUsers.length > 0) {
          const randomUser = globalUsers[Math.floor(Math.random() * globalUsers.length)];
          impactLat = randomUser.latitude + (Math.random() - 0.5) * 10;
          impactLng = randomUser.longitude + (Math.random() - 0.5) * 10;
          console.log(`📍 Generating threat near user at ${randomUser.latitude}, ${randomUser.longitude}`);
        }
        
        const dangerRadius = Math.min(1000, diameter * 3);
        const hoursToImpact = Math.random() * 6 + 1; // 1-7 hours
        const timeToImpact = this.formatTimeToImpact(hoursToImpact);
        
        return {
          name: asteroid.name || `Asteroid-${Date.now().toString().slice(-6)}`,
          diameter,
          speed: velocity,
          impactLat,
          impactLng,
          timeToImpact,
          dangerRadius,
          threatLevel
        };
      }
      
      return null;
    } catch (error) {
      console.error('Threat evaluation error:', error);
      return null;
    }
  }

  private async handleThreat(threat: AsteroidAlert): Promise<void> {
    const mode = this.getDemoMode() ? ' (DEMO MODE)' : ' (Gmail)';
    console.log(`🚨 THREAT DETECTED${mode}: ${threat.name} (${threat.threatLevel})`);
    
    const usersInDanger = this.getUsersInDangerZone(threat);
    
    if (usersInDanger.length === 0) {
      console.log('✅ No registered users in danger zone');
      console.log(`📊 Total users: ${globalUsers.length}, Danger radius: ${threat.dangerRadius}km`);
      return;
    }
    
    console.log(`📧 Sending BEAUTIFUL HTML EMAIL ALERTS via Gmail to ${usersInDanger.length} users${mode}`);
    
    const results = await this.emailService.sendBulkEmergencyAlerts(usersInDanger, threat);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    console.log(`📊 Gmail Alert Results: ${successful} successful, ${failed} failed${mode}`);
    
    // Log each user that received alert
    usersInDanger.forEach((user, index) => {
      const result = results[index];
      if (result?.success) {
        console.log(`✅ Beautiful HTML emergency email sent to ${user.email} (${user.location})`);
      } else {
        console.log(`❌ Failed to send email to ${user.email}: ${result?.error}`);
      }
    });
  }

  private getUsersInDangerZone(threat: AsteroidAlert): User[] {
    return globalUsers.filter(user => {
      if (!user.verified) return false;
      
      const distance = this.calculateDistance(
        user.latitude, user.longitude,
        threat.impactLat, threat.impactLng
      );
      
      const inDanger = distance <= threat.dangerRadius;
      
      console.log(`🎯 User ${user.email} is ${distance.toFixed(0)}km from impact (${inDanger ? 'IN DANGER' : 'safe'})`);
      
      return inDanger;
    });
  }

  async simulateThreat(customThreat?: Partial<AsteroidAlert>): Promise<void> {
    console.log(`🧪 SIMULATING THREAT - Users available: ${globalUsers.length}`);
    
    if (globalUsers.length === 0) {
      console.log('❌ No users registered for simulation');
      return;
    }
    
    const targetUser = globalUsers[0];
    const impactLat = targetUser?.latitude || 40.7128;
    const impactLng = targetUser?.longitude || -74.0060;
    
    const threat: AsteroidAlert = {
      name: 'TEST ASTEROID (GMAIL DEMO)',
      diameter: 950,
      speed: 42,
      impactLat,
      impactLng,
      timeToImpact: '6.2 hours',
      dangerRadius: 750,
      threatLevel: 'HIGH',
      ...customThreat
    };
    
    const mode = this.getDemoMode() ? ' (DEMO MODE)' : ' (Gmail)';
    console.log(`🧪 SIMULATING THREAT FOR EMAIL USERS${mode}`);
    console.log(`📍 Impact location: ${impactLat.toFixed(4)}, ${impactLng.toFixed(4)}`);
    console.log(`👥 Registered users: ${globalUsers.map(u => u.email).join(', ')}`);
    
    await this.handleThreat(threat);
  }

  async sendTestAlertToUser(email: string): Promise<{ success: boolean; message: string }> {
    console.log(`🔍 Looking for user with email: "${email}"`);
    console.log(`📋 Available users: ${globalUsers.map(u => `"${u.email}"`).join(', ')}`);
    
    const user = globalUsers.find(u => u.email === email);
    if (!user) {
      console.log(`❌ User not found. Searched for: "${email}"`);
      return { 
        success: false, 
        message: `User not found. Available users: ${globalUsers.length}` 
      };
    }

    console.log(`✅ Found user: ${user.email} at ${user.location}`);
    const result = await this.emailService.sendTestAlert(user);
    
    if (result.success) {
      return { 
        success: true, 
        message: this.getDemoMode() 
          ? 'Test email alert simulated successfully via Gmail!' 
          : 'Beautiful HTML test email sent successfully via Gmail! Check your inbox.' 
      };
    } else {
      return { success: false, message: result.error || 'Failed to send test email alert via Gmail' };
    }
  }

  getStats() {
    const verifiedUsers = globalUsers.filter(u => u.verified).length;
    const totalUsers = globalUsers.length;
    
    return {
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      monitoringActive: this.monitoringActive,
      demoMode: this.getDemoMode(),
      emailProvider: 'Gmail + Nodemailer',
      emailAvailable: this.emailService.isAvailable(),
      users: globalUsers.map(u => ({ email: u.email, location: u.location }))
    };
  }

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

  private formatTimeToImpact(hours: number): string {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minutes`;
    } else if (hours < 24) {
      return `${hours.toFixed(1)} hours`;
    } else {
      const days = Math.round(hours / 24);
      return `${days} days`;
    }
  }
}
