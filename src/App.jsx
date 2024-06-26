import React from 'react'
import {
  Route,
  Routes
} from 'react-router-dom';
import StudentLogin from './pages/StudentLogin';
import Profile from './pages/Profile';
import AddStudents from './pages/AddStudents';
import StudentsList from './pages/StudentsList';
import AdminLogin from './pages/AdminLogin';
import ImageUpload from './pages/ImageUpload';
import Community from './pages/Community';

const App = () => {
  return (
    <Routes>
      <Route path='/std-login' element={<StudentLogin />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/add-std' element={<AddStudents />} />
      <Route path='/std-list' element={<StudentsList />} />
      <Route path='/admin-login' element={<AdminLogin />} />
      <Route path='/img-upload' element={<ImageUpload />} />
      <Route path='/community' element={<Community />} />
    </Routes>
  )
}

export default App