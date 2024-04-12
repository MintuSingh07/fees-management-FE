import React from 'react'
import {
  Route,
  Routes
} from 'react-router-dom';
import StudentLogin from './pages/StudentLogin';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Routes>
      <Route path='/std-login' element={<StudentLogin />} />
      <Route path='/profile' element={<Profile />} />
    </Routes>
  )
}

export default App