import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, function () {
  console.log(`Server listening on port ${env.port}`);
});

server.on("error", function (error) {
  console.error("Server failed to start", error);
  process.exitCode = 1;
});