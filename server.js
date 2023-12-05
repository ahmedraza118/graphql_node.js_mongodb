import express from 'express';
import mongoose from 'mongoose';
import { createHandler } from 'graphql-http/lib/use/express';
import  schema from "./schema.js";

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/school', { useNewUrlParser: true, useUnifiedTopology: true });

// Enable CORS for development purposes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
// Add middleware to parse JSON bodies
app.use(express.json());

app.all('/graphql', (req, res, next) => {
    console.log('Request received:', req.body); // Check the request body
    createHandler({
      schema,
      graphiql: true,
    })(req, res, next);
  });

const port = 3000;
app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
});
