import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DoorShop from "./pages/DoorShop";
import JewelleryShop from "./pages/JewelleryShop";
import CakeShop from "./pages/CakeShop";
import Shop from "./pages/Shop";
import ShopDetails from "./pages/ShopDetails";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import Error from "./pages/Error";
import ElectricShop from "./pages/ElectricShop";
import SunglassShop from "./pages/SunglassShop";
import CarPartShop from "./pages/CarPartShop";
import WatchShop from "./pages/WatchShop";
import CycleShop from "./pages/CycleShop";
import KidsClothingShop from "./pages/KidsClothingShop";
import BagShop from "./pages/BagShop";
import CcTvShop from "./pages/CcTvShop";
import BagShop2 from "./pages/BagShop2";
import Shop2 from "./pages/Shop2";

import Providers from "./pages/Providers/Providers.jsx";
import Products from "./pages/Products/Products.jsx";
import Purchases from "./pages/Purchases/Purchases.jsx";
import PurchasesReport from "./pages/Purchases/PurchasesReport.jsx";
import NewPurchasePage from "./pages/Purchases/newPurchase.jsx";

import Clients from "./pages/client/Clients.jsx";
import Discounts from "./pages/discount/Discount.jsx";
import Sales from "./pages/sale/Sale.jsx";

import Cakes from "./pages/Products/Cake.jsx";
import ShopProducts from "./pages/Products/shopProducts.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import DashboardMain from "./components/dashboard/DashboardMain.jsx";
import Role from "./pages/admin/Role.jsx";
import User from "./pages/admin/User.jsx";
import RoleDemo from "./pages/admin/RoleDemo.jsx";
import RoleDocumentation from "./pages/docs/RoleDocumentation.jsx";
import RoleTestDemo from "./components/demo/RoleTestDemo.jsx";
import { DiscountProvider } from "./context/DiscountContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import Inventory from "./pages/inventory/Inventory.jsx";
import Movement from "./pages/movement/Movement.jsx";
import AboutUs from "./pages/AboutUs.jsx";

/* === CRM imports === */
import RequireRoles from "./routes/RequireRoles"; // <-- sin extensión para evitar fallo con Vite
import CRMLayout from "./pages/crm/CRMLayout.jsx";
import CRMHome from "./pages/crm/CRMHome.jsx";
import ClientsCRM from "./pages/crm/ClientsCRM.jsx";
import Opportunities from "./pages/crm/Opportunities.jsx";
import Quotes from "./pages/crm/quote/Quotes.jsx";
import Offers from "./pages/crm/Offers.jsx";
import Suggestions from "./pages/crm/Suggestions.jsx";
import Activities from "./pages/crm/Activities.jsx";
import Campaigns from "./pages/crm/Campaigns.jsx";
import Reports from "./pages/crm/Reports.jsx";

function App() {
  return (
    <DiscountProvider>
      <CartProvider>
        <ProductProvider>
          <Router>
            <Routes>
              {/* Público / e-commerce */}
              <Route path="/" element={<Cakes />} />

              {/* Dashboard protegido - acceso solo con login */}
              <Route
                path="/dashboard"
                element={
                  <RequireRoles roles={["ADMINISTRADOR", "VENDEDOR", "GERENTE_MERCADEO"]}>
                    <DashboardMain />
                  </RequireRoles>
                }
              />

              <Route path="/jewellery-shop" element={<JewelleryShop />} />
              <Route path="/cake-shop" element={<CakeShop />} />
              <Route path="/electric-shop" element={<ElectricShop />} />
              <Route path="/sunglass-shop" element={<SunglassShop />} />
              <Route path="/car-part-shop" element={<CarPartShop />} />
              <Route path="/watch-shop" element={<WatchShop />} />
              <Route path="/cycle-shop" element={<CycleShop />} />
              <Route path="/kids-cloth-shop" element={<KidsClothingShop />} />
              <Route path="/bag-shop" element={<BagShop />} />
              <Route path="/bag-shop-2" element={<BagShop2 />} />
              <Route path="/cctv-shop" element={<CcTvShop />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop-2" element={<Shop2 />} />
              <Route path="/shopDetails" element={<ShopDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<Account />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blogDetails" element={<BlogDetails />} />
              <Route path="/contact" element={<Contact />} />

              {/* === RUTAS PARA VENDEDORES Y ADMINISTRADORES === */}
              <Route
                path="/clients"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Clients />
                  </RequireRoles>
                }
              />
              <Route
                path="/sales"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Sales />
                  </RequireRoles>
                }
              />
              <Route
                path="/products"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Products />
                  </RequireRoles>
                }
              />
              <Route
                path="/cakes"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Cakes />
                  </RequireRoles>
                }
              />
              <Route
                path="/shopProducts"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <ShopProducts />
                  </RequireRoles>
                }
              />

              {/* === RUTAS PARA VENDEDOR Y ADMINISTRADOR === */}
              <Route
                path="/providers"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Providers />
                  </RequireRoles>
                }
              />
              <Route
                path="/inventory"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Inventory />
                  </RequireRoles>
                }
              />
              <Route
                path="/movement"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Movement />
                  </RequireRoles>
                }
              />
              <Route
                path="/purchases"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Purchases />
                  </RequireRoles>
                }
              />
              <Route
                path="/reportPurchases"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <PurchasesReport />
                  </RequireRoles>
                }
              />
              <Route
                path="/newPurchase"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <NewPurchasePage />
                  </RequireRoles>
                }
              />
              <Route
                path="/discounts"
                element={
                  <RequireRoles roles={["VENDEDOR", "ADMINISTRADOR"]}>
                    <Discounts />
                  </RequireRoles>
                }
              />

              {/* === RUTAS SOLO PARA ADMINISTRADORES === */}
              <Route
                path="/role"
                element={
                  <RequireRoles roles={["ADMINISTRADOR"]}>
                    <Role />
                  </RequireRoles>
                }
              />
              <Route
                path="/user"
                element={
                  <RequireRoles roles={["ADMINISTRADOR"]}>
                    <User />
                  </RequireRoles>
                }
              />

              {/* === RUTAS PÚBLICAS (sin restricción) === */}
              <Route path="/aboutUs" element={<AboutUs />} />
              <Route path="/role-demo" element={<RoleDemo />} />
              <Route path="/role-test" element={<RoleTestDemo />} />
              <Route path="/role-docs" element={<RoleDocumentation />} />

              {/* === CRM: pantalla y layout propios === */}
              <Route
                path="/crm"
                element={
                  <RequireRoles roles={["ADMINISTRADOR", "GERENTE_MERCADEO"]}>
                    <CRMLayout />
                  </RequireRoles>
                }
              >
                <Route index element={<CRMHome />} />
                <Route path="quotes" element={<Quotes />} />
                <Route path="clients" element={<ClientsCRM />} />
                <Route path="opportunities" element={<Opportunities />} />
                <Route path="offers" element={<Offers />} />
                <Route path="suggestions" element={<Suggestions />} />
                <Route path="activities" element={<Activities />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="reports" element={<Reports />} />
              </Route>

              <Route path="*" element={<Error />} />
            </Routes>
          </Router>
        </ProductProvider>
      </CartProvider>
    </DiscountProvider>
  );
}

export default App;
