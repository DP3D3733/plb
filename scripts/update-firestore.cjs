const admin = require('firebase-admin');

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const db = admin.firestore();

async function run() {
  await db.collection('version').doc('version').set(
    {
      version: admin.firestore.FieldValue.serverTimestamp(),
      commit: process.env.GITHUB_SHA,
      branch: process.env.GITHUB_REF_NAME
    },
    { merge: true }
  );

  console.log('✅ Firestore atualizado após deploy');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
