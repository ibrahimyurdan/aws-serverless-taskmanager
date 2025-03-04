import axios from 'axios';
import config from '../config';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request');
    } else {
      console.log('No auth token found in localStorage');
    }
    
    // Log the full request for debugging
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
  } catch (error) {
    console.error('Error in request interceptor:', error);
  }
  
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error.response || error);
    
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.log('Unauthorized request - token may be invalid');
    }
    
    return Promise.reject(error);
  }
);

// Task API methods
export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      console.log('Fetching all tasks...');
      const response = await api.get('/api/tasks');
      console.log('Tasks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  // Get a task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },
  
  // Get tasks by completion status
  getTasksByStatus: async (isCompleted) => {
    try {
      const response = await api.get(`/api/tasks/status/${isCompleted}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks by status ${isCompleted}:`, error);
      throw error;
    }
  },
  
  // Create a new task
  createTask: async (task) => {
    try {
      // Ensure the task has the required structure
      const taskData = {
        id: task.id || "00000000-0000-0000-0000-000000000000", // Empty GUID string format that matches C# Guid.Empty
        title: task.title,
        description: task.description,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        dueDate: task.dueDate || null,
        priority: task.priority || 1
      };
      
      console.log('Creating task with data:', taskData);
      
      // Try direct API call
      try {
        const response = await api.post('/api/tasks', taskData);
        console.log('Task creation response:', response);
        return response.data;
      } catch (directError) {
        console.error('Direct API call failed, trying alternative endpoint:', directError);
        
        // Try alternative endpoint format
        const altResponse = await api.post('api/tasks', taskData);
        console.log('Alternative task creation response:', altResponse);
        return altResponse.data;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  // Update a task
  updateTask: async (id, task) => {
    try {
      const response = await api.put(`/api/tasks/${id}`, {
        ...task,
        id: id
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },
  
  // Mark a task as complete
  completeTask: async (id) => {
    try {
      const response = await api.put(`/api/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing task ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a task
  deleteTask: async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },
};

export default api; 