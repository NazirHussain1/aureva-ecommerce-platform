require('dotenv').config();
const { sendEmail } = require('../config/email');
const { 
  welcomeEmailTemplate,
  contactFormNotificationTemplate,
  contactFormAutoReplyTemplate 
} = require('../utils/emailTemplates');

async function testEmailSystem() {
  console.log('\n🧪 Testing Email System...\n');
  console.log('📧 Email Configuration:');
  console.log(`   Host: ${process.env.EMAIL_HOST}`);
  console.log(`   Port: ${process.env.EMAIL_PORT}`);
  console.log(`   User: ${process.env.EMAIL_USER}`);
  console.log(`   From: ${process.env.EMAIL_FROM}`);
  console.log(`   Admin: ${process.env.ADMIN_EMAIL}\n`);

  // Test 1: Welcome Email
  console.log('📨 Test 1: Sending Welcome Email...');
  const welcomeResult = await sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: 'Test: Welcome to Aureva Beauty! 💄✨',
    html: welcomeEmailTemplate('Test User')
  });

  if (welcomeResult.success) {
    console.log('✅ Welcome email sent successfully!');
    console.log(`   Message ID: ${welcomeResult.messageId}\n`);
  } else {
    console.log('❌ Welcome email failed:', welcomeResult.error || welcomeResult.message);
    console.log('\n');
  }

  // Wait 2 seconds between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Contact Form Notification
  console.log('📨 Test 2: Sending Contact Form Notification...');
  const contactResult = await sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: 'Test: New Contact Message',
    html: contactFormNotificationTemplate(
      'John Doe',
      'john@example.com',
      'Test Subject',
      'This is a test message from the contact form.'
    )
  });

  if (contactResult.success) {
    console.log('✅ Contact notification sent successfully!');
    console.log(`   Message ID: ${contactResult.messageId}\n`);
  } else {
    console.log('❌ Contact notification failed:', contactResult.error || contactResult.message);
    console.log('\n');
  }

  // Wait 2 seconds between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Auto-Reply Email
  console.log('📨 Test 3: Sending Auto-Reply Email...');
  const autoReplyResult = await sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: 'Test: We\'ve Received Your Message',
    html: contactFormAutoReplyTemplate('Test User')
  });

  if (autoReplyResult.success) {
    console.log('✅ Auto-reply email sent successfully!');
    console.log(`   Message ID: ${autoReplyResult.messageId}\n`);
  } else {
    console.log('❌ Auto-reply email failed:', autoReplyResult.error || autoReplyResult.message);
    console.log('\n');
  }

  console.log('🎉 Email testing complete!\n');
  console.log('📬 Check your inbox at:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
  console.log('\n💡 Note: If emails are not arriving:');
  console.log('   1. Check spam/junk folder');
  console.log('   2. Verify EMAIL_USER and EMAIL_PASS in .env');
  console.log('   3. For Gmail, use App Password (not regular password)');
  console.log('   4. Enable 2FA and generate App Password at:');
  console.log('      https://myaccount.google.com/apppasswords\n');

  process.exit(0);
}

testEmailSystem().catch(error => {
  console.error('\n❌ Email test failed:', error);
  process.exit(1);
});
