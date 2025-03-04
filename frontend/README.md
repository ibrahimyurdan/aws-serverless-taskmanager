# Task Management Frontend

This is a React-based frontend for the Serverless Task Management API. It provides a user interface for managing tasks and integrates with Amazon Cognito for authentication.

## Features

- User authentication with Amazon Cognito
- Task management (create, read, update, delete)
- Task filtering by completion status
- Responsive design using React Bootstrap

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone this repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Configuration

Before running the application, update the configuration in `src/config.js` with your own AWS resources:

```javascript
const config = {
  cognito: {
    userPoolId: 'YOUR_USER_POOL_ID',
    userPoolWebClientId: 'YOUR_USER_POOL_CLIENT_ID',
    region: 'YOUR_REGION',
  },
  api: {
    baseUrl: 'YOUR_API_ENDPOINT',
  },
};
```

### Running the Application

To start the development server:

```
npm start
```

or

```
yarn start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

To build the app for production:

```
npm run build
```

or

```
yarn build
```

This will create a `build` folder with the optimized production build.

## Deployment

You can deploy the frontend to AWS Amplify, Amazon S3, or any other static website hosting service.

### Deploy to S3

1. Build the application
2. Create an S3 bucket with static website hosting enabled
3. Upload the contents of the `build` folder to the bucket
4. Configure the bucket policy for public access (if needed)

### Deploy to AWS Amplify

1. Set up an AWS Amplify project
2. Connect it to your code repository
3. Configure the build settings and deploy

## Project Structure

```
frontend/
├── public/                 # Public assets
├── src/
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── tasks/          # Task management components
│   │   └── Header.js       # Application header
│   ├── context/            # React context
│   │   └── AuthContext.js  # Authentication context
│   ├── services/           # API services
│   │   └── api.js          # API client
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── config.js           # Application configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
``` 