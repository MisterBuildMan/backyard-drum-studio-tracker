import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseConfig, serializeConfig, ConfigValidationError } from '../src/config.js';

/**
 * Arbitrary for generating valid TrackerConfig objects
 */
const validConfigArb = fc.record({
  source: fc.record({
    repository: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
    branch: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)
  }),
  aws: fc.record({
    region: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
    modelId: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)
  }),
  site: fc.record({
    title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
    description: fc.option(fc.string(), { nil: undefined })
  }),
  pages: fc.option(fc.record({
    home: fc.option(fc.boolean(), { nil: undefined }),
    phases: fc.option(fc.boolean(), { nil: undefined }),
    progress: fc.option(fc.boolean(), { nil: undefined }),
    glossary: fc.option(fc.boolean(), { nil: undefined })
  }), { nil: undefined }),
  output: fc.record({
    directory: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
    branch: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)
  })
});

describe('Config Property Tests', () => {
  /**
   * Feature: automated-tracker, Property 14: Valid config parsing round-trip
   * Validates: Requirements 8.1
   */
  it('Property 14: Valid config parsing round-trip - serializing to YAML and parsing back produces equivalent config', () => {
    fc.assert(
      fc.property(validConfigArb, (config) => {
        const yaml = serializeConfig(config);
        const parsed = parseConfig(yaml);
        
        // Check required fields are preserved
        expect(parsed.source.repository).toBe(config.source.repository);
        expect(parsed.source.branch).toBe(config.source.branch);
        expect(parsed.aws.region).toBe(config.aws.region);
        expect(parsed.aws.modelId).toBe(config.aws.modelId);
        expect(parsed.site.title).toBe(config.site.title);
        expect(parsed.output.directory).toBe(config.output.directory);
        expect(parsed.output.branch).toBe(config.output.branch);
      }),
      { numRuns: 100 }
    );
  });
});


/**
 * Arbitrary for generating invalid configs (missing required fields)
 */
const invalidConfigArb = fc.oneof(
  // Missing source
  fc.record({
    aws: fc.record({ region: fc.string({ minLength: 1 }), modelId: fc.string({ minLength: 1 }) }),
    site: fc.record({ title: fc.string({ minLength: 1 }) }),
    output: fc.record({ directory: fc.string({ minLength: 1 }), branch: fc.string({ minLength: 1 }) })
  }),
  // Missing aws
  fc.record({
    source: fc.record({ repository: fc.string({ minLength: 1 }), branch: fc.string({ minLength: 1 }) }),
    site: fc.record({ title: fc.string({ minLength: 1 }) }),
    output: fc.record({ directory: fc.string({ minLength: 1 }), branch: fc.string({ minLength: 1 }) })
  }),
  // Missing site
  fc.record({
    source: fc.record({ repository: fc.string({ minLength: 1 }), branch: fc.string({ minLength: 1 }) }),
    aws: fc.record({ region: fc.string({ minLength: 1 }), modelId: fc.string({ minLength: 1 }) }),
    output: fc.record({ directory: fc.string({ minLength: 1 }), branch: fc.string({ minLength: 1 }) })
  }),
  // Missing output
  fc.record({
    source: fc.record({ repository: fc.string({ minLength: 1 }), branch: fc.string({ minLength: 1 }) }),
    aws: fc.record({ region: fc.string({ minLength: 1 }), modelId: fc.string({ minLength: 1 }) }),
    site: fc.record({ title: fc.string({ minLength: 1 }) })
  }),
  // Empty repository
  fc.record({
    source: fc.record({ repository: fc.constant(''), branch: fc.string({ minLength: 1 }) }),
    aws: fc.record({ region: fc.string({ minLength: 1 }), modelId: fc.string({ minLength: 1 }) }),
    site: fc.record({ title: fc.string({ minLength: 1 }) }),
    output: fc.record({ directory: fc.string({ minLength: 1 }), branch: fc.string({ minLength: 1 }) })
  }),
  // Null config
  fc.constant(null),
  // Non-object config
  fc.constant('not an object')
);

describe('Config Validation Property Tests', () => {
  /**
   * Feature: automated-tracker, Property 15: Invalid config produces descriptive error
   * Validates: Requirements 8.5
   */
  it('Property 15: Invalid config produces descriptive error - parsing invalid config throws with specific field info', () => {
    fc.assert(
      fc.property(invalidConfigArb, (invalidConfig) => {
        const yaml = typeof invalidConfig === 'string' ? invalidConfig : serializeConfig(invalidConfig || {});
        
        expect(() => parseConfig(yaml)).toThrow();
        
        try {
          parseConfig(yaml);
        } catch (error) {
          // Error message should identify the problematic field
          expect(error.message).toMatch(/Configuration error|must be/i);
        }
      }),
      { numRuns: 100 }
    );
  });
});
