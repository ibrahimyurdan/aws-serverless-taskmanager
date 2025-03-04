import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../../services/api';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await taskService.getTaskById(id);
        setTask(data);
      } catch (err) {
        setError('Failed to fetch task details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [id]);

  const handleCompleteTask = async () => {
    try {
      await taskService.completeTask(id);
      // Update the task in the local state
      setTask(prevTask => ({
        ...prevTask,
        isCompleted: true,
      }));
    } catch (err) {
      setError('Failed to complete task');
      console.error(err);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 3: return { text: 'High', variant: 'danger' };
      case 2: return { text: 'Medium', variant: 'warning' };
      case 1: return { text: 'Low', variant: 'success' };
      default: return { text: 'Unknown', variant: 'secondary' };
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!task) {
    return <Alert variant="warning">Task not found</Alert>;
  }

  const priorityInfo = getPriorityText(task.priority);

  return (
    <div className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Task Details</h2>
        <Link to="/">
          <Button variant="outline-secondary">Back to Tasks</Button>
        </Link>
      </div>
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>{task.title}</h3>
          <Badge bg={priorityInfo.variant}>{priorityInfo.text} Priority</Badge>
        </Card.Header>
        <Card.Body>
          <Card.Title className={task.isCompleted ? 'completed-task' : ''}>
            Status: {task.isCompleted ? 'Completed' : 'Active'}
          </Card.Title>
          
          <Card.Text className="mt-3">
            <strong>Description:</strong>
            <p>{task.description || 'No description provided.'}</p>
          </Card.Text>
          
          <div className="mt-3">
            <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
          </div>
          
          {task.dueDate && (
            <div className="mt-2">
              <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
          
          <div className="d-flex mt-4 gap-2">
            {!task.isCompleted && (
              <>
                <Button
                  variant="success"
                  onClick={handleCompleteTask}
                >
                  Mark as Complete
                </Button>
                <Link to={`/tasks/edit/${task.id}`}>
                  <Button variant="primary">Edit Task</Button>
                </Link>
              </>
            )}
            <Button
              variant="danger"
              onClick={handleDeleteTask}
            >
              Delete Task
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskDetail; 