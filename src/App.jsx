import React, { useState, useEffect, useRef } from 'react';
import Header from './layouts/Header';
import Hero from './layouts/Hero';
import Menu from './layouts/Menu';
import Testimonial from './layouts/Testimonial';
import Contact from './layouts/Contact';
import Footer from './layouts/Footer';
import Nav from './layouts/Nav';
import Sidebar from './Sidebars/Sidebar';
import CartSidebar from './Sidebars/CartSidebar';
import OrderSidebar from './Sidebars/OrderSidebar';
import SignUp from './Signing/SignUp';
import SignIn from './Signing/SignIn';
import DriverDashboard from './Driver/DriverDashboard';
import { AuthProvider,useAuth } from './AuthContext/AuthContext';
import Overlay from './Overlay/Overlay';
import AdminDashboard from './admin/AdminDashboard';
import WaiterDashboard from './WaiterDashboard/WaiterDashboard';
import ErrorBoundary from '../errorBoundry/ErrorBoundary'

const App = () => {
  const { user,currentView ,login} = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('FATA');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderOpen,setIsOrderOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
const [isSignUpOpen, setIsSignUpOpen] = useState(false);
const [isSignInOpen, setIsSignInOpen] = useState(false);
const [authUserForm, setAuthUserForm] = useState({
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
});
const [signInForm, setSignInForm] = useState({
  name: '',
  password: ''
});
const [authError, setAuthError] = useState('');
const [authSuccess, setAuthSuccess] = useState('');

  const translations = {
    English: {
      shopName: "YoYo Fast Food",
      location: "Addis Ababa, Ethiopia",
      topOrders: "Top Orders",
      orderNow: "Order Now",
      customerFeedback: "Customer Feedback",
      menu: "Menu",
      testimonials: "Testimonials",
      contactUs: "Contact Us",
      weAreHere: "We Are Here If You Want To Say Something",
      sendMessage: "Send Message",
      name: "Name",
      email: "Email",
      message: "Message",
      total: "Total",
      cart: "Cart",
      myOrders: "My Orders",
      noOrders: "No current orders",
      addToCart: "Add to Cart",
      home: "Home",
      watchFeedback: "Watch how our customers are grateful for our service",
      betterTaste: "Better Taste our food and know how tasty our products are!",
      testimonial1: "The best fast food in town! Their burgers are amazing and the juice is always fresh.",
      testimonial2: "Quick delivery and great customer service. I order from them every week!",
      testimonial3: "The quality of their food is outstanding. Highly recommended!",
      testimonial4: "Amazing taste and affordable prices. YoYo is my go-to place for quick meals.",
      signIn: "Sign In",
      signUp: "Sign Up",
      fullName: "Full Name",
      phone: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      createAccount: "Create Account",
      login: "Login",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      signUpHere: "Sign Up here",
      signInHere: "Sign In here"
   },
    Amharic: {
      shopName: "ዮዮ ፋስት ፉድ",
      location: "አዲስ አበባ, ኢትዮጵያ",
      topOrders: "ከፍተኛ ትዕዛዞች",
      orderNow: "አሁን ይዘዙ",
      customerFeedback: "የደንበኞች አስተያየት",
      menu: "ምግብ ዝርዝር",
      testimonials: "ምስክርነቶች",
      contactUs: "አግኙን",
      weAreHere: "አንድ ነገር ማለት ከፈለጉ እዚህ ነን",
      sendMessage: "መልእክት ይላኩ",
      name: "ስም",
      email: "ኢሜይል",
      message: "መልእክት",
      total: "ጠቅላላ",
      cart: "ጋሪ",
      myOrders: "ትዕዛዞቼ",
      noOrders: "አሁን ያሉ ትዕዛዞች የሉም",
      addToCart: "ወደ ጋሪ ጨምር",
      home: "መነሻ",
      watchFeedback: "ደንበኞቻችን ለአገልግሎታችን እንዴት እንደሚያምሩ ይመልከቱ",
      betterTaste: "ምግባችንን ይቀምሱ እና ምርቶቻችን ምን ያህል ጣፋጭ እንደሆኑ ይወቁ!",
      testimonial1: "በከተማው ውስጥ ከሚገኙት ሁሉ ጥሩው ፋስት ፉድ! በርገሮቻቸው አስደናቂ ናቸው።",
      testimonial2: "ፈጣን አቅራቢያ እና አስደናቂ የደንበኞች አገልግሎት። በሳምንት ከእነሱ እዘዛለሁ!",
      testimonial3: "የምግባቸው ጥራት አስደናቂ ነው። በጣም ይመከራል!",
      testimonial4: "አስደናቂ ጣዕም እና ተመጣጣኝ ዋጋ። ዮዮ ለፈጣን ምግቦች የምሄድበት ቦታ ነው።",
      signIn: "ግባ",
      signUp: "ይመዝገቡ",
      fullName: "ሙሉ ስም",
      phone: "ስልክ ቁጥር",
      password: "የይለፍ ቃል",
      confirmPassword: "የይለፍ ቃል አረጋግጥ",
      createAccount: "መለያ ይፍጠሩ",
      login: "ግባ",
      dontHaveAccount: "መለያ የሎትም?",
      alreadyHaveAccount: "ቀድሞውኑ መለያ አሎት?",
      signUpHere: "እዚህ ይመዝገቡ",
      signInHere: "እዚህ ግቡ"
    },
    Tigrigha: {
      shopName: "ዮዮ ፋስት ፉድ",
      location: "ኣዲስ ኣበባ, ኢትዮጵያ",
      topOrders: "ላዕለዋይ ትእዛዛት",
      orderNow: "ሕጂ ምዝዛን",
      customerFeedback: "ናይ ዓማዊል ርእይቶ",
      menu: "መዝገብ መኣዲ",
      testimonials: "ምስክርነታት",
      contactUs: "ርኸቡና",
      weAreHere: "እንተደሊኹም ክትብሉ ኣብዚ ኣለና",
      sendMessage: "መልእኽቲ ለኣኹም",
      name: "ስም",
      email: "ኢመይል",
      message: "መልእኽቲ",
      total: "ጠቕላላ",
      cart: "ጋሪ",
      myOrders: "ትእዛዛተይ",
      noOrders: "ዘይትረክብ ትእዛዛት",
      addToCart: "ናብ ጋሪ ወስኹ",
      home: "ቤት",
      watchFeedback: "ከመይ ጌርና ንኣገልግሎትና ዓማዊልና ከመይ ጌሮም ከም ዘሐጉሱ ርአዩ",
      betterTaste: "መግብና ቅመሱ እሞ ፍርያትና ክንደይ ጥዑም ምዃኑ ፈልጡ!",
      testimonial1: "ኣብታ ኸተማ ዘሎ ዝበለጸ ፋስት ፉድ! በርገሮም ኣዝዮም ጽቡቕ እዮም።",
      testimonial2: "ቅልጡፍ ምድሓን እሞ ኣዝዩ ጽቡቕ ናይ ዓማዊል ኣገልግሎት። በየንደፈ ካርኦም እዘዛለኹ!",
      testimonial3: "ጥራይ መግቦም ኣዝዩ ረቂቕ እዩ። ብምልከት እዩ ዝመክር!",
      testimonial4: "ጽቡቕ ጣዕም እሞ ተመጣጣኒ ዋጋ። ዮዮ ንቅልጡፍ መኣዲ እትኸዲሉ ቦታይ እያ።",
      signIn: "ግባ",
      signUp: "ይመዝገቡ",
      fullName: "ሙሉ ስም",
      phone: "ስልክ ቁጥር",
      password: "የይለፍ ቃል",
      confirmPassword: "የይለፍ ቃል አረጋግጥ",
      createAccount: "መለያ ይፍጠሩ",
      login: "ግባ",
      dontHaveAccount: "መለያ የሎትም?",
      alreadyHaveAccount: "ቀድሞውኑ መለያ አሎት?",
      signUpHere: "እዚህ ይመዝገቡ",
      signInHere: "እዚህ ግቡ"
    }
  };

  const t = translations[currentLanguage];

  const products = {
    FATA: [
      { id: 1, name: "Fata with 3", price: 120, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 2, name: "Fata with 4", price: 180, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGl6emF8ZW58MHx8MHx8fDA%3D&w=1000&q=80" },
      { id: 3, name: "Fata with 5", price: 200, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlbmNoJTIwZnJpZXN8ZW58MHx8MHx8fDA%3D&w=1000&q=80" },
      { id: 4, name: "Fata with 6", price: 220, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHdpbmdzfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 5, name: "Fata with 7", price: 240, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHdpbmdzfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 6, name: "CFata with 8", price: 280, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHdpbmdzfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 7, name: "Fata with 9", price: 290, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHdpbmdzfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 8, name: "Fata with 10", price: 300, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHdpbmdzfGVufDB8fDB8fHww&w=1000&q=80" }
    ],
    FUL: [
      { id: 9, name: "Traditional Ful", price: 120, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnVsfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 10, name: "Ful with Egg", price: 150, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnVsfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 11, name: "Special Ful", price: 180, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnVsfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 12, name: "Ful Meselah", price: 200, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnVsfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 13, name: "Ful btesmi", price: 180, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnVsfGVufDB8fDB8fHww&w=1000&q=80" }
    ],
    JUICE: [
      { id: 14, name: "Avocado Juice", price: 130, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlc2glMjBqdWljZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 15, name: "Mango Juice", price: 150, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlc2glMjBqdWljZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 16, name: "Orange Juice", price: 180, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlc2glMjBqdWljZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 17, name: "Mixed Fruit Juice", price: 200, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlc2glMjBqdWljZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" }
    ],
    "ENJERA FOODS": [
      { id: 12, name: "Doro Wat", price: 250, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 13, name: "Key Wat", price: 150, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 14, name: "Shiro", price: 120, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 15, name: "Tegabino", price: 80, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 16, name: "Beyeaynet", price: 80, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 17, name: "Pasta", price: 80, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 18, name: "Egg frfr", price: 80, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 19, name: "Pasta Beatklt", price: 80, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 20, name: "Dnsh wet", price: 80, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" }
    ],
    OTHERS: [
      { id: 21, name: "Coffee", price: 30, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 22, name: "Tea", price: 20, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhfGVufDB8fDB8fHww&w=1000&q=80" },
      { id: 23, name: "Cake", price: 90, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 24, name: "Makiato", price: 90, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 25, name: "Cappucino", price: 90, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" },
      { id: 26, name: "Hot chocolate", price: 90, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" }
    ]
  };
  const topOrders = products.FATA.slice(0, 4);

  const addToCart = (product,price) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 , price:price}
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, price:price }];
    });
  };
 
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

const handleAuthChange = (e) => {
  setAuthUserForm({
    ...authUserForm,
    [e.target.name]: e.target.value
  });
};

const handleSignInChange = (e) => {
  setSignInForm({
    ...signInForm,
    [e.target.name]: e.target.value
  });
};

const handleSignUp = async (e) => {
  e.preventDefault();
  setAuthError('');
  setAuthSuccess('');

  // Basic validation
  if (authUserForm.password !== authUserForm.confirmPassword) {
    setAuthError('Passwords do not match');
    return;
  }

  if (authUserForm.password.length < 6) {
    setAuthError('Password must be at least 6 characters long');
    return;
  }

  try {
    const response = await fetch('http://localhost:27500/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: authUserForm.name,
        phone: authUserForm.phone,
        pwd: authUserForm.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      setAuthSuccess('Account created successfully! You can now sign in.');
      setAuthUserForm({ name: '', phone: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
      }, 2000);
    } else {
      setAuthError(data.message || 'Registration failed');
    }
  } catch (error) {
    setAuthError('Network error. Please try again.');
  }
};


const handleSignIn = async (e) => {
  e.preventDefault();
  setAuthError('');
  setAuthSuccess('');

  try {
    const response = await fetch('http://localhost:27500/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: signInForm.name,
        pwd: signInForm.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      setAuthSuccess('Login successful!');
      setSignInForm({ name: '', password: '' });
      login(data.user,data.token)
      setTimeout(() => {
        setIsSignInOpen(false);
        setAuthSuccess('');
      }, 1500);
    } else {
      setAuthError(data.message || 'Login failed');
    }
  } catch (error) {
    setAuthError('Network error. Please try again.');
  }
};

const closeAuthModals = () => {
  setIsSignUpOpen(false);
  setIsSignInOpen(false);
  setAuthError('');
  setAuthSuccess('');
  setAuthUserForm({ name: '', phone: '', password: '', confirmPassword: '' });
  setSignInForm({ name: '', password: '' });
};
  const renderCustomerView = () => (
    <ErrorBoundary>
      <Header 
        setIsSidebarOpen={setIsSidebarOpen}
        t={t} 
        setIsSignUpOpen={setIsSignUpOpen}
        setIsSignInOpen={setIsSignInOpen}
      />
      
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        t={t}
        topOrders={topOrders}
        setCurrentLanguage={setCurrentLanguage}
        currentLanguage={currentLanguage}
      />

      <Hero
        currentSlide={currentSlide}
        t={t}
        setCurrentSlide={setCurrentSlide}
      />

      <Menu 
        products={products}
        activeCategory={activeCategory}
        t={t}
        setActiveCategory={setActiveCategory}
        addToCart={addToCart}
      />

      <Testimonial 
        t={t}
      />

      <Contact 
        t={t}
        setContactForm={setContactForm}
        contactForm={contactForm}
      />

      <SignUp 
        isSignUpOpen={isSignUpOpen}
        closeAuthModals={closeAuthModals}
        authError={authError}
        authSuccess={authSuccess}
        setAuthError={setAuthError}
        setAuthSuccess={setAuthSuccess}
        setAuthUserForm={setAuthUserForm}
        t={t}
        authUserForm={authUserForm}
        handleAuthChange={handleAuthChange}
        setIsSignUpOpen={setIsSignUpOpen}
        setIsSignInOpen={setIsSignInOpen}
        handleSignUp={handleSignUp}
      />

      <SignIn
        isSignInOpen={isSignInOpen}
        closeAuthModals={closeAuthModals}
        handleSignIn={handleSignIn}
        authError={authError}
        authSuccess={authSuccess}
        t={t}
        setIsSignInOpen={setIsSignInOpen}
        signInForm={signInForm}
        handleSignInChange={handleSignInChange}
      />

      <Footer 
        t={t}
      />

      <Nav 
        t={t}
        setIsCartOpen={setIsCartOpen}
        setIsOrderOpen={setIsOrderOpen}
        cartItems={cartItems}
      />

      <CartSidebar 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        t={t}
        setCartItems={setCartItems}
        cartTotal={cartTotal}
        setOrders={setOrders}
        Orders={orders}
        setIsSignInOpen={setIsSignInOpen}
      />
  
      <OrderSidebar 
        isOrderOpen={isOrderOpen}
        setIsOrderOpen={setIsOrderOpen}
        orders={orders}
      />

      <Overlay
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        isOrderOpen={isOrderOpen}
        setIsOrderOpen={setIsOrderOpen}
        isSignUpOpen={isSignUpOpen}
        isSignInOpen={isSignInOpen}
        closeAuthModals={closeAuthModals}
      />
    </ErrorBoundary>
  );

  // FIX: Add loading state and proper conditional rendering
  const renderContent = () => {
    switch (currentView) {
      case 'driver':
        return <DriverDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'waiter':
        return <WaiterDashboard />;
      case 'customer':
      case 'home':
        return renderCustomerView();
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {renderContent()}
    </div>
  );
};

function MainApp() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default MainApp;