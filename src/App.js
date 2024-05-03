import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from './general/home.js'
import Navbar from './general/navbar.js'
import Publicar from './user/publicar'
import Auth from './auth/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './firebase/firebase'
import axios from 'axios'
import User from './user/user';
import Main from './servicos/main';
import Trabalho from './main/trabalho';
import AuthWorker from './auth/authWorker';
import Profissional from './main/profissional';
import Admin from './admin/admin';


import { useDispatch, useSelector } from 'react-redux'
import { 
        worker_update_profile_complete,
        worker_update_is_subscribed,
        user_load,
        user_reset,
        user_update_phone_verified,
        user_update_email_verified
      } from './store';
import ProtectedRoute from './protectedRoute';
import ConfirmEmail from './general/confirmEmail';


function App() {
  const api_url = useSelector(state => {return state.api_url})
  const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})
  const user = useSelector(state => {return state.user})

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
      window.localStorage.setItem('loggedIn', 1)
    } else {
      window.localStorage.setItem('loggedIn', 0)
      setUserGoogle(null)
      dispatch(user_reset())
      setUserLoadAttempt(true)
    }
})

const checkWorkerComplete = (worker, userGoogle) => {
  // if(worker.regioes?.length===0||worker.trabalhos?.length===0||userGoogle?.phoneNumber === null||userGoogle?.emailVerified === false)
  if(worker.regioes?.length===0||worker.trabalhos?.length===0||userGoogle?.emailVerified === false)
  {
    dispatch(worker_update_profile_complete(false))
    if(worker.state!==0)
        axios.post(`${api_url}/worker/update_state`, {state: 0, user_id: worker._id})
  }
  else
  {
    dispatch(worker_update_profile_complete(true))
    if(worker.state!==1 && worker_is_subscribed)
        axios.post(`${api_url}/worker/update_state`, {state: 1, user_id: worker._id})
  }

  if(userGoogle?.emailVerified === true)
  {
    dispatch(user_update_email_verified(true))
    if(worker.email_verified === false)
    {
      axios.post(`${api_url}/worker/verify_email`, {user_id: worker._id})
    }
  }
}

const checkUserComplete = (user_google, user_mongo) => {
  //phone
  if(user_google?.phoneNumber != null) dispatch(user_update_phone_verified(true))
  else dispatch(user_update_phone_verified(true))
  // else dispatch(user_update_phone_verified(false))
  //email
  if(user_google?.emailVerified === true)
  {
    dispatch(user_update_email_verified(true))
    if(user_mongo.email_verified === false)
    {
      axios.post(`${api_url}/user/verify_email`, {user_id: user_mongo._id})
    }
  }
  else dispatch(user_update_email_verified(false))
}

useEffect(() => {
  setLoading(true)
  if(userGoogle){
    axios.get(`${api_url}/auth/get_user`, { params: {google_uid: userGoogle?.uid} }).then(res => {
      if(res.data != null){
        dispatch(user_load(res.data))
        setIsAdmin(res.data.admin)
        checkUserComplete(userGoogle, res.data)
        setUserLoadAttempt(true)
        setLoading(false)
      }
      else{
        axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: userGoogle?.uid} }).then(res => {
          if(res.data !== null){
            console.log(res.data)
            dispatch(user_load(res.data))
            checkUserComplete(userGoogle)
            if(res.data.subscription){
              setLoading(true)
              axios.post(`${api_url}/retrieve-subscription-and-schedule`, {
                  subscription_id: res.data.subscription.id,
                  schedule_id: res.data.subscription.sub_schedule
              })
              .then(res2 => {
                  if(res2.data.schedule){
                      console.log("1")
                      if(new Date().getTime() < new Date(res2.data.schedule.current_phase?.end_date*1000)){
                        dispatch(worker_update_is_subscribed(true))
                      }
                      else{
                        dispatch(worker_update_is_subscribed(false))
                        if(res.data.state!==0)
                          axios.post(`${api_url}/worker/update_state`, {state: 0, user_id: res.data._id})
                      }
                  }
              })
            }
            else if(new Date(res.data.trial?.end_date) > new Date())
            {
              console.log("2")
              dispatch(worker_update_is_subscribed(true))
            }
            else
            {
              dispatch(worker_update_is_subscribed(false))
              if(res.data.state!==0)
                axios.post(`${api_url}/worker/update_state`, {state: 0, user_id: res.data._id})
            }
            checkWorkerComplete(res.data, userGoogle)
            setUserLoadAttempt(true)
            setLoading(false)
          }
          else{
            console.log("3")
            dispatch(worker_update_is_subscribed(false))
            setLoading(false)
          }
        })
      }
    }).catch(err => {
      setLoading(false)
    })
  }
  else{
    dispatch(worker_update_is_subscribed(false))
    setLoading(false)
  }
}, [userGoogle])

const refreshWorker = () => {
  window.history.replaceState({}, document.title)
  axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: userGoogle?.uid} }).then(res => {
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
                  console.log("4")
                  dispatch(worker_update_is_subscribed(true))
                }
            }
        })
      }
      else if(new Date(res.data.trial?.end_date) > new Date())
      {
        console.log("5")
        dispatch(worker_update_is_subscribed(true))
      }
      else{
        dispatch(worker_update_is_subscribed(false))
      }

      //worker complete
      checkWorkerComplete(res.data, userGoogle)
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
              <Route exact path="/confirm-email" 
                element={<ConfirmEmail/>}
              />
              <Route exact path="/main/publications/publication" 
                element={<Trabalho
                  refreshWorker={() => refreshWorker()}
                  userLoadAttempt={userLoadAttempt}
                  />}
              />
              <Route exact path="/main/publications/profissional" 
                element={<Profissional
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
                      user?.type===0&&
                      parseInt(window.localStorage.getItem('loggedIn'))
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
                      user?.type===0&&
                      parseInt(window.localStorage.getItem('loggedIn'))
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
                      parseInt(window.localStorage.getItem('loggedIn'))
                    }>
                    <User
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
                  loading={loading}
                  loadingHandler={bool => setLoading(bool)}/>}
              />
              <Route path="/admin/*" 
                element={
                  <ProtectedRoute
                    redirectPath='/'
                    isAllowed={
                      parseInt(window.localStorage.getItem('loggedIn'))&&isAdmin
                    }>
                    <Admin 
                        userLoadAttempt={userLoadAttempt}/>
                  </ProtectedRoute>
                } />
              <Route path="/" 
                element={<Home
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
