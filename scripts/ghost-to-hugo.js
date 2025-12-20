require("dotenv").config({ path: "../.env" });
const GhostContentAPI = require("@tryghost/content-api");
const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");

// Initialize Ghost API
const api = new GhostContentAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: "v5.0",
});

const CONTENT_DIR = path.join(__dirname, "..", "hugo-site", "content", "words");

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

  // Add feature image if exists
  if (post.feature_image) {
    frontMatter.image = post.feature_image;
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
