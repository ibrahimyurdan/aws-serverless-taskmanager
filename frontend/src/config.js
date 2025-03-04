// Replace these values with the actual values from your AWS deployment
const config = {
  cognito: {
    userPoolId: 'us-east-1_K8hQanXtM', // Updated UserPoolId
    userPoolWebClientId: '3i97o15h8ienp2h7hjvt4j78ol', // Updated UserPoolClientId
    region: 'us-east-1', 
  },
  api: {
    baseUrl: 'https://ctm9zolcb6.execute-api.us-east-1.amazonaws.com/', // Updated API endpoint with trailing slash
  },
};

export default config; 