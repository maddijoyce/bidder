import { values, flatten } from 'lodash';
import * as typeObject from './*/types.js';

const typeArray = flatten(values(typeObject));

export default [
  'scalar Date',
  'type Query { null: String }',
  'type Mutation { null: String }',
  'type Subscription { null: String }',
  ...typeArray,
];
