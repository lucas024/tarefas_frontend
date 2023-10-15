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
import Main from './servicos/main';
import Trabalho from './main/trabalho';
import AuthWorker from './auth/authWorker';
import Trabalhador from './main/trabalhador';
import Admin from './admin/admin';


import { useDispatch, useSelector } from 'react-redux'
import { 
        worker_update_profile_complete, 
        user_load,
        user_reset
      } from './store';


function App() {
  const api_url = "http://localhost:5200" //"https://docker-image-fixed-v2-z4uucaddha-ew.a.run.app"

  const dispatch = useDispatch()

  const user = useSelector(state => {return state.user})
  
  const [userGoogle, setUserGoogle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [userLoadAttempt, setUserLoadAttempt] = useState(false)
  const [hasTexts, setHasTexts] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(null)


onAuthStateChanged(auth, (user_google) => {
    if (user_google) {
      setUserGoogle(user_google)
    } else {
      setUserGoogle(null)
      dispatch(user_reset())
      setUserLoadAttempt(true)
    }
})

const checkWorkerComplete = (worker) => {
  if(worker.regioes?.length===0||worker.trabalhos?.length===0||worker.phone===""||worker.photoUrl===""||!worker.phone_verified||!worker.email_verified){
    dispatch(worker_update_profile_complete(false))
  }
  else{
    dispatch(worker_update_profile_complete(true))
  }
}

const updateChatReadLocal = chat_id => {
  let has = false
  if(user?.chats.length>0){
    let arr = user.chats
    for(let el of arr){
      if(el.chat_id === chat_id){
        if(user?.type===1){
          el.worker_read = true
        }
        else{
          el.user_read = true
        }
      }
      else{
        if(user?.type===1&&!el.worker_read){
          has=true
        }
        else if(user?.type===0&&!el.user_read){
          has=true
        }
      }
    }
    setHasTexts(has)
    dispatch(user_load(user))
  }
}

useEffect(() => {
  setLoading(true)
  if(userGoogle){
    axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
      if(res.data != null){
        dispatch(user_load(res.data))
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
            dispatch(user_load(res.data))
            if(res.data.subscription){
              setLoading(true)
              axios.post(`${api_url}/retrieve-subscription-and-schedule`, {
                  subscription_id: res.data.subscription.id,
                  schedule_id: res.data.subscription.sub_schedule
              })
              .then(res2 => {
                  if(res2.data.schedule){
                      if(new Date().getTime() < new Date(res2.data.schedule.current_phase?.end_date*1000)){
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
            checkWorkerComplete(res.data)
            
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
    dispatch(user_load(res.data))
  }
}

const refreshWorker = () => {
  window.history.replaceState({}, document.title)
  axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: userGoogle.uid} }).then(res => {
    if(res.data !== null){
      dispatch(user_load(res.data))
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

      //user complete
      checkWorkerComplete(res.data)


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
  dispatch(user_load(userAux))
  checkWorkerComplete(userAux)
}

  return (
    <div className="App">
      
        <BrowserRouter>
          <Navbar 
            hasTexts={hasTexts} 
            hasSubscription={hasSubscription}
            userLoadAttempt={userLoadAttempt}/>
          <Routes>
              <Route exact path="/main/publications/publication" 
                element={<Trabalho
                  refreshWorker={() => refreshWorker()}
                  api_url={api_url}
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/main/publications/trabalhador" 
                element={<Trabalhador
                  api_url={api_url}
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/main/publications/*" 
                element={<Main
                  api_url={api_url}
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/publicar/:editar/*" 
                key={'single'}
                element={<Publicar
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}
                  />}
              />
              <Route exact path="/publicar/novo/*" 
                key={'all'}
                element={<Publicar
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
                    hasSubscription={hasSubscription}
                    userLoadAttempt={userLoadAttempt}
                    updateChatReadLocal={chat_id => updateChatReadLocal(chat_id)}
                    api_url={api_url}
                    loadingHandler={bool => setLoading(bool)}
                    updateUser={(val, what) => updateUser(val, what)}
                    />
                }
              />
              <Route exact path="/authentication/worker" 
                element={<AuthWorker
                  refreshWorker={() => refreshWorker()}
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/authentication/*" 
                element={<Auth
                  api_url={api_url}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/admin/*" 
                element={<Admin 
                  api_url={api_url}
                  userLoadAttempt={userLoadAttempt}/>} />
              <Route path="/" 
                element={<Home
                  refreshUser={() => refreshUser()}
                  refreshWorker={() => refreshWorker()}
                  notifications={notifications}
                  userLoadAttempt={userLoadAttempt}/>} />
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
