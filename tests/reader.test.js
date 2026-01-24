import { describe, it, expect } from 'vitest';
import { readSourceContent } from '../src/reader.js';

describe('Content Reader', () => {
  it('reads markdown files from test-source-repo', async () => {
    const result = await readSourceContent('./test-source-repo');
    
    // Should find markdown files
    expect(result.files.length).toBeGreaterThan(0);
    
    // Should include key files
    const paths = result.files.map(f => f.path);
    expect(paths).toContain('master-plan.md');
    expect(paths).toContain('CHANGELOG.md');
    expect(paths).toContain('glossary.md');
    expect(paths).toContain('README.md');
    
    // Files should have content
    const masterPlan = result.files.find(f => f.path === 'master-plan.md');
    expect(masterPlan.content).toContain('Phase');
  });

  it('returns images array', async () => {
    const result = await readSourceContent('./test-source-repo');
    
    // Images should be an array (may be empty if no images)
    expect(Array.isArray(result.images)).toBe(true);
  });
});
