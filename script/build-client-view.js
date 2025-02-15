import { build } from "vite";

const pages = ["root", "login", "signup", "forgotpassword", "profile"];

async function buildPages() {
  try {
    console.log("🚀 build client views...");

    const buildPromises = pages.map(async (page) => {
      try {
        console.log(`📦 Building client ${page} page...`);
        await build({
          html: { cspNonce: "nonce-value" },
          build: {
            rollupOptions: {
              input: `./client/views/${page}/${page}.html`,
            },
            outDir: `dist/ssr`,
            assetsDir: "assets",
          },
        });

        console.log(`✅client ${page} page built successfully`);
      } catch (error) {
        console.error(`❌ Error building client ${page} page:`, error);
        throw error;
      }
    });

    await Promise.all(buildPromises);
    console.log("✨ client build completed successfully");
  } catch (error) {
    console.error("🚨client Build failed:", error);
  }
}

// Usage
buildPages();
