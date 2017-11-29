import ValidationError from '../error';
import db from '../../config/mongo';
import pubsub, { BID_MADE } from '../../config/pubsub';

export default {
  Auction: {
    id: ({ _id }) => (_id),
    price: ({ bids }) => (Math.max(...bids.map(({ amount }) => (amount)))),
    createdBy: ({ createdById }) => (db.Users.findOne(new db.ObjectID(createdById))),
  },
  Query: {
    async myAuctions(root, { me }, context) {
      let auctions = [];

      if (context && context.user && context.user._id == me) {
        auctions = await db.Auctions.find({ createdById: context.user._id });
        auctions = auctions.sort({ createdAt: 1 });
        auctions = auctions.toArray();
      }

      return auctions;
    },
    async liveAuctions(root, variables, context) {
      let auctions = await db.Auctions.find({
        createdById: { $ne: (context && context.user && context.user._id) },
        finishAt: { $gt: new Date() },
      });
      auctions = auctions.sort({ finishAt: 1 });
      auctions = auctions.toArray();

      return auctions;
    },
    async auction(root, { id }) {
      let auction;
      if (id) {
        auction = await db.Auctions.findOne(new db.ObjectID(id));
      }
      return auction;
    },
  },
  Mutation: {
    async updateAuction(root, { id, fields }, context) {
      let auction;

      if (context && context.user) {
        const update = {
          ...fields,
          updatedAt: new Date(),
        };

        if (id) {
          const find = { _id: new db.ObjectID(id), createdById: context.user._id };
          await db.Auctions.updateOne(find, { $set: update });
          auction = await db.Auctions.findOne(find);
        } else {
          update.createdById = context.user._id;
          update.createdAt = new Date();
          update.bids = [];

          const result = await db.Auctions.insertOne(update);
          auction = await db.Auctions.findOne(result.insertedId);
        }
      }

      return auction;
    },
    async makeBid(root, { id, amount, me }, context) {
      let auction;

      if (context && context.user && context.user._id == me) {
        if (!amount || typeof amount != 'number') {
          throw new ValidationError({ amount: 'is not a number' });
        }

        const result = await db.Auctions.updateOne({
          _id: new db.ObjectID(id),
          finishAt: { $gt: new Date() },
          createdById: { $ne: context.user._id },
          bids: { $not: { $elemMatch: { amount: { $gte: amount } } } },
        }, { $push: { bids: {
          amount,
          createdAt: new Date(),
          user: {
            id: context.user._id,
            name: context.user.name,
          },
        } } });

        if (result.modifiedCount < 1) {
          throw new ValidationError({ amount: 'is invalid' });
        }

        auction = await db.Auctions.findOne({ _id: new db.ObjectID(id) });
        pubsub.publish(BID_MADE, { bidMade: auction })
      }

      return auction;
    }
  },
  Subscription: {
    bidMade: {
      subscribe: () => pubsub.asyncIterator(BID_MADE),
    }
  },
};
