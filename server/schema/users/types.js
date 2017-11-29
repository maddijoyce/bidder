export default [`
  type User {
    id: ID
    email: String
    name: String
    phone: String
    createdAt: Date
    lastLoginAt: Date
  }
`, `
  input UserInput {
    name: String
    phone: String
  }
`, `
  type Login {
    token: String
    user: User
  }
`, `
  extend type Query {
    me: User
  }
`, `
  extend type Mutation {
    signUp(email: String, password: String, fields: UserInput): Login
    signIn(email: String, password: String): Login
  }
`];
