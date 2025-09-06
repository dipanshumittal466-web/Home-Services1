let admin;
try{
  admin = require('firebase-admin');
  if(!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT){
    const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(creds) });
  }
}catch(e){
  console.log('Firebase admin not configured');
}

async function sendPush(token, title, body){
  if(!admin || !token) return;
  try{
    await admin.messaging().send({ token, notification: { title, body } });
  }catch(e){
    console.log('Push error', e.message);
  }
}

module.exports = { sendPush };
