using Amazon.DynamoDBv2.DataModel;
using ServerlessAPI.Entities;

namespace ServerlessAPI.Repositories;

/// <summary>
/// Implementation for Task Repository
/// </summary>
public class TaskRepository : ITaskRepository
{
    private readonly IDynamoDBContext _dynamoDBContext;
    private readonly ILogger<TaskRepository> _logger;

    /// <summary>
    /// Constructor with DI
    /// </summary>
    /// <param name="dynamoDBContext">dynamoDB context</param>
    /// <param name="logger">logger</param>
    public TaskRepository(IDynamoDBContext dynamoDBContext, ILogger<TaskRepository> logger)
    {
        _dynamoDBContext = dynamoDBContext;
        _logger = logger;
    }

    /// <summary>
    /// Create a new task
    /// </summary>
    /// <param name="task">Task to create</param>
    /// <returns>success/failure</returns>
    public async Task<bool> CreateAsync(Entities.Task task)
    {
        try
        {
            if (task.Id == Guid.Empty)
            {
                task.Id = Guid.NewGuid();
            }
            
            task.CreatedAt = DateTime.UtcNow;
            
            await _dynamoDBContext.SaveAsync(task);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task {Id}", task.Id);
            return false;
        }
    }

    /// <summary>
    /// Delete a task by reference
    /// </summary>
    /// <param name="task">Task to delete</param>
    /// <returns>success/failure</returns>
    public async Task<bool> DeleteAsync(Entities.Task task)
    {
        try
        {
            await _dynamoDBContext.DeleteAsync(task);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task {Id}", task.Id);
            return false;
        }
    }

    /// <summary>
    /// Get a task by ID
    /// </summary>
    /// <param name="id">Task ID</param>
    /// <returns>Task if found, null otherwise</returns>
    public async Task<Entities.Task?> GetByIdAsync(Guid id)
    {
        try
        {
            return await _dynamoDBContext.LoadAsync<Entities.Task>(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving task {Id}", id);
            return null;
        }
    }

    /// <summary>
    /// Get all tasks with optional limit
    /// </summary>
    /// <param name="limit">Maximum number of tasks to return</param>
    /// <returns>List of tasks</returns>
    public async Task<IList<Entities.Task>> GetTasksAsync(int limit = 50)
    {
        try
        {
            var search = _dynamoDBContext.ScanAsync<Entities.Task>(null);
            var page = await search.GetNextSetAsync();
            return page.Take(limit).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing tasks");
            return new List<Entities.Task>();
        }
    }

    /// <summary>
    /// Update an existing task
    /// </summary>
    /// <param name="task">Task with updated values</param>
    /// <returns>success/failure</returns>
    public async Task<bool> UpdateAsync(Entities.Task task)
    {
        try
        {
            await _dynamoDBContext.SaveAsync(task);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task {Id}", task.Id);
            return false;
        }
    }

    /// <summary>
    /// Get tasks filtered by completion status
    /// </summary>
    /// <param name="isCompleted">The completion status to filter by</param>
    /// <param name="limit">Maximum number of tasks to return</param>
    /// <returns>List of filtered tasks</returns>
    public async Task<IList<Entities.Task>> GetTasksByStatusAsync(bool isCompleted, int limit = 50)
    {
        try
        {
            var conditions = new List<ScanCondition>
            {
                new ScanCondition("IsCompleted", Amazon.DynamoDBv2.DocumentModel.ScanOperator.Equal, isCompleted)
            };
            
            var search = _dynamoDBContext.ScanAsync<Entities.Task>(conditions);
            var page = await search.GetNextSetAsync();
            return page.Take(limit).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing tasks by status {IsCompleted}", isCompleted);
            return new List<Entities.Task>();
        }
    }
}