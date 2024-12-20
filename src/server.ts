import { createServer } from "http";
import dotenv from "dotenv";
import { requestListener } from "./configuration/app_config";

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
