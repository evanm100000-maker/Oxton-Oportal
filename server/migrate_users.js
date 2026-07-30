const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://oxton-new-main-database-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();
const auth = admin.auth();

async function migrateUsers() {
  console.log('Fetching users from Realtime Database...');
  try {
    const snapshot = await db.ref('users').once('value');
    const usersData = snapshot.val();
    
    if (!usersData) {
      console.log('No users found in database.');
      return;
    }

    // Convert object or array to array
    const usersList = Array.isArray(usersData) ? usersData : Object.values(usersData);
    
    let successCount = 0;
    let errorCount = 0;

    for (const user of usersList) {
      if (!user || !user.email) continue;
      
      try {
        console.log(`Migrating ${user.email}...`);
        
        // Check if user already exists
        let existingAuthUser = null;
        try {
          existingAuthUser = await auth.getUserByEmail(user.email);
        } catch (e) {
          if (e.code !== 'auth/user-not-found') throw e;
        }

        if (existingAuthUser) {
          console.log(`  User ${user.email} already exists in Firebase Auth. Skipping creation, but updating password.`);
          // If we want to overwrite their password with the one in DB:
          if (user.password) {
            await auth.updateUser(existingAuthUser.uid, {
              password: user.password
            });
            console.log(`  Password updated for ${user.email}.`);
          }
        } else {
          // Create the user in Firebase Auth
          await auth.createUser({
            email: user.email,
            password: user.password || 'Temporary123!', // Ensure there's a password
            displayName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.robloxUsername,
          });
          console.log(`  Successfully created Auth account for ${user.email}`);
        }

        // We could also remove the plaintext password from the DB now for security
        // but let's leave it until we've confirmed the frontend is working.

        successCount++;
      } catch (err) {
        console.error(`  Error migrating ${user.email}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\nMigration Complete:`);
    console.log(`- Successfully migrated: ${successCount}`);
    console.log(`- Errors: ${errorCount}`);
    process.exit(0);

  } catch (error) {
    console.error('Failed to migrate users:', error);
    process.exit(1);
  }
}

migrateUsers();
