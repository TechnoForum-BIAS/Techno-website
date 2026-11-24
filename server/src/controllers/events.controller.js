const { supabase } = require('../config/supabase');

// Mock events for initial local testing
let mockEvents = [
  {
    id: 'evt-001',
    title: 'TechnoHacks 2026: Annual Flagship Hackathon',
    category: 'Hackathon',
    date: '2026-12-15',
    time: '10:00 AM - 10:00 PM',
    venue: 'BIAS Auditorium & Lab Complex',
    description: '36-hour non-stop innovation sprint solving real campus and societal challenges with cutting-edge tech.',
    maxParticipants: 120,
    registrationDeadline: '2026-12-10',
    bannerUrl: '/assets/flyers/hackathon-2026.png',
    status: 'upcoming'
  },
  {
    id: 'evt-002',
    title: 'RoboQuest: Autonomous Line Follower & Maze Solver',
    category: 'Robotics',
    date: '2026-12-20',
    time: '02:00 PM - 06:00 PM',
    venue: 'BIAS Quadrangle',
    description: 'Design and build your own autonomous bots to conquer the obstacle course. Hardware kits provided by Technoforum.',
    maxParticipants: 60,
    registrationDeadline: '2026-12-18',
    bannerUrl: '/assets/flyers/roboquest.png',
    status: 'upcoming'
  },
  {
    id: 'evt-003',
    title: 'Web3 & AI Fusion Workshop',
    category: 'Workshop',
    date: '2026-11-28',
    time: '04:00 PM - 07:00 PM',
    venue: 'Virtual / Lab 3',
    description: 'Hands-on masterclass on building decentralized applications paired with LLM agents.',
    maxParticipants: 80,
    registrationDeadline: '2026-11-27',
    bannerUrl: '/assets/flyers/workshop.png',
    status: 'ongoing'
  }
];

let mockRegistrations = [];

// Get all events
const getEvents = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (error) throw error;
      return res.json({ success: true, count: data.length, events: data });
    }
    res.json({ success: true, count: mockEvents.length, events: mockEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new event (Coordinator or Super Admin)
const createEvent = async (req, res) => {
  try {
    const { title, category, date, time, venue, description, maxParticipants, registrationDeadline } = req.body;
    const flyerFile = req.file;

    const bannerUrl = flyerFile ? `/uploads/flyers/${flyerFile.filename}` : '/assets/flyers/default-event.png';

    const newEvent = {
      id: `evt-${Date.now()}`,
      title,
      category: category || 'Technical',
      date,
      time: time || 'TBA',
      venue: venue || 'BIAS Campus',
      description,
      maxParticipants: parseInt(maxParticipants) || 100,
      registrationDeadline,
      bannerUrl,
      status: 'upcoming',
      created_by: req.user ? req.user.id : 'admin'
    };

    if (supabase) {
      const { data, error } = await supabase.from('events').insert([newEvent]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Event created successfully', event: data });
    }

    mockEvents.push(newEvent);
    res.status(201).json({ success: true, message: 'Event created successfully (Mock)', event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register student for an event
const registerForEvent = async (req, res) => {
  try {
    const { eventId, studentName, rollNumber, email, phone, teamMembers } = req.body;

    if (!eventId || !studentName || !rollNumber || !email) {
      return res.status(400).json({ success: false, message: 'Event ID, student name, roll number and email are required.' });
    }

    const registration = {
      id: `reg-${Date.now()}`,
      eventId,
      studentName,
      rollNumber,
      email,
      phone: phone || '',
      teamMembers: teamMembers || [],
      registeredAt: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('event_registrations').insert([registration]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Registration submitted successfully!', registration: data });
    }

    mockRegistrations.push(registration);
    res.status(201).json({ success: true, message: 'Registration submitted successfully! (Mock)', registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEvents, createEvent, registerForEvent, mockEvents, mockRegistrations };
