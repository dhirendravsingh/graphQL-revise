const express = require("express");
const {ApolloServer} = require("@apollo/server");
const {expressMiddleware} = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const {default : axios }= require("axios");

async function startServer(){
    const app = express();

    //we need to define what we will be accessing in the graphql server, hence it asks for typeDefs and resolvers
    //typeDefs is the schema of the data that we will be accessing
    //resolver stores the logic when the specific query will be performed
    const server = new ApolloServer({
        typeDefs : `
            type User {
                id : ID!
                name : String!
                username : String!
                email : String!
                phone : String!
                website : String!
            }
            type Todo {
                id : ID!
                task : String!
                completed : Boolean
                user : User
            }
            type Query {
                //this will be creating a query to get all the todos
                getTodos : [Todo]
                //this will be creating a query to get all the users
                getAllUsers : [User]
                //this will be creating a query to get a specific user
                getUser(id : ID!) : User
            
            }
        `,
        resolvers : {
            Todo : {
                user : async (todo) => await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`).data
            },
            Query : {
                getTodos : async ()=> (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
                getAllUsers : async ()=> (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
                getUser : async (parent, {id})=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
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



