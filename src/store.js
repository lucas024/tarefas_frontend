import { createSlice, configureStore } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'slice',
  initialState: {
    user: null,
    search_context: null,
    search_scroll: 0
  },
  reducers: {
    user_load: (state, action) => {
        state.user = action.payload
    },
    user_update_photo_and_phone: (state, action) => {
        state.user.photoUrl = action.payload.photo
        state.user.phone = action.payload.phone
    },
    user_update_phone: (state, action) => {
      state.user.phone = action.payload.phone
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
        console.log(action)
        state.search_scroll = action.payload
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
    search_scroll_save } = slice.actions


export const store = configureStore({
  reducer: slice.reducer
})
