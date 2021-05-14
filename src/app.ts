import { Server } from './server';

console.log("app starting .... ");
const server = new Server();

const starter = server.start(5000)
  .then(port => console.log(`Running on port ${port}`))
  .catch(error => {
    console.log(error)
});

process.on('exit', function () {
  console.log("app ending....");

});

process.on('SIGINT', function () {
  console.log('exiting....');
  process.exit();
});