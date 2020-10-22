import { Server } from './server';

console.log("app starting .... ");

const starter = new Server().start(3000)
  .then(port => console.log(`Running on port ${port}`))
  .catch(error => {
    console.log(error)
});