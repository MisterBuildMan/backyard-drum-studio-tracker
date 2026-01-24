import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';

/**
 * Writes generated files to the output directory
 * 
 * @param {Array} files - Array of {path, content} objects
 * @param {string} outputDir - Output directory path
 */
export function writeFiles(files, outputDir) {
  // Ensure output directory exists
  mkdirSync(outputDir, { recursive: true });
  
  for (const file of files) {
    const fullPath = join(outputDir, file.path);
    const dir = dirname(fullPath);
    
    // Ensure subdirectory exists
    if (dir !== outputDir) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(fullPath, file.content, 'utf8');
    console.log(`  Written: ${file.path}`);
  }
}

/**
 * Copies image assets from source to output directory
 * 
 * @param {Array} images - Array of relative image paths
 * @param {string} sourceDir - Source directory
 * @param {string} outputDir - Output directory
 */
export function copyImages(images, sourceDir, outputDir) {
  if (images.length === 0) return;
  
  const imagesOutputDir = join(outputDir, 'images');
  mkdirSync(imagesOutputDir, { recursive: true });
  
  for (const imagePath of images) {
    const sourcePath = join(sourceDir, imagePath);
    const destPath = join(outputDir, imagePath);
    const destDir = dirname(destPath);
    
    if (existsSync(sourcePath)) {
      mkdirSync(destDir, { recursive: true });
      copyFileSync(sourcePath, destPath);
      console.log(`  Copied: ${imagePath}`);
    }
  }
}

/**
 * Commits generated files to the gh-pages branch
 * 
 * @param {string} outputDir - Output directory with generated files
 * @param {string} branch - Target branch (e.g., 'gh-pages')
 */
export function commitToGhPages(outputDir, branch = 'gh-pages') {
  const cwd = outputDir;
  
  try {
    // Initialize git if needed
    if (!existsSync(join(outputDir, '.git'))) {
      execSync('git init', { cwd, stdio: 'pipe' });
      execSync(`git checkout -b ${branch}`, { cwd, stdio: 'pipe' });
    }
    
    // Configure git user (for CI environments)
    execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { cwd, stdio: 'pipe' });
    execSync('git config user.name "github-actions[bot]"', { cwd, stdio: 'pipe' });
    
    // Stage all files
    execSync('git add -A', { cwd, stdio: 'pipe' });
    
    // Commit with timestamp
    const timestamp = new Date().toISOString();
    execSync(`git commit -m "Generated site: ${timestamp}"`, { cwd, stdio: 'pipe' });
    
    console.log(`  Committed to ${branch} branch`);
    return true;
  } catch (error) {
    // If nothing to commit, that's okay
    if (error.message.includes('nothing to commit')) {
      console.log('  No changes to commit');
      return false;
    }
    throw error;
  }
}

/**
 * Full deployment: write files, copy images, commit
 * 
 * @param {object} generatedSite - { files: [{path, content}] }
 * @param {Array} images - Array of image paths from source
 * @param {string} sourceDir - Source directory for images
 * @param {object} config - { output: { directory, branch } }
 */
export async function deploy(generatedSite, images, sourceDir, config) {
  const { directory: outputDir, branch } = config.output;
  
  console.log(`\nDeploying to ${outputDir}/`);
  
  // Write generated HTML/CSS
  console.log('Writing generated files...');
  writeFiles(generatedSite.files, outputDir);
  
  // Copy images
  if (images.length > 0) {
    console.log('Copying images...');
    copyImages(images, sourceDir, outputDir);
  }
  
  // Commit to gh-pages
  console.log('Committing to git...');
  commitToGhPages(outputDir, branch);
  
  console.log('\n✅ Deployment complete!');
}
