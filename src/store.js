import { createSlice, configureStore } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'slice',
  initialState: {
    user: {},
    user_google: {},
    search_context: null,
    search_scroll: 0,
    user_profile_complete: false,
    worker_profile_complete: false,
    worker_is_subscribed: false,
    user_subscription_active: false,
    user_admin_verified: false,
    api_url: "http://localhost:5200" //"https://docker-image-fixed-v2-z4uucaddha-ew.a.run.app"
  },
  reducers: {
    user_load: (state, action) => {
        state.user = action.payload
    },
    user_google_load: (state, action) => {
      state.user_google = action.payload
    },
    user_reset : (state) => {
      state.user = {
        "_id": null,
        "name": "",
        "surname": "",
        "phone": "",
        "email": "",
        "google_uid": null,
        "address": "",
        "photoUrl": "",
        "type": null,
        "email_verified": false,
        "admin": false,
        "chats": [],
        "trial": {}
      }
  },
    user_update_photo_and_phone: (state, action) => {
        state.user.photoUrl = action.payload.photo
        state.user.phone = action.payload.phone
    },
    user_update_phone: (state, action) => {
      state.user.phone = action.payload.phone
    },

    set_socket : (state, action) => {
      state.socket = action.payload.socket
    },
    user_update_chats: (state, action) => {
      state.user.chats = action.payload
    },
    user_update_field: (state, action) => {
      for(let el of action.payload)
      {
        state.user[el.field] = el.value
      }
    },
    search_save: (state, action) => {
        state.search_context = action.payload
    },
    search_scroll_save: (state, action) => {
        state.search_scroll = action.payload
    },
    user_update_subscription_active: (state, action) => {
      state.user_subscription_active = action.payload
    },
    user_update_admin_verified: (state, action) => {
      state.user_admin_verified = action.payload
    },
    user_update_profile_complete: (state, action) => {
      state.user_profile_complete = action.payload
    },


    ///////////////////////// worker
    worker_update_profile_complete: (state, action) => {
      state.worker_profile_complete = action.payload
    },
    worker_update_is_subscribed: (state, action) => {
      state.worker_is_subscribed = action.payload
    },
    worker_update_trial: (state, action) => {
      state.user.trial = action.payload
    },
  }
})

export const { 
    user_load,
    user_update_photo_and_phone, 
    user_reset, 
    user_update_phone, 
    set_socket, 
    user_update_chats,
    user_update_field,
    search_save,
    search_scroll_save,
    user_update_subscription_active,
    user_update_admin_verified,
    user_update_profile_complete,

    ////////////////////// worker
    worker_update_profile_complete,
    worker_update_is_subscribed,
    worker_update_trial,
  } = slice.actions


export const store = configureStore({
  reducer: slice.reducer
})
