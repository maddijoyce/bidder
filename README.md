# Bidder
## Auction Website

- Uses mongodb, graphql (apollo) and react.
- Jest for testing
- Testing out use of apollo subscriptions via websocket.

### Server - Requirements
The server requires a MongoDB server and an S3 bucket. In development, I normally install [Fake S3](https://github.com/jubos/fake-s3) instead of using an actual S3 bucket.

1. ```cd server```
2. ```mv .env.sample .env``` (Then update .env to contain the correct environment variable values. If using Fake S3, the AWS ID and secret can be any value but must not be empty).
3. ```yarn install``` or ```npm install```
4. ```yarn setup``` or ```npm run setup```
5. ```yarn develop``` or ```npm run develop```
6. Graphiql is available at http://localhost:8060/graphiql

### Client
1. ```cd web```
2. ```mv .env.sample .env``` (If using the default settings for the server, the .env file will not need to be updated once it's been moved).
2. ```yarn install```
3. ```yarn develop```
4. Client is available at http://localhost:8061
