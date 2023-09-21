import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import NavbarExample from './components/Navbar';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import { ImageTrack } from './components/images';
import LoginPage from './components/loginPage';
import Register from './components/RegisterPage';
import PageNotFound from './components/PageNotFound';
import HomePage from './components/homepage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <Router> 
      <NavbarExample/>
        <Routes> 
            <Route path='/' element={<ImageTrack />}> </Route>
            <Route path='/belepes' element={<LoginPage/>}>  </Route>
            <Route path='/regisztracio' element={<Register/>}>  </Route>
            <Route path='*' element={<PageNotFound/>}> </Route>
        </Routes>
    </Router>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
