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
import Publicar from './user/publicar'
import Auth from './auth/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './firebase/firebase'
import axios from 'axios'
import User from './user/user';
import Main from './main/main';
import Loader from './general/loader';
import Trabalho from './main/trabalho';
import AuthWorker from './auth/authWorker';
import Trabalhador from './main/trabalhador';
import Admin from './admin/admin';

function App() {
  const api_url = "http://localhost:5200" //"https://docker-image-fixed-v2-z4uucaddha-ew.a.run.app"
  
  
  const [user, setUser] = useState(null)
  const [userGoogle, setUserGoogle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [userLoadAttempt, setUserLoadAttempt] = useState(false)
  const [incompleteUser, setIncompleteUser] = useState(false)
  const [hasTexts, setHasTexts] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(null)


onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserGoogle(user)
    } else {
      setUserGoogle(null)
      setUser(null)
      setUserLoadAttempt(true)
    }
});

const updateChatReadLocal = chat_id => {
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
          has=true
        }
        else if(user.type===0&&!el.user_read){
          has=true
        }
      }
    }
    setHasTexts(has)
    setUser(user)
  }
}


useEffect(() => {
  setLoading(true)
  if(userGoogle){
    axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
      if(res.data != null){
        setUser(res.data)
        if(res.data.chats?.length>0){
          for(const el of res.data.chats){
            if(el.user_read){
              setHasTexts(true)
              break
            }
          }
        }
        setUserLoadAttempt(true)
        setLoading(false)
      }
      else{
        axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: userGoogle.uid} }).then(res => {
          console.log('here')
          if(res.data !== null){
            setUser(res.data)
            if(res.data.subscription){
              setLoading(true)
              axios.post(`${api_url}/retrieve-subscription-and-schedule`, {
                  subscription_id: res.data.subscription.id,
                  schedule_id: res.data.subscription.sub_schedule
              })
              .then(res2 => {
                  if(res2.data.schedule){
                      if(new Date().getTime() < new Date(res2.data.schedule.current_phase.end_date*1000)){
                        setHasSubscription(true)
                      }
                  }
              })
            }
            else{
              setHasSubscription(false)
            }
            if(res.data.chats?.length>0){
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
            else{
              console.log('complete')
              setIncompleteUser(false)
            }
            setUserLoadAttempt(true)
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
  }
}, [userGoogle])

const refreshUser = async () => {
  window.history.replaceState({}, document.title)
  let res = await axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} })
  if(res.data !== null){
    setUser(res.data)
  }
}

const refreshWorker = () => {
  window.history.replaceState({}, document.title)
  axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: userGoogle.uid} }).then(res => {
    if(res.data !== null){
      setUser(res.data)
      if(res.data.subscription){
        setLoading(true)
        axios.post(`${api_url}/retrieve-subscription-and-schedule`, {
            subscription_id: res.data.subscription.id,
            schedule_id: res.data.subscription.sub_schedule
        })
        .then(res2 => {
            if(res2.data.schedule){
                if(new Date().getTime() < new Date(res2.data.schedule.current_phase.end_date*1000)){
                  setHasSubscription(true)
                }
            }
        })
      }
      else{
        setHasSubscription(false)
      }
      if(res.data.regioes?.length===0||res.data.trabalhos?.length===0||res.data.phone===""||res.data.photoUrl===""){
        setIncompleteUser(true)
      }
      else{
        setIncompleteUser(false)
      }
      setUserLoadAttempt(true)
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
    else{
      setIncompleteUser(true)
    }
  }

  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Navbar 
            user={user} 
            hasTexts={hasTexts} 
            hasSubscription={hasSubscription}
            incompleteUser={incompleteUser} 
            userLoadAttempt={userLoadAttempt}/>
          <Routes>
              <Route exact path="/main/publications/publication" 
                element={<Trabalho
                  refreshWorker={() => refreshWorker()}
                  user={user}
                  api_url={api_url}
                  incompleteUser={incompleteUser}
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/main/publications/trabalhador" 
                element={<Trabalhador
                  user={user}
                  api_url={api_url}
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/main/publications/*" 
                element={<Main
                  user={user}
                  api_url={api_url}
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/publicar/*" 
                element={<Publicar
                  user={user}
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}
                  />}
              />
              <Route exact path="/user" 
                element={
                  <User
                    refreshUser={() => refreshUser()}
                    refreshWorker={() => refreshWorker()}
                    incompleteUser={incompleteUser}
                    hasSubscription={hasSubscription}
                    userLoadAttempt={userLoadAttempt}
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
                  refreshWorker={() => refreshWorker()}
                  setUser = {user => setUser(user)}
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/authentication/*" 
                element={<Auth
                  setUser = {user => setUser(user)}
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/admin/*" 
                element={<Admin 
                  api_url={api_url}
                  user={user} 
                  userLoadAttempt={userLoadAttempt}/>} />
              <Route path="/" 
                element={<Home
                  refreshUser={() => refreshUser()}
                  refreshWorker={() => refreshWorker()}
                  user={user} 
                  notifications={notifications}
                  incompleteUser={incompleteUser}
                  userLoadAttempt={userLoadAttempt}/>} />
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
