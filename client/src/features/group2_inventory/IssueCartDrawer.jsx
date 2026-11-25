import React from 'react';
import { ShoppingCart, X, CheckCircle, Trash2 } from 'lucide-react';

/**
 * IssueCartDrawer Component
 * Owned by: Group 2 (Intern 4)
 * Manages active hardware checkout cart, return deadlines, and issue submission.
 */
const IssueCartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  returnDate,
  onReturnDateChange,
  onCheckout,
  checkoutSuccess,
  user
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-card border-l border-brand-border max-w-md w-full h-full p-6 flex flex-col justify-between glow-card">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-lg font-bold text-white">Component Issue Cart</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{item.name}</div>
                    <div className="text-[10px] text-brand-cyan font-mono">{item.serialPrefix}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={item.cartQuantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-12 bg-brand-card border border-brand-border rounded px-2 py-1 text-xs text-white text-center font-mono"
                    />
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
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
                onChange={(e) => onReturnDateChange(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div className="text-xs text-slate-400 bg-brand-bg p-2.5 rounded-xl border border-brand-border">
              Issuing to: <span className="text-white font-semibold">{user ? user.name : 'Student Member'} ({user ? user.rollNumber : '230101'})</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs glow-blue transition-all"
            >
              Confirm Issue & Log to Student Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCartDrawer;
