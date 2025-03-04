import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { taskService } from '../../services/api';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 1,
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingTask, setFetchingTask] = useState(isEditMode);

  useEffect(() => {
    // If in edit mode, fetch the task data
    if (isEditMode) {
      const getTask = async () => {
        try {
          const task = await taskService.getTaskById(id);
          
          // Format date for input field (YYYY-MM-DD)
          let formattedDueDate = '';
          if (task.dueDate) {
            const date = new Date(task.dueDate);
            formattedDueDate = date.toISOString().split('T')[0];
          }
          
          setFormData({
            title: task.title || '',
            description: task.description || '',
            priority: task.priority || 1,
            dueDate: formattedDueDate,
          });
        } catch (err) {
          setError('Failed to fetch task details');
          console.error(err);
        } finally {
          setFetchingTask(false);
        }
      };
      
      getTask();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const taskData = {
        ...formData,
        priority: parseInt(formData.priority, 10),
        // Ensure dates are in ISO format if provided
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };
      
      console.log('Submitting task data:', taskData);
      console.log('Auth token:', localStorage.getItem('token'));
      
      if (isEditMode) {
        await taskService.updateTask(id, taskData);
      } else {
        const response = await taskService.createTask(taskData);
        console.log('Task creation response:', response);
      }
      
      navigate('/');
    } catch (err) {
      console.error('Task creation error details:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
        console.error('Status code:', err.response.status);
        setError(`Failed to ${isEditMode ? 'update' : 'create'} task: ${err.response.data?.message || err.message}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError(`Failed to ${isEditMode ? 'update' : 'create'} task: No response from server`);
      } else {
        console.error('Error:', err.message);
        setError(`Failed to ${isEditMode ? 'update' : 'create'} task: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTask) {
    return <div className="text-center my-5">Loading task data...</div>;
  }

  return (
    <div className="mt-4">
      <Card>
        <Card.Body>
          <h2 className="mb-4">{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="dueDate">
              <Form.Label>Due Date (Optional)</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskForm; 