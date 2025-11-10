require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

// Create express app
const app = express();

var corsOptions = {
  origin: 'http://localhost:4200' // Frontend URL
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// Seed admin if not exists
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@example.com';
    const adminPhone = '1234567890';
    
    // Check if admin already exists by email or phone
    const existingAdmin = await db.user.findOne({ 
      where: { 
        [db.Sequelize.Op.or]: [
          { email: adminEmail },
          { phone: adminPhone }
        ]
      } 
    });
    
    if (!existingAdmin) {
      await db.user.create({
        firstname: 'Admin',
        lastname: 'User',
        email: adminEmail,
        phone: adminPhone,
        password: 'Admin#2021',
        status: 'Active',
        role: 'admin',
        isFirstLogin: false
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
};

// Sync DB and then seed
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized.');
  seedAdmin().catch(err => console.error('Error seeding admin:', err));
});

// Listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});