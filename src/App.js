import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './general/home'
import Navbar from './general/navbar'
import Servicos from './servicos/servicos'
import './app.css'
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import Worker from './worker/worker';

const firebaseConfig = {
  apiKey: "AIzaSyAf2f0loUTxnN61Yrs6BGaQoljVVkm68cs",
  authDomain: "hustle-292f2.firebaseapp.com",
  projectId: "hustle-292f2",
  storageBucket: "hustle-292f2.appspot.com",
  messagingSenderId: "894454234209",
  appId: "1:894454234209:web:3e46fef21878c13e0fbe20",
  measurementId: "G-2H1BL2H0JL"
}

function App() {

  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route exact path="/servicos/:id" 
              element={<Servicos
                storage={storage}/>}
            />  
            <Route exact path="/trabalhador" 
              element={<Worker
                storage={storage}/>}
            />
            <Route path="/" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
