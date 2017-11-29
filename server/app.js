import 'dotenv/config';
import Koa from 'koa';
import Router from 'koa-router';
import compress from 'koa-compress';
import body from 'koa-bodyparser';
import cors from 'kcors';
import chalk from 'chalk';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import mongo from './config/mongo';
import schema from './schema';
import userAuth from './schema/users/authorization';

const isInteractive = process.stdout.isTTY;
const port = process.env.PORT || 8060;

const app = new Koa();
const router = new Router();

router.post('/graphql', (context, next) => graphqlKoa({
  schema,
  context: {
    user: context.user,
  },
  formatError: error => ({
    message: error.message,
    state: error.originalError && error.originalError.state,
    locations: error.locations,
    path: error.path,
  }),
})(context, next));
router.get('/graphiql', graphiqlKoa({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`,
}));

app.use(body());
app.use(cors());
app.use(compress());
app.use(userAuth);
app.use(router.routes());
app.use(router.allowedMethods());

async function initialize() {
  if (isInteractive) process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');

  console.log(chalk.green('Connecting to Mongo...'));
  await mongo.initialize();

  console.log(chalk.green('Starting Koa...'));

  const server = createServer(app.callback());
  server.listen(port, () => {
    console.log('\nThe server is running at:');
    console.log(chalk.cyan(`  http://localhost:${port}/`));

    const ws = new SubscriptionServer({
      execute,
      subscribe,
      schema,
    }, {
      server,
      path: '/subscriptions',
    });
  });
}

initialize().catch(console.error);
