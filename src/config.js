import { readFileSync } from 'fs';
import yaml from 'js-yaml';

/**
 * Configuration validation error with descriptive message
 */
export class ConfigValidationError extends Error {
  constructor(field, message) {
    super(`Configuration error in '${field}': ${message}`);
    this.name = 'ConfigValidationError';
    this.field = field;
  }
}

/**
 * Validates the source configuration section
 */
function validateSource(source) {
  if (!source) {
    throw new ConfigValidationError('source', 'source section is required');
  }
  if (!source.repository || typeof source.repository !== 'string') {
    throw new ConfigValidationError('source.repository', 'repository must be a non-empty string');
  }
  if (!source.branch || typeof source.branch !== 'string') {
    throw new ConfigValidationError('source.branch', 'branch must be a non-empty string');
  }
}

/**
 * Validates the AWS configuration section
 */
function validateAws(aws) {
  if (!aws) {
    throw new ConfigValidationError('aws', 'aws section is required');
  }
  if (!aws.region || typeof aws.region !== 'string') {
    throw new ConfigValidationError('aws.region', 'region must be a non-empty string');
  }
  if (!aws.modelId || typeof aws.modelId !== 'string') {
    throw new ConfigValidationError('aws.modelId', 'modelId must be a non-empty string');
  }
}

/**
 * Validates the site configuration section
 */
function validateSite(site) {
  if (!site) {
    throw new ConfigValidationError('site', 'site section is required');
  }
  if (!site.title || typeof site.title !== 'string') {
    throw new ConfigValidationError('site.title', 'title must be a non-empty string');
  }
}

/**
 * Validates the output configuration section
 */
function validateOutput(output) {
  if (!output) {
    throw new ConfigValidationError('output', 'output section is required');
  }
  if (!output.directory || typeof output.directory !== 'string') {
    throw new ConfigValidationError('output.directory', 'directory must be a non-empty string');
  }
  if (!output.branch || typeof output.branch !== 'string') {
    throw new ConfigValidationError('output.branch', 'branch must be a non-empty string');
  }
}

/**
 * Validates the complete configuration object
 */
export function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new ConfigValidationError('root', 'configuration must be an object');
  }
  
  validateSource(config.source);
  validateAws(config.aws);
  validateSite(config.site);
  validateOutput(config.output);
  
  return config;
}

/**
 * Loads and validates configuration from a YAML file
 */
export function loadConfig(configPath = 'config.yaml') {
  const content = readFileSync(configPath, 'utf8');
  const config = yaml.load(content);
  return validateConfig(config);
}

/**
 * Serializes configuration to YAML string
 */
export function serializeConfig(config) {
  return yaml.dump(config);
}

/**
 * Parses configuration from YAML string
 */
export function parseConfig(yamlString) {
  const config = yaml.load(yamlString);
  return validateConfig(config);
}
