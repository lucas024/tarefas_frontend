import { createSlice, configureStore } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'slice',
  initialState: {
    user: {},
    user_google: {},
    search_context: null,
    search_scroll: 0,
    worker_profile_complete: false,
    user_subscription_active: false,
    user_admin_verified: false,
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
        "name": null,
        "surname": null,
        "phone": null,
        "email": null,
        "google_uid": null,
        "address": null,
        "photoUrl": null,
        "type": null,
        "email_verified": false,
        "admin": true,
        "chats": []
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
    search_save: (state, action) => {
        state.search_context = action.payload
    },
    search_scroll_save: (state, action) => {
        state.search_scroll = action.payload
    },
    worker_update_profile_complete: (state, action) => {
      state.worker_profile_complete = action.payload
    },
    user_update_subscription_active: (state, action) => {
      state.user_subscription_active = action.payload
    },
    user_update_admin_verified: (state, action) => {
      state.user_admin_verified = action.payload
    }
  }
})

export const { 
    user_load,
    user_update_photo_and_phone, 
    user_reset, 
    user_update_phone, 
    set_socket, 
    user_update_chats, 
    search_save,
    search_scroll_save,
    worker_update_profile_complete,
    user_update_subscription_active,
    user_update_admin_verified
  } = slice.actions


export const store = configureStore({
  reducer: slice.reducer
})
