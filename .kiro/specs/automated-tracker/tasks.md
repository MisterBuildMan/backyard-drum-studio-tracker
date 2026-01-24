# Implementation Plan: Automated Tracker

## Overview

This plan implements an automated website generator that monitors a GitHub repository and uses AWS Bedrock/Claude to generate a static website deployed to GitHub Pages. The implementation uses Node.js with ES modules.

## Tasks

- [x] 0. Initialize git repository
  - [x] 0.1 Initialize git repo in backyard-drum-studio-tracker directory
  - [x] 0.2 Create .gitignore file (node_modules, dist, .env, etc.)
  - [x] 0.3 Create README.md with project overview
  - [x] 0.4 Make initial commit with spec files
  - [x] 0.5 Create GitHub repo and push (manual)

- [ ] 1. Set up project structure and configuration
  - [ ] 1.1 Initialize Node.js project with package.json
    - Set up ES modules, add dependencies (aws-sdk, js-yaml, marked, fast-check)
    - _Requirements: 8.1_
  - [ ] 1.2 Create config.yaml with default configuration
    - Include source repo, AWS settings, site metadata, output settings
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [ ] 1.3 Implement configuration loader (src/config.js)
    - Parse YAML, validate required fields, return TrackerConfig object
    - _Requirements: 8.1, 8.5_
  - [ ] 1.4 Write property test for config parsing round-trip
    - **Property 14: Valid config parsing round-trip**
    - **Validates: Requirements 8.1**
  - [ ] 1.5 Write property test for invalid config error messages
    - **Property 15: Invalid config produces descriptive error**
    - **Validates: Requirements 8.5**

- [ ] 2. Implement content extractor module
  - [ ] 2.1 Create markdown parser utilities (src/utils/markdown.js)
    - Parse task checkboxes, extract headings, parse glossary format
    - _Requirements: 2.3, 2.7_
  - [ ] 2.2 Implement master-plan.md extractor (src/extractor.js)
    - Parse phase list with status indicators
    - _Requirements: 2.1_
  - [ ] 2.3 Write property test for master plan extraction
    - **Property 1: Master plan extraction preserves phases**
    - **Validates: Requirements 2.1**
  - [ ] 2.4 Implement CHANGELOG.md extractor
    - Parse date-grouped entries with completion status
    - _Requirements: 2.2_
  - [ ] 2.5 Write property test for changelog extraction
    - **Property 2: Changelog extraction preserves entries**
    - **Validates: Requirements 2.2**
  - [ ] 2.6 Implement tasks.md extractor
    - Parse nested task checkboxes, calculate completion percentage
    - _Requirements: 2.3, 2.7_
  - [ ] 2.7 Write property test for task extraction
    - **Property 3: Task extraction preserves status**
    - **Validates: Requirements 2.3**
  - [ ] 2.8 Write property test for completion percentage
    - **Property 6: Completion percentage calculation is accurate**
    - **Validates: Requirements 2.7**
  - [ ] 2.9 Implement glossary.md extractor
    - Parse terms by category with definitions
    - _Requirements: 2.4_
  - [ ] 2.10 Write property test for glossary extraction
    - **Property 4: Glossary extraction preserves terms**
    - **Validates: Requirements 2.4**
  - [ ] 2.11 Implement image asset discovery
    - Scan images/ directory, create ImageAsset objects
    - _Requirements: 2.6_
  - [ ] 2.12 Write property test for image discovery
    - **Property 5: Image discovery is complete**
    - **Validates: Requirements 2.6**
  - [ ] 2.13 Implement partial extraction error handling
    - Continue on file errors, log warnings
    - _Requirements: 6.2_
  - [ ] 2.14 Write property test for partial extraction
    - **Property 17: Partial extraction continues on file errors**
    - **Validates: Requirements 6.2**

- [ ] 3. Checkpoint - Verify extraction works
  - Run extraction against sample source repo content
  - Ensure all tests pass, ask the user if questions arise

