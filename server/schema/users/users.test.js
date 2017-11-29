import db from '../../config/mongo';
import authorization, { encodeUser, decodeUser } from './authorization';
import resolvers from './resolvers';

const user = {
  _id: "test",
  email: 'test@test.com',
  name: 'Test',
  phone: '555 1234',
}

beforeAll(async () => {
  await db.initialize();
});

afterAll(async () => {
  await db.db.close();
});

describe('user authorization', () => {
  beforeAll(async () => {
    await db.Users.insert(user);
  });

  afterAll(async () => {
    await db.Users.remove(user);
  });

  test('decodes an encoded user', async () => {
    const token = encodeUser(user);
    const result = await decodeUser(token);

    expect(result).toEqual(user);
  });

  test('fails a non-existent user', async () => {
    const token = encodeUser({ email: "test2@test.com" });
    try {
      await decodeUser(token);
    } catch (e) {
      expect(e).toBe('User Does Not Exist');
    }
  })

  test('converts token header to user', async () => {
    const ctx = {
      response: { set: jest.fn() },
      headers: {
        authorization: `Bearer ${encodeUser(user)}`,
      },
    };
    const next = jest.fn();

    await expect(authorization(ctx, next)).resolves.toBeUndefined();

    expect(next).toHaveBeenCalledTimes(1);
    expect(ctx.user).toEqual(user);
    expect(ctx.response.set.mock.calls[0][0]).toBe('Authorization');
  });
});

describe('user resolver', () => {
  afterAll(async () => {
    await db.Users.remove({ email: 'test@test.com' });
  });

  test('sign up allows sign in', async () => {
    const signUp = await resolvers.Mutation.signUp(null, { email: 'test@test.com', password: 'test', fields: {} });
    const signIn = await resolvers.Mutation.signIn(null, { email: 'test@test.com', password: 'test' });

    expect(signIn.user).toEqual(signUp.user);
  });
});
