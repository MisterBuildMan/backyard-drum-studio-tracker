#!/usr/bin/env node
/**
 * Manual test script to verify extraction against the actual source repo.
 * Run with: node test-extraction.js
 */

import { extractContent } from './src/extractor.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  // Path to the sibling backyard-drum-studio repo
  const sourceDir = join(__dirname, '..', 'backyard-drum-studio');
  
  console.log('🔍 Extracting content from:', sourceDir);
  console.log('─'.repeat(60));
  
  try {
    const content = await extractContent(sourceDir);
    
    // Master Plan
    console.log('\n📋 MASTER PLAN');
    console.log(`   Phases: ${content.masterPlan.phases.length}`);
    for (const phase of content.masterPlan.phases) {
      const icon = phase.status === 'complete' ? '✅' : phase.status === 'in-progress' ? '🔄' : '⬜';
      console.log(`   ${icon} ${phase.number}. ${phase.name}`);
    }
    
    // Changelog
    console.log('\n📰 CHANGELOG');
    console.log(`   Entries: ${content.changelog.length}`);
    for (const entry of content.changelog.slice(0, 3)) {
      console.log(`   - ${entry.date}: ${entry.items.length} items`);
    }
    
    // Phases (from specs)
    console.log('\n📁 SPECS');
    console.log(`   Phase specs found: ${content.phases.length}`);
    for (const phase of content.phases) {
      console.log(`   - ${phase.id}: ${phase.completionPercentage}% complete`);
    }
    
    // Glossary
    console.log('\n📖 GLOSSARY');
    console.log(`   Terms: ${content.glossary.length}`);
    const categories = [...new Set(content.glossary.map(t => t.category))];
    console.log(`   Categories: ${categories.join(', ')}`);
    
    // Images
    console.log('\n🖼️  IMAGES');
    console.log(`   Found: ${content.images.length}`);
    
    // Metadata
    console.log('\n📊 METADATA');
    console.log(`   Project: ${content.metadata.name}`);
    console.log(`   Location: ${content.metadata.location}`);
    console.log(`   Current Phase: ${content.metadata.currentPhase}`);
    console.log(`   Overall Progress: ${content.metadata.overallProgress}%`);
    
    // Errors
    if (content.errors.length > 0) {
      console.log('\n⚠️  WARNINGS');
      for (const err of content.errors) {
        console.log(`   - ${err.file}: ${err.error}`);
      }
    }
    
    console.log('\n' + '─'.repeat(60));
    console.log('✅ Extraction completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Extraction failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
