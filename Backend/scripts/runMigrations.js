/**
 * Script to run all migrations in the proper order
 * Usage: node scripts/runMigrations.js
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of migration scripts in the order they should be executed
const migrations = [
  'fixCandidateEmails.js'
  // Add more migration scripts as needed
];

// Function to run a migration script and return a promise
function runMigration(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n*** Running migration: ${scriptName} ***`);
    
    const scriptPath = path.join(__dirname, scriptName);
    const child = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration ${scriptName} failed with error: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`Migration ${scriptName} warnings:\n${stderr}`);
      }
      
      console.log(`Migration ${scriptName} output:\n${stdout}`);
      console.log(`*** Migration ${scriptName} completed ***\n`);
      resolve();
    });
    
    // Stream output in real-time
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}

// Run all migrations sequentially
async function runAllMigrations() {
  console.log('======================================');
  console.log('Starting database migrations...');
  console.log('======================================');
  
  for (const migration of migrations) {
    try {
      await runMigration(migration);
    } catch (error) {
      console.error(`Migration ${migration} failed. Stopping migration process.`);
      process.exit(1);
    }
  }
  
  console.log('======================================');
  console.log('All migrations completed successfully!');
  console.log('======================================');
}

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllMigrations().catch(error => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });
} 