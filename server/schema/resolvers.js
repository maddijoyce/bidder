import GraphQLDate from 'graphql-date';
import { values, reduce, merge } from 'lodash';

import * as resolverObject from './*/resolvers.js';

const resolvers = reduce(values(resolverObject), merge);
resolvers.Date = GraphQLDate;

export default resolvers;
