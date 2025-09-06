const sgMail = require('@sendgrid/mail');
if(process.env.SENDGRID_API_KEY){ sgMail.setApiKey(process.env.SENDGRID_API_KEY); }

async function sendEmail(to, subject, html){
  if(!process.env.SENDGRID_API_KEY){
    console.log('[DEV] Email skipped ->', { to, subject });
    return;
  }
  const msg = { to, from: process.env.FROM_EMAIL || 'noreply@example.com', subject, html };
  await sgMail.send(msg);
}
module.exports = { sendEmail };

const fs = require('fs');
const path = require('path');
function renderTemplate(name, vars={}){
  try{
    const file = path.join(__dirname,'..','templates','email', name + '.html');
    let html = fs.readFileSync(file, 'utf-8');
    Object.keys(vars).forEach(k => { html = html.replaceAll('{{'+k+'}}', vars[k]) });
    return html;
  }catch(e){
    return null;
  }
}

async function sendTemplatedEmail(to, templateName, subject, vars){
  const html = renderTemplate(templateName, vars) || `<p>${subject}</p>`;
  return sendEmail(to, subject, html);
}
module.exports.renderTemplate = renderTemplate;
module.exports.sendTemplatedEmail = sendTemplatedEmail;
