//import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import CartList from './components/CartList';
import HeaderComponent from './components/HeaderComponent';
import ItemDetail from './components/ItemDetail';
import SearchResultComponent from './components/SearchResultComponent';
import BrandPage from './components/BrandPage';

function App() {

  return (
    <div>
      <BrowserRouter>
      <HeaderComponent/>
      <Routes>
        <Route path='/cart' element={<CartList/>}/>
        <Route path='/item/:itemid' element={<ItemDetail/>}/>
        <Route path='/search' element={<SearchResultComponent/>}/>
        <Route path='/brand/:id' element={<BrandPage/>}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
