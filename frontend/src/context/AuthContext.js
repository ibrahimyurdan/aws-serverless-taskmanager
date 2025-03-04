import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  CognitoUserPool, 
  CognitoUserAttribute, 
  AuthenticationDetails, 
  CognitoUser 
} from 'amazon-cognito-identity-js';
import config from '../config';

// Initialize the Cognito User Pool
const userPool = new CognitoUserPool({
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.userPoolWebClientId,
});

// Create the Authentication Context
const AuthContext = createContext(null);

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Check if the user is already signed in
  useEffect(() => {
    const currentUser = userPool.getCurrentUser();
    
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        if (session.isValid()) {
          setIsAuthenticated(true);
          setUser(currentUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Sign up a new user
  const signUp = async (email, password, name) => {
    setError('');
    
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: 'name',
          Value: name,
        }),
      ];
      
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          setError(err.message);
          reject(err);
          return;
        }
        
        resolve(result.user);
      });
    });
  };

  // Sign in an existing user
  const signIn = async (email, password) => {
    setError('');
    
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
      
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });
      
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          setIsAuthenticated(true);
          setUser(cognitoUser);
          
          // Store the JWT token in localStorage for API requests
          const idToken = result.getIdToken().getJwtToken();
          localStorage.setItem('token', idToken);
          
          resolve(result);
        },
        onFailure: (err) => {
          setError(err.message);
          reject(err);
        },
      });
    });
  };

  // Sign out the current user
  const signOut = () => {
    if (user) {
      user.signOut();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Get the current user's JWT token
  const getToken = async () => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('No user is signed in'));
        return;
      }
      
      user.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(session.getIdToken().getJwtToken());
      });
    });
  };

  // Verify a user's account with the verification code
  const verifyAccount = async (email, code) => {
    setError('');
    
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });
      
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          setError(err.message);
          reject(err);
          return;
        }
        
        resolve(result);
      });
    });
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    error,
    signUp,
    signIn,
    signOut,
    getToken,
    verifyAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 