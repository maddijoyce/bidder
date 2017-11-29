import db from '../../config/mongo';
import resolvers from './resolvers';

const finishAt = new Date();
finishAt.setDate(finishAt.getDate() + 1);

const auction = {
  _id: new db.ObjectID(),
  title: 'Test',
  description: 'This is a test',
  picture: 'http://www.google.com/',
  finishAt,
  createdById: 'user',
  bids: [{
    amount: 8,
    createdAt: new Date(),
    user: {
      id: 'user2',
      name: 'User 2',
    }
  }],
};

beforeAll(async () => {
  await db.initialize();
  await db.Auctions.updateOne({ _id: auction._id }, auction, { upsert: true });
});

afterAll(async () => {
  await db.Auctions.remove({});
  await db.db.close();
});

test('Returns an array of live auctions', async () => {
  const result = await resolvers.Query.liveAuctions();
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual(auction);
});

test('Returns a specific auction', async () => {
  const result = await resolvers.Query.auction(null, { id: auction._id });
  expect(result).toEqual(auction);
});

test('Updates an auction', async () => {
  const fields = { title: 'New Test' }
  const result = await resolvers.Mutation.updateAuction(null, { id: auction._id, fields }, { user: { _id: 'user' } });
  expect(result).toHaveProperty('title', 'New Test');
});

test('Makes a bid', async () => {
  const result = await resolvers.Mutation.makeBid(null, { id: auction._id, amount: 10, me: 'user2' }, { user: { _id: 'user2' } });
  expect(result).toHaveProperty('amount', 10);
});

test('Makes a low bid', async () => {
  let exceptionThrown = false;
  try {
    await resolvers.Mutation.makeBid(null, { id: auction._id, amount: 5, me: 'user2' }, { user: { _id: 'user2' } });
  } catch (e) {
    exceptionThrown = true;
    expect(e.state).toHaveProperty('amount', 'is invalid');
  }
  expect(exceptionThrown).toBe(true);
});

test('Makes an invalid bid', async () => {
  let exceptionThrown = false;
  try {
    await resolvers.Mutation.makeBid(null, { id: auction._id, amount: 'Bad', me: 'user2' }, { user: { _id: 'user2' } });
  } catch (e) {
    exceptionThrown = true;
    expect(e.state).toHaveProperty('amount', 'is not a number');
  }
  expect(exceptionThrown).toBe(true);
});
