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
        user_update_profile_complete,
        worker_update_profile_complete,
        worker_update_is_subscribed,
        user_load,
        user_reset,
      } from './store';
import ProtectedRoute from './protectedRoute';


function App() {
  const api_url = useSelector(state => {return state.api_url})

  const dispatch = useDispatch()
  
  const [userGoogle, setUserGoogle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [userLoadAttempt, setUserLoadAttempt] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

onAuthStateChanged(auth, (user_google) => {
    if (user_google) {
      setUserGoogle(user_google)
      setUserLoadAttempt(true)
      window.localStorage.setItem('loggedIn', true)
    } else {
      window.localStorage.setItem('loggedIn', false)
      setUserGoogle(null)
      dispatch(user_reset())
      setUserLoadAttempt(true)
    }
})

const checkWorkerComplete = (worker) => {
  if(worker.regioes?.length===0||worker.trabalhos?.length===0||worker.phone===""||worker.photoUrl===""||!worker.phone_verified||!worker.email_verified)
    dispatch(worker_update_profile_complete(false))
  else
    dispatch(worker_update_profile_complete(true))
}

const checkUserComplete = (user) => {
  if(!user.phone_verified||!user.email_verified)
    dispatch(user_update_profile_complete(false))
  else
    dispatch(user_update_profile_complete(true))
}

useEffect(() => {
  setLoading(true)
  if(userGoogle){
    axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle.uid} }).then(res => {
      if(res.data != null){
        dispatch(user_load(res.data))
        setIsAdmin(res.data.admin)
        checkUserComplete(res.data)
        setUserLoadAttempt(true)
        setLoading(false)
      }
      else{
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
                      if(new Date().getTime() < new Date(res2.data.schedule.current_phase?.end_date*1000)){
                        dispatch(worker_update_is_subscribed(true))
                      }
                  }
              })
            }
            else if(new Date(res.data.trial?.end_date) > new Date())
            {
              dispatch(worker_update_is_subscribed(true))
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
    checkUserComplete(res.data)
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
                  dispatch(worker_update_is_subscribed(true))
                }
            }
        })
      }
      else if(new Date(res.data.trial?.end_date) > new Date())
      {
        dispatch(worker_update_is_subscribed(true))
      }
      else{
        dispatch(worker_update_is_subscribed(false))
      }

      //worker complete
      checkWorkerComplete(res.data)
      setUserLoadAttempt(true)
      setLoading(false)
    }
    else{
      setLoading(false)
    }
  })
}

  return (
    <div className="App">
      
        <BrowserRouter>
          <Navbar 
            userLoadAttempt={userLoadAttempt}/>
          <Routes>
              <Route exact path="/main/publications/publication" 
                element={<Trabalho
                  refreshWorker={() => refreshWorker()}
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/main/publications/trabalhador" 
                element={<Trabalhador
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/main/publications/*" 
                element={<Main
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/publicar/:editar/*" 
                key={'single'}
                element={
                  <ProtectedRoute
                    redirectPath='/'
                    isAllowed={
                      window.localStorage.getItem('loggedIn')
                    }>
                    <Publicar
                      loading={loading}
                      loadingHandler={bool => setLoading(bool)}
                      />
                  </ProtectedRoute>
                  }
              />
              <Route exact path="/publicar/novo/*" 
                key={'all'}
                element={
                  <ProtectedRoute
                    redirectPath='/'
                    isAllowed={
                      window.localStorage.getItem('loggedIn')
                    }>
                    <Publicar
                      loading={loading}
                      loadingHandler={bool => setLoading(bool)}
                      />
                  </ProtectedRoute>
                  }
              />
              <Route exact path="/user" 
                element={
                  <ProtectedRoute
                    redirectPath='/'
                    isAllowed={
                      window.localStorage.getItem('loggedIn')
                    }>
                    <User
                      refreshUser={() => refreshUser()}
                      refreshWorker={() => refreshWorker()}
                      userLoadAttempt={userLoadAttempt}
                      loadingHandler={bool => setLoading(bool)}
                      />
                  </ProtectedRoute>
                }
              />
              <Route exact path="/authentication/worker" 
                element={<AuthWorker
                  refreshWorker={() => refreshWorker()}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/authentication/*" 
                element={<Auth
                  refreshUser={() => refreshUser()}
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/admin/*" 
                element={
                  <ProtectedRoute
                    redirectPath='/'
                    isAllowed={
                      window.localStorage.getItem('loggedIn')&&isAdmin
                    }>
                    <Admin 
                        userLoadAttempt={userLoadAttempt}/>
                  </ProtectedRoute>
                } />
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
