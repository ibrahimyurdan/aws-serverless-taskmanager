using Amazon.DynamoDBv2.DataModel;

namespace ServerlessAPI.Entities;

// <summary>
/// Map the Task Class to DynamoDb Table
/// </summary>
[DynamoDBTable("ServerlessTaskTable")]
public class Task
{
    ///<summary>
    /// Map c# types to DynamoDb Columns 
    /// </summary>
    [DynamoDBHashKey] //Partition key
    public Guid Id { get; set; } = Guid.Empty;

    [DynamoDBProperty]
    public string Title { get; set; } = string.Empty;

    [DynamoDBProperty]
    public string Description { get; set; } = string.Empty;

    [DynamoDBProperty]
    public bool IsCompleted { get; set; } = false;

    [DynamoDBProperty]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [DynamoDBProperty]
    public DateTime? DueDate { get; set; }

    [DynamoDBProperty]
    public int Priority { get; set; } = 1; // 1 = Low, 2 = Medium, 3 = High
}
