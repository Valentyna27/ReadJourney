import { createSlice } from '@reduxjs/toolkit';
import { fetchOwnBooks, addBook, deleteBook, addBookById } from './operations';
import {
  startReading,
  stopReading,
  deleteReadingEvent,
  fetchBookById,
} from './operations';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchOwnBooks.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchOwnBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOwnBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addBookById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        const exists = state.items.some(
          book => book._id === action.payload._id
        );
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(addBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.items = state.items.filter(book => book._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(startReading.fulfilled, (state, action) => {
        const id = action.meta.arg.bookId;
        const book = state.items.find(b => b._id === id || b.id === id);
        if (book) {
          book.isReading = true;
          book.progress = action.payload.progress;
        }
      })

      .addCase(stopReading.fulfilled, (state, action) => {
        const id = action.meta.arg.bookId;
        const book = state.items.find(b => b._id === id || b.id === id);
        if (book) {
          book.isReading = false;
          book.progress = action.payload.progress;
        }
      })
      .addCase(deleteReadingEvent.fulfilled, (state, action) => {
        const book = state.items.find(b => b._id === action.payload.bookId);
        if (book) {
          book.progress = book.progress.filter(
            e => e._id !== action.payload.readingId
          );
          const activeSession = book.progress.find(p => p.status === 'active');
          if (!activeSession) {
            book.isReading = false;
          }
        }
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        const index = state.items.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      }),
});

export default booksSlice.reducer;
