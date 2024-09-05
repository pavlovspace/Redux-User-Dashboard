import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers, selectUsers, selectStatus, selectError, setFilter, selectFilters } from '../features/usersSlice'
import { RootState, AppDispatch } from '../store/store'

const UsersTable: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const users = useSelector(selectUsers)
    const status = useSelector(selectStatus)
    const error = useSelector(selectError)
    const filters = useSelector(selectFilters)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        dispatch(setFilter({ field, value }))
    }

    const handlePhoneFilterInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target as HTMLInputElement;
   
      const sanitizedValue = input.value.replace(/[^0-9]/g, '');
      handleFilterChange('phone', sanitizedValue);
      input.value = sanitizedValue; 
  };

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <>
            <div className="table-container">
                <div className="filter-container">
                    <input   className="filter-input" type="text" placeholder="Filter by name" value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} />
                    <input   className="filter-input" type="text" placeholder="Filter by username" value={filters.username} onChange={(e) => handleFilterChange('username', e.target.value)} />
                    <input   className="filter-input" type="text" placeholder="Filter by email" value={filters.email} onChange={(e) => handleFilterChange('email', e.target.value)} />
                    <input   className="filter-input"  type="tel" placeholder="Filter by phone" value={filters.phone}  onInput={handlePhoneFilterInput} />
                </div>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="empty-message">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="user-row">
                                    <td>{user.name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default UsersTable
