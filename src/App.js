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
  const [incompleteUser, setIncompleteUser] = useState(false)
  const [hasTexts, setHasTexts] = useState(false)


  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserGoogle(user)
    } else {
      setUserGoogle(null)
      setUser(null)
    }
  });

  const updateChatReadLocal = chat_id => {
    console.log("sim")
    let has = false
    if(user.chats.length>0){
      let arr = user.chats
      for(let el of arr){
        if(el.chat_id === chat_id){
          if(user.type===1){
            el.worker_read = true
          }
          else{
            el.user_read = true
          }
        }
        else{
          if(user.type===1&&!el.worker_read){
            console.log(chat_id);
            console.log(el)
            console.log(el.worker_read);
            has=true
          }
          else if(user.type===0&&!el.user_read){
            has=true
          }
        }
      }
      console.log(has);
      setHasTexts(has)
      setUser(user)
    }
  }


  useEffect(() => {
    setLoading(true)
    if(userGoogle){
      axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
        if(res.data !== null){
          setUser(res.data)
          if(res.data.chats.length>0){
            for(const el of res.data.chats){
              if(el.user_read){
                setHasTexts(true)
                break
              }
            }
          }
          if(res.data.regioes?.length===0||res.data.trabalhos?.length===0||res.data.phone===""||res.data.photoUrl===""){
            setIncompleteUser(true)
          }
          setUserLoadAttemp(true)
          setLoading(false)
        }
        else{
          axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: userGoogle.uid} }).then(res => {
            if(res.data !== null){
              setUser(res.data)
              if(res.data.chats.length>0){
                for(const el of res.data.chats){
                  if(!el.worker_read){
                    setHasTexts(true)
                    break
                  }
                }
              }
              if(res.data.regioes?.length===0||res.data.trabalhos?.length===0||res.data.phone===""||res.data.photoUrl===""){
                setIncompleteUser(true)
              }
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

  const refreshWorker = () => {
    axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: userGoogle.uid} }).then(res => {
      if(res.data !== null){
        console.log(res.data);
        setUser(res.data)
        setNotifications(res.data.notifications)
        if(res.data.regioes?.length===0||res.data.trabalhos?.length===0||res.data.phone===""||res.data.photoUrl===""){
          setIncompleteUser(true)
        }
        setUserLoadAttemp(true)
        setLoading(false)
      }
      else{
        setLoading(false)
      }
    })
  }

  const updateUser = (val, what) => {
    let userAux = user
    userAux[what] = val
    setUser(userAux)
    if(user.regioes?.length>0&&user.trabalhos?.length>0&&user.phone!==""&&user.photoUrl!==""){
      setIncompleteUser(false)
    }
  }

  return (
    <div className="App">
      <div>
        <Loader loading={loading}/>        
        <BrowserRouter>
          <Navbar user={user} hasTexts={hasTexts} incompleteUser={incompleteUser} userLoadAttempt={userLoadAttempt}/>
          <Routes>
              <Route exact path="/main/publications/publication" 
                element={<Reserva
                  refreshWorker={() => refreshWorker()}
                  user={user}
                  api_url={api_url}
                  incompleteUser={incompleteUser}
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
                  <User
                    refreshWorker={() => refreshWorker()}
                    incompleteUser={incompleteUser}
                    updateChatReadLocal={chat_id => updateChatReadLocal(chat_id)}
                    user={user}
                    api_url={api_url}
                    loadingHandler={bool => setLoading(bool)}
                    updateUser={(val, what) => updateUser(val, what)}
                    />
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
