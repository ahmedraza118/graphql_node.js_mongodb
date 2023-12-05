import express from 'express';
import mongoose from 'mongoose';
import { createHandler } from 'graphql-http/lib/use/express';
import  schema from "./schema.js";

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());

app.all('/graphql', (req, res, next) => {
    console.log('Request received:', req.body); // Check the request body
    createHandler({
      schema,
      graphiql: true,
    })(req, res, next);
  });

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost/school', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
};

const startServer = () => {
  app.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  });
};

// Connect to the database and then start the server
connectToDatabase().then(startServer);
