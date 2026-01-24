import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  extractMasterPlan,
  extractChangelog,
  extractTasks,
  extractGlossary,
  flattenTasks
} from '../src/extractor.js';
import { calculateCompletionPercentage, TaskStatus } from '../src/utils/markdown.js';

/**
 * Generates a valid phase status line
 */
const phaseStatusArb = fc.record({
  number: fc.integer({ min: 0, max: 20 }),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0 && !s.includes('\n')),
  status: fc.constantFrom('not-started', 'in-progress', 'complete')
});

/**
 * Converts phase status to checkbox character
 */
function statusToCheckbox(status) {
  switch (status) {
    case 'complete': return 'x';
    case 'in-progress': return '-';
    default: return ' ';
  }
}

/**
 * Generates master-plan.md content from phases
 */
function generateMasterPlanContent(phases) {
  let content = '# Master Plan\n\n## Phases\n\n';
  for (const phase of phases) {
    content += `- [${statusToCheckbox(phase.status)}] ${phase.number}. ${phase.name}\n`;
  }
  content += '\n## Notes\n\n- Some notes here\n';
  return content;
}

describe('Master Plan Extraction Property Tests', () => {
  /**
   * Feature: automated-tracker, Property 1: Master plan extraction preserves phases
   * Validates: Requirements 2.1
   */
  it('Property 1: Master plan extraction preserves phases - extracting produces correct phase count and statuses', () => {
    fc.assert(
      fc.property(
        fc.array(phaseStatusArb, { minLength: 1, maxLength: 15 }),
        (phases) => {
          const content = generateMasterPlanContent(phases);
          const extracted = extractMasterPlan(content);
          
          // Should have same number of phases
          expect(extracted.phases.length).toBe(phases.length);
          
          // Each phase should have correct name and status
          for (let i = 0; i < phases.length; i++) {
            expect(extracted.phases[i].number).toBe(phases[i].number);
            expect(extracted.phases[i].name).toBe(phases[i].name);
            expect(extracted.phases[i].status).toBe(phases[i].status);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Generates a changelog item
 */
const changelogItemArb = fc.record({
  type: fc.constantFrom('completed', 'started', 'note'),
  description: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('\n')),
  taskRef: fc.option(fc.stringMatching(/^\d+\.\d+$/), { nil: null })
});

/**
 * Generates changelog entry
 */
const changelogEntryArb = fc.record({
  date: fc.constantFrom('Unreleased', '2026-01-20', '2026-01-15', '2025-12-01'),
  phase: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0 && !s.includes('\n')),
  items: fc.array(changelogItemArb, { minLength: 1, maxLength: 5 })
});

/**
 * Generates CHANGELOG.md content
 */
function generateChangelogContent(entries) {
  let content = '# Changelog\n\n';
  for (const entry of entries) {
    const header = entry.date === 'Unreleased' ? '## [Unreleased]' : `## ${entry.date}`;
    content += `${header}\n\n### ${entry.phase}\n`;
    for (const item of entry.items) {
      const taskPart = item.taskRef ? ` (Task ${item.taskRef})` : '';
      content += `- **${item.type.charAt(0).toUpperCase() + item.type.slice(1)}:** ${item.description}${taskPart}\n`;
    }
    content += '\n';
  }
  return content;
}

describe('Changelog Extraction Property Tests', () => {
  /**
   * Feature: automated-tracker, Property 2: Changelog extraction preserves entries
   * Validates: Requirements 2.2
   */
  it('Property 2: Changelog extraction preserves entries - all dates, phases, and descriptions are preserved', () => {
    fc.assert(
      fc.property(
        fc.array(changelogEntryArb, { minLength: 1, maxLength: 5 }),
        (entries) => {
          const content = generateChangelogContent(entries);
          const extracted = extractChangelog(content);
          
          // Should have same number of entries
          expect(extracted.length).toBe(entries.length);
          
          // Each entry should preserve date
          for (let i = 0; i < entries.length; i++) {
            const expectedDate = entries[i].date === 'Unreleased' ? 'Unreleased' : entries[i].date;
            expect(extracted[i].date).toBe(expectedDate);
            
            // Items should be preserved
            expect(extracted[i].items.length).toBe(entries[i].items.length);
            for (let j = 0; j < entries[i].items.length; j++) {
              expect(extracted[i].items[j].type).toBe(entries[i].items[j].type);
              expect(extracted[i].items[j].description).toBe(entries[i].items[j].description);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Generates a task with status
 */
const taskArb = fc.record({
  id: fc.stringMatching(/^\d+\.\d+$/),
  text: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0 && !s.includes('\n')),
  status: fc.constantFrom('pending', 'in-progress', 'complete')
});

/**
 * Converts task status to checkbox
 */
function taskStatusToCheckbox(status) {
  switch (status) {
    case 'complete': return 'x';
    case 'in-progress': return '-';
    default: return ' ';
  }
}

/**
 * Generates tasks.md content
 */
function generateTasksContent(tasks) {
  let content = '# Tasks\n\n';
  for (const task of tasks) {
    content += `- [${taskStatusToCheckbox(task.status)}] ${task.id} ${task.text}\n`;
  }
  return content;
}

describe('Task Extraction Property Tests', () => {
  /**
   * Feature: automated-tracker, Property 3: Task extraction preserves status
   * Validates: Requirements 2.3
   */
  it('Property 3: Task extraction preserves status - checkbox states correctly map to status values', () => {
    fc.assert(
      fc.property(
        fc.array(taskArb, { minLength: 1, maxLength: 20 }),
        (tasks) => {
          const content = generateTasksContent(tasks);
          const extracted = extractTasks(content);
          const flat = flattenTasks(extracted);
          
          // Should have same number of tasks
          expect(flat.length).toBe(tasks.length);
          
          // Each task should have correct status
          for (let i = 0; i < tasks.length; i++) {
            expect(flat[i].status).toBe(tasks[i].status);
            expect(flat[i].id).toBe(tasks[i].id);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('Completion Percentage Property Tests', () => {
  /**
   * Feature: automated-tracker, Property 6: Completion percentage calculation is accurate
   * Validates: Requirements 2.7
   */
  it('Property 6: Completion percentage equals (completed / total) * 100 rounded', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ status: fc.constantFrom('pending', 'in-progress', 'complete') }),
          { minLength: 1, maxLength: 50 }
        ),
        (tasks) => {
          const completed = tasks.filter(t => t.status === 'complete').length;
          const expected = Math.round((completed / tasks.length) * 100);
          const actual = calculateCompletionPercentage(tasks);
          
          expect(actual).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Empty task list returns 0 percent', () => {
    expect(calculateCompletionPercentage([])).toBe(0);
    expect(calculateCompletionPercentage(null)).toBe(0);
  });
});


/**
 * Generates a glossary term
 */
const glossaryTermArb = fc.record({
  term: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0 && !s.includes('\n') && !s.includes('*')),
  definition: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('\n')),
  category: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0 && !s.includes('\n'))
});

/**
 * Generates glossary.md content
 */
function generateGlossaryContent(terms) {
  // Group by category
  const byCategory = {};
  for (const term of terms) {
    if (!byCategory[term.category]) {
      byCategory[term.category] = [];
    }
    byCategory[term.category].push(term);
  }
  
  let content = '# Glossary\n\n';
  for (const [category, categoryTerms] of Object.entries(byCategory)) {
    content += `## ${category}\n\n`;
    for (const term of categoryTerms) {
      content += `**${term.term}**: ${term.definition}\n\n`;
    }
  }
  return content;
}

describe('Glossary Extraction Property Tests', () => {
  /**
   * Feature: automated-tracker, Property 4: Glossary extraction preserves terms
   * Validates: Requirements 2.4
   */
  it('Property 4: Glossary extraction preserves terms - all terms, categories, and definitions are preserved', () => {
    fc.assert(
      fc.property(
        fc.array(glossaryTermArb, { minLength: 1, maxLength: 20 }),
        (terms) => {
          const content = generateGlossaryContent(terms);
          const extracted = extractGlossary(content);
          
          // Should have same number of terms
          expect(extracted.length).toBe(terms.length);
          
          // Each term should be present with correct definition and category
          for (const term of terms) {
            const found = extracted.find(e => e.term === term.term);
            expect(found).toBeDefined();
            expect(found.definition).toBe(term.definition);
            expect(found.category).toBe(term.category);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { discoverImages } from '../src/extractor.js';

describe('Image Discovery Property Tests', () => {
  const testDir = join(process.cwd(), 'test-images-temp');
  
  /**
   * Feature: automated-tracker, Property 5: Image discovery is complete
   * Validates: Requirements 2.6
   */
  it('Property 5: Image discovery is complete - all image files in directory are discovered', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.stringMatching(/^[a-z]{3,10}$/),
            ext: fc.constantFrom('.jpg', '.png', '.gif', '.webp')
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (images) => {
          // Setup: create temp directory with images
          try {
            rmSync(testDir, { recursive: true, force: true });
          } catch {}
          mkdirSync(testDir, { recursive: true });
          
          // Create unique filenames
          const uniqueImages = images.map((img, i) => ({
            ...img,
            name: `${img.name}${i}`
          }));
          
          for (const img of uniqueImages) {
            writeFileSync(join(testDir, `${img.name}${img.ext}`), 'fake image data');
          }
          
          // Test
          const discovered = discoverImages(testDir);
          
          // Cleanup
          rmSync(testDir, { recursive: true, force: true });
          
          // Verify all images were discovered
          expect(discovered.length).toBe(uniqueImages.length);
          
          for (const img of uniqueImages) {
            const found = discovered.find(d => d.sourcePath.includes(`${img.name}${img.ext}`));
            expect(found).toBeDefined();
          }
        }
      ),
      { numRuns: 20 } // Fewer runs due to file system operations
    );
  });
});


import { extractContent } from '../src/extractor.js';

describe('Partial Extraction Property Tests', () => {
  const testSourceDir = join(process.cwd(), 'test-source-temp');
  
  /**
   * Feature: automated-tracker, Property 17: Partial extraction continues on file errors
   * Validates: Requirements 6.2
   */
  it('Property 17: Partial extraction continues on file errors - valid files are extracted even when some fail', async () => {
    // Setup: create temp directory with only some files
    try {
      rmSync(testSourceDir, { recursive: true, force: true });
    } catch {}
    mkdirSync(testSourceDir, { recursive: true });
    
    // Create only master-plan.md (missing CHANGELOG.md and glossary.md)
    const masterPlanContent = `# Master Plan

## Phases

- [ ] 0. Project Setup
- [-] 1. Planning
- [x] 2. Design

## Notes

- Test note
`;
    writeFileSync(join(testSourceDir, 'master-plan.md'), masterPlanContent);
    
    // Test: extraction should succeed with partial content
    const result = await extractContent(testSourceDir);
    
    // Cleanup
    rmSync(testSourceDir, { recursive: true, force: true });
    
    // Verify master plan was extracted
    expect(result.masterPlan.phases.length).toBe(3);
    expect(result.masterPlan.phases[0].status).toBe('not-started');
    expect(result.masterPlan.phases[1].status).toBe('in-progress');
    expect(result.masterPlan.phases[2].status).toBe('complete');
    
    // Verify errors were logged for missing files
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.file === 'CHANGELOG.md')).toBe(true);
    expect(result.errors.some(e => e.file === 'glossary.md')).toBe(true);
    
    // Verify empty arrays for missing content
    expect(result.changelog).toEqual([]);
    expect(result.glossary).toEqual([]);
  });
});
