import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
}

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  const res = await api.get('/tasks/my');
  return res.data;
});

export const createTask = createAsyncThunk('tasks/create', async (task: Task) => {
  const res = await api.post('/tasks', task);
  return res.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, task }: { id: number; task: Task }) => {
  const res = await api.put(`/tasks/${id}`, task);
  return res.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id: number) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [] as Task[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(createTask.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t: any) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t: any) => t.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
