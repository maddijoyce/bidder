import bcrypt from 'bcrypt';

import ValidationError from '../error';
import db from '../../config/mongo';
import { encodeUser } from './authorization';

export default {
  User: {
    id: ({ _id }) => (_id),
  },
  Query: {
    me(root, variables, context) {
      return context && context.user;
    },
  },
  Mutation: {
    async signUp(root, { email, password, fields }) {
      let user;
      let token;

      if (await db.Users.findOne({ email })) {
        throw new ValidationError({ email: 'already exists' });
      } else {
        const hash = await bcrypt.hash(password, 10);
        const { insertedId } = await db.Users.insertOne({
          email,
          hash,
          ...fields,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        })
        user = await db.Users.findOne(insertedId);
        token = encodeUser(user);
      }

      return {
        user,
        token,
      };
    },
    async signIn(root, { email, password }) {
      let token;
      let user = await db.Users.findOne({ email });

      const found = user && await bcrypt.compare(password, user.hash);
      if (user && found) {
        await db.Users.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
        token = encodeUser(user);
      } else {
        user = null;
        throw new ValidationError({ email: 'did not match', password: 'did not match' });
      }

      return {
        user,
        token,
      };
    }
  },
};
