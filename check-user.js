const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    const user = await db.collection('users').findOne({ email: 'glenda+faculty@walkyapp.com' });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User details:');
    console.log(JSON.stringify({
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      is_verified: user.is_verified,
      first_name: user.first_name,
      last_name: user.last_name,
      school_id: user.school_id?.toString(),
      campus_id: user.campus_id?.toString(),
    }, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
