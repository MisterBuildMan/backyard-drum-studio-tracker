/**
 * Markdown parsing utilities for extracting structured content
 */

/**
 * Task checkbox status mapping
 */
export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETE: 'complete'
};

/**
 * Parses a task checkbox and returns its status
 * @param {string} checkbox - The checkbox string like "[ ]", "[-]", or "[x]"
 * @returns {string} - TaskStatus value
 */
export function parseTaskCheckbox(checkbox) {
  const trimmed = checkbox.trim();
  if (trimmed === '[x]' || trimmed === '[X]') {
    return TaskStatus.COMPLETE;
  }
  if (trimmed === '[-]') {
    return TaskStatus.IN_PROGRESS;
  }
  return TaskStatus.PENDING;
}

/**
 * Parses a single task line from markdown
 * @param {string} line - A line like "- [ ] 1.1 Task description"
 * @returns {object|null} - Task object or null if not a task line
 */
export function parseTaskLine(line) {
  // Match: - [ ] or - [x] or - [-] followed by optional task ID and text
  const match = line.match(/^(\s*)-\s*\[([ xX-])\]\s*(\*?)(.*)$/);
  if (!match) return null;

  const [, indent, checkChar, optional, text] = match;
  const indentLevel = Math.floor(indent.length / 2);
  const checkbox = `[${checkChar}]`;
  
  // Try to extract task ID (like "1.1" or "1.2.3")
  const idMatch = text.match(/^(\d+(?:\.\d+)*)\s+(.*)$/);
  
  return {
    id: idMatch ? idMatch[1] : null,
    text: idMatch ? idMatch[2].trim() : text.trim(),
    status: parseTaskCheckbox(checkbox),
    indentLevel,
    isOptional: optional === '*'
  };
}

/**
 * Parses phase status from master-plan.md format
 * @param {string} line - A line like "- [ ] 1. Planning & Permits"
 * @returns {object|null} - Phase status object or null
 */
export function parsePhaseStatus(line) {
  const match = line.match(/^-\s*\[([ xX-])\]\s*(\d+)\.\s+(.*)$/);
  if (!match) return null;

  const [, checkChar, number, name] = match;
  const checkbox = `[${checkChar}]`;
  
  let status;
  switch (parseTaskCheckbox(checkbox)) {
    case TaskStatus.COMPLETE:
      status = 'complete';
      break;
    case TaskStatus.IN_PROGRESS:
      status = 'in-progress';
      break;
    default:
      status = 'not-started';
  }

  return {
    number: parseInt(number, 10),
    name: name.trim(),
    status
  };
}

/**
 * Extracts headings from markdown content
 * @param {string} content - Markdown content
 * @returns {Array} - Array of {level, text, line} objects
 */
export function extractHeadings(content) {
  const lines = content.split('\n');
  const headings = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.*)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        line: i
      });
    }
  }

  return headings;
}

/**
 * Parses glossary term from markdown format
 * Expected format: "**Term**: Definition"
 * @param {string} line - A glossary line
 * @returns {object|null} - {term, definition} or null
 */
export function parseGlossaryTerm(line) {
  // Match **Term**: Definition or **Term** - Definition
  const match = line.match(/^\*\*([^*]+)\*\*[:\s-]+(.*)$/);
  if (!match) return null;

  return {
    term: match[1].trim(),
    definition: match[2].trim()
  };
}

/**
 * Parses changelog entry header
 * Expected format: "## YYYY-MM-DD" or "## [Unreleased]"
 * @param {string} line - A heading line
 * @returns {object|null} - {date, isUnreleased} or null
 */
export function parseChangelogHeader(line) {
  const unreleasedMatch = line.match(/^##\s*\[?Unreleased\]?/i);
  if (unreleasedMatch) {
    return { date: null, isUnreleased: true };
  }

  const dateMatch = line.match(/^##\s*(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    return { date: dateMatch[1], isUnreleased: false };
  }

  return null;
}

/**
 * Parses changelog item
 * Expected format: "- **Completed:** Description" or "- **Started:** Description"
 * @param {string} line - A changelog item line
 * @returns {object|null} - {type, description, taskRef} or null
 */
export function parseChangelogItem(line) {
  const match = line.match(/^-\s*\*\*(\w+):\*\*\s*(.*)$/);
  if (!match) return null;

  const [, type, rest] = match;
  
  // Try to extract task reference like "(Task 1.1)"
  const taskMatch = rest.match(/\(Task\s+([\d.]+)\)/i);
  
  return {
    type: type.toLowerCase(),
    description: rest.replace(/\s*\(Task\s+[\d.]+\)/i, '').trim(),
    taskRef: taskMatch ? taskMatch[1] : null
  };
}

/**
 * Calculates completion percentage from tasks
 * @param {Array} tasks - Array of task objects with status field
 * @returns {number} - Percentage 0-100
 */
export function calculateCompletionPercentage(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETE).length;
  return Math.round((completed / tasks.length) * 100);
}
