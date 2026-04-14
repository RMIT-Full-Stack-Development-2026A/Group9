import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
//import './index.css'
import App from './app/App.jsx'
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider } from './app/providers/AuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
=======
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
>>>>>>> origin/Khoa/Profile-Management-&-Game-History

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      <AuthProvider>
        <App />
      </AuthProvider>
=======
      <App />
>>>>>>> origin/Khoa/Profile-Management-&-Game-History
    </BrowserRouter>
  </StrictMode>,
)
