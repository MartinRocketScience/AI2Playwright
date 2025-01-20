import { Hono } from "hono";
import { serve } from "@hono/node-server";

interface ServerInstance {
  close: () => void;
  port: number;
}

export const startServer = async (port: number): Promise<ServerInstance> => {
  const app = new Hono();

  app.get("/", (c) =>
    c.html(`<html>
  <body>
    <h1>Hello, Rayrun!</h1>
    <form id="search">
      <label>Search</label>
      <input type="text" name="query" data-testid="search-input" />
    </form>
    <div id="click-counter">
      <p>Click count: <span id="current-count" data-testid="current-count">0</span></p>
      <button id="click-button">Click me</button>
      <script>
      const clickButton = document.getElementById("click-button");
      const currentCount = document.getElementById("current-count");
      let clickCount = 0;
      clickButton.addEventListener("click", () => {
        currentCount.innerText = ++clickCount;
      });
      </script>
    </div>
  </body>
</html>`)
  );

  return new Promise((resolve) => {
    const server = serve(
      {
        fetch: app.fetch,
        port,
      },
      (info) => {
        console.log(`Server started on port ${info.port}`);
        resolve({
          close: () => {
            console.log(`Closing server on port ${info.port}`);
            server.close();
          },
          port: info.port,
        });
      }
    );

    // Handle errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      } else {
        console.error('Server error:', error);
      }
    });
  });
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer(3000);
}
