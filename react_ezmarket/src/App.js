//import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/home';
import GoogleLoginButton from './components/GoogleLoginButton';


function App() {

  return (
  
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<GoogleLoginButton />} />
      </Routes>
    </Router>
  );
}

export default App;
