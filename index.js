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
    // Check if directory exists and is not empty
    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
      console.error(chalk.red(`Error: Directory "${targetDir}" already exists and is not empty`));
      process.exit(1);
    }

    // Create directory if it doesn't exist
    fs.ensureDirSync(targetDir);

    // Clone the boilerplate repository
    console.log(chalk.blue('Downloading template...'));
    execSync(`git clone --depth 1 https://github.com/axiijs/boilerplate.git ${targetDir}`, { stdio: 'inherit' });

    // Remove .git directory
    fs.removeSync(path.join(targetDir, '.git'));

    console.log(chalk.green('\nSuccess! Created Axii.js app at'), chalk.cyan(targetDir));
    console.log('\nInside that directory, you can run several commands:');
    console.log('\n  npm start');
    console.log('    Starts the development server.');
    console.log('\n  npm run build');
    console.log('    Builds the app for production.\n');
    console.log('Happy hacking!\n');

  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red('Error:'), error);
  process.exit(1);
});
