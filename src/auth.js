const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk')

const secret_Key = 'secret_key_example';


const createToken = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    // Information user
    const userInformation = {
        name: "mizra",
        email: "mizra@example.com",
        age: 20
    }

    // Create access token
    const accessToken = jwt.sign(userInformation, secret_Key);

    const newUser = {
        id: "1",
        data: userInformation,
        token: accessToken
    }

    // Save user with token in db
    await dynamodb.put({
        TableName: 'UserTable',
        Item: newUser
    }).promise()
    
    return {
      status: 200,
      body: accessToken,
    };
};


const verifyToken = async (event) => {
    // get token from the db
    // const token = the token
    // verify headers
    if (event.headers.authorization === 'Bearer ABCDEF') {
        return {
          principalId: 'anonymous',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: event.routeArn,
              },
            ],
          },
        };
      }
    throw Error('Unauthorized');
};

module.exports = {
    createToken,
    verifyToken
};