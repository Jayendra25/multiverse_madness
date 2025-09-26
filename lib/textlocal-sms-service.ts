export interface SMSResult {
    success: boolean;
    messageId?: string;
    error?: string;
    cost?: number;
  }
  
  export class TextLocalSMSService {
    private apiKey: string;
    private sender: string;
  
    constructor() {
      this.apiKey = process.env.TEXTLOCAL_API_KEY || '';
      this.sender = process.env.TEXTLOCAL_SENDER || 'DEFEND';
    }
  
    isAvailable(): boolean {
      return !!this.apiKey;
    }
  
    async sendSMS(to: string, message: string): Promise<SMSResult> {
      // Demo mode if no API key
      if (!this.isAvailable()) {
        console.log(`📱 DEMO MODE - TextLocal SMS to ${to}:`);
        console.log(`📄 Message: ${message}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, messageId: `demo_${Date.now()}`, cost: 0 };
      }
  
      try {
        // Remove +91 country code for TextLocal (they add it automatically)
        const indianNumber = to.replace('+91', '').replace(/\s/g, '');
        
        const response = await fetch('https://api.textlocal.in/send/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            apikey: this.apiKey,
            numbers: indianNumber,
            message: message,
            sender: this.sender
          })
        });
  
        const result = await response.json();
        
        if (result.status === 'success') {
          console.log('✅ TextLocal SMS sent successfully');
          return {
            success: true,
            messageId: result.batch_id,
            cost: result.cost || 0
          };
        } else {
          console.error('❌ TextLocal SMS failed:', result.errors);
          return {
            success: false,
            error: result.errors?.[0]?.message || 'SMS failed'
          };
        }
      } catch (error: any) {
        console.error('❌ TextLocal SMS error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  }
  