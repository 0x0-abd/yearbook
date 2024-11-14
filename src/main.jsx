import { createRoot } from 'react-dom/client'
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import './config/firebase.js'
import Home from './pages/Home.jsx'
import './index.css'
import { UserProvider } from './config/userContext.jsx';
import App from './App.jsx';


createRoot(document.getElementById('root')).render(
  <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </UserProvider>,
)
