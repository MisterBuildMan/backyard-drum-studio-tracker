# Backyard Drum Studio Tracker

Automated website generator that monitors the [backyard-drum-studio](https://github.com/MisterBuildMan/backyard-drum-studio) repository and generates a live progress website using AI.

## How It Works

1. **Trigger**: Commits to the source repo trigger a GitHub Actions workflow
2. **Extract**: Parses markdown files (master-plan, changelog, specs, glossary)
3. **Generate**: Uses AWS Bedrock/Claude to generate HTML/CSS
4. **Deploy**: Publishes to GitHub Pages

## Features

- AI-generated website content from markdown documentation
- Automatic updates on every commit to source repo
- Design system for consistent styling
- Progress tracking with task completion percentages
- Glossary and phase documentation

## Setup

See `.kiro/specs/automated-tracker/` for full requirements and implementation details.

## Configuration

Edit `config.yaml` to customize:
- Source repository URL
- AWS region and Bedrock model
- Site metadata
- Output settings

## License

MIT
