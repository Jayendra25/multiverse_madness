import { NextRequest, NextResponse } from 'next/server';
import { NodemailerService } from '../../../../lib/nodemailer-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, subject, message } = body;
    
    console.log('📧 Gmail test request:', { email, subject: !!subject, message: !!message });
    
    if (!email) {
      return NextResponse.json({ 
        success: false,
        error: 'Email address required',
        message: 'No email address provided'
      }, { status: 400 });
    }

    const emailService = new NodemailerService();
    
    const testSubject = subject || '🧪 Gmail + Nodemailer Direct Test';
    const testMessage = message || `This is a direct test of Gmail + Nodemailer delivery.

Time: ${new Date().toLocaleString()}
Status: Testing email functionality

If you receive this message, Gmail + Nodemailer is working correctly!

DefendEarth System`;

    const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background: #f0f0f0; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #2563eb; margin-bottom: 30px; }
            .content { color: #374151; line-height: 1.6; }
            .success { background: #dcfce7; border: 1px solid #16a34a; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧪 Gmail + Nodemailer Direct Test</h1>
            </div>
            <div class="content">
                <div class="success">
                    <h3 style="color: #16a34a;">✅ Test Successful!</h3>
                    <p>This is a direct test of Gmail + Nodemailer delivery.</p>
                </div>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Status:</strong> Testing email functionality</p>
                <p>If you receive this message, <strong>Gmail + Nodemailer is working correctly!</strong></p>
                <hr style="margin: 20px 0;">
                <p style="text-align: center; color: #6b7280;"><em>DefendEarth System - Powered by Gmail SMTP</em></p>
            </div>
        </div>
    </body>
    </html>`;

    const result = await emailService.sendEmail(email, testSubject, testHtml, testMessage);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Gmail test email sent successfully!',
        details: result,
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error || 'Failed to send Gmail test email',
        error: result.error
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Gmail test API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      message: 'Internal server error during Gmail test'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const emailService = new NodemailerService();
    
    return NextResponse.json({
      configured: emailService.isAvailable(),
      status: emailService.isAvailable() ? 'Ready for Gmail delivery' : 'Gmail not configured - check environment variables',
      provider: 'Gmail + Nodemailer',
      environment: {
        hasGmailUser: !!process.env.GMAIL_USER,
        hasGmailAppPassword: !!process.env.GMAIL_APP_PASSWORD,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      configured: false,
      status: 'Error initializing Gmail service',
      error: error.message 
    });
  }
}
