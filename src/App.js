import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './general/home'
import Navbar from './general/navbar'
import Servicos from './servicos/servicos'
import './app.css'
import Worker from './worker/worker';
import UserReservationPage from './interaction/userReservationPage'
import Auth from './auth/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './firebase/firebase'
import axios from 'axios'
import ClipLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  z-index: 4;
  left: calc(50% - 75px);
  top: calc(50% - 75px);
`;


function App() {
  const api_url = "http://localhost:5000"
  
  const [user, setUser] = useState(null)
  const [userGoogle, setUserGoogle] = useState(null)
  const [loading, setLoading] = useState(false)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserGoogle(user)
    } else {
      setUserGoogle(null)
      setUser(null)
    }
  });
  

  useEffect(() => {
    if(userGoogle && !user){
      axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
        if(res.data == null){
          axios.post(`${api_url}/auth/register`, 
              {
                  name: userGoogle.displayName,
                  phone: "",
                  email: userGoogle.email,
                  google_uid: userGoogle.uid,
                  address: "",
                  photoUrl: userGoogle.photoURL
              }).then(result => {
                setUser(result.data.ops[0])
                setLoading(false)
              })
        }
        else{
          setUser(res.data)
          setLoading(false)
        }
    })
    }
    else{
      setLoading(false)
    }
  }, [userGoogle])


  return (
    <div className="App">
      <div>
        <ClipLoader color={"#FF785A"} css={override} loading={loading} size={150} />
        <BrowserRouter>
          <Navbar user={user} />
          <Routes>
              <Route exact path="/servicos/:id" 
                element={<Servicos
                  />}
              />  
              <Route exact path="/trabalhador" 
                element={<Worker
                  />}
              />
              <Route exact path="/reserva/*" 
                element={<UserReservationPage
                  />}
              />
              <Route exact path="/authentication/*" 
                element={<Auth
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/" element={<Home/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
