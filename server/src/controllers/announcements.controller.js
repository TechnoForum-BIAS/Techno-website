const { supabase } = require('../config/supabase');

let mockAnnouncements = [
  {
    id: 'ann-001',
    title: 'Recruitment Drive 2026: Technoforum Core Team',
    category: 'Society Recruitment',
    date: '2026-11-22',
    author: 'President, Technoforum',
    content: 'Calling all coders, designers, hardware hackers, and organizers! Technoforum core committee recruitments for 2026 are officially open.',
    flyerUrl: '/assets/announcements/recruitment-2026.png',
    isPinned: true
  },
  {
    id: 'ann-002',
    title: 'Hardware Lab Inventory Auditing Guidelines',
    category: 'Inventory Notice',
    date: '2026-11-18',
    author: 'Hardware Coordinator',
    content: 'All students with active component issues must submit their equipment for physical verification before the semester break.',
    flyerUrl: '/assets/announcements/lab-notice.png',
    isPinned: false
  }
];

const getAnnouncements = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, count: data.length, announcements: data });
    }
    res.json({ success: true, count: mockAnnouncements.length, announcements: mockAnnouncements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, category, content, isPinned } = req.body;
    const flyer = req.file;

    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      category: category || 'General',
      date: new Date().toISOString().split('T')[0],
      author: req.user ? req.user.name : 'Coordinator',
      content,
      flyerUrl: flyer ? `/uploads/flyers/${flyer.filename}` : '/assets/announcements/default-flyer.png',
      isPinned: Boolean(isPinned)
    };

    if (supabase) {
      const { data, error } = await supabase.from('announcements').insert([newAnnouncement]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Announcement published', announcement: data });
    }

    mockAnnouncements.unshift(newAnnouncement);
    res.status(201).json({ success: true, message: 'Announcement published (Mock)', announcement: newAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, mockAnnouncements };
