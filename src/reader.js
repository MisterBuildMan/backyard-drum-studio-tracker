import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname } from 'path';

/**
 * Recursively finds all files with given extensions
 */
function findFiles(dir, extensions, baseDir = dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir);
  for (const entry of entries) {
    // Skip hidden files/dirs and node_modules
    if (entry.startsWith('.') || entry === 'node_modules') continue;
    
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findFiles(fullPath, extensions, baseDir));
    } else if (extensions.includes(extname(entry).toLowerCase())) {
      results.push({
        path: relative(baseDir, fullPath),
        fullPath
      });
    }
  }
  return results;
}

/**
 * Reads all markdown content and lists images from a source directory.
 * Returns raw content - no parsing or interpretation.
 * 
 * @param {string} sourceDir - Path to source repository
 * @returns {object} - { files: [{path, content}], images: [paths] }
 */
export async function readSourceContent(sourceDir) {
  // Find and read all markdown files
  const mdFiles = findFiles(sourceDir, ['.md']);
  const files = mdFiles.map(f => ({
    path: f.path,
    content: readFileSync(f.fullPath, 'utf8')
  }));

  // Find all image files
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const imageFiles = findFiles(sourceDir, imageExtensions);
  const images = imageFiles.map(f => f.path);

  return { files, images };
}