- [ ] 4. Implement AI generator module
  - [ ] 4.1 Create design-system.md template
    - Define colors, typography, components, page templates
    - _Requirements: 4.1, 4.2_
  - [ ] 4.2 Implement Bedrock client wrapper (src/bedrock.js)
    - Configure client with model from config, implement invoke method
    - _Requirements: 7.4_
  - [ ] 4.3 Write property test for model configuration
    - **Property 13: Bedrock client uses configured model**
    - **Validates: Requirements 7.4**
  - [ ] 4.4 Implement retry logic with exponential backoff
    - Retry up to 3 times with 1s, 2s, 4s delays
    - _Requirements: 6.1_
  - [ ] 4.5 Write property test for retry logic
    - **Property 16: Retry logic respects max attempts**
    - **Validates: Requirements 6.1**
  - [ ] 4.6 Implement prompt builder (src/generator.js)
    - Construct prompts with design system and content context
    - _Requirements: 4.3_
  - [ ] 4.7 Write property test for prompt construction
    - **Property 12: Prompt includes design system**
    - **Validates: Requirements 4.3**
  - [ ] 4.8 Implement HTML validator (src/utils/validator.js)
    - Validate well-formed HTML, check required elements
    - _Requirements: 3.7, 6.3_
  - [ ] 4.9 Write property test for HTML validation
    - **Property 11: Generated HTML is valid**
    - **Property 18: HTML validator rejects malformed content**
    - **Validates: Requirements 3.7, 6.3**
  - [ ] 4.10 Implement page generators
    - Generate home, phases, progress, glossary pages
    - _Requirements: 3.2, 3.3, 3.4, 3.5_
  - [ ] 4.11 Write property tests for page content
    - **Property 7: Generated home page contains project metadata**
    - **Property 8: Generated phases page contains all phases**
    - **Property 9: Generated progress page contains changelog entries**
    - **Property 10: Generated glossary page contains all terms**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**

- [ ] 5. Checkpoint - Verify generation works
  - Test generation with mocked Bedrock responses
  - Ensure all tests pass, ask the user if questions arise

- [ ] 6. Implement deployer module
  - [ ] 6.1 Implement file writer (src/deployer.js)
    - Write HTML/CSS to output directory, copy image assets
    - _Requirements: 5.4_
  - [ ] 6.2 Implement git operations for gh-pages branch
    - Commit generated files, prepare for push
    - _Requirements: 5.4_

- [ ] 7. Create GitHub Actions workflow
  - [ ] 7.1 Create workflow file (.github/workflows/generate-site.yml)
    - Configure triggers (repository_dispatch, workflow_dispatch)
    - _Requirements: 1.1, 1.3_
  - [ ] 7.2 Add AWS OIDC authentication step
    - Configure assume-role with web identity
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ] 7.3 Add source repo checkout step
    - Clone source repo at triggered commit
    - _Requirements: 1.2_
  - [ ] 7.4 Add extraction, generation, and deployment steps
    - Run Node.js scripts in sequence
    - _Requirements: 5.1_
  - [ ] 7.5 Add error handling and notifications
    - Report failures in workflow summary
    - _Requirements: 6.5_
  - [ ] 7.6 Add logging for trigger events
    - Log timestamp and commit SHA
    - _Requirements: 1.4_

- [ ] 8. Create source repo webhook (documentation)
  - [ ] 8.1 Document webhook setup for source repository
    - Instructions to add repository_dispatch trigger
    - _Requirements: 1.1_

- [ ] 9. Final checkpoint - End-to-end verification
  - Test full workflow with manual dispatch
  - Verify generated site deploys to GitHub Pages
  - Ensure all tests pass, ask the user if questions arise

## Notes

- All property tests are required for comprehensive coverage
- AWS OIDC setup requires one-time IAM configuration in the user's AWS account
- The design-system.md can be iterated on after initial deployment to refine the website appearance
- Source repo webhook setup is a one-time manual step documented in task 8.1
