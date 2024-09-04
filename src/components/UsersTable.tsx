import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, selectUsers, selectStatus } from '../features/usersSlice';
import { RootState, AppDispatch } from '../store/store';

const UsersTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector(selectUsers);
  const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Failed to load users.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
