import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Products from "./pages/products";
import Cart from "./pages/cart";
import NotFound from "./pages/notfound";
import ProductDetail from "./pages/productdetail/ProductDetail";
import { useContext } from "react";
import { GlobalState } from "./GlobalState";
import Categories from "./pages/categories";
import CreateProduct from "./pages/createproduct";
import OrderHistory from "./pages/orderhistory";
import OrderDetail from "./pages/orderdetail";

function App() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  console.log("isAdmin", isAdmin, "isLogged", isLogged);

  return (
    <div className="min-h-screen bg-secondary">
      <Router>
        <Header />
        <div className="max-w-7xl mx-auto py-5">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/detail/:id" element={<ProductDetail />} />
            <Route
              path="/login"
              element={!isLogged ? <Login /> : <NotFound />}
            />
            <Route
              path="/register"
              element={!isLogged ? <Register /> : <NotFound />}
            />
            <Route
              path="/history"
              element={isLogged ? <OrderHistory /> : <NotFound />}
            />{" "}
            <Route
              path="/history/:id"
              element={isLogged ? <OrderDetail /> : <NotFound />}
            />
            <Route
              path="/categories"
              element={isAdmin ? <Categories /> : <NotFound />}
            />
            <Route
              path="/create_product"
              element={isAdmin ? <CreateProduct /> : <NotFound />}
            />
            <Route
              path="/edit_product/:id"
              element={isAdmin ? <CreateProduct /> : <NotFound />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
