using ServerlessAPI.Entities;

namespace ServerlessAPI.Repositories;

/// <summary>
/// Task repository interface for CRUD operations
/// </summary>
public interface ITaskRepository
{
    /// <summary>
    /// Create a new task in the DynamoDB Table
    /// </summary>
    /// <param name="task">Task to create</param>
    /// <returns>success/failure</returns>
    Task<bool> CreateAsync(Entities.Task task);
    
    /// <summary>
    /// Delete an existing task from DynamoDB Table
    /// </summary>
    /// <param name="task">Task to delete</param>
    /// <returns>success/failure</returns>
    Task<bool> DeleteAsync(Entities.Task task);

    /// <summary>
    /// List tasks from DynamoDB Table with items limit (default=50)
    /// </summary>
    /// <param name="limit">limit (default=50)</param>
    /// <returns>Collection of tasks</returns>
    Task<IList<Entities.Task>> GetTasksAsync(int limit = 50);

    /// <summary>
    /// Get task by ID
    /// </summary>
    /// <param name="id">Task ID</param>
    /// <returns>Task object</returns>
    Task<Entities.Task?> GetByIdAsync(Guid id);
    
    /// <summary>
    /// Update task
    /// </summary>
    /// <param name="task">Task to be updated</param>
    /// <returns>success/failure</returns>
    Task<bool> UpdateAsync(Entities.Task task);
    
    /// <summary>
    /// Get tasks by completion status
    /// </summary>
    /// <param name="isCompleted">Completion status</param>
    /// <param name="limit">Maximum items to return</param>
    /// <returns>Collection of tasks</returns>
    Task<IList<Entities.Task>> GetTasksByStatusAsync(bool isCompleted, int limit = 50);
}