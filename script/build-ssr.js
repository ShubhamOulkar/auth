import { build } from "vite";

const pages = [
  {
    name: "root",
    entry: `pages/root/entry-server.tsx`,
    outDir: `dist/server/root`,
  },
  {
    name: "conf",
    entry: `pages/conf/entry-server.tsx`,
    outDir: `dist/server/conf`,
  },
];

async function buildPages() {
  for (const page of pages) {
    await build({
      build: {
        ssr: page.entry,
        outDir: page.outDir,
      },
    });
    console.log(`Built ${page.name} page`);
  }
}

buildPages().catch(console.error);
