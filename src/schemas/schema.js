const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLID,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
  } = require("graphql");
  const User = require("../models/User");
  const Employee = require("../models/Employee");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  require("dotenv").config();
  
  // User Type
  const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      _id: { type: GraphQLID },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      created_at: { type: GraphQLString },
      updated_at: { type: GraphQLString },
    }),
  });
  
  // Employee Type
  const EmployeeType = new GraphQLObjectType({
    name: "Employee",
    fields: () => ({
      _id: { type: GraphQLID },
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      email: { type: GraphQLString },
      gender: { type: GraphQLString },
      designation: { type: GraphQLString },
      salary: { type: GraphQLFloat },
      date_of_joining: { type: GraphQLString },
      department: { type: GraphQLString },
      employee_photo: { type: GraphQLString },
    }),
  });
  
  // Root Query
  const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async () => {
          return await User.find();
        },
      },
      employees: {
        type: new GraphQLList(EmployeeType),
        resolve: async () => {
          return await Employee.find();
        },
      },
      message: {
        type: GraphQLString,
        resolve: () => "Hello, GraphQL!",
      },
    },
  });
  
  // Mutations
  const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      signup: {
        type: UserType,
        args: {
          username: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args) {
          const existingUser = await User.findOne({ email: args.email });
          if (existingUser) throw new Error("Email already exists");
  
          const hashedPassword = await bcrypt.hash(args.password, 10);
          const newUser = new User({
            username: args.username,
            email: args.email,
            password: hashedPassword,
          });
  
          return newUser.save();
        },
      },
    },
  });
  
  // Export Schema
  module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
  });
  