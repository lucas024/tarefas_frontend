import { createSlice, configureStore } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'slice',
  initialState: {
    user: {},
    user_google: {},
    search_context: null,
    search_scroll: null,
    user_email_verified: false,
    user_phone_verified: true,
    worker_profile_complete: false,
    worker_is_subscribed: false,
    user_subscription_active: false,
    user_admin_verified: false,
    chats: [],

    //
    //LOCALHOST
    // api_url: "http://localhost:5200",

    //LIVE
    api_url: "https://vender-344408.ew.r.appspot.com",
    //
  },
  reducers: {
    user_load: (state, action) => {
        state.user = action.payload
    },
    user_google_load: (state, action) => {
      state.user_google = action.payload
    },
    user_reset : (state) => {
      state.user = null
    },
    user_update_photo_and_phone: (state, action) => {
        state.user.photoUrl = action.payload.photo
        state.user.phone = action.payload.phone
    },
    user_update_phone: (state, action) => {
      state.user.phone = action.payload
    },
    user_update_worker: (state, action) => {
      state.user.worker = action.payload
    },
    set_socket : (state, action) => {
      state.socket = action.payload.socket
    },
    user_update_chats: (state, action) => {
      state.chats = action.payload
    },
    user_update_field: (state, action) => {
      for(let el of action.payload)
      {
        state.user[el.field] = el.value
      }
    },
    user_set_admin_chat: (state, action) => {
      state.user.admin_chat = action.payload
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
    user_update_email_verified: (state, action) => {
      state.user_email_verified = action.payload
    },
    user_update_phone_verified: (state, action) => {
      state.user_phone_verified = action.payload
    },

    ///////////////////////// worker
    worker_update_profile_complete: (state, action) => {
      state.worker_profile_complete = action.payload
    },
    worker_update_is_subscribed: (state, action) => {
      state.worker_is_subscribed = action.payload
    },
    worker_update_subscription: (state, action) => {
      state.user.subscription = action.payload
    },
  }
})

export const { 
    user_load,
    user_update_photo_and_phone, 
    user_reset, 
    user_update_phone, 
    set_socket, 
    user_sort_chats,
    user_update_single_read,
    user_update_chats,
    user_update_field,
    user_update_worker,
    search_save,
    search_scroll_save,
    user_update_subscription_active,
    user_update_admin_verified,
    user_update_email_verified,
    user_update_phone_verified,
    user_set_admin_chat,

    ////////////////////// worker
    worker_update_profile_complete,
    worker_update_is_subscribed,
    worker_update_subscription,
  } = slice.actions


export const store = configureStore({
  reducer: slice.reducer
})
