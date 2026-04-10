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

const saveAuth = (state: AuthState, payload: any) => {
  state.token = payload.token;
  state.username = payload.username;
  state.role = payload.role;
  state.loading = false;
  state.error = null;
  localStorage.setItem('token', payload.token);
  localStorage.setItem('username', payload.username);
  localStorage.setItem('role', payload.role);
};

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
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { saveAuth(state, action.payload); })
      .addCase(login.rejected, (state) => { state.loading = false; state.error = 'Invalid credentials'; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { saveAuth(state, action.payload); })
      .addCase(register.rejected, (state) => { state.loading = false; state.error = 'Registration failed'; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
