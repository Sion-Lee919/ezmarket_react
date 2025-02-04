//import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import CartList from './components/CartList';
import HeaderComponent from './components/HeaderComponent';
import ItemDetail from './components/ItemDetail';


function App() {

  return (
    <div>
      <BrowserRouter>
      <HeaderComponent/>
      <Routes>
        <Route path='/cart' element={<CartList/>}/>
        <Route path='/item/:itemid' element={<ItemDetail/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
