import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools';

import typeDefs from './types';
import resolvers from './resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });
const logger = { log(e) { console.error(e.stack); } };
addErrorLoggingToSchema(schema, logger);

export default schema;
