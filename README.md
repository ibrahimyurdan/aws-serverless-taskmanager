# AWS Serverless TaskManager

A full-stack serverless task management application built with AWS Lambda, API Gateway, DynamoDB, Cognito, and React.

## Project Overview

AWS Serverless TaskManager demonstrates modern cloud application development using AWS serverless technologies. This application enables users to create, manage, prioritize, and track tasks in a secure environment with user authentication.

## Architecture

The application follows a serverless architecture pattern:

- **Frontend**: React.js single-page application
- **Backend**: AWS Lambda functions using .NET Core
- **API Layer**: AWS API Gateway (HTTP API)
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito
- **Deployment**: AWS Serverless Application Model (SAM)

## Technologies

### Frontend
- React.js
- React Router
- Axios
- Bootstrap for responsive UI
- JWT token authentication

### Backend
- AWS Lambda (.NET Core runtime)
- AWS API Gateway
- Amazon DynamoDB
- Amazon Cognito
- AWS SAM for infrastructure as code

## Features

- **User Authentication**: Secure login and registration using Amazon Cognito
- **Task Management**:
  - Create new tasks with title, description, priority, and due date
  - View all tasks with filtering options (All/Active/Completed)
  - Update task details
  - Mark tasks as complete
  - Delete tasks
- **Task Prioritization**: Assign Low, Medium, or High priority to tasks
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
├── frontend/                 # React.js frontend application
│   ├── public/               # Static files
│   │   ├── src/                  # Source code
│   │   │   ├── components/       # UI components
│   │   │   ├── services/         # API service layer
│   │   │   └── ...
│   │   └── package.json          # Dependencies and scripts
│   │
│   ├── Serverless/               # Backend serverless application
│   │   ├── src/                  # Source code
│   │   │   ├── ServerlessAPI/    # .NET Core Lambda functions
│   │   │   │   ├── Controllers/  # API endpoints
│   │   │   │   ├── Entities/     # Data models
│   │   │   │   ├── Repositories/ # Data access layer
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── template.yaml         # AWS SAM template
│   │   └── ...
│   └── README.md                 # This file
```

## Setup Instructions

### Prerequisites
- AWS Account
- AWS CLI configured
- .NET Core SDK
- Node.js and npm
- AWS SAM CLI

### Backend Deployment
1. Navigate to the Serverless directory:
   ```
   cd Serverless
   ```
2. Build the SAM application:
   ```
   sam build
   ```
3. Deploy the application:
   ```
   sam deploy --guided
   ```
4. Note the outputs from the deployment, including:
   - API Gateway Endpoint URL
   - Cognito User Pool ID
   - Cognito App Client ID

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `src/config.js` file with your AWS resource information:
   ```javascript
   export default {
     api: {
       baseUrl: '[YOUR_API_GATEWAY_ENDPOINT]',
     },
     cognito: {
       userPoolId: '[YOUR_COGNITO_USER_POOL_ID]',
       userPoolWebClientId: '[YOUR_COGNITO_APP_CLIENT_ID]',
       region: '[YOUR_AWS_REGION]',
     }
   };
   ```
4. Start the development server:
   ```
   npm start
   ```

## Usage

1. Register a new account or sign in with existing credentials
2. Create tasks by clicking "Add New Task"
3. Fill in the task details and submit
4. View your tasks on the main dashboard
5. Filter tasks by clicking All/Active/Completed
6. Mark tasks as complete or delete them as needed

## Lessons Learned

This project demonstrates several important aspects of serverless application development:

- Serverless architecture design and implementation
- CORS configuration for secure API access
- Proper authentication flow using JWT tokens
- DynamoDB data modeling and access patterns
- AWS service integration best practices
- Handling API Gateway and Lambda error responses

## Future Enhancements

- Task sharing between users
- File attachments for tasks
- Email notifications for due dates
- Mobile application using React Native
- Enhanced analytics and reporting
