import userReducer from './userSlice';
import cartReducer from './cartSlice';
import { configureStore } from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const persistedUserReducer = persistReducer({ ...persistConfig, key: 'user' }, userReducer)
const persistedCartReducer = persistReducer({ ...persistConfig, key: 'cart' }, cartReducer)

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        cart: persistedCartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store);
export default store;

