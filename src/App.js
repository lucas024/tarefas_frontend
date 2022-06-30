import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from './general/home'
import Navbar from './general/navbar'
import './app.css'
import UserReservationPage from './interaction/userReservationPage'
import Auth from './auth/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './firebase/firebase'
import axios from 'axios'
import User from './user/user';
import ProtectedRoute from './protectedRoute';
import Main from './main/main';
import Loader from './general/loader';
import Reserva from './main/reserva';
import AuthWorker from './auth/authWorker';


function App() {
  const api_url = "http://localhost:5000"
  
  const [user, setUser] = useState(null)
  const [userGoogle, setUserGoogle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [userLoadAttempt, setUserLoadAttemp] = useState(false)

  

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserGoogle(user)
    } else {
      setUserGoogle(null)
      setUser(null)
    }
  });

  const updateLocalNotifications = notification_id => {
    let arr = [...notifications]
    arr.splice(arr.indexOf(notification_id), 1)
    setNotifications(arr)
  }


  

  useEffect(() => {
    setLoading(true)
    if(userGoogle){
      axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
        if(res.data !== null){
          setUser(res.data)
          setNotifications(res.data.notifications)
          setUserLoadAttemp(true)
          setLoading(false)
        }
        else{
          axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: userGoogle.uid} }).then(res => {
            if(res.data !== null){
              setUser(res.data)
              setNotifications(res.data.notifications)
              setUserLoadAttemp(true)
              setLoading(false)
            }
            else{
              setLoading(false)
            }
          })
        }
      }).catch(err => {
        setLoading(false)
      })
    }
    else{
      setLoading(false)
      setUserLoadAttemp(true)
    }
  }, [userGoogle])

  const refreshUser = () => {
    setLoading(true)
    axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
      if(res.data !== null){
        setUser(res.data)
        setLoading(false)
      }
    }).catch(err => {
      setLoading(false)
    })
  }


  return (
    <div className="App">
      <div>
        <Loader loading={loading}/>        
        <BrowserRouter>
          <Navbar user={user} notifications={notifications} userLoadAttempt={userLoadAttempt}/>
          <Routes>
              <Route exact path="/main/publications/publication" 
                element={<Reserva
                  user={user}
                  api_url={api_url}
                  />}
              />
              <Route exact path="/main/publications/*" 
                element={<Main
                  user={user}
                  api_url={api_url}
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
                element={
                <ProtectedRoute user={user}>
                  <User
                    notifications={notifications}
                    updateNotification={not_id => updateLocalNotifications(not_id)}
                    user={user}
                    api_url={api_url}
                    loadingHandler={bool => setLoading(bool)}
                    refreshUser={() => refreshUser()}
                    />
                </ProtectedRoute>
                }
              />
              <Route exact path="/authentication/worker" 
                element={<AuthWorker
                  setUser = {user => setUser(user)}
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route exact path="/authentication" 
                element={<Auth
                  setUser = {user => setUser(user)}
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/" element={<Home user={user} notifications={notifications} userLoadAttempt={userLoadAttempt}/>} />
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
