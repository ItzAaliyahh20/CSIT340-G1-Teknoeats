import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layout";
import SignUp from './Signup';
import Login from './Login';

// ✅ Import your new pages
import Home from './app/homepage';
import Order from './app/order-page';
import Cart from './app/cart-page';
import Favorites from './app/favorites-page';
import Profile from './app/profile-page';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Redirect root to login if not logged in */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth pages */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Main pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
