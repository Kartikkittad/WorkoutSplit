const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function logoutAllUsers() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing Supabase URL or Service Role Key in .env');
    process.exit(1);
  }

  const supabaseAdmin = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('Fetching users...');
  
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users:', error);
      process.exit(1);
    }
    
    console.log(`Found ${users.length} users. Logging them out globally...`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const user of users) {
      try {
        const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(user.id, { scope: 'global' });
        if (signOutError) {
          console.error(`Failed to sign out user ${user.id}:`, signOutError);
          failCount++;
        } else {
          successCount++;
          process.stdout.write('.');
        }
      } catch (err) {
        console.error(`\nException signing out user ${user.id}:`, err.message);
        failCount++;
      }
    }
    
    console.log(`\n\nLogout complete. Success: ${successCount}, Failed: ${failCount}`);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

logoutAllUsers();
