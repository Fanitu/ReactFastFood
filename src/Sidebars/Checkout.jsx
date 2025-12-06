import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext/AuthContext';

// Prefer env-configured API base URL with Vite; fallback to localhost
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:27500';

const Checkout = ({
  handlePaymentmethod,
  setSelectedPaymentMethod,
  setReceiptUrl,
  selectedPaymentMethod,
  setIsSignInOpen,
  cartTotal,
  cartItems,
  setOrders,
  receiptUrl,
  setCartItems
}) => {
  const { user, logout } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [userEnteredAddressString, setUserEnteredAddressString] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    room: '',
    block: ''
  });
  const orderTimeoutRef = useRef(null);
  const reverseControllerRef = useRef(null);
  const reverseTimeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (orderTimeoutRef.current) {
        clearTimeout(orderTimeoutRef.current);
      }
      if (reverseTimeoutRef.current) {
        clearTimeout(reverseTimeoutRef.current);
      }
      if (reverseControllerRef.current) {
        try { reverseControllerRef.current.abort(); } catch {}
      }
    };
  }, []);

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (latitude, longitude) => {
    // Abort any previous reverse geocode in flight
    if (reverseControllerRef.current) {
      try { reverseControllerRef.current.abort(); } catch {}
    }
    const controller = new AbortController();
    reverseControllerRef.current = controller;
    // Timeout after 8s to avoid hanging
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    reverseTimeoutRef.current = timeoutId;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            // Public endpoints often prefer a UA; adjust to your contact if needed
            'User-Agent': 'yoyo-shop/1.0 (contact: support@yoyo.example)'
          },
          signal: controller.signal
        }
      );

      if (!response.ok) throw new Error('Reverse geocoding failed');

      const data = await response.json();
      if (data?.address) {
        const address = data.address;
        const addressString = `${address.road || ''} ${address.house_number || ''}, ${address.postcode || ''} ${address.city || address.town || address.village || ''}`;
        setUserEnteredAddressString(addressString.trim())
      }
    } catch (error) {
      if (error?.name === 'AbortError') return; // ignore aborts
      console.warn('Reverse geocoding failed:', error);
    } finally {
      clearTimeout(timeoutId);
      if (reverseControllerRef.current === controller) {
        reverseControllerRef.current = null;
        reverseTimeoutRef.current = null;
      }
    }
  };

  // Function to get the user's current location
  const handleGetLocation = () => {
    // Clear previous errors
    setLocationError('');

    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsSubmitting(true);

    // Get the current position with improved options
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        setUserLocation(location);
        // Immediately allow UI to proceed; reverse geocoding is non-blocking
        setIsSubmitting(false);
        // Fire-and-forget reverse geocoding
        reverseGeocode(latitude, longitude);
      },
      // Error callback
      (error) => {
        setIsSubmitting(false);
        let errorMessage = 'An unknown error occurred.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services in your browser settings or manually enter your address.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your device location settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or enter address manually.';
            break;
          default:
            errorMessage = error.message || 'Failed to get location.';
            break;
        }
        setLocationError(errorMessage);
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds
        maximumAge: 10000 // allow a recent cached fix up to 10s old
      }
    );
  };

  // Validate order before submission
  const validateOrder = () => {
    const userId = user?.id || user?._id;

    if (!addressDetails.room || !addressDetails.block) {
      setLocationError('Please provide either your location or enter a delivery address.');
      return false;
    }

    if (!selectedPaymentMethod) {
      setLocationError('Please select a payment method.');
      return false;
    }

    if (selectedPaymentMethod === 'mobile' && !receiptUrl) {
      setLocationError('Payment receipt is required for Mobile Transfer. Please complete payment or upload a receipt.');
      return false;
    }

    if (cartItems.length === 0) {
      setLocationError('Your cart is empty. Please add items before placing an order.');
      return false;
    }

    if (!userId) {
      setLocationError('Please log in to place an order.');
      setIsSignInOpen(true);
      return false;
    }

    return true;
  };

  // Function to handle order submission
  const handleSubmitOrder = async () => {
    // Clear previous messages
    setLocationError('');
    setOrderMessage('');

    // Validate inputs
    if (!validateOrder()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const addressString = userEnteredAddressString.trim() ||
        [addressDetails.room, addressDetails.block]
          .filter(Boolean)
          .join(', ');

      const userId = user?.id || user?._id;

      const orderData = {
        // Adjust this field name to match your backend (userId vs user)
        user: userId,
        userName:user.name,
        userPhone:user.phone,
        items: cartItems.map(item => ({
          itemId: item.id || item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        blockNumber:addressDetails.block,
        roomNumber:addressDetails.room,
        totalAmount: cartTotal,
        paymentMethod: selectedPaymentMethod,
        deliveryAddress: {
          type: 'Point',
          coordinates: userLocation
            ? [userLocation.longitude, userLocation.latitude]
            : [0, 0],
          address: addressString
        },
        receiptUrl: selectedPaymentMethod === 'mobile' ? !!receiptUrl : null,
      };
      console.log(orderData);

      const response = await fetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      // Handle authentication errors
      if (response.status === 401) {
        logout();
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Success handling
      setOrderMessage(`Order #${data.orderId || data._id} created successfully!`);
      
      // Add to orders state
      if (setOrders) {
        setOrders(prevOrders => [...prevOrders, data]);
      }

      // Clear cart and reset after delay
      orderTimeoutRef.current = setTimeout(() => {
        setSelectedPaymentMethod('');
        setCartItems([]);
        setUserLocation(null);
        setUserEnteredAddressString('');
        setAddressDetails({
          street: '',
          city: '',
          postalCode: '',
          additionalInfo: ''
        });
        setOrderMessage('');
      }, 4000);

    } catch (error) {
      console.error('Failed to create order:', error);
      
      // User-friendly error messages
      if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
        setLocationError('Network error. Please check your connection and try again.');
      } else {
        setLocationError(error.message || 'Failed to create order. Please try again.');
      }
      
      // Only show login modal for auth issues, not for network errors
      if (error.message.includes('token') || error.message.includes('auth')) {
        setIsSignInOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format location display
  const formatLocation = () => {
    if (!userLocation) return null;
    return `${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`;
  };

  return (
    <div className="checkout-container">
      <div className="delivery-section">
        <h3>Delivery Information</h3>
        
        <div className="location-section">
          <p className="section-label">Delivery Location</p>
          <button 
            type="button" 
            onClick={handleGetLocation}
            disabled={isSubmitting}
            className="location-button"
          >
            {isSubmitting ? 'Getting Location...' : '📍 Use My Current Location'}
          </button>
          
          {userLocation && (
            <div className="location-success">
              <p className="location-coordinates">
                Location captured: {formatLocation()}
              </p>
              {userEnteredAddressString && (
                <p className="location-address">
                  Address: {userEnteredAddressString}
                </p>
              )}
            </div>
          )}
          
          {locationError && (
            <div className="error-message">
              <p>{locationError}</p>
            </div>
          )}
        </div>

        <div className="manual-address-section">
          <label className="address-label">
            Or Enter Delivery Address:
            <textarea 
              value={userEnteredAddressString}
              onChange={(e) => setUserEnteredAddressString(e.target.value)}
              placeholder="Enter full delivery address..."
              rows="3"
              className="address-input"
              disabled={isSubmitting}
            />
          </label>
          
          <div className="address-details">
            <input
              type="text"
              placeholder="Block Num"
              value={addressDetails.block}
              onChange={(e) => setAddressDetails(prev => ({...prev, block: e.target.value}))}
              className="detail-input"
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Room Num"
              value={addressDetails.room}
              onChange={(e) => setAddressDetails(prev => ({...prev, room: e.target.value}))}
              className="detail-input"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="order-summary-section">
        <h4>Payment Method</h4>
        <div className="time-filter" role="tablist" aria-label="Payment method">
          <button
            type="button"
            role="tab"
            aria-selected={selectedPaymentMethod === 'mobile'}
            className={`time-btn ${selectedPaymentMethod === 'mobile' ? 'active' : ''}`}
            onClick={() => setSelectedPaymentMethod('mobile')}
            disabled={isSubmitting}
          >
            📱 Mobile Transfer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPaymentMethod === 'cash'}
            className={`time-btn ${selectedPaymentMethod === 'cash' ? 'active' : ''}`}
            onClick={() => setSelectedPaymentMethod('cash')}
            disabled={isSubmitting}
          >
            💵 Cash on Delivery
          </button>
        </div>
        {selectedPaymentMethod === 'mobile' && (
          receiptUrl ? (
            <p className="payment-confirmed">✅ Payment Confirmed</p>
          ) : (
            <div className="error-message"><p>Please upload or provide your payment receipt to continue.</p></div>
          )
        )}
        {selectedPaymentMethod === 'cash' && (
          <div className="success-message"><p>You can pay cash when your order arrives. No receipt required.</p></div>
        )}
      </div>

      <div className="order-summary-section">
        <h4>Order Summary</h4>
        <p>Items: {cartItems.length}</p>
        <p>Total: ${cartTotal.toFixed(2)}</p>
        {receiptUrl && (
          <p className="payment-confirmed">✅ Payment Confirmed</p>
        )}
      </div>

      {orderMessage && (
        <div className="success-message">
          <p>{orderMessage}</p>
        </div>
      )}

      <button 
        className="order-button"
        onClick={handleSubmitOrder}
        disabled={
          isSubmitting ||
          cartItems.length === 0 ||
          !selectedPaymentMethod ||
          (selectedPaymentMethod === 'mobile' && !receiptUrl)
        }
      >
        {isSubmitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;