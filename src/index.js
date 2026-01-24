#!/usr/bin/env node
/**
 * Main entry point for the Backyard Drum Studio Tracker
 * 
 * Usage: node src/index.js [source-dir]
 * 
 * If source-dir is not provided, clones the configured repository.
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { loadConfig } from './config.js';
import { readSourceContent } from './reader.js';
import { generateSite } from './generator.js';
import { deploy } from './deployer.js';

async function main() {
  console.log('🥁 Backyard Drum Studio Tracker\n');
  
  try {
    // Load configuration
    console.log('Loading configuration...');
    const config = loadConfig('config.yaml');
    
    // Determine source directory
    let sourceDir = process.argv[2];
    
    if (!sourceDir) {
      // Clone the source repository
      sourceDir = 'source-repo';
      const repoUrl = `https://github.com/${config.source.repository}.git`;
      
      console.log(`Cloning ${config.source.repository}...`);
      if (existsSync(sourceDir)) {
        execSync(`rm -rf ${sourceDir}`, { stdio: 'pipe' });
      }
      execSync(`git clone --depth 1 --branch ${config.source.branch} ${repoUrl} ${sourceDir}`, { stdio: 'pipe' });
    }
    
    console.log(`Reading source content from ${sourceDir}...`);
    const sourceContent = await readSourceContent(sourceDir);
    console.log(`  Found ${sourceContent.files.length} markdown files`);
    console.log(`  Found ${sourceContent.images.length} images`);
    
    // Load design system
    console.log('Loading design system...');
    const designSystem = readFileSync('design-system.md', 'utf8');
    
    // Generate website
    console.log('\nGenerating website with Claude...');
    const generatedSite = await generateSite(sourceContent, designSystem, config);
    
    // Deploy
    await deploy(generatedSite, sourceContent.images, sourceDir, config);
    
    console.log('\n🎉 Done! Site generated in', config.output.directory);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
