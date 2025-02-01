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
    console.log("🚀 Starting SSR build...");

    const buildPromises = pages.map(async (page) => {
      try {
        console.log(`📦 Building ${page} page...`);
        await build({
          build: {
            ssr: `client/views/${page}/entry-server.tsx`,
            outDir: `dist/server/${page}`,
            emitAssets: page === "error" ? true : false,
            manifest: true,
          },
        });

        console.log(`✅ ${page} page built successfully`);
      } catch (error) {
        console.error(`❌ Error building ${page} page:`, error);
        throw error;
      }
    });

    await Promise.all(buildPromises);
    console.log("✨ SSR build completed successfully");
  } catch (error) {
    console.error("🚨 Build failed:", error);
  }
}

// Usage
buildPages();
