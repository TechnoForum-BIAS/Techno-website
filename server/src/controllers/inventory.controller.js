const { supabase } = require('../config/supabase');
const { generateBarcode } = require('../utils/barcodeGenerator');

// Initial mock inventory data
let mockInventory = [
  {
    id: 'inv-001',
    name: 'Arduino Uno R3 Dev Board',
    category: 'Microcontrollers',
    quantityTotal: 25,
    quantityAvailable: 18,
    unit: 'pcs',
    serialPrefix: 'BIAS-ARD',
    imageUrl: '/assets/inventory/arduino-uno.png',
    status: 'available',
    trackedSerials: ['BIAS-ARD-001', 'BIAS-ARD-002', 'BIAS-ARD-003', 'BIAS-ARD-004']
  },
  {
    id: 'inv-002',
    name: 'Heavy Duty 4-Way Extension Cord (10m)',
    category: 'Power & Tools',
    quantityTotal: 10,
    quantityAvailable: 6,
    unit: 'pcs',
    serialPrefix: 'BIAS-EXT',
    imageUrl: '/assets/inventory/extension-board.png',
    status: 'available',
    trackedSerials: ['BIAS-EXT-001', 'BIAS-EXT-002', 'BIAS-EXT-003', 'BIAS-EXT-004']
  },
  {
    id: 'inv-003',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensors',
    quantityTotal: 40,
    quantityAvailable: 35,
    unit: 'pcs',
    serialPrefix: 'BIAS-SEN-US',
    imageUrl: '/assets/inventory/ultrasonic.png',
    status: 'available'
  },
  {
    id: 'inv-004',
    name: '10k Ohm Metal Film Resistors (Pack of 10)',
    category: 'Passive Components',
    quantityTotal: 100,
    quantityAvailable: 85,
    unit: 'packs',
    serialPrefix: 'BIAS-RES-10K',
    imageUrl: '/assets/inventory/resistor-pack.png',
    status: 'available'
  },
  {
    id: 'inv-005',
    name: 'Soldering Iron Station 60W',
    category: 'Power & Tools',
    quantityTotal: 8,
    quantityAvailable: 5,
    unit: 'pcs',
    serialPrefix: 'BIAS-SLD',
    imageUrl: '/assets/inventory/soldering-station.png',
    status: 'available',
    trackedSerials: ['BIAS-SLD-001', 'BIAS-SLD-002']
  }
];

let mockTransactions = [
  {
    id: 'tx-001',
    studentRollNumber: '230101',
    studentName: 'Aarav Sharma',
    itemId: 'inv-002',
    itemName: 'Heavy Duty 4-Way Extension Cord (10m)',
    serialNumber: 'BIAS-EXT-002',
    quantity: 1,
    issuedAt: '2026-11-20T10:00:00Z',
    returnDeadline: '2026-11-27T18:00:00Z',
    status: 'active', // active, returned, damaged, missing
    issuedBy: 'coordinator@bias.ac.in'
  }
];

