/**
 * SEED SCRIPT — run once to populate DB for testing
 * Usage: node src/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/user.model');
const Trip     = require('./models/trip.model');
const Expense  = require('./models/expense.model');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // ── Clean existing test data ──────────────────────────────────────────────
    await User.deleteMany({});
    await Trip.deleteMany({});
    await Expense.deleteMany({});
    console.log('🗑  Old test data cleared');

    // ── Create 4 test users (one per team member) ─────────────────────────────
    const [u1, u2, u3, u4] = await User.insertMany([
      {
        firebaseUid: 'test-uid-member1',
        email:       'frontend@pravas.com',
        name:        'Pravas Member 1 (Frontend)',
        photoUrl:    '',
        fcmToken:    'test-fcm-token-1',
      },
      {
        firebaseUid: 'test-uid-member2',
        email:       'backend@pravas.com',
        name:        'Pravas Member 2 (Backend)',
        photoUrl:    '',
        fcmToken:    'test-fcm-token-2',
      },
      {
        firebaseUid: 'test-uid-member3',
        email:       'ai@pravas.com',
        name:        'Pravas Member 3 (AI)',
        photoUrl:    '',
        fcmToken:    'test-fcm-token-3',
      },
      {
        firebaseUid: 'test-uid-member4',
        email:       'db@pravas.com',
        name:        'Pravas Member 4 (DB)',
        photoUrl:    '',
        fcmToken:    'test-fcm-token-4',
      },
    ]);
    console.log('👥 4 users created');

    // ── Create 3 trips ────────────────────────────────────────────────────────
    const [trip1, trip2, trip3] = await Trip.insertMany([
      {
        title:       'Goa Beach Trip',
        description: 'Annual team trip to Goa',
        destination: 'Goa, India',
        startDate:   new Date('2026-05-01'),
        endDate:     new Date('2026-05-07'),
        createdBy:   u1._id,
        budget:      50000,
        currency:    'INR',
        status:      'upcoming',
        members: [
          { user: u2._id, role: 'member', status: 'accepted' },
          { user: u3._id, role: 'member', status: 'accepted' },
          { user: u4._id, role: 'member', status: 'invited' },
        ],
      },
      {
        title:       'Mumbai Work Trip',
        description: 'Client meeting in Mumbai',
        destination: 'Mumbai, India',
        startDate:   new Date('2026-03-25'),
        endDate:     new Date('2026-03-28'),
        createdBy:   u2._id,
        budget:      20000,
        currency:    'INR',
        status:      'current',
        members: [
          { user: u1._id, role: 'member', status: 'accepted' },
        ],
      },
      {
        title:       'Manali Snow Trip',
        description: 'Winter trip to Manali',
        destination: 'Manali, India',
        startDate:   new Date('2025-12-20'),
        endDate:     new Date('2025-12-26'),
        createdBy:   u3._id,
        budget:      35000,
        currency:    'INR',
        status:      'past',
        members: [
          { user: u1._id, role: 'member', status: 'accepted' },
          { user: u2._id, role: 'member', status: 'accepted' },
          { user: u4._id, role: 'member', status: 'declined' },
        ],
      },
    ]);
    console.log('✈️  3 trips created');

    // ── Create expenses for Goa trip ──────────────────────────────────────────
    const shareOf3 = parseFloat((6000 / 3).toFixed(2)); // equal split 3 members
    const shareOf2 = parseFloat((4500 / 3).toFixed(2));

    await Expense.insertMany([
      {
        trip:      trip1._id,
        title:     'Hotel booking',
        amount:    6000,
        currency:  'INR',
        category:  'accommodation',
        paidBy:    u1._id,
        splitType: 'equal',
        splits: [
          { user: u1._id, amount: shareOf3, paid: true },
          { user: u2._id, amount: shareOf3, paid: false },
          { user: u3._id, amount: shareOf3, paid: false },
        ],
        date:  new Date('2026-05-01'),
        notes: 'Beach resort 3 nights',
      },
      {
        trip:      trip1._id,
        title:     'Flight tickets',
        amount:    4500,
        currency:  'INR',
        category:  'transport',
        paidBy:    u2._id,
        splitType: 'equal',
        splits: [
          { user: u1._id, amount: shareOf2, paid: false },
          { user: u2._id, amount: shareOf2, paid: true },
          { user: u3._id, amount: shareOf2, paid: false },
        ],
        date:  new Date('2026-05-01'),
        notes: 'Return flights from Pune',
      },
      {
        trip:      trip1._id,
        title:     'Dinner at beach shack',
        amount:    1500,
        currency:  'INR',
        category:  'food',
        paidBy:    u3._id,
        splitType: 'equal',
        splits: [
          { user: u1._id, amount: 500, paid: false },
          { user: u2._id, amount: 500, paid: false },
          { user: u3._id, amount: 500, paid: true },
        ],
        date:  new Date('2026-05-02'),
        notes: 'Seafood dinner',
      },
      {
        trip:      trip1._id,
        title:     'Water sports',
        amount:    3000,
        currency:  'INR',
        category:  'activity',
        paidBy:    u1._id,
        splitType: 'percentage',
        splits: [
          { user: u1._id, amount: 1500, paid: true },  // 50%
          { user: u2._id, amount: 900,  paid: false },  // 30%
          { user: u3._id, amount: 600,  paid: false },  // 20%
        ],
        date:  new Date('2026-05-03'),
        notes: 'Jet ski + parasailing',
      },
    ]);
    console.log('💰 4 expenses created for Goa trip');

    // ── Print summary ─────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════');
    console.log('✅ SEED COMPLETE — copy these IDs for Postman:');
    console.log('════════════════════════════════════════');
    console.log('\n👤 USERS:');
    console.log(`  Member 1 (Frontend) _id : ${u1._id}`);
    console.log(`  Member 2 (Backend)  _id : ${u2._id}`);
    console.log(`  Member 3 (AI)       _id : ${u3._id}`);
    console.log(`  Member 4 (DB)       _id : ${u4._id}`);
    console.log('\n✈️  TRIPS:');
    console.log(`  Goa Trip   (upcoming) _id : ${trip1._id}`);
    console.log(`  Mumbai Trip (current) _id : ${trip2._id}`);
    console.log(`  Manali Trip (past)    _id : ${trip3._id}`);
    console.log('\n🔑 USE THIS firebaseUid to bypass auth in test routes:');
    console.log(`  Member 2: test-uid-member2`);
    console.log('\n════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

run();