import React, { useState, useEffect } from 'react';
import './App.css';
import dosaImage from './assets/dosa.jpeg';
import idlyImage from './assets/idly.png';
import paneerTikkaImage from './assets/paneer-tikka.jpg';
import vegManchurianImage from './assets/veg-manchurian.jpg';
import chickenBiryaniImage from './assets/chicken-biryani.jpg';
import vegPulaoImage from './assets/veg-pulao.jpg';
import gulabJamunImage from './assets/gulab-jamun.jpg';
import halwaImage from './assets/halwa.jpg';
import lassiImage from './assets/lassi.jpg';
import masalaChaiImage from './assets/masala-chai.jpg';

const menu = [
  {name:'Dosa', price:7, category:'tiffin',image: dosaImage, veg: true},        
  {name:'Idly', price:5, category:'tiffin',image: idlyImage, veg: true},        
  {name:'Paneer Tikka', price:10, category:'starter',image: paneerTikkaImage, veg: true}, 
  {name:'Veg Manchurian', price:12, category:'starter',image: vegManchurianImage, veg: true},
  {name:'Chicken Biryani', price:15, category:'main course',image: chickenBiryaniImage, veg: false}, 
  {name:'Veg Pulao', price:12, category:'main course',image: vegPulaoImage, veg: true},
  {name:'Gulab Jamun', price:3, category:'dessert', image: gulabJamunImage,veg: true}, 
  {name:'Halwa', price:5, category:'dessert',image: halwaImage, veg: true},
  {name:'Lassi', price:5, category:'beverage',image: lassiImage, veg: true},
  {name:'Masala Chai', price:2, category:'beverage',image: masalaChaiImage, veg: true}, 
];

const priceRanges = [
  { label: 'Under $2', max: 2 },
  { label: '$2 - $5', min: 2, max: 5 },
  { label: '$5 - $10', min: 5, max: 10 },
  { label: '$10 - $12', min: 10, max: 12 },
  { label: 'Over $12', min: 12 }
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [isVeg, setIsVeg] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tableNumber, setTableNumber] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const sessionDuration = 2 * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (sessionStart) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = sessionStart + sessionDuration;
        const remaining = endTime - now;
        if (remaining <= 0) {
          resetSession();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionStart]);

  const startOrdering = () => {
    const randomTable = Math.floor(Math.random() * 10) + 1;
    setTableNumber(randomTable);
    setSessionStart(new Date().getTime());
    setCart([]);
  };

  const resetSession = () => {
    setTableNumber(null);
    setSessionStart(null);
    setTimeLeft(0);
    setCart([]);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const categories = ['all', ...new Set(menu.map(item => item.category))];

  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesVeg = !isVeg || item.veg;
    const matchesPrice = selectedPrices.length === 0 || 
      selectedPrices.some(range => {
        const price = item.price;
        return (
          (range.min ? price >= range.min : true) &&
          (range.max ? price <= range.max : true)
        );
      });

    return matchesSearch && matchesCategory && matchesVeg && matchesPrice;
  });

  const addToCart = (item) => {
    handleItemClick(item); // Show popup first
  };

  const updateQuantity = (item, delta) => {
    setCart(prev => {
      const newCart = prev.map(i => {
        if(i.name === item.name) {
          const newQuantity = i.quantity + delta;
          return newQuantity > 0 ? {...i, quantity: newQuantity} : null;
        }
        return i;
      }).filter(Boolean);
      return newCart;
    });
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const addToCartWithQuantity = () => {
    if(selectedItem) {
      setCart(prev => {
        const existing = prev.find(i => i.name === selectedItem.name);
        if(existing) {
          return prev.map(i => 
            i.name === selectedItem.name 
              ? {...i, quantity: i.quantity + quantity} 
              : i
          );
        }
        return [...prev, {...selectedItem, quantity}];
      });
      setSelectedItem(null);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!tableNumber) {
    return (
      <div className="start-screen">
        <h2>Welcome to the Restaurant</h2>
        <button onClick={startOrdering}>Start Ordering</button>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Restaurant Menu</h1>
        <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
          🛒
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </div>
      </nav>

      <div className="session-info">
        <p><strong>Table:</strong> {tableNumber}</p>
        <p><strong>Time Left:</strong> {formatTime(timeLeft)}</p>
      </div>

      <div className="main-content">
        <div className="filters">
          <div className="filter-section">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <h3>Price</h3>
            {priceRanges.map((range, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={selectedPrices.some(r => r.label === range.label)}
                  onChange={() => {
                    setSelectedPrices(prev => 
                      prev.some(r => r.label === range.label)
                        ? prev.filter(r => r.label !== range.label)
                        : [...prev, range]
                    );
                  }}
                />
                {range.label}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h3>Veg/Non-Veg</h3>
            <div className="veg-toggle">
              <button
                className={isVeg ? 'active' : ''}
                onClick={() => setIsVeg(true)}
              >
                Veg
              </button>
              <button
                className={!isVeg ? 'active' : ''}
                onClick={() => setIsVeg(false)}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>

        <div className="menu-content">
          <div className="category-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="menu-items">
            {filteredMenu.map(item => (
              <div key={item.name} className="menu-item" onClick={() => handleItemClick(item)}>
               <img src={item.image} alt={item.name} className="menu-image" />
                <h3>{item.name}</h3>
                <div className="price">${item.price}</div>
                <div className="category">{item.category}</div>
                <button onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}>Add to cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="popup-overlay">
          <div className="quantity-popup">
            <h3>{selectedItem.name}</h3>
            <div className="price">${selectedItem.price.toFixed(2)}</div>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <div className="popup-buttons">
              <button className="cancel" onClick={() => setSelectedItem(null)}>Cancel</button>
              <button className="add" onClick={addToCartWithQuantity}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="cart-overlay">
          <div className="cart-header">
            <h2>Your Order ({totalItems})</h2>
            <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
          </div>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.name} className="cart-item">
                  <div>
                    <h4>{item.name}</h4>
                    <p>${item.price} x {item.quantity}</p>
                  </div>
                  <div className="cart-controls">
                    <button onClick={() => updateQuantity(item, -1)}>-</button>
                    <button onClick={() => updateQuantity(item, 1)}>+</button>
                  </div>
                </div>
              ))}
              <div className="total">
                <h3>Total: ${totalAmount}</h3>
                <button onClick={async () => {
  try {
    const timestamp = new Date().toISOString();
    const orderId = `T${tableNumber}_${timestamp.replace(/[-:T.Z]/g, '').slice(0, 14)}`;

    const payload = {
      orderId,
      timestamp,
      tableNumber,
      cart: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: totalAmount
    };

    const response = await fetch(process.env.REACT_APP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Order failed');

    const result = await response.json();
    alert(`Order placed successfully! Order ID: ${result.orderId || orderId}`);
    resetSession();
  } catch (error) {
    alert('Failed to place order. Please try again.');
    console.error(error);
  }
}}>
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
