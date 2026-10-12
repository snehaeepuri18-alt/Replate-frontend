import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ListingProvider } from './context/ListingContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ListingProvider>
          <CartProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </CartProvider>
        </ListingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)