import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './page/Login';
import Signup from './page/Signup';
import Search from './page/Search';
import MainPage from './page/Main';
import MainHeader from './components/Header';
import { Myorder } from './page/Myorder';

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/myorders" element={<Myorder />} />
      </Routes>
    </div>
  );
}

export default App;
