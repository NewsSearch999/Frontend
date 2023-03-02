import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './page/Login';
import Signup from './page/Signup';
import Search from './page/Search';
import MainPage from './page/Main';
import MainHeader from './components/Header';

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <MainHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  );
}

export default App;
