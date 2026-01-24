# Implementation Plan: Automated Tracker (Simplified)

## Overview

This plan implements an automated website generator using a simplified approach: read raw markdown files from the source repo and let Claude generate the website directly. No complex parsing or extraction logic needed.

## Tasks

- [x] 0. Initialize git repository
  - [x] 0.1 Initialize git repo
  - [x] 0.2 Create .gitignore file
  - [x] 0.3 Create README.md
  - [x] 0.4 Make initial commit
  - [x] 0.5 Create GitHub repo and push (manual)

- [x] 1. Set up project structure and configuration
  - [x] 1.1 Initialize Node.js project with package.json
  - [x] 1.2 Create config.yaml with default configuration
  - [x] 1.3 Implement configuration loader (src/config.js)

- [x] 2. Implement simple content reader
  - [x] 2.1 Create src/reader.js
    - Read all .md files recursively from source directory
    - List all image file paths
    - Return raw content (no parsing)
    - _Requirements: 2.1-2.6_

- [x] 3. Implement AI generator module
  - [x] 3.1 Create design-system.md template
    - Define colors, typography, components, page templates
    - Include example HTML/CSS patterns for Claude to follow
    - _Requirements: 4.1, 4.2_
  - [x] 3.2 Implement Bedrock client (src/bedrock.js)
    - Configure client with model from config
    - Implement invoke method with retry logic (3 retries, exponential backoff)
    - _Requirements: 6.1, 7.4_
  - [x] 3.3 Implement prompt builder and generator (src/generator.js)
    - Build prompt with design system + raw markdown content
    - Call Bedrock and parse JSON response
    - Extract generated HTML/CSS files
    - _Requirements: 3.1-3.6, 4.3_

- [x] 4. Implement deployer module
  - [x] 4.1 Implement file writer (src/deployer.js)
    - Write generated HTML/CSS to output directory
    - Copy image assets from source
    - _Requirements: 5.4_
  - [x] 4.2 Implement git operations for gh-pages branch
    - Commit generated files, prepare for push
    - _Requirements: 5.4_

- [x] 5. Create main entry point
  - [x] 5.1 Create src/index.js
    - Wire together: read → generate → deploy
    - Handle errors gracefully
    - _Requirements: 6.2, 6.4_

- [x] 6. Create GitHub Actions workflow
  - [x] 6.1 Create .github/workflows/generate-site.yml
    - Configure triggers (repository_dispatch, workflow_dispatch)
    - Add AWS OIDC authentication
    - Clone source repo, run generator, deploy
    - _Requirements: 1.1-1.4, 7.1-7.3_

- [x] 7. Final verification
  - Test full workflow with manual dispatch
  - Verify generated site deploys to GitHub Pages

## Notes

- This simplified approach removes ~80% of the original code
- Claude handles all markdown interpretation directly
- No property-based tests needed for extraction (there is no extraction)
- Focus testing on integration and config validation
