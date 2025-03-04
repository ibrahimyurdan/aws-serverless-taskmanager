import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import VerifyAccount from './components/auth/VerifyAccount';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import TaskDetail from './components/tasks/TaskDetail';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-4">
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<VerifyAccount />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<TaskList />} />
            <Route path="tasks/new" element={<TaskForm />} />
            <Route path="tasks/:id" element={<TaskDetail />} />
            <Route path="tasks/edit/:id" element={<TaskForm />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

export default App; 