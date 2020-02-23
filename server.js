const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connection Successful');
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on ${port}`);
});