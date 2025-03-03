const express = require("express");
const {ApolloServer} = require("@apollo/server");
const {expressMiddleware} = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

async function startServer(){
    const app = express();

    //we need to define what we will be accessing in the graphql server, hence it asks for typeDefs and resolvers
    //typeDefs is the schema of the data that we will be accessing
    //resolver stores the logic when the specific query will be performed
    const server = new ApolloServer({
        typeDefs : `
            type Todo {
                id : ID!
                task : String!
                completed : Boolean
            }
            type Query {
                getTodos : [Todo]
            }
        `,
        resolvers : {
            Query : {
                getTodos : ()=> [{id: 1, title : "Something Something", completed : false}]
            }
         }
    });

    app.use(cors());
    app.use(bodyParser.json());

    //start the server
    await server.start();
    //whenever someone try hitting the qraphQL endpoint, the expressMiddleware function will be triggered
    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, ()=> console.log("Server Started on Port 8000"))
}

startServer();



