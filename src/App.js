import './App.css';
import MainTemplate from './components/MainTemplate/MainTemplate';
import Login from './components/Login/Login';
import Products from './components/MainProduct/products/Products';
import Product from './components/MainProduct/product/Product';
import AddProduct from './components/MainProduct/add-product/AddProduct';
import UpdateProduct from './components/MainProduct/update-product/UpdateProduct';
import Category from './components/MainCategory/category/Category';
import Orders from './components/Orders/Orders';
import UpdateOrder from './components/Orders/update-order/UpdateOrder';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoutes from './components/Login/ProtectedRoutes';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <MainTemplate></MainTemplate>
          <Routes>
            <Route exact path='/' element={<Login />} />
            <Route element={<ProtectedRoutes></ProtectedRoutes>}>
              <Route exact path='/products' element={<Products />} />
              <Route exact path='/product/:id' element={<Product />} />
              <Route exact path='/add-product' element={<AddProduct />} />
              <Route exact path='/edit-product/:id' element={<UpdateProduct />} />
              <Route exact path='/orders' element={<Orders />} />
              <Route exact path='/edit-order/:id' element={<UpdateOrder />} />
              <Route exact path='/:category' element={<Category />} />
            </Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;