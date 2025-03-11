export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    active: Boolean!
    emailVerified: Boolean!
    createdAt: String!
    updatedAt: String!
    lastLogin: String
    avatar: String
    roles: [Role!]
  }

  type Role {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    updatedAt: String!
    permissions: [Permission!]
  }

  type Permission {
    id: ID!
    code: String!
    description: String
    service: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateUserInput {
    email: String!
    password: String!
    firstName: String
    lastName: String
  }

  input UpdateUserInput {
    email: String
    firstName: String
    lastName: String
    active: Boolean
    avatar: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
    user(id: ID!): User
    users(offset: Int = 0, limit: Int = 10): [User!]!
    role(id: ID!): Role
    roles: [Role!]!
    permissions: [Permission!]!
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    assignRole(userId: ID!, roleId: ID!): User!
    removeRole(userId: ID!, roleId: ID!): User!
  }
`;