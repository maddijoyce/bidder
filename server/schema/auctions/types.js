export default [`
  type Auction {
    id: ID
    title: String
    description: String
    picture: String
    finishAt: Date
    price: Int
    bids: [Bid]
    createdBy: User
    createdAt: Date
    updatedAt: Date
  }
`, `
  type Bid {
    amount: Int
    createdAt: Date
    user: User
  }
`, `
  input AuctionInput {
    title: String
    description: String
    picture: String
    finishAt: Date
  }
`, `
  extend type Query {
    myAuctions(me: ID): [Auction]
    liveAuctions: [Auction]
    auction(id: ID): Auction
  }
`, `
  extend type Mutation {
    updateAuction(id: ID, fields: AuctionInput): Auction
    makeBid(id: ID, amount: Int, me: ID): Auction
  }
`, `
  extend type Subscription {
    bidMade(id: ID!): Auction
  }
`];
