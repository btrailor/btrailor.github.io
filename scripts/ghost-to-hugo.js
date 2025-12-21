require("dotenv").config({ path: "../.env" });
const GhostContentAPI = require("@tryghost/content-api");
const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");
const https = require("https");
const http = require("http");

// Initialize Ghost API
const api = new GhostContentAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: "v5.0",
});

const CONTENT_DIR = path.join(
  __dirname,
  "..",
  "hugo-site",
  "content",
  "scrolls"
);

const IMAGES_DIR = path.join(
  __dirname,
  "..",
  "hugo-site",
  "static",
  "images",
  "scrolls"
);

// Download image from URL and save locally
async function downloadImage(imageUrl, slug) {
  if (!imageUrl) return null;

  try {
    // Extract file extension from URL
    const urlPath = new URL(imageUrl).pathname;
    const ext = path.extname(urlPath) || ".png";
    const filename = `${slug}-cover${ext}`;
    const localPath = path.join(IMAGES_DIR, filename);

    // Ensure images directory exists
    await fs.mkdir(IMAGES_DIR, { recursive: true });

    // Check if image already exists
    try {
      await fs.access(localPath);
      console.log(`    📷 Image already exists: ${filename}`);
      return `/images/scrolls/${filename}`;
    } catch {
      // Image doesn't exist, download it
    }

    // Download the image
    const protocol = imageUrl.startsWith("https") ? https : http;

    return new Promise((resolve, reject) => {
      protocol
        .get(imageUrl, (response) => {
          if (response.statusCode !== 200) {
            console.log(
              `    ⚠️ Could not download image (${response.statusCode})`
            );
            resolve(null);
            return;
          }

          const chunks = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", async () => {
            const buffer = Buffer.concat(chunks);
            await fs.writeFile(localPath, buffer);
            console.log(`    📷 Downloaded image: ${filename}`);
            resolve(`/images/scrolls/${filename}`);
          });
          response.on("error", reject);
        })
        .on("error", (err) => {
          console.log(`    ⚠️ Error downloading image: ${err.message}`);
          resolve(null);
        });
    });
  } catch (error) {
    console.log(`    ⚠️ Error processing image: ${error.message}`);
    return null;
  }
}

async function syncGhostToHugo() {
  try {
    console.log("🔄 Fetching posts from Ghost...");

    // Fetch all published posts
    const posts = await api.posts.browse({
      limit: "all",
      include: "tags,authors",
      formats: ["html"],
    });

    console.log(`📝 Found ${posts.length} posts`);

    // Ensure content directory exists
    await fs.mkdir(CONTENT_DIR, { recursive: true });

    // Process each post
    for (const post of posts) {
      await createHugoPost(post);
    }

    console.log("✅ Sync complete!");
  } catch (error) {
    console.error("❌ Error syncing Ghost to Hugo:", error);
    process.exit(1);
  }
}

async function createHugoPost(post) {
  // Download feature image if exists
  let localImagePath = null;
  if (post.feature_image) {
    localImagePath = await downloadImage(post.feature_image, post.slug);
  }

  // Build Hugo front matter
  const frontMatter = {
    title: post.title,
    date: post.published_at,
    lastmod: post.updated_at,
    draft: false,
    slug: post.slug,
    tags: post.tags.map((tag) => tag.name),
    author: post.primary_author?.name || "Brett Gershon",
    description: post.excerpt || "",
  };

  // Add feature image if successfully downloaded
  if (localImagePath) {
    frontMatter.image = localImagePath;
  }

  // Use Ghost's HTML content
  const content = post.html;

  // Create the Hugo markdown file
  const hugoPost = `---
${yaml.dump(frontMatter).trim()}
---

${content}
`;

  const filename = `${post.slug}.md`;
  const filepath = path.join(CONTENT_DIR, filename);

  await fs.writeFile(filepath, hugoPost);
  console.log(`  ✅ Created/updated ${filename}`);
}

// Run the sync
syncGhostToHugo();
