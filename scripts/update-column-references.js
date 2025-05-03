// filepath: /Users/danny_1/_PROJECTS_/haya/haya_mvp/scripts/update-column-references.js
/**
 * This script updates column name references in the application code
 * from 'org_id' to 'organization_id' for consistency
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// File extensions we're interested in
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Files to skip
const SKIP_FILES = [
  'update-column-references.js',
  '20250510000000_standardize_organization_columns.sql'
];

// Our column renaming map
const RENAME_MAP = {
  'org_id': 'organization_id'
};

// Simple regex patterns for replacements
// These patterns need to be specific enough to not cause false positives
const REGEX_PATTERNS = [
  // Replace 'org_id' in various contexts
  { pattern: /\.eq\('org_id'/g, replacement: ".eq('organization_id'" },
  { pattern: /\.in\('org_id'/g, replacement: ".in('organization_id'" },
  { pattern: /org_id:/g, replacement: "organization_id:" },
  { pattern: /org_id =/g, replacement: "organization_id =" },
  { pattern: /org_id\)/g, replacement: "organization_id)" },
  { pattern: /org_id,/g, replacement: "organization_id," },
  { pattern: /org_id\}/g, replacement: "organization_id}" },
  { pattern: /\.org_id/g, replacement: ".organization_id" },
  { pattern: /'org_id'/g, replacement: "'organization_id'" },
  { pattern: /"org_id"/g, replacement: '"organization_id"' }
];

// More complex context-aware replacements that need review
// These will be logged for manual verification
const CONTEXT_PATTERNS = [
  // Database queries or schemas
  { pattern: /org_id.*UUID/i, context: "Database Schema" },
  { pattern: /org_id.*REFERENCES/i, context: "Foreign Key" },
  // Component props or interfaces
  { pattern: /interface.*org_id/i, context: "TypeScript Interface" },
  { pattern: /type.*org_id/i, context: "TypeScript Type" },
  // Function parameters
  { pattern: /function.*\(.*org_id/i, context: "Function Parameter" },
  // Variable declarations
  { pattern: /const org_id/i, context: "Variable Declaration" },
  { pattern: /let org_id/i, context: "Variable Declaration" }
];

// Walk through directories recursively
async function walkDir(dir) {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    if (SKIP_FILES.includes(entry)) continue;
    
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      const subDirFiles = await walkDir(fullPath);
      files.push(...subDirFiles);
    } else if (stats.isFile() && EXTENSIONS.includes(path.extname(fullPath))) {
      files.push(fullPath);
    }
  }

  return files;
}

// Process a single file
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    let changed = false;
    const contextualMatches = [];

    // Apply simple regex replacements
    for (const { pattern, replacement } of REGEX_PATTERNS) {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, replacement);
        changed = true;
      }
    }

    // Identify complex patterns that need review
    for (const { pattern, context } of CONTEXT_PATTERNS) {
      const matches = content.match(new RegExp(pattern, 'g'));
      if (matches) {
        matches.forEach(match => {
          contextualMatches.push({ match, context });
        });
      }
    }

    // If file was modified, write changes
    if (changed) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
      
      // Log contextual matches if any
      if (contextualMatches.length > 0) {
        console.log(`  Context matches requiring review:`);
        contextualMatches.forEach(({ match, context }) => {
          console.log(`    - [${context}]: ${match.trim()}`);
        });
      }
      
      return { filePath, changed: true, contextualMatches };
    }

    return { filePath, changed: false, contextualMatches };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return { filePath, error: true, message: error.message };
  }
}

async function main() {
  // Define the root directory (assuming script is run from project root)
  const rootDir = path.resolve(__dirname, '..');
  const targetDirs = ['app', 'lib', 'hooks', 'components'];
  
  console.log('Starting column name standardization...');
  
  let processedCount = 0;
  let changedCount = 0;
  let errorCount = 0;
  const reviewFiles = [];

  for (const dir of targetDirs) {
    const dirPath = path.join(rootDir, dir);
    
    try {
      // Check if directory exists before processing
      await stat(dirPath);
      
      console.log(`Scanning ${dir} directory...`);
      const files = await walkDir(dirPath);
      
      for (const file of files) {
        processedCount++;
        const result = await processFile(file);
        
        if (result.changed) {
          changedCount++;
          if (result.contextualMatches.length > 0) {
            reviewFiles.push(file);
          }
        }
        
        if (result.error) {
          errorCount++;
        }
      }
    } catch (error) {
      console.error(`Error accessing directory ${dirPath}:`, error);
    }
  }

  console.log('\nSummary:');
  console.log(`Total files processed: ${processedCount}`);
  console.log(`Files modified: ${changedCount}`);
  console.log(`Errors: ${errorCount}`);
  
  if (reviewFiles.length > 0) {
    console.log('\nFiles that need manual review:');
    reviewFiles.forEach(file => console.log(` - ${file}`));
  }
  
  console.log('\nDone! Please check the modified files and run tests to ensure everything works correctly.');
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
