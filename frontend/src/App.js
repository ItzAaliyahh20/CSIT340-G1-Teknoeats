import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUp from './Signup';  // Your Sign Up component
import Login from './Login';    // Your Login component

function App() {
  return (
    <Router>
      {/* Your app's main layout, if needed (e.g., header could go here) */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />  {/* Default route for Sign Up */}
        <Route path="/login" element={<Login />} />  {/* Route for Login */}
      </Routes>
    </Router>
  );
}

export default App;