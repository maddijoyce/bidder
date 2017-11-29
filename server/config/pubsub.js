import { PubSub } from 'graphql-subscriptions';

export const BID_MADE = 'BID/Made';

const pubsub = new PubSub();
export default pubsub;
