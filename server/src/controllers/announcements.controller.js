const { supabase } = require('../config/supabase');

// In-memory mock announcements for initial local development & offline fallback
let mockAnnouncements = [
  {
    id: 'ann-001',
    title: 'Recruitment Drive 2026: Technoforum Core Team Applications Open',
    category: 'Society Recruitment',
    priority: 'High',
    date: '2026-11-22',
    time: '10:00 AM',
    author: 'President, Technoforum',
    content: 'Calling all coders, designers, hardware hackers, and organizers! Technoforum core committee recruitments for 2026 are officially open. Fill out the application form before November 30.',
    flyerUrl: '/assets/announcements/recruitment-2026.png',
    isPinned: true,
    targetAudience: 'All Students & Faculty'
  },
  {
    id: 'ann-002',
    title: 'Hardware Lab Inventory Auditing & Return Guidelines',
    category: 'Hardware Lab & Equipment',
    priority: 'Urgent',
    date: '2026-11-18',
    time: '02:00 PM',
    author: 'Hardware Coordinator',
    content: 'All students with active component issues must submit their equipment (especially extension cords and Arduino kits) for physical serial verification before the semester break.',
    flyerUrl: '/assets/announcements/lab-notice.png',
    isPinned: true,
    targetAudience: 'Hardware Lab Members'
  },
  {
    id: 'ann-003',
    title: 'TechnoHacks 2026 Venue & Schedule Confirmed',
    category: 'Hackathon & Competition',
    priority: 'High',
    date: '2026-11-15',
    time: '11:00 AM',
    author: 'Faculty Coordinator',
    content: 'TechnoHacks 2026 36-hour sprint will be held in the BIAS Auditorium & Central Lab Complex. Teams of up to 4 must bring their registered student credentials.',
    flyerUrl: '/assets/announcements/techfest.png',
    isPinned: false,
    targetAudience: 'All Students & Faculty'
  },
  {
    id: 'ann-004',
    title: 'Winter Vacation Laboratory Operating Timings',
    category: 'Academic Circular',
    priority: 'Normal',
    date: '2026-11-10',
    time: '09:00 AM',
    author: 'Central Administration',
    content: 'The hardware lab will remain functional from 09:00 AM to 08:00 PM on weekdays during the winter session. Component checkouts require student roll number verification.',
    flyerUrl: '/assets/announcements/winter-schedule.png',
    isPinned: false,
    targetAudience: 'All Students & Faculty'
  }
];

// 1. GET ALL ANNOUNCEMENTS (Public - with or without login)
const getAnnouncements = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map database columns to standardized format
        const formatted = data.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category || 'General Notice',
          priority: item.priority || (item.is_pinned ? 'High' : 'Normal'),
          date: item.date || item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          time: item.time || '10:00 AM',
          author: item.author || 'Technoforum Coordinator',
          content: item.content || item.description || '',
          flyerUrl: item.flyer_url || item.flyerUrl || '/assets/announcements/lab-notice.png',
          isPinned: Boolean(item.is_pinned),
          targetAudience: item.target_audience || 'All Students & Faculty'
        }));
        return res.json({ success: true, count: formatted.length, announcements: formatted });
      }
    }

    // Fallback to in-memory mock sorted by pinned first, then date
    const sorted = [...mockAnnouncements].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    res.json({ success: true, count: sorted.length, announcements: sorted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. CREATE ANNOUNCEMENT (Coordinators & Admins Only)
const createAnnouncement = async (req, res) => {
  try {
    const { title, category, priority, date, time, content, isPinned, flyerUrl, targetAudience } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Notice title and description are required.' });
    }

    const authorName = req.user ? `${req.user.name} (${req.user.role.toUpperCase()})` : 'Technoforum Coordinator';

    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      category: category || 'General Notice',
      priority: priority || 'Normal',
      date: date || new Date().toISOString().split('T')[0],
      time: time || '10:00 AM',
      author: authorName,
      content: content.trim(),
      flyerUrl: flyerUrl || '/assets/announcements/lab-notice.png',
      isPinned: Boolean(isPinned),
      targetAudience: targetAudience || 'All Students & Faculty'
    };

    if (supabase) {
      const dbPayload = {
        title: newAnnouncement.title,
        category: newAnnouncement.category,
        priority: newAnnouncement.priority,
        time: newAnnouncement.time,
        target_audience: newAnnouncement.targetAudience,
        content: newAnnouncement.content,
        flyer_url: newAnnouncement.flyerUrl,
        is_pinned: newAnnouncement.isPinned,
        author: newAnnouncement.author,
        date: newAnnouncement.date
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert([dbPayload])
        .select()
        .single();

      if (!error && data) {
        newAnnouncement.id = data.id;
        return res.status(201).json({
          success: true,
          message: 'Official announcement published successfully',
          announcement: newAnnouncement
        });
      }
    }

    // In-memory fallback
    mockAnnouncements.unshift(newAnnouncement);
    res.status(201).json({
      success: true,
      message: 'Official announcement published successfully',
      announcement: newAnnouncement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. UPDATE ANNOUNCEMENT (Coordinators & Admins Only)
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, priority, date, time, content, isPinned, flyerUrl, targetAudience } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Notice title and description are required.' });
    }

    let updatedItem = null;

    if (supabase) {
      const dbPayload = {
        title: title.trim(),
        category: category || 'General Notice',
        priority: priority || 'Normal',
        time: time || '10:00 AM',
        target_audience: targetAudience || 'All Students & Faculty',
        content: content.trim(),
        flyer_url: flyerUrl,
        is_pinned: Boolean(isPinned),
        date: date || new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('announcements')
        .update(dbPayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        updatedItem = {
          id: data.id,
          title: data.title,
          category: data.category,
          priority: priority || 'Normal',
          date: data.date,
          time: time || '10:00 AM',
          author: data.author,
          content: data.content,
          flyerUrl: data.flyer_url || flyerUrl,
          isPinned: Boolean(data.is_pinned),
          targetAudience: targetAudience || 'All Students & Faculty'
        };
      }
    }

    // In-memory update
    const index = mockAnnouncements.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAnnouncements[index] = {
        ...mockAnnouncements[index],
        title: title.trim(),
        category: category || mockAnnouncements[index].category,
        priority: priority || mockAnnouncements[index].priority,
        date: date || mockAnnouncements[index].date,
        time: time || mockAnnouncements[index].time,
        content: content.trim(),
        isPinned: isPinned !== undefined ? Boolean(isPinned) : mockAnnouncements[index].isPinned,
        flyerUrl: flyerUrl || mockAnnouncements[index].flyerUrl,
        targetAudience: targetAudience || mockAnnouncements[index].targetAudience
      };
      if (!updatedItem) updatedItem = mockAnnouncements[index];
    }

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      announcement: updatedItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. DELETE ANNOUNCEMENT (Coordinators & Admins Only)
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete error (falling back to mock):', error.message);
      }
    }

    const beforeLength = mockAnnouncements.length;
    mockAnnouncements = mockAnnouncements.filter(a => a.id !== id);

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
      deletedId: id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  mockAnnouncements
};
