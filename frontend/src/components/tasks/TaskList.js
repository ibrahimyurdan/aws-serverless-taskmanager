import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, ButtonGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    fetchTasks();
  }, [activeFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    
    try {
      let data;
      
      if (activeFilter === 'all') {
        data = await taskService.getAllTasks();
      } else if (activeFilter === 'active') {
        data = await taskService.getTasksByStatus(false);
      } else if (activeFilter === 'completed') {
        data = await taskService.getTasksByStatus(true);
      }
      
      setTasks(data || []);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await taskService.completeTask(id);
      // Update the task in the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, isCompleted: true } : task
        )
      );
    } catch (err) {
      setError('Failed to complete task. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        // Remove the task from the local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error(err);
      }
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 3: return 'priority-high';
      case 2: return 'priority-medium';
      case 1: return 'priority-low';
      default: return '';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 3: return <Badge bg="danger">High</Badge>;
      case 2: return <Badge bg="warning" text="dark">Medium</Badge>;
      case 1: return <Badge bg="success">Low</Badge>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Tasks</h2>
        <Link to="/tasks/new">
          <Button variant="primary">Add New Task</Button>
        </Link>
      </div>

      <ButtonGroup className="mb-4">
        <Button 
          variant={activeFilter === 'all' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={activeFilter === 'active' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveFilter('active')}
        >
          Active
        </Button>
        <Button 
          variant={activeFilter === 'completed' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </Button>
      </ButtonGroup>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : tasks.length === 0 ? (
        <Alert variant="info">No tasks found. Click "Add New Task" to create one.</Alert>
      ) : (
        <Row>
          {tasks.map(task => (
            <Col md={6} lg={4} key={task.id}>
              <Card className={`task-card ${getPriorityClass(task.priority)} ${task.isCompleted ? 'completed-task' : ''}`}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>{task.title}</Card.Title>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <Card.Text>{task.description}</Card.Text>
                  
                  {task.dueDate && (
                    <div className="mb-2">
                      <small className="text-muted">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </small>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      {!task.isCompleted && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleCompleteTask(task.id)}
                          className="me-2"
                        >
                          Complete
                        </Button>
                      )}
                      <Link to={`/tasks/${task.id}`}>
                        <Button variant="outline-primary" size="sm">View</Button>
                      </Link>
                    </div>
                    <div>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TaskList; 