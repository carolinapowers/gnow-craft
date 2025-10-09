#!/usr/bin/env node

/**
 * Vue TDD Automation - Initialization Script
 * Sets up TDD automation in any Vue.js project
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { execSync } = require('child_process');

async function init() {
  console.log(chalk.bold.green('\n🚀 Vue TDD Automation Setup\n'));

  // Check if we're in a Vue project
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error(chalk.red('❌ No package.json found. Please run this command in a Vue.js project root.'));
    process.exit(1);
  }

  const packageJson = fs.readJsonSync(packageJsonPath);
  const hasVue = packageJson.dependencies?.vue || packageJson.devDependencies?.vue;
  
  if (!hasVue) {
    const { continueAnyway } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAnyway',
        message: 'Vue.js not detected. Continue anyway?',
        default: false
      }
    ]);
    
    if (!continueAnyway) {
      console.log(chalk.yellow('Setup cancelled.'));
      process.exit(0);
    }
  }

  // Configuration questions
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'testingLibrary',
      message: 'Which testing approach do you prefer?',
      choices: [
        { name: 'Both Testing Library and Vue Test Utils (Recommended)', value: 'both' },
        { name: 'Testing Library only (User-centric)', value: 'testing-library' },
        { name: 'Vue Test Utils only (Component-centric)', value: 'vue-test-utils' }
      ],
      default: 'both'
    },
    {
      type: 'confirm',
      name: 'useGithubActions',
      message: 'Set up GitHub Actions for automated TDD?',
      default: true
    },
    {
      type: 'confirm',
      name: 'useAI',
      message: 'Enable AI-powered test generation?',
      default: true
    },
    {
      type: 'list',
      name: 'aiProvider',
      message: 'Which AI provider do you prefer?',
      choices: [
        { name: 'OpenAI (GPT-4)', value: 'openai' },
        { name: 'Anthropic (Claude)', value: 'anthropic' },
        { name: 'Both (fallback support)', value: 'both' },
        { name: 'None (template-based only)', value: 'none' }
      ],
      when: (answers) => answers.useAI,
      default: 'both'
    },
    {
      type: 'input',
      name: 'componentPath',
      message: 'Where are your Vue components located?',
      default: 'src/components',
      validate: (input) => {
        if (!input) return 'Component path is required';
        return true;
      }
    },
    {
      type: 'input',
      name: 'testPattern',
      message: 'Test file naming pattern?',
      default: '[name].test.ts',
      validate: (input) => {
        if (!input.includes('[name]')) {
          return 'Pattern must include [name] placeholder';
        }
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'installDependencies',
      message: 'Install required dependencies?',
      default: true
    }
  ]);

  const spinner = ora('Setting up TDD automation...').start();

  try {
    // 1. Create necessary directories
    const dirs = [
      '.github/workflows',
      '.github/ISSUE_TEMPLATE',
      'scripts/tdd',
      answers.componentPath,
      'test/helpers'
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(process.cwd(), dir));
    }
    spinner.text = 'Created directories';

    // 2. Copy templates
    const templatesDir = path.join(__dirname, '..', 'templates');
    
    // GitHub Actions workflow
    if (answers.useGithubActions) {
      const workflowTemplate = await fs.readFile(
        path.join(templatesDir, 'github-action.yml'),
        'utf-8'
      );
      
      const workflow = workflowTemplate
        .replace(/{{AI_PROVIDER}}/g, answers.aiProvider || 'none')
        .replace(/{{COMPONENT_PATH}}/g, answers.componentPath)
        .replace(/{{TEST_PATTERN}}/g, answers.testPattern);
      
      await fs.writeFile(
        path.join(process.cwd(), '.github/workflows/auto-tdd.yml'),
        workflow
      );
      
      // Issue template
      await fs.copy(
        path.join(templatesDir, 'issue-template.md'),
        path.join(process.cwd(), '.github/ISSUE_TEMPLATE/tdd-feature.md')
      );
    }
    spinner.text = 'Created GitHub workflows';

    // 3. Copy scripts
    const scriptsToInstall = [
      'auto-tdd-local.js',
      'test-generator.js',
      'component-scaffolder.js',
      'ai-test-generator.js'
    ];

    for (const script of scriptsToInstall) {
      const scriptContent = await fs.readFile(
        path.join(templatesDir, 'scripts', script),
        'utf-8'
      );
      
      const processedContent = scriptContent
        .replace(/{{COMPONENT_PATH}}/g, answers.componentPath)
        .replace(/{{TEST_PATTERN}}/g, answers.testPattern)
        .replace(/{{TESTING_LIBRARY}}/g, answers.testingLibrary)
        .replace(/{{AI_PROVIDER}}/g, answers.aiProvider || 'none');
      
      await fs.writeFile(
        path.join(process.cwd(), 'scripts/tdd', script),
        processedContent
      );
    }
    spinner.text = 'Installed TDD scripts';

    // 4. Copy test helpers based on testing library choice
    const helpersDir = path.join(templatesDir, 'helpers');
    
    if (answers.testingLibrary === 'both' || answers.testingLibrary === 'testing-library') {
      await fs.copy(
        path.join(helpersDir, 'testing-library.ts'),
        path.join(process.cwd(), 'test/helpers/testing-library.ts')
      );
    }
    
    if (answers.testingLibrary === 'both' || answers.testingLibrary === 'vue-test-utils') {
      await fs.copy(
        path.join(helpersDir, 'vue-test-utils.ts'),
        path.join(process.cwd(), 'test/helpers/vue-test-utils.ts')
      );
    }
    
    await fs.copy(
      path.join(helpersDir, 'composables.ts'),
      path.join(process.cwd(), 'test/helpers/composables.ts')
    );
    
    spinner.text = 'Installed test helpers';

    // 5. Create configuration file
    const config = {
      version: '1.0.0',
      testingLibrary: answers.testingLibrary,
      aiProvider: answers.aiProvider,
      componentPath: answers.componentPath,
      testPattern: answers.testPattern,
      githubActions: answers.useGithubActions,
      createdAt: new Date().toISOString()
    };
    
    await fs.writeJson(
      path.join(process.cwd(), '.vue-tdd.config.json'),
      config,
      { spaces: 2 }
    );
    spinner.text = 'Created configuration';

    // 6. Update package.json scripts
    const scripts = {
      'tdd': 'vitest --watch --reporter=verbose',
      'tdd:auto': 'node scripts/tdd/auto-tdd-local.js',
      'tdd:create': 'node scripts/tdd/component-scaffolder.js',
      'test': packageJson.scripts?.test || 'vitest',
      'test:coverage': 'vitest --coverage'
    };
    
    packageJson.scripts = { ...packageJson.scripts, ...scripts };
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    spinner.text = 'Updated package.json';

    // 7. Install dependencies
    if (answers.installDependencies) {
      spinner.text = 'Installing dependencies...';
      
      const deps = [];
      const devDeps = [
        'vitest',
        '@vitest/ui',
        'happy-dom',
        '@types/node'
      ];
      
      if (answers.testingLibrary === 'both' || answers.testingLibrary === 'testing-library') {
        devDeps.push(
          '@testing-library/vue',
          '@testing-library/user-event',
          '@testing-library/jest-dom'
        );
      }
      
      if (answers.testingLibrary === 'both' || answers.testingLibrary === 'vue-test-utils') {
        devDeps.push('@vue/test-utils');
      }
      
      const packageManager = detectPackageManager();
      const installCmd = packageManager === 'yarn' 
        ? `yarn add -D ${devDeps.join(' ')}`
        : `npm install --save-dev ${devDeps.join(' ')}`;
      
      execSync(installCmd, { stdio: 'inherit' });
      spinner.text = 'Installed dependencies';
    }

    // 8. Create example component and test
    const { createExample } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createExample',
        message: 'Create an example component with tests?',
        default: true
      }
    ]);
    
    if (createExample) {
      const exampleComponent = await fs.readFile(
        path.join(templatesDir, 'example/ExampleButton.vue'),
        'utf-8'
      );
      
      const exampleTest = await fs.readFile(
        path.join(templatesDir, 'example/ExampleButton.test.ts'),
        'utf-8'
      );
      
      await fs.writeFile(
        path.join(process.cwd(), answers.componentPath, 'ExampleButton.vue'),
        exampleComponent
      );
      
      await fs.writeFile(
        path.join(process.cwd(), answers.componentPath, 'ExampleButton.test.ts'),
        exampleTest
      );
      
      spinner.text = 'Created example component';
    }

    spinner.succeed(chalk.green('✅ TDD automation setup complete!'));

    // 9. Display next steps
    console.log(chalk.bold.cyan('\n📋 Next Steps:\n'));
    
    if (answers.aiProvider && answers.aiProvider !== 'none') {
      console.log(chalk.yellow('1. Set up AI API keys:'));
      
      if (answers.useGithubActions) {
        console.log('   GitHub: Go to Settings → Secrets → Actions');
        if (answers.aiProvider === 'openai' || answers.aiProvider === 'both') {
          console.log('   Add: OPENAI_API_KEY');
        }
        if (answers.aiProvider === 'anthropic' || answers.aiProvider === 'both') {
          console.log('   Add: ANTHROPIC_API_KEY');
        }
      }
      
      console.log('\n   Local development:');
      if (answers.aiProvider === 'openai' || answers.aiProvider === 'both') {
        console.log('   export OPENAI_API_KEY="your-key"');
      }
      if (answers.aiProvider === 'anthropic' || answers.aiProvider === 'both') {
        console.log('   export ANTHROPIC_API_KEY="your-key"');
      }
      console.log('');
    }
    
    console.log(chalk.yellow('2. Try the automated TDD workflow:'));
    console.log('   npm run tdd:auto');
    console.log('');
    
    console.log(chalk.yellow('3. Create a GitHub issue:'));
    console.log('   Use the template: [FEATURE] ComponentName - Description');
    console.log('   Add label: tdd-feature');
    console.log('');
    
    if (createExample) {
      console.log(chalk.yellow('4. Run the example tests:'));
      console.log('   npm run tdd');
      console.log('');
    }
    
    console.log(chalk.gray('Documentation: https://github.com/yourusername/vue-tdd-automation'));
    console.log(chalk.gray('Report issues: https://github.com/yourusername/vue-tdd-automation/issues'));
    console.log('');

  } catch (error) {
    spinner.fail(chalk.red('Setup failed'));
    console.error(error);
    process.exit(1);
  }
}

function detectPackageManager() {
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  return 'npm';
}

// Run initialization
init().catch(console.error);
