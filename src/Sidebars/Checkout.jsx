import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext/AuthContext';

const Checkout = ({
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
    street: '',
    city: '',
    postalCode: '',
    additionalInfo: ''
  });
  const orderTimeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (orderTimeoutRef.current) {
        clearTimeout(orderTimeoutRef.current);
      }
    };
  }, []);

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Reverse geocoding failed');
      
      const data = await response.json();
      if (data.address) {
        const address = data.address;
        const addressString = `${address.road || ''} ${address.house_number || ''}, ${address.postcode || ''} ${address.city || address.town || address.village || ''}`;
        setUserEnteredAddressString(addressString.trim());
        
        // Populate address details
        setAddressDetails({
          street: `${address.road || ''} ${address.house_number || ''}`.trim(),
          city: address.city || address.town || address.village || '',
          postalCode: address.postcode || '',
          additionalInfo: ''
        });
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      // Continue without reverse geocoding
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
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        setUserLocation(location);
        
        // Attempt reverse geocoding
        await reverseGeocode(latitude, longitude);
        setIsSubmitting(false);
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
      // Options for better accuracy
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0 // Don't use cached location
      }
    );
  };

  // Validate order before submission
  const validateOrder = () => {
    if (!userLocation && !userEnteredAddressString.trim()) {
      setLocationError('Please provide either your location or enter a delivery address.');
      return false;
    }

    if (!receiptUrl) {
      setLocationError('Payment receipt is required. Please complete payment first.');
      return false;
    }

    if (cartItems.length === 0) {
      setLocationError('Your cart is empty. Please add items before placing an order.');
      return false;
    }

    if (!user || !user.id) {
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

      const orderData = {
         user: user.id,
        items: cartItems.map(item => ({
          itemId: item.id || item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal,
        deliveryAddress: {
          type:'Point',
          coordinates: userLocation 
            ? [userLocation.longitude, userLocation.latitude] 
            : [0,0],
          address:`${addressDetails}-${userEnteredAddressString.trim()}`
        },
        receiptUrl: receiptUrl,
      };
      console.log(orderData);

      const response = await fetch('http://localhost:27500/order', {
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
              placeholder="Street Address"
              value={addressDetails.street}
              onChange={(e) => setAddressDetails(prev => ({...prev, street: e.target.value}))}
              className="detail-input"
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="City"
              value={addressDetails.city}
              onChange={(e) => setAddressDetails(prev => ({...prev, city: e.target.value}))}
              className="detail-input"
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={addressDetails.postalCode}
              onChange={(e) => setAddressDetails(prev => ({...prev, postalCode: e.target.value}))}
              className="detail-input"
              disabled={isSubmitting}
            />
          </div>
        </div>
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
        disabled={isSubmitting || !receiptUrl || cartItems.length === 0}
      >
        {isSubmitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;