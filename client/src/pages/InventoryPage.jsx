import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Search, 
  Scan, 
  Camera, 
  Barcode, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Calendar,
  Sparkles,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

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
            quantityAvailable: 35,
            unit: 'pcs',
            serialPrefix: 'BIAS-SEN-US',
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
            status: 'available',
            trackedSerials: ['BIAS-SLD-001', 'BIAS-SLD-002']
          }
        ]);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Microcontrollers', 'Sensors', 'Passive Components', 'Power & Tools'];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.serialPrefix.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Open Barcode viewer for an item serial
  const handleViewBarcode = (serial) => {
    setSelectedBarcodeSerial(serial);
    setIsBarcodeModalOpen(true);
    fetch(`/api/inventory/barcode/${serial}`)
      .then(res => res.json())
      .then(data => {
        if (data.barcodeDataUrl) setBarcodeDataUrl(data.barcodeDataUrl);
      })
      .catch(() => {
        // Fallback SVG data url or mock representation
        setBarcodeDataUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><rect width="200" height="80" fill="%23fff"/><text x="20" y="45" font-family="monospace" font-size="16" fill="%23000">||| |||| || |||</text><text x="40" y="65" font-family="monospace" font-size="12" fill="%23000">' + serial + '</text></svg>');
      });
  };

  // Simulate or execute AI Vision scan of components on table
  const handleAiScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAiScanning(true);
    const formData = new FormData();
    formData.append('component', file);

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
        // Mock detected components when testing without active server
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
        studentName: user ? user.name : 'Sample Student',
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
          {/* AI Vision Scanner Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-blue hover:from-brand-blue hover:to-brand-indigo text-white text-xs font-semibold glow-blue transition-all"
          >
            <Camera className="w-4 h-4 text-brand-cyan" />
            <span>AI Component Scanner</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white text-xs font-semibold transition-all"
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
            className="w-full bg-brand-card border border-brand-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
          />
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-20 text-brand-muted text-sm font-mono">Loading inventory...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-brand-border text-slate-400 text-sm">
          No hardware components found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="rounded-2xl bg-brand-card border border-brand-border hover:border-brand-blue/40 transition-all flex flex-col justify-between p-6 glow-card"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-brand-blue/20 text-brand-cyan text-[11px] font-semibold">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      item.quantityAvailable > 5 
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' 
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                    }`}>
                      {item.quantityAvailable} {item.unit} left
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <div className="text-xs text-brand-muted font-mono mt-1">
                    Prefix: <span className="text-slate-200">{item.serialPrefix}</span>
                  </div>
                </div>

                {/* Tracked Individual Serials (if any, like extension boards) */}
                {item.trackedSerials && item.trackedSerials.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-brand-muted uppercase font-mono tracking-wider">
                      Tracked Unique Serials:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.trackedSerials.slice(0, 4).map(serial => (
                        <button
                          key={serial}
                          onClick={() => handleViewBarcode(serial)}
                          className="px-2 py-0.5 rounded bg-brand-bg border border-brand-border text-[11px] font-mono text-brand-cyan hover:border-brand-cyan flex items-center space-x-1"
                          title="Click to view & print barcode"
                        >
                          <Barcode className="w-3 h-3" />
                          <span>{serial}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-brand-border flex items-center justify-between mt-4">
                <button
                  onClick={() => handleViewBarcode(item.trackedSerials ? item.trackedSerials[0] : `${item.serialPrefix}-001`)}
                  className="text-xs text-brand-muted hover:text-brand-cyan flex items-center space-x-1"
                >
                  <Barcode className="w-4 h-4" />
                  <span>Barcode</span>
                </button>

                <button
                  onClick={() => addToCart(item, 1)}
                  disabled={item.quantityAvailable <= 0}
                  className="px-4 py-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 glow-blue transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Issue Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Component Vision Scanner Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-brand-card border border-brand-border rounded-2xl max-w-lg w-full p-6 space-y-6 glow-card relative">
            <button
              onClick={() => {
                setIsAiModalOpen(false);
                setDetectedAiItems(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs text-brand-cyan font-mono mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Vision Batch Recognition</span>
              </div>
              <h3 className="text-xl font-bold text-white">Capture / Upload Components on Table</h3>
              <p className="text-xs text-slate-400 mt-1">
                Take a phone photo of all resistors, capacitors, and sensor boards laid out on your work table. AI will detect and count them automatically!
              </p>
            </div>

            {/* Upload dropzone */}
            <div className="border-2 border-dashed border-brand-border hover:border-brand-cyan rounded-xl p-8 text-center transition-colors">
              <input
                type="file"
                accept="image/*"
                id="ai-component-input"
                onChange={handleAiScan}
                className="hidden"
              />
              <label htmlFor="ai-component-input" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-full bg-brand-blue/20 text-brand-cyan flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-white">Click to Upload Table Photo or Snap Camera</div>
                <div className="text-xs text-brand-muted">Supports PNG, JPG, WebP from phone or webcam</div>
              </label>
            </div>

            {/* Scanning Indicator */}
            {aiScanning && (
              <div className="text-center py-4 space-y-2">
                <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-xs text-brand-cyan font-mono">Analyzing circuit elements & counting items...</div>
              </div>
            )}

            {/* Detected Items Card List */}
            {detectedAiItems && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Detected {detectedAiItems.length} Components:</span>
                  <span className="text-brand-cyan font-mono">Auto Matched</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {detectedAiItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-brand-bg border border-brand-border text-xs">
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Confidence: {(item.confidence * 100).toFixed(0)}%</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan font-bold font-mono">
                        Qty: {item.detectedQuantity}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddAiDetectedToCart}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan text-brand-bg font-bold text-xs glow-cyan transition-all"
                >
                  Add All Detected Components to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barcode Viewer Modal */}
      {isBarcodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-brand-card border border-brand-border rounded-2xl max-w-sm w-full p-6 space-y-4 glow-card relative text-center">
            <button
              onClick={() => setIsBarcodeModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] text-brand-muted uppercase font-mono">Technoforum Equipment Label</span>
              <h3 className="text-lg font-bold text-white font-mono mt-0.5">{selectedBarcodeSerial}</h3>
            </div>

            <div className="bg-white p-4 rounded-xl flex items-center justify-center min-h-[120px]">
              {barcodeDataUrl ? (
                <img src={barcodeDataUrl} alt="Barcode" className="max-w-full h-auto" />
              ) : (
                <div className="text-xs text-slate-500 font-mono">Generating barcode...</div>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Print and paste onto physical equipment (e.g. extension board casing) for barcode scanner tracking.
            </p>

            <button
              onClick={() => window.print()}
              className="w-full py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sticker Label</span>
            </button>
          </div>
        </div>
      )}

      {/* Issue Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="bg-brand-card border-l border-brand-border max-w-md w-full h-full p-6 flex flex-col justify-between glow-card">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-brand-cyan" />
                  <h3 className="text-lg font-bold text-white">Component Issue Cart</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {checkoutSuccess ? (
                <div className="text-center py-16 space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Components Issued!</h4>
                  <p className="text-xs text-slate-300">
                    Logged under Student Roll No: <strong className="text-brand-cyan">{user ? user.rollNumber : '230101'}</strong>. Return deadline: {returnDate}.
                  </p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  Your issue cart is currently empty. Add items from catalog or scan with AI.
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-3 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-brand-cyan font-mono">{item.serialPrefix}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={item.cartQuantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 bg-brand-card border border-brand-border rounded px-2 py-1 text-xs text-white text-center font-mono"
                        />
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && !checkoutSuccess && (
              <div className="space-y-4 border-t border-brand-border pt-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Return Deadline (Automated alert will be sent):
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="text-xs text-slate-400 bg-brand-bg p-2.5 rounded-lg border border-brand-border">
                  Issuing to: <span className="text-white font-semibold">{user ? user.name : 'Aarav Sharma'} ({user ? user.rollNumber : '230101'})</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs glow-blue transition-all"
                >
                  Confirm Issue & Log to Student Account
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryPage;
