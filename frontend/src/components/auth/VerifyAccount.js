import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const VerifyAccount = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { verifyAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state, if available
  const email = location.state?.email || '';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!email) {
        throw new Error('Email is required. Please go back to the sign-up page.');
      }
      
      await verifyAccount(email, verificationCode);
      setMessage('Account verified successfully! You can now sign in.');
      
      // Redirect to sign-in page after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to verify account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container className="auth-form">
      <h2 className="text-center mb-4">Verify Your Account</h2>
      <p className="text-center">
        Please enter the verification code that was sent to your email.
      </p>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            disabled
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Verification Code</Form.Label>
          <Form.Control
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            placeholder="Enter verification code"
          />
        </Form.Group>
        
        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Account'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default VerifyAccount; 