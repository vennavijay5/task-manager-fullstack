import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  role: localStorage.getItem('role'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (creds: { username: string; password: string }) => {
  const res = await api.post('/auth/login', creds);
  return res.data;
});

export const register = createAsyncThunk('auth/register', async (data: { username: string; email: string; password: string }) => {
  const res = await api.post('/auth/register', data);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null; state.username = null; state.role = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.role = action.payload.role;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);
        localStorage.setItem('role', action.payload.role);
      })
      .addCase(login.rejected, (state) => { state.error = 'Invalid credentials'; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
