import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import app from "../package.json" assert { type: "json" };

const PORT = 80;

const currPath = (new URL(import.meta.url)).pathname
  .split('/').slice(0, -1).join('/');
const rootPath = currPath.split('/').slice(0, -1).join('/');

const assets = await Promise.all([
  Deno.readTextFile(`${currPath}/index.html`).then((data) => {
    return data.replace("{{version}}", app.version);
  }),
  Deno.readFile(`${currPath}/header.png`),
  Deno.readFile(`${currPath}/terminal.png`),
  Deno.readFile(`${rootPath}/install.sh`),
]);

serve((req: Request) => {
  if (req.url === "/" || req.url === "/index.html" || req.url === "/index") {
    return new Response(assets[0], {
      status: 200,
      headers: new Headers({
        "content-type": "text/html; charset=utf-8;",
      }),
    });
  } else if (req.url.includes('header.png')) {
    return new Response(assets[1], {
      headers: new Headers({
        "content-type": "image/png;",
      }),
    });
  } else if (req.url.includes('favicon.ico')) {
    return new Response("", {
      headers: new Headers({
        "content-type": "image/x-icon;",
      }),
    });
  } else if (req.url.includes('terminal.png')) {
    return new Response(assets[2], {
      headers: new Headers({
        "content-type": "image/png;",
      }),
    });
  } else if (req.url.includes('install') || req.url === "/install") {
    return new Response(assets[3], {
      headers: new Headers({
        "content-type": "application/x-sh;",
      }),
    });
  } else {
    return new Response(assets[0], {
      status: 200,
      headers: new Headers({
        "content-type": "text/html; charset=utf-8;",
      }),
    });
  }
  
}, { port: PORT });
