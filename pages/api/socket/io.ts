import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
      cors: {
        origin: ["https://interact-zeta.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;

/*
🧱 Now let’s break down the code
ts
Copy code
// Importing necessary types
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types"; // custom type to help TypeScript understand what's going on
🔧 export const config
ts
Copy code
export const config = {
  api: {
    bodyParser: false,
  },
};
This disables Next.js's body parser.

Reason: WebSocket communication doesn't use JSON bodies like regular HTTP, so the parser would break the connection.

⚙️ The main handler function
ts
Copy code
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
This is the function that will be run when the route is hit (like /api/socket/io).

🧠 What happens inside the function:
ts
Copy code
if (!res.socket.server.io) {
This checks:

“Has Socket.IO already been initialized?”

You only want to start it once — otherwise every request will create a new Socket.IO server (which causes bugs and crashes).

🏗 If not initialized:
ts
Copy code
const path = "/api/socket/io"; // custom path for socket
const httpServer: NetServer = res.socket.server as any; // get the raw HTTP server
res.socket.server gives you the underlying Node.js HTTP server

as any tells TypeScript to chill — we know what we're doing here

ts
Copy code
const io = new ServerIO(httpServer, {
  path: path,
  addTrailingSlash: false,
});
This creates the Socket.IO server attached to your HTTP server

path is the URL path clients will connect to (e.g., /api/socket/io)

🧷 Attach the io server to your response object:
ts
Copy code
res.socket.server.io = io;
This is the magic: you store the Socket.IO server on the server instance so it persists and doesn't get recreated every time.

✅ Done — end the request
ts
Copy code
res.end();
This just ends the API call. The Socket.IO server will stay running on the background.
*/
