import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import authReducer from './auth/slice';
import booksReducer from './books/slice';
import filterReducer from './filters/slice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    books: booksReducer,
    filters: filterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
