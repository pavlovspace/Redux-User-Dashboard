import React from 'react';
import './App.css';
import './scss/App.scss';
import UsersTable from './components/UsersTable';

function App() {
  return (
    <div className="App">
      <h1>User Management</h1>
      <UsersTable />
    </div>
  );
}

export default App;
