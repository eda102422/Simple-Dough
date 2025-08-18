import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Clock, MapPin, Phone, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutSuccess = ({ order, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const downloadReceipt = () => {
    const receiptData = {
      orderNumber: order.id.slice(-8),
      date: new Date(order.createdAt).toLocaleString(),
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      deliveryMethod: order.deliveryMethod,
      customerInfo: {
        phone: order.phone,
        address: order.deliveryAddress
      }
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simple-dough-receipt-${order.id.slice(-8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🍩', '🎉', '✨', '🎊'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 text-center rounded-t-2xl">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed! 🎉</h1>
          <p className="text-green-100 text-lg">
            Thank you for choosing Simple Dough!
          </p>
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3 inline-block">
            <p className="text-sm">Order Number</p>
            <p className="text-2xl font-bold">#{order.id.slice(-8)}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8 space-y-6">
          {/* Status Timeline */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Order Status
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Order Received</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Preparing</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Ready</span>
              </div>
            </div>
            <p className="text-sm text-amber-700 mt-3">
              We'll notify you when your delicious donuts are ready!
            </p>
          </div>

          {/* Delivery Information */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              {order.deliveryMethod === 'delivery' ? <MapPin className="w-5 h-5 text-blue-600" /> : <Package className="w-5 h-5 text-blue-600" />}
              {order.deliveryMethod === 'delivery' ? 'Delivery Details' : 'Pickup Details'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">{order.phone}</span>
              </div>
              {order.deliveryMethod === 'delivery' ? (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                    <p className="text-xs text-blue-600 mt-1">Estimated delivery: 30-45 minutes</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">Simple Dough Store</p>
                    <p className="text-xs text-blue-600 mt-1">Ready for pickup in 15-20 minutes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    {item.customizations.flavors && item.customizations.flavors.length > 0 && (
                      <p className="text-xs text-gray-600">
                        Flavors: {item.customizations.flavors.join(', ')}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">₱{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span>Subtotal:</span>
                <span>₱{order.total - (order.deliveryMethod === 'delivery' ? 50 : 0)}</span>
              </div>
              {order.deliveryMethod === 'delivery' && (
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Delivery Fee:</span>
                  <span>₱50</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold text-amber-600">
                <span>Total:</span>
                <span>₱{order.total}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Payment Method:</span>
                <span>{order.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Special Instructions</h3>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadReceipt}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
            <Link
              to="/menu"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Order More Donuts
            </Link>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* Footer Message */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 text-center rounded-b-2xl">
          <p className="text-sm">
            🍩 Thank you for choosing Simple Dough! We're preparing your fresh donuts with love. 
            Follow us on social media for updates and special offers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;