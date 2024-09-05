import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../store/store'

interface User {
    id: number
    name: string
    username: string
    email: string
    phone: string
}

interface UsersState {
    users: User[]
    filteredUsers: User[]
    filters: {
        name: string
        username: string
        email: string
        phone: string
    }
    status: 'idle' | 'loading' | 'failed'
    error?: string
}

const initialState: UsersState = {
    users: [],
    filteredUsers: [],
    filters: {
        name: '',
        username: '',
        email: '',
        phone: '',
    },
    status: 'idle',
    error: undefined,
}

const filterUsers = (users: User[], filters: UsersState['filters']): User[] => {
    return users.filter(
        (user) =>
            (!filters.name || user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (!filters.username || user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
            (!filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
            (!filters.phone || user.phone.toLowerCase().includes(filters.phone.toLowerCase()))
    )
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) {
            throw new Error('Failed to fetch users')
        }
        return (await response.json()) as User[]
    } catch (error) {
        return rejectWithValue('An error occurred while fetching users')
    }
})

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<{ field: keyof UsersState['filters']; value: string }>) => {
            const { field, value } = action.payload
            state.filters[field] = value
            state.filteredUsers = filterUsers(state.users, state.filters)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading'
                state.error = undefined
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.status = 'idle'
                state.users = action.payload
                state.filteredUsers = filterUsers(state.users, state.filters)
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload as string
            })
    },
})

export const { setFilter } = usersSlice.actions

export const selectUsers = (state: RootState) => state.users.filteredUsers
export const selectStatus = (state: RootState) => state.users.status
export const selectFilters = (state: RootState) => state.users.filters
export const selectError = (state: RootState) => state.users.error

export default usersSlice.reducer
