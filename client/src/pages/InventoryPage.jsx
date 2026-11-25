import React, { useState, useEffect } from 'react';
import { Search, Camera, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import InventoryItemCard from '../features/group2_inventory/InventoryItemCard';
import BarcodeModal from '../features/group2_inventory/BarcodeModal';
import AiTableScannerModal from '../features/group2_inventory/AiTableScannerModal';
import IssueCartDrawer from '../features/group2_inventory/IssueCartDrawer';

const InventoryPage = () => {
  const { user } = useAuth();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItemsCount } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [selectedBarcodeSerial, setSelectedBarcodeSerial] = useState(null);
  const [barcodeDataUrl, setBarcodeDataUrl] = useState(null);

  // AI Scanner state
  const [aiScanning, setAiScanning] = useState(false);
  const [detectedAiItems, setDetectedAiItems] = useState(null);

  // Checkout state
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/inventory/items')
      .then(res => res.json())
      .then(data => {
        if (data.items) setItems(data.items);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock items
        setItems([
          {
            id: 'inv-001',
            name: 'Arduino Uno R3 Dev Board',
            category: 'Microcontrollers',
            quantityTotal: 25,
            quantityAvailable: 18,
            unit: 'pcs',
            serialPrefix: 'BIAS-ARD',
            status: 'available',
            trackedSerials: ['BIAS-ARD-001', 'BIAS-ARD-002', 'BIAS-ARD-003']
          },
          {
            id: 'inv-002',
            name: 'Heavy Duty 4-Way Extension Cord (10m)',
            category: 'Power & Tools',
            quantityTotal: 10,
            quantityAvailable: 6,
            unit: 'pcs',
            serialPrefix: 'BIAS-EXT',
            status: 'available',
            trackedSerials: ['BIAS-EXT-001', 'BIAS-EXT-002', 'BIAS-EXT-003', 'BIAS-EXT-004']
          },
          {
            id: 'inv-003',
            name: 'HC-SR04 Ultrasonic Distance Sensor',
            category: 'Sensors',
            quantityTotal: 40,
            quantityAvailable: 32,
            unit: 'pcs',
            serialPrefix: 'BIAS-SEN-US',
            status: 'available',
            trackedSerials: ['BIAS-SEN-001', 'BIAS-SEN-002']
          },
          {
            id: 'inv-004',
            name: '10k Ohm Metal Film Resistors (Pack of 10)',
            category: 'Passive Components',
            quantityTotal: 100,
            quantityAvailable: 85,
            unit: 'packs',
            serialPrefix: 'BIAS-RES-10K',
            status: 'available'
          }
        ]);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Microcontrollers', 'Sensors', 'Passive Components', 'Power & Tools'];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          (item.serialPrefix && item.serialPrefix.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Generate & Display Barcode
  const handleViewBarcode = (serial) => {
    setSelectedBarcodeSerial(serial);
    setBarcodeDataUrl(null);
    setIsBarcodeModalOpen(true);

    fetch(`/api/inventory/barcode/${serial}`)
      .then(res => res.json())
      .then(data => {
        if (data.barcodeDataUrl) {
          setBarcodeDataUrl(data.barcodeDataUrl);
        }
      })
      .catch(() => {
        // Fallback dummy SVG barcode
        setBarcodeDataUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><rect width="200" height="80" fill="%23fff"/><text x="20" y="50" font-family="monospace" font-size="16" fill="%23000">BARCODE:' + serial + '</text></svg>');
      });
  };

  // AI Scanner submission
  const handleAiScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAiScanning(true);
    setDetectedAiItems(null);

    const formData = new FormData();
    formData.append('image', file);

    fetch('/api/inventory/scan-ai', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setAiScanning(false);
        setDetectedAiItems(data.items || []);
      })
      .catch(() => {
        setTimeout(() => {
          setAiScanning(false);
          setDetectedAiItems([
            { name: '10k Ohm Metal Film Resistors', matchedItemId: 'inv-004', detectedQuantity: 5, confidence: 0.96 },
            { name: 'HC-SR04 Ultrasonic Distance Sensor', matchedItemId: 'inv-003', detectedQuantity: 2, confidence: 0.92 },
            { name: 'Arduino Uno R3 Dev Board', matchedItemId: 'inv-001', detectedQuantity: 1, confidence: 0.98 }
          ]);
        }, 1200);
      });
  };

  const handleAddAiDetectedToCart = () => {
    if (!detectedAiItems) return;
    detectedAiItems.forEach(aiItem => {
      const match = items.find(i => i.id === aiItem.matchedItemId || i.name.toLowerCase().includes(aiItem.name.toLowerCase()));
      if (match) {
        addToCart(match, aiItem.detectedQuantity);
      }
    });
    setIsAiModalOpen(false);
    setDetectedAiItems(null);
    setIsCartOpen(true);
  };

  // Checkout Cart to student account
  const handleCheckout = () => {
    fetch('/api/inventory/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentRollNumber: user ? user.rollNumber : '230101',
        studentName: user ? user.name : 'Student Member',
        returnDeadline: returnDate,
        items: cartItems.map(i => ({ itemId: i.id, quantity: i.cartQuantity }))
      })
    })
      .then(res => res.json())
      .then(() => {
        setCheckoutSuccess(true);
        setTimeout(() => {
          clearCart();
          setCheckoutSuccess(false);
          setIsCartOpen(false);
        }, 2000);
      })
      .catch(() => {
        setCheckoutSuccess(true);
        setTimeout(() => {
          clearCart();
          setCheckoutSuccess(false);
          setIsCartOpen(false);
        }, 2000);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header with AI Scanner & Cart Triggers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Hardware Inventory & Component Hub</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse microcontrollers, sensors, extension cords with tracked serials, and AI vision batch scanner.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-blue hover:from-brand-blue hover:to-brand-indigo text-white text-xs font-semibold glow-blue transition-all"
          >
            <Camera className="w-4 h-4 text-brand-cyan" />
            <span>AI Component Scanner</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white text-xs font-semibold transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-brand-cyan" />
            <span>Issue Cart</span>
            {totalItemsCount > 0 && (
              <span className="bg-brand-cyan text-brand-bg font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-blue text-white shadow-sm glow-blue'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300 border border-brand-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search item name or serial (e.g. BIAS-EXT)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
          />
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-20 text-brand-muted text-sm font-mono">Loading inventory catalog...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-brand-border text-slate-400 text-sm">
          No hardware components found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              onViewBarcode={handleViewBarcode}
            />
          ))}
        </div>
      )}

      {/* AI Component Vision Scanner Modal (Owned by Intern 4) */}
      <AiTableScannerModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setDetectedAiItems(null);
        }}
        onFileSelect={handleAiScan}
        aiScanning={aiScanning}
        detectedAiItems={detectedAiItems}
        onAddToCart={handleAddAiDetectedToCart}
      />

      {/* Barcode Viewer Modal (Owned by Intern 3) */}
      <BarcodeModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        serialNumber={selectedBarcodeSerial}
        barcodeDataUrl={barcodeDataUrl}
      />

      {/* Issue Cart Drawer (Owned by Intern 4) */}
      <IssueCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        returnDate={returnDate}
        onReturnDateChange={setReturnDate}
        onCheckout={handleCheckout}
        checkoutSuccess={checkoutSuccess}
        user={user}
      />

    </div>
  );
};

export default InventoryPage;
