import mongodb from 'mongodb';

mongodb.initialize = async function(url) {
  if (mongodb.db) await mongodb.db.close();
  const db = mongodb.db = await mongodb.connect(url || process.env.DB_URL);

  mongodb.Users = db.collection('users');
  mongodb.Auctions = db.collection('auctions');
}

export default mongodb;
