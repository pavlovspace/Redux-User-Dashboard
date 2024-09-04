import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

interface UsersState {
  users: User[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
};


export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return (await response.json()) as User[];
});

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // budut finkcii filtracii
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'idle';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectUsers = (state: RootState) => state.users.users;
export const selectStatus = (state: RootState) => state.users.status;

export default usersSlice.reducer;
