const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Service = require('./models/Service');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@fleet.com',
    password: 'admin123',
    role: 'admin',
    phone: '1234567890'
  },
  {
    name: 'John Technician',
    email: 'tech@fleet.com',
    password: 'tech123',
    role: 'technician',
    phone: '1234567891'
  },
  {
    name: 'Jane User',
    email: 'user@fleet.com',
    password: 'user123',
    role: 'user',
    phone: '1234567892'
  },
  {
    name: 'Mike Technician',
    email: 'mike@fleet.com',
    password: 'tech123',
    role: 'technician',
    phone: '1234567893'
  },
  {
    name: 'Sarah User',
    email: 'sarah@fleet.com',
    password: 'user123',
    role: 'user',
    phone: '1234567894'
  }
];

const vehicles = [
  {
    vehicleNumber: 'ABC123',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    type: 'car',
    mileage: 15000,
    status: 'active'
  },
  {
    vehicleNumber: 'XYZ789',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    type: 'truck',
    mileage: 25000,
    status: 'active'
  },
  {
    vehicleNumber: 'DEF456',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    type: 'car',
    mileage: 8000,
    status: 'active'
  },
  {
    vehicleNumber: 'GHI789',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2020,
    type: 'van',
    mileage: 45000,
    status: 'maintenance'
  }
];

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Service.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log('✅ Users created');

    // Assign vehicles to users
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const regularUser1 = createdUsers.find(u => u.email === 'user@fleet.com');
    const regularUser2 = createdUsers.find(u => u.email === 'sarah@fleet.com');
    const technician1 = createdUsers.find(u => u.email === 'tech@fleet.com');

    vehicles[0].assignedTo = regularUser1._id;
    vehicles[1].assignedTo = regularUser2._id;
    vehicles[2].assignedTo = regularUser1._id;

    const createdVehicles = await Vehicle.create(vehicles);
    console.log('✅ Vehicles created');

    // Create sample services
    const services = [
      {
        vehicle: createdVehicles[0]._id,
        serviceType: 'oil-change',
        description: 'Regular oil change service',
        scheduledDate: new Date('2026-01-20'),
        status: 'pending',
        assignedTechnician: technician1._id,
        cost: 50,
        createdBy: adminUser._id
      },
      {
        vehicle: createdVehicles[1]._id,
        serviceType: 'brake-service',
        description: 'Brake pad replacement',
        scheduledDate: new Date('2026-01-18'),
        status: 'in-progress',
        assignedTechnician: technician1._id,
        cost: 200,
        notes: 'Front brake pads need replacement',
        createdBy: adminUser._id
      },
      {
        vehicle: createdVehicles[2]._id,
        serviceType: 'inspection',
        description: 'Annual vehicle inspection',
        scheduledDate: new Date('2026-01-10'),
        completedDate: new Date('2026-01-11'),
        status: 'completed',
        assignedTechnician: technician1._id,
        cost: 100,
        notes: 'All checks passed',
        createdBy: adminUser._id
      },
      {
        vehicle: createdVehicles[3]._id,
        serviceType: 'engine-repair',
        description: 'Engine diagnostic and repair',
        scheduledDate: new Date('2026-01-15'),
        status: 'in-progress',
        assignedTechnician: technician1._id,
        cost: 500,
        notes: 'Check engine light diagnosis in progress',
        createdBy: adminUser._id
      }
    ];

    await Service.create(services);
    console.log('✅ Services created');

    console.log('\n📊 Seed Data Summary:');
    console.log('━'.repeat(50));
    console.log('\n👥 Test Credentials:');
    console.log('━'.repeat(50));
    console.log('\n1. Admin:');
    console.log('   Email: admin@fleet.com');
    console.log('   Password: admin123');
    console.log('\n2. Technician:');
    console.log('   Email: tech@fleet.com');
    console.log('   Password: tech123');
    console.log('\n3. User:');
    console.log('   Email: user@fleet.com');
    console.log('   Password: user123');
    console.log('\n━'.repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
