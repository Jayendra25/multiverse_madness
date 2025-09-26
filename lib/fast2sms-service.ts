export class Fast2SMSService {
    private apiKey: string;
  
    constructor() {
      this.apiKey = process.env.FAST2SMS_API_KEY || '';
    }
  
    isAvailable(): boolean {
      return !!this.apiKey;
    }
  
    async sendSMS(to: string, message: string): Promise<SMSResult> {
      // Demo mode
      if (!this.isAvailable()) {
        console.log(`📱 DEMO MODE - Fast2SMS to ${to}:`);
        console.log(`📄 Message: ${message}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, messageId: `demo_${Date.now()}`, cost: 0 };
      }
  
      try {
        // Remove +91 for Fast2SMS
        const indianNumber = to.replace('+91', '').replace(/\s/g, '');
        
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': this.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'q',
            message: message,
            language: 'english',
            flash: 0,
            numbers: indianNumber
          })
        });
  
        const result = await response.json();
        
        if (result.return) {
          console.log('✅ Fast2SMS sent successfully');
          return { success: true, messageId: result.request_id, cost: 0 };
        } else {
          console.error('❌ Fast2SMS failed:', result.message);
          return { success: false, error: result.message };
        }
      } catch (error: any) {
        console.error('❌ Fast2SMS error:', error);
        return { success: false, error: error.message };
      }
    }
  }
  