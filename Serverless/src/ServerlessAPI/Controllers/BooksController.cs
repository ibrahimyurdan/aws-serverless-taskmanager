using Microsoft.AspNetCore.Mvc;
using ServerlessAPI.Entities;
using ServerlessAPI.Repositories;

namespace ServerlessAPI.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
public class TasksController : ControllerBase
{
    private readonly ILogger<TasksController> _logger;
    private readonly ITaskRepository _taskRepository;

    public TasksController(ILogger<TasksController> logger, ITaskRepository taskRepository)
    {
        _logger = logger;
        _taskRepository = taskRepository;
    }

    // GET api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Entities.Task>>> Get([FromQuery] int limit = 50)
    {
        if (limit <= 0 || limit > 100) return BadRequest("The limit should be between [1-100]");

        return Ok(await _taskRepository.GetTasksAsync(limit));
    }

    // GET api/tasks/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Entities.Task>> Get(Guid id)
    {
        var result = await _taskRepository.GetByIdAsync(id);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
    
    // GET api/tasks/status/{isCompleted}
    [HttpGet("status/{isCompleted}")]
    public async Task<ActionResult<IEnumerable<Entities.Task>>> GetByStatus(bool isCompleted, [FromQuery] int limit = 50)
    {
        if (limit <= 0 || limit > 100) return BadRequest("The limit should be between [1-100]");

        return Ok(await _taskRepository.GetTasksByStatusAsync(isCompleted, limit));
    }

    // POST api/tasks
    [HttpPost]
    public async Task<ActionResult<Entities.Task>> Post([FromBody] Entities.Task task)
    {
        if (task == null) return ValidationProblem("Invalid input! Task not provided");

        var result = await _taskRepository.CreateAsync(task);

        if (result)
        {
            return CreatedAtAction(
                nameof(Get),
                new { id = task.Id },
                task);
        }
        else
        {
            return BadRequest("Failed to create task");
        }
    }

    // PUT api/tasks/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] Entities.Task task)
    {
        if (id == Guid.Empty || task == null) return ValidationProblem("Invalid request payload");

        // Retrieve the task
        var taskRetrieved = await _taskRepository.GetByIdAsync(id);

        if (taskRetrieved == null)
        {
            var errorMsg = $"Invalid input! No task found with id:{id}";
            return NotFound(errorMsg);
        }

        task.Id = taskRetrieved.Id;
        // Preserve the creation date
        task.CreatedAt = taskRetrieved.CreatedAt;

        var result = await _taskRepository.UpdateAsync(task);
        
        if (result)
        {
            return Ok();
        }
        else
        {
            return BadRequest("Failed to update task");
        }
    }
    
    // PUT api/tasks/5/complete
    [HttpPut("{id}/complete")]
    public async Task<IActionResult> MarkComplete(Guid id)
    {
        if (id == Guid.Empty) return ValidationProblem("Invalid request payload");

        // Retrieve the task
        var task = await _taskRepository.GetByIdAsync(id);

        if (task == null)
        {
            var errorMsg = $"Invalid input! No task found with id:{id}";
            return NotFound(errorMsg);
        }

        task.IsCompleted = true;
        
        var result = await _taskRepository.UpdateAsync(task);
        
        if (result)
        {
            return Ok();
        }
        else
        {
            return BadRequest("Failed to update task");
        }
    }

    // DELETE api/tasks/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (id == Guid.Empty) return ValidationProblem("Invalid request payload");

        var taskRetrieved = await _taskRepository.GetByIdAsync(id);

        if (taskRetrieved == null)
        {
            var errorMsg = $"Invalid input! No task found with id:{id}";
            return NotFound(errorMsg);
        }

        var result = await _taskRepository.DeleteAsync(taskRetrieved);
        
        if (result)
        {
            return Ok();
        }
        else
        {
            return BadRequest("Failed to delete task");
        }
    }
}
