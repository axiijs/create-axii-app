#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const targetDir = process.argv[2] || '.';
  
  try {
    // Check if a folder name was provided
    const isFolderNameProvided = process.argv[2] !== undefined;
    
    if (isFolderNameProvided) {
      // Check if directory exists
      if (fs.existsSync(targetDir)) {
        // Check if directory is not empty
        if (fs.readdirSync(targetDir).length > 0) {
          console.error(chalk.green(`Warning: Directory "${targetDir}" already exists and is not empty. Download terminated.`));
          process.exit(1);
        }
      } else {
        // Create directory if it doesn't exist
        console.log(chalk.green(`Creating directory "${targetDir}"...`));
        fs.ensureDirSync(targetDir);
      }
    } else {
      // No folder name provided, use current directory
      if (fs.readdirSync(targetDir).length > 0) {
        console.error(chalk.green('Warning: Current directory is not empty. Download terminated.'));
        process.exit(1);
      }
    }

    // Clone the boilerplate repository
    console.log(chalk.green('Downloading template...'));
    execSync(`git clone --depth 1 --branch main https://github.com/axiijs/boilerplate.git ${targetDir}`, { stdio: 'inherit' });

    // Remove .git directory
    fs.removeSync(path.join(targetDir, '.git'));

    // Install dependencies
    console.log(chalk.green('\nInstalling dependencies...\n'));
    execSync('npm install', { stdio: 'inherit', cwd: targetDir });

    console.log(chalk.green('\nSuccess!') + ' Axii.js application has been created at: ' + chalk.green(targetDir));
    console.log('\nIn this directory, you can run the following commands:');
    console.log('\n  npm run dev');
    console.log('    Start the development server');
    console.log('\nHappy coding!\n');

  } catch (error) {
    console.error(chalk.green('Error:'), error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.green('Error:'), error);
  process.exit(1);
});