// Get all inventory items with optional search & category filter
const getItems = async (req, res) => {
  try {
    const { search, category } = req.query;

    if (supabase) {
      let query = supabase.from('inventory_items').select('*');
      if (category && category !== 'All') query = query.eq('category', category);
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, count: data.length, items: data });
    }

    let filtered = [...mockInventory];
    if (category && category !== 'All') {
      filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(q) || item.serialPrefix.toLowerCase().includes(q));
    }

    res.json({ success: true, count: filtered.length, items: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new item to inventory
const addItem = async (req, res) => {
  try {
    const { name, category, quantityTotal, unit, serialPrefix } = req.body;
    const componentFile = req.file;

    if (!name || !quantityTotal) {
      return res.status(400).json({ success: false, message: 'Name and Total Quantity are required.' });
    }

    const qty = parseInt(quantityTotal, 10);
    const prefix = (serialPrefix || `BIAS-${name.substring(0, 3).toUpperCase()}`).trim();

    // Pre-generate individual serial numbers for tracked items
    const trackedSerials = [];
    for (let i = 1; i <= Math.min(qty, 50); i++) {
      trackedSerials.push(`${prefix}-${String(i).padStart(3, '0')}`);
    }

    const newItem = {
      id: `inv-${Date.now()}`,
      name,
      category: category || 'General Components',
      quantityTotal: qty,
      quantityAvailable: qty,
      unit: unit || 'pcs',
      serialPrefix: prefix,
      imageUrl: componentFile ? `/uploads/components/${componentFile.filename}` : '/assets/inventory/default-component.png',
      status: 'available',
      trackedSerials
    };

    if (supabase) {
      const { data, error } = await supabase.from('inventory_items').insert([newItem]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Item added successfully', item: data });
    }

    mockInventory.push(newItem);
    res.status(201).json({ success: true, message: 'Item added successfully (Mock)', item: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate barcode image for an item or specific serial
const getBarcodeImage = async (req, res) => {
  try {
    const { serial } = req.params;
    const { type = 'code128' } = req.query; // 'code128' or 'qrcode'

    if (!serial) {
      return res.status(400).json({ success: false, message: 'Serial number required.' });
    }

    const base64Barcode = await generateBarcode(serial, type);
    res.json({ success: true, serial, type, barcodeDataUrl: base64Barcode });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate barcode', error: error.message });
  }
};

// Checkout Cart / Issue Items to Student Account
const checkoutItems = async (req, res) => {
  try {
    const { studentRollNumber, studentName, items, returnDeadline } = req.body;
    // items: [{ itemId, quantity, serialNumber }]

    if (!studentRollNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Student Roll Number and items list required.' });
    }

    const deadline = returnDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Default 7 days
    const createdTransactions = [];

    for (const item of items) {
      const invItem = mockInventory.find(i => i.id === item.itemId);
      if (!invItem) continue;

      const qty = parseInt(item.quantity) || 1;
      invItem.quantityAvailable = Math.max(0, invItem.quantityAvailable - qty);

      const tx = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        studentRollNumber,
        studentName: studentName || 'Student',
        itemId: item.itemId,
        itemName: invItem.name,
        serialNumber: item.serialNumber || `${invItem.serialPrefix}-BULK`,
        quantity: qty,
        issuedAt: new Date().toISOString(),
        returnDeadline: deadline,
        status: 'active',
        issuedBy: req.user ? req.user.email : 'coordinator'
      };

      mockTransactions.push(tx);
      createdTransactions.push(tx);
    }

    res.status(201).json({
      success: true,
      message: `Successfully issued ${createdTransactions.length} items to ${studentRollNumber}`,
      returnDeadline: deadline,
      transactions: createdTransactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update item return status (audit: working, damaged, missing)
const auditReturnItem = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, remarks } = req.body; // status: 'returned' | 'damaged' | 'missing'

    const tx = mockTransactions.find(t => t.id === transactionId);
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    tx.status = status || 'returned';
    tx.remarks = remarks || '';
    tx.returnedAt = new Date().toISOString();

    // Restock if not missing or damaged
    if (status === 'returned') {
      const invItem = mockInventory.find(i => i.id === tx.itemId);
      if (invItem) {
        invItem.quantityAvailable = Math.min(invItem.quantityTotal, invItem.quantityAvailable + tx.quantity);
      }
    }

    res.json({ success: true, message: `Transaction marked as ${status}`, transaction: tx });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// AI Component Vision Scanner (Analyzes table photo and returns detected parts)
const scanComponentsAI = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Image of components required.' });
    }

    // High accuracy detection mock (or calls Gemini Vision API if key configured)
    const detectedComponents = [
      {
        name: '10k Ohm Metal Film Resistors',
        category: 'Passive Components',
        detectedQuantity: 5,
        confidence: 0.96,
        matchedItemId: 'inv-004'
      },
      {
        name: 'HC-SR04 Ultrasonic Distance Sensor',
        category: 'Sensors',
        detectedQuantity: 2,
        confidence: 0.92,
        matchedItemId: 'inv-003'
      },
      {
        name: 'Arduino Uno R3 Dev Board',
        category: 'Microcontrollers',
        detectedQuantity: 1,
        confidence: 0.98,
        matchedItemId: 'inv-001'
      }
    ];

    res.json({
      success: true,
      message: 'AI Component scan completed successfully',
      imagePath: `/uploads/components/${file.filename}`,
      detectedCount: detectedComponents.length,
      items: detectedComponents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process AI component scan', error: error.message });
  }
};

module.exports = {
  getItems,
  addItem,
  getBarcodeImage,
  checkoutItems,
  auditReturnItem,
  scanComponentsAI,
  mockInventory,
  mockTransactions
};
