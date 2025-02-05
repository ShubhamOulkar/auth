import { build } from "vite";

/**
 * Array of page names to be built for server-side rendering
 * @type {string[]}
 */

const pages = ["root", "login", "signup", "error", "forgotpassword", "profile"];

/**
 * Builds server-side rendering bundles for specified pages
 * @param {BuildConfig} [config=defaultBuildConfig] - Build configuration options
 * @returns {Promise<void>}
 */

async function buildPages() {
  try {
    console.log("🚀 building server views...");

    const buildPromises = pages.map(async (page) => {
      try {
        console.log(`📦 Building server ${page} page...`);
        await build({
          build: {
            ssr: `client/views/${page}/entry-server.tsx`,
            outDir: `dist/ssr/serverViews/${page}`,
            emitAssets: page === "error" ? true : false,
            manifest: true,
          },
        });

        console.log(`✅server ${page} page built successfully`);
      } catch (error) {
        console.error(`❌ Error building server ${page} page:`, error);
        throw error;
      }
    });

    await Promise.all(buildPromises);
    console.log("✨ server build completed successfully");
  } catch (error) {
    console.error("🚨 server Build failed:", error);
  }
}

// Usage
buildPages();
