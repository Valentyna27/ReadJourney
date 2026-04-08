import api from './api';

export const getRecommendedBooks = async (
  token,
  page = 1,
  limit = 10,
  filters = {}
) => {
  const { title = '', author = '' } = filters;

  const response = await api.get('/books/recommend', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
      title,
      author,
    },
  });

  return response.data;
};

export const addBookApi = async (bookData, token) => {
  const res = await api.post('/books/add', bookData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getOwnBooks = async token => {
  const res = await api.get('/books/own', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
