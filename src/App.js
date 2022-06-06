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
import User from './user/user';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  z-index: 11;
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
    setLoading(true)
    if(userGoogle){
      console.log(userGoogle);
      axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
        if(res.data !== null){
          console.log(res.data);
          setUser(res.data)
          setLoading(false)
        }
      }).catch(err => {
        setLoading(false)
        console.log(err)
      })
    }
    else{
      console.log("ayo");
      setLoading(false)
    }
  }, [userGoogle])

  const refreshUser = () => {
    setLoading(true)
    axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
      if(res.data !== null){
        console.log(res.data);
        setUser(res.data)
        setLoading(false)
      }
    }).catch(err => {
      setLoading(false)
      console.log(err)
    })
  }


  return (
    <div className="App">
      <div>
        <ClipLoader color={"#FF785A"} css={override} loading={loading} size={150} />
        {
          loading?
          <div className="frontdrop"></div>
          :null
        }
        
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
                  user={user}
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}
                  />}
              />
              <Route exact path="/user" 
                element={<User
                  user={user}
                  api_url={api_url}
                  loadingHandler={bool => setLoading(bool)}
                  refreshUser={() => refreshUser()}
                  />}
              />
              <Route exact path="/authentication/*" 
                element={<Auth
                  setUser = {user => setUser(user)}
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
