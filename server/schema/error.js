import { GraphQLError } from 'graphql';

class ValidationError extends GraphQLError {
  constructor(errors) {
    super('The request is invalid.');
    this.state = errors;
  }
}

export default ValidationError;
