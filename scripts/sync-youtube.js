import { google } from 'googleapis';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// --- Recreate __dirname for ES Modules ---
// This is necessary because __dirname is not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Configuration ---
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = 'PLNYkxOF6rcIA46I-YCX3ASF4SRb548z8s';
// Use the channel name as the default author
const AUTHOR_NAME = 'WebAssembly';
const AUTHOR_GITHUB_HANDLE = 'WebAssembly'; // Fallback if a specific author isn't found
const POSTS_DIR = path.join(__dirname, '..', '_posts');
// --- End Configuration ---

if (!YOUTUBE_API_KEY) {
  console.error('Error: YOUTUBE_API_KEY environment variable not set.');
  process.exit(1);
}

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY,
});

/**
 * Reads the _posts directory and returns a Set of existing video IDs
 * based on the filename format: YYYY-MM-DD-videoID.md
 */
function getExistingVideoIds() {
  if (!existsSync(POSTS_DIR)) {
    mkdirSync(POSTS_DIR, { recursive: true });
  }
  const files = readdirSync(POSTS_DIR);
  const videoIds = new Set();
  const regex = /^\d{4}-\d{2}-\d{2}-([a-zA-Z0-9_-]{11})\.md$/;

  files.forEach((file) => {
    const match = file.match(regex);
    if (match && match[1]) {
      videoIds.add(match[1]);
    }
  });
  console.log(`Found ${videoIds.size} existing video posts.`);
  return videoIds;
}

/**
 * Fetches all video items from a given YouTube playlist.
 * Handles pagination automatically.
 */
async function getPlaylistItems(playlistId) {
  let allItems = [];
  let nextPageToken = null;

  console.log(`Fetching videos from playlist: ${playlistId}`);

  do {
    const res = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: playlistId,
      maxResults: 50,
      pageToken: nextPageToken,
    });

    allItems = allItems.concat(res.data.items);
    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  console.log(`Fetched a total of ${allItems.length} videos.`);
  return allItems;
}

/**
 * Generates the Markdown content for a blog post.
 */
function createPostContent(video) {
  const videoId = video.snippet.resourceId.videoId;
  const title = `🎧 WasmAssembly—${video.snippet.title.trim().replace(/"/g, '\\"').replace(/\s-\sWasmAssembly$/, '')}`;
  const publishedDate = new Date(video.snippet.publishedAt)
    .toISOString()
    .split('T')[0];
  const formattedDate = new Date(video.snippet.publishedAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  // Simple heuristic to extract an author handle from the title, e.g., "Title | by @author"
  let authorName = AUTHOR_NAME;
  let authorHandle = AUTHOR_GITHUB_HANDLE;
  const authorMatch = title.match(/by\s+([a-zA-Z0-9_.-]+)/i);
  if (authorMatch && authorMatch[1]) {
    authorName = authorMatch[1].replace('@', '');
    authorHandle = authorName; // Assume GH handle is the same
  }

  // The Jekyll post format
  return `---
title: "${title}"
author: '${authorName}'
---

# WasmAssembly podcast episode: ${video.snippet.title}

Published on ${formattedDate} by ${authorName}.

Check out the latest video from our YouTube channel!

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/%24{videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<details>
<summary>Video Description</summary>
<p>${video.snippet.description.replace(/\n/g, '')}</p>
</details>
`;
}

async function main() {
  try {
    const existingIds = getExistingVideoIds();
    const playlistItems = await getPlaylistItems(PLAYLIST_ID);
    let newPostsCreated = 0;

    for (const item of playlistItems) {
      const videoId = item.snippet.resourceId.videoId;

      if (!videoId) {
        console.warn(`Skipping item with no video ID: ${item.snippet.title}`);
        continue;
      }

      if (!existingIds.has(videoId)) {
        console.log(
          `New video found: "${item.snippet.title}" (ID: ${videoId})`
        );

        const content = createPostContent(item);
        const publishedDate = new Date(item.snippet.publishedAt)
          .toISOString()
          .split('T')[0];
        const fileName = `${publishedDate}-${videoId}.md`;
        const filePath = path.join(POSTS_DIR, fileName);

        writeFileSync(filePath, content);
        console.log(`  -> Created post: ${filePath}`);
        newPostsCreated++;
      }
    }

    if (newPostsCreated === 0) {
      console.log('No new videos found. Everything is up-to-date.');
    } else {
      console.log(`Successfully created ${newPostsCreated} new post(s).`);
    }
  } catch (error) {
    console.error('An error occurred during the sync process:', error);
    process.exit(1);
  }
}

main();
