import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './general/Home'
import Navbar from './general/Navbar'
import Servicos from './servicos/Servicos'
import './app.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route exact path="/servicos/:id" element={<Servicos/>}/>
            <Route path="/" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
