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
          console.error(chalk.red(`警告: 文件夹 "${targetDir}" 已存在且不为空，终止下载。`));
          process.exit(1);
        }
      } else {
        // Create directory if it doesn't exist
        console.log(chalk.blue(`创建文件夹 "${targetDir}"...`));
        fs.ensureDirSync(targetDir);
      }
    } else {
      // No folder name provided, use current directory
      if (fs.readdirSync(targetDir).length > 0) {
        console.error(chalk.red('警告: 当前目录不为空，终止下载。'));
        process.exit(1);
      }
    }

    // Clone the boilerplate repository
    console.log(chalk.blue('Downloading template...'));
    execSync(`git clone --depth 1 --branch main https://github.com/axiijs/boilerplate.git ${targetDir}`, { stdio: 'inherit' });

    // Remove .git directory
    fs.removeSync(path.join(targetDir, '.git'));

    // Install dependencies
    console.log(chalk.blue('\nInstalling dependencies...\n'));
    execSync('npm install', { stdio: 'inherit', cwd: targetDir });

    console.log(chalk.green('\nSuccess! Created Axii.js app at'), chalk.cyan(targetDir));
    console.log('\nInside that directory, you can run several commands:');
    console.log('\n  npm run dev');
    console.log('    Starts the development server.');
    console.log('\nHappy hacking!\n');

  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red('Error:'), error);
  process.exit(1);
});
