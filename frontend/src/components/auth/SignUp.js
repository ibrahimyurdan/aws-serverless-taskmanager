import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      await signUp(formData.email, formData.password, formData.name);
      setSuccess('Registration successful! Please check your email for a verification code.');
      
      // Redirect to verification page
      navigate('/verify', { state: { email: formData.email } });
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-5">
      <Card className="auth-form mx-auto">
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <Form.Text className="text-muted">
                Password must be at least 8 characters long.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <p>
              Already have an account? <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUp; 