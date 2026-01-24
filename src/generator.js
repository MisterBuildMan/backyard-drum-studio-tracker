import { readFileSync } from 'fs';
import { createBedrockClient } from './bedrock.js';

/**
 * Builds the prompt for Claude to generate the website
 */
function buildPrompt(sourceContent, designSystem, siteConfig) {
  const { files, images } = sourceContent;
  
  let prompt = `You are a web developer generating a static website for a DIY construction project tracker.

## Your Task
Generate a complete static website based on the source content below. Follow the design system exactly.

## Site Configuration
- Title: ${siteConfig.title}
- Description: ${siteConfig.description}

## Design System
${designSystem}

## Source Content

The following markdown files contain all the project information. Interpret them to build the website:

`;

  // Add all source files
  for (const file of files) {
    prompt += `### File: ${file.path}\n\`\`\`markdown\n${file.content}\n\`\`\`\n\n`;
  }

  // Add image list
  if (images.length > 0) {
    prompt += `### Available Images\n`;
    for (const img of images) {
      prompt += `- ${img}\n`;
    }
    prompt += '\n';
  }

  prompt += `## Instructions

1. Generate 4 HTML pages: index.html, phases.html, progress.html, glossary.html
2. Generate 1 CSS file: styles.css
3. Follow the design system components and colors exactly
4. Parse the markdown content to extract:
   - Project phases and their status from master-plan.md
   - Recent updates from CHANGELOG.md
   - Glossary terms from glossary.md
   - Task completion from specs/*/tasks.md
5. Calculate completion percentages based on checkbox states: [ ] = incomplete, [x] = complete, [-] = in progress
6. Make the site responsive and accessible
7. Include proper navigation between pages
8. Show the current date as the "last updated" date

## Output Format

Return ONLY a valid JSON object with this exact structure (no markdown code blocks, just raw JSON):

{
  "files": [
    { "path": "index.html", "content": "<!DOCTYPE html>..." },
    { "path": "phases.html", "content": "<!DOCTYPE html>..." },
    { "path": "progress.html", "content": "<!DOCTYPE html>..." },
    { "path": "glossary.html", "content": "<!DOCTYPE html>..." },
    { "path": "styles.css", "content": ":root { ... }" }
  ]
}`;

  return prompt;
}

/**
 * Parses Claude's response to extract generated files
 */
function parseResponse(responseText) {
  // Try to find JSON in the response
  let jsonStr = responseText.trim();
  
  // Remove markdown code blocks if present
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  
  try {
    const result = JSON.parse(jsonStr);
    
    if (!result.files || !Array.isArray(result.files)) {
      throw new Error('Response missing "files" array');
    }
    
    // Validate each file has path and content
    for (const file of result.files) {
      if (!file.path || typeof file.content !== 'string') {
        throw new Error(`Invalid file entry: ${JSON.stringify(file)}`);
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error.message}\n\nResponse was:\n${responseText.substring(0, 500)}...`);
  }
}

/**
 * Generates the website using Claude
 * 
 * @param {object} sourceContent - { files: [{path, content}], images: [paths] }
 * @param {string} designSystem - The design system markdown content
 * @param {object} config - { aws: {region, modelId}, site: {title, description} }
 * @returns {object} - { files: [{path, content}] }
 */
export async function generateSite(sourceContent, designSystem, config) {
  const bedrockClient = createBedrockClient(config.aws);
  
  const prompt = buildPrompt(sourceContent, designSystem, config.site);
  
  console.log('Calling Claude to generate website...');
  const response = await bedrockClient.invoke(prompt);
  
  console.log('Parsing response...');
  const result = parseResponse(response);
  
  console.log(`Generated ${result.files.length} files`);
  return result;
}
