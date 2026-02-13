/**
 * Email Module - Envio de emails
 * @module email
 */

const sendEmail = async ({ to, subject, body }) => {
  console.log('Sending email to:', to);
  console.log('Subject:', subject);
  return { success: true, messageId: 'mock-id-' + Date.now() };
};

module.exports = { sendEmail };
