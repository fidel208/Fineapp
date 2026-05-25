const db = require('./config/db');

async function createTables() {
  console.log('🔄 Creating database tables...');

  const createUserTableSql = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      profile_picture VARCHAR(255) DEFAULT 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      bio TEXT,
      gender VARCHAR(20),
      birthday DATE,
      has_completed_onboarding BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(createUserTableSql);
    console.log('✅ "users" table is ready and verified!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    process.exit();
  }
}

createTables();