import React, { useState } from 'react';

const menu = [
  {name:'Dosa', price:99, category:'tiffin'},
  {name:'Idly', price:45, category:'tiffin'},
  {name:'Paneer Tikka', price:199, category:'starter'},
  {name:'Veg Manchurian', price:199, category:'starter'},
  {name:'Chicken Biryani', price:249, category:'main course'},
  {name:'Veg Pulao', price:199, category:'main course'},
  {name:'Gulab Jamun', price:65, category:'dessert'},
  {name:'Halwa', price:99, category:'dessert'},
  {name:'Lassi', price:99, category:'beverage'},
  {name:'Masala Chai', price:49, category:'beverage'},
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  // Get unique categories
  const categories = ['all', ...new Set(menu.map(item => item.category))];

  // Filter menu items
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart functions
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if(existing) {
        return prev.map(i => 
          i.name === item.name ? {...i, quantity: i.quantity + 1} : i
        );
      }
      return [...prev, {...item, quantity: 1}];
    });
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

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="app">
      {/* Search and Filters */}
      <div className="controls">
        <input 
          type="text" 
          placeholder="Search dishes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Menu Display */}
      <div className="menu">
        <h2>Menu</h2>
        <div className="menu-items">
          {filteredMenu.map(item => (
            <div key={item.name} className="menu-item">
              <h3>{item.name}</h3>
              <p>₹{item.price} • {item.category}</p>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="cart">
        <h2>Your Order</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.name} className="cart-item">
                <div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price} x {item.quantity}</p>
                </div>
                <div className="cart-controls">
                  <button onClick={() => updateQuantity(item, -1)}>-</button>
                  <button onClick={() => updateQuantity(item, 1)}>+</button>
                </div>
              </div>
            ))}
            <div className="total">
              <h3>Total: ₹{totalAmount}</h3>
              <button onClick={() => alert(`Total Amount: ₹${totalAmount}`)}>
                Generate Bill
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;