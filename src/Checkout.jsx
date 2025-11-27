import { useState } from 'react';

const Checkout = ({cartTotal,cartItems}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [userEnteredAddressString,setUserEnteredAddressString]=useState('');

  // Function to get the user's current location
  const handleGetLocation = () => {
    // Clear previous errors
    setLocationError('');

    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    // Get the current position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        // You can also automatically fill a "Delivery Address" text field here
        // by reverse geocoding (see "Pro Tips" below).
      },
      // Error callback
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('The request to get user location timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
            break;
        }
      },
      // Options (optional)
      {
        maximumAge: 600000 // Cache location for 10 minutes
      }
    );
  };

  // Function to handle order submission
  const handleSubmitOrder = async () => {
    if (!userLocation) {
      alert('Please provide your delivery location.');
      return;
    }

    // Prepare the order data, including the location
    const orderData = {
      items: cartItems,
      totalAmount: cartTotal,
      deliveryAddress: { // This is the key part!
        coordinates: [userLocation.longitude, userLocation.latitude], // GeoJSON standard: [lng, lat]
        address: userEnteredAddressString // A human-readable address from a form field
      },
      status: 'pending',
      userId: currentUserId,
    };

    // Send the order to your backend
    try {
      const response = await fetch('http://localhost:27500/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      // Proceed to payment with data.receiptUrl...
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };
  return (
    <div>
      {/* ... other checkout fields ... */}
      
      <div>
        <p>Delivery Location</p>
        <button type="button" onClick={handleGetLocation}>
          📍 Use My Current Location
        </button>
        {userLocation && (
          <p>
            Location Captured: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </p>
        )}
        {locationError && <p style={{ color: 'red' }}>Error: {locationError}</p>}
        <br/>
        {/* It's good practice to also let users type their address as a fallback */}
        <label>
          Or Enter Full Address:
          <input type="text" value={userEnteredAddressString} onChange={(e) => setUserEnteredAddressString(e.target.value)} />
        </label>
      </div>

    <button 
      className='orderButton'
        
    >
    Place the order
    </button>
    </div>
  );
};

export default Checkout;