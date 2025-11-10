const express = require('express');
const cors = require('cors');
const db = require('./models');
require('dotenv').config();

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

// Sync DB
db.sequelize.sync({ force: false }).then(() => {
  console.log('Drop and re-sync db.');
});

// Seed admin if not exists
const seedAdmin = async () => {
  const adminEmail = 'admin@example.com';
  const existingAdmin = await db.user.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await db.user.create({
      firstname: 'Admin',
      lastname: 'User',
      email: adminEmail,
      phone: '1234567890',
      password: 'Admin#2021',
      status: 'Active',
      role: 'admin',
      isFirstLogin: false
    });
    console.log('Admin user created.');
  }
};

seedAdmin();

// Listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});