import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname } from 'path';
import {
  parsePhaseStatus,
  parseTaskLine,
  parseGlossaryTerm,
  parseChangelogHeader,
  parseChangelogItem,
  extractHeadings,
  calculateCompletionPercentage,
  TaskStatus
} from './utils/markdown.js';

/**
 * Extracts master plan content from master-plan.md
 * @param {string} content - File content
 * @returns {object} - MasterPlan object
 */
export function extractMasterPlan(content) {
  const lines = content.split('\n');
  const phases = [];
  let notes = '';
  let inNotes = false;

  for (const line of lines) {
    // Check for notes section
    if (line.match(/^##\s*Notes/i)) {
      inNotes = true;
      continue;
    }

    if (inNotes) {
      // Collect notes until next section or end
      if (line.match(/^##/)) {
        inNotes = false;
      } else if (line.trim().startsWith('-')) {
        notes += line.trim().substring(1).trim() + '\n';
      }
      continue;
    }

    // Parse phase status lines
    const phase = parsePhaseStatus(line);
    if (phase) {
      phases.push(phase);
    }
  }

  return {
    phases,
    notes: notes.trim()
  };
}

/**
 * Extracts changelog entries from CHANGELOG.md
 * @param {string} content - File content
 * @returns {Array} - Array of ChangelogEntry objects
 */
export function extractChangelog(content) {
  const lines = content.split('\n');
  const entries = [];
  let currentEntry = null;
  let currentPhase = null;

  for (const line of lines) {
    // Check for date header
    const header = parseChangelogHeader(line);
    if (header) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      currentEntry = {
        date: header.date || 'Unreleased',
        isUnreleased: header.isUnreleased,
        phases: {}
      };
      currentPhase = null;
      continue;
    }

    // Check for phase header (### Phase Name)
    const phaseMatch = line.match(/^###\s+(.*)$/);
    if (phaseMatch && currentEntry) {
      currentPhase = phaseMatch[1].trim();
      if (!currentEntry.phases[currentPhase]) {
        currentEntry.phases[currentPhase] = [];
      }
      continue;
    }

    // Parse changelog items
    if (currentEntry && currentPhase) {
      const item = parseChangelogItem(line);
      if (item) {
        currentEntry.phases[currentPhase].push(item);
      }
    }
  }

  // Don't forget the last entry
  if (currentEntry) {
    entries.push(currentEntry);
  }

  // Convert to flat format expected by interface
  return entries.map(entry => {
    const items = [];
    for (const [phase, phaseItems] of Object.entries(entry.phases)) {
      for (const item of phaseItems) {
        items.push({ ...item, phase });
      }
    }
    return {
      date: entry.date,
      phase: Object.keys(entry.phases)[0] || '',
      items
    };
  });
}

/**
 * Extracts tasks from a tasks.md file
 * @param {string} content - File content
 * @returns {Array} - Array of Task objects with nested subtasks
 */
export function extractTasks(content) {
  const lines = content.split('\n');
  const tasks = [];
  const stack = [{ subtasks: tasks, indentLevel: -1 }];

  for (const line of lines) {
    const task = parseTaskLine(line);
    if (!task) continue;

    const taskObj = {
      id: task.id,
      text: task.text,
      status: task.status,
      subtasks: [],
      isOptional: task.isOptional
    };

    // Find the right parent based on indent level
    while (stack.length > 1 && stack[stack.length - 1].indentLevel >= task.indentLevel) {
      stack.pop();
    }

    stack[stack.length - 1].subtasks.push(taskObj);
    stack.push({ ...taskObj, indentLevel: task.indentLevel });
  }

  return tasks;
}

/**
 * Flattens nested tasks into a single array (for completion calculation)
 * @param {Array} tasks - Nested task array
 * @returns {Array} - Flat array of all tasks
 */
export function flattenTasks(tasks) {
  const result = [];
  
  function flatten(taskList) {
    for (const task of taskList) {
      result.push(task);
      if (task.subtasks && task.subtasks.length > 0) {
        flatten(task.subtasks);
      }
    }
  }
  
  flatten(tasks);
  return result;
}

/**
 * Extracts glossary terms from glossary.md
 * @param {string} content - File content
 * @returns {Array} - Array of GlossaryTerm objects
 */
export function extractGlossary(content) {
  const lines = content.split('\n');
  const terms = [];
  let currentCategory = 'General';

  for (const line of lines) {
    // Check for category header
    const categoryMatch = line.match(/^##\s+(.*)$/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // Parse glossary term
    const term = parseGlossaryTerm(line);
    if (term) {
      terms.push({
        ...term,
        category: currentCategory
      });
    }
  }

  return terms;
}

/**
 * Discovers image assets in a directory
 * @param {string} imagesDir - Path to images directory
 * @param {string} baseDir - Base directory for relative paths
 * @returns {Array} - Array of ImageAsset objects
 */
export function discoverImages(imagesDir, baseDir = '') {
  const images = [];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

  function scanDir(dir) {
    if (!existsSync(dir)) return;
    
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (imageExtensions.includes(extname(entry).toLowerCase())) {
        const relativePath = baseDir ? relative(baseDir, fullPath) : fullPath;
        
        // Try to extract phase from path (e.g., images/01-planning/photo.jpg)
        const phaseMatch = relativePath.match(/(\d{2}-[^/]+)/);
        
        images.push({
          sourcePath: fullPath,
          outputPath: relativePath,
          phase: phaseMatch ? phaseMatch[1] : null,
          altText: entry.replace(extname(entry), '').replace(/[-_]/g, ' ')
        });
      }
    }
  }

  scanDir(imagesDir);
  return images;
}

/**
 * Safely reads a file, returning null on error
 * @param {string} filePath - Path to file
 * @returns {string|null} - File content or null
 */
function safeReadFile(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Extracts all content from a source repository directory
 * @param {string} sourceDir - Path to source repository
 * @returns {object} - ExtractedContent object
 */
export async function extractContent(sourceDir) {
  const errors = [];
  
  // Extract master plan
  let masterPlan = { phases: [], notes: '' };
  const masterPlanContent = safeReadFile(join(sourceDir, 'master-plan.md'));
  if (masterPlanContent) {
    masterPlan = extractMasterPlan(masterPlanContent);
  } else {
    errors.push({ file: 'master-plan.md', error: 'File not found or unreadable' });
  }

  // Extract changelog
  let changelog = [];
  const changelogContent = safeReadFile(join(sourceDir, 'CHANGELOG.md'));
  if (changelogContent) {
    changelog = extractChangelog(changelogContent);
  } else {
    errors.push({ file: 'CHANGELOG.md', error: 'File not found or unreadable' });
  }

  // Extract glossary
  let glossary = [];
  const glossaryContent = safeReadFile(join(sourceDir, 'glossary.md'));
  if (glossaryContent) {
    glossary = extractGlossary(glossaryContent);
  } else {
    errors.push({ file: 'glossary.md', error: 'File not found or unreadable' });
  }

  // Extract phases from specs directory
  const phases = [];
  const specsDir = join(sourceDir, 'specs');
  if (existsSync(specsDir)) {
    const specFolders = readdirSync(specsDir).filter(f => {
      const fullPath = join(specsDir, f);
      return statSync(fullPath).isDirectory() && !f.startsWith('_');
    });

    for (const folder of specFolders) {
      const phaseDir = join(specsDir, folder);
      const numberMatch = folder.match(/^(\d+)/);
      
      const phase = {
        id: folder,
        number: numberMatch ? parseInt(numberMatch[1], 10) : 0,
        name: folder.replace(/^\d+-/, '').replace(/-/g, ' '),
        requirements: [],
        designSummary: '',
        tasks: [],
        completionPercentage: 0
      };

      // Read tasks.md
      const tasksContent = safeReadFile(join(phaseDir, 'tasks.md'));
      if (tasksContent) {
        phase.tasks = extractTasks(tasksContent);
        const flatTasks = flattenTasks(phase.tasks);
        phase.completionPercentage = calculateCompletionPercentage(flatTasks);
      }

      // Read design.md summary (first paragraph after first heading)
      const designContent = safeReadFile(join(phaseDir, 'design.md'));
      if (designContent) {
        const headings = extractHeadings(designContent);
        if (headings.length > 0) {
          const lines = designContent.split('\n');
          const startLine = headings[0].line + 1;
          let summary = '';
          for (let i = startLine; i < lines.length && !lines[i].startsWith('#'); i++) {
            if (lines[i].trim()) {
              summary += lines[i].trim() + ' ';
            }
          }
          phase.designSummary = summary.trim().substring(0, 500);
        }
      }

      phases.push(phase);
    }
  }

  // Discover images
  const images = discoverImages(join(sourceDir, 'images'), sourceDir);

  // Calculate overall progress
  const totalPhases = masterPlan.phases.length;
  const completedPhases = masterPlan.phases.filter(p => p.status === 'complete').length;
  const inProgressPhases = masterPlan.phases.filter(p => p.status === 'in-progress').length;
  const overallProgress = totalPhases > 0 
    ? Math.round(((completedPhases + inProgressPhases * 0.5) / totalPhases) * 100)
    : 0;

  // Find current phase
  const currentPhase = masterPlan.phases.find(p => p.status === 'in-progress')
    || masterPlan.phases.find(p => p.status === 'not-started')
    || masterPlan.phases[masterPlan.phases.length - 1];

  return {
    masterPlan,
    changelog,
    phases,
    glossary,
    images,
    metadata: {
      name: 'Backyard Drum Studio',
      location: 'Cedar Park, Texas',
      currentPhase: currentPhase?.name || 'Unknown',
      overallProgress,
      lastUpdated: new Date().toISOString()
    },
    errors
  };
}
