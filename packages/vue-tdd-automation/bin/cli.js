#!/usr/bin/env node

/**
 * Vue TDD Automation CLI
 * Main command-line interface for TDD automation
 */

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Load package.json for version
const packageJson = require('../package.json');

program
  .name('vue-tdd')
  .description('Vue.js TDD Automation CLI')
  .version(packageJson.version);

// Init command
program
  .command('init')
  .description('Initialize TDD automation in your Vue project')
  .action(() => {
    require('./init');
  });

// Create component command
program
  .command('create <componentName>')
  .description('Create a new component with TDD tests')
  .option('-i, --issue <issue>', 'GitHub issue number or description')
  .option('-t, --template <template>', 'Component template to use')
  .option('--no-tests', 'Skip test generation')
  .option('--ai', 'Use AI for test generation')
  .action(async (componentName, options) => {
    const config = await loadConfig();
    
    if (!config) {
      console.error(chalk.red('❌ TDD automation not initialized. Run: vue-tdd init'));
      process.exit(1);
    }
    
    console.log(chalk.green(`Creating component: ${componentName}`));
    
    // Run the local TDD script
    const scriptPath = path.join(process.cwd(), 'scripts/tdd/component-scaffolder.js');
    
    if (!fs.existsSync(scriptPath)) {
      console.error(chalk.red('❌ Component scaffolder not found. Run: vue-tdd init'));
      process.exit(1);
    }
    
    const args = [componentName];
    if (options.issue) args.push(`--issue="${options.issue}"`);
    if (options.template) args.push(`--template="${options.template}"`);
    if (!options.tests) args.push('--no-tests');
    if (options.ai) args.push('--ai');
    
    execSync(`node ${scriptPath} ${args.join(' ')}`, { stdio: 'inherit' });
  });

// Auto command (interactive TDD)
program
  .command('auto')
  .description('Interactive TDD workflow')
  .option('--ai', 'Force AI test generation')
  .option('--template', 'Force template-based generation')
  .action(async (options) => {
    const config = await loadConfig();
    
    if (!config) {
      console.error(chalk.red('❌ TDD automation not initialized. Run: vue-tdd init'));
      process.exit(1);
    }
    
    const scriptPath = path.join(process.cwd(), 'scripts/tdd/auto-tdd-local.js');
    
    if (!fs.existsSync(scriptPath)) {
      console.error(chalk.red('❌ Auto TDD script not found. Run: vue-tdd init'));
      process.exit(1);
    }
    
    const env = { ...process.env };
    
    if (options.ai) env.FORCE_AI = 'true';
    if (options.template) env.FORCE_TEMPLATE = 'true';
    
    execSync(`node ${scriptPath}`, { stdio: 'inherit', env });
  });

// Config command
program
  .command('config')
  .description('View or update TDD configuration')
  .option('-l, --list', 'List current configuration')
  .option('-s, --set <key=value>', 'Set a configuration value')
  .option('-r, --reset', 'Reset to defaults')
  .action(async (options) => {
    const configPath = path.join(process.cwd(), '.vue-tdd.config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error(chalk.red('❌ TDD automation not initialized. Run: vue-tdd init'));
      process.exit(1);
    }
    
    const config = await fs.readJson(configPath);
    
    if (options.list) {
      console.log(chalk.cyan('\n📋 Current Configuration:\n'));
      console.log(JSON.stringify(config, null, 2));
      return;
    }
    
    if (options.set) {
      const [key, value] = options.set.split('=');
      
      if (!key || value === undefined) {
        console.error(chalk.red('❌ Invalid format. Use: --set key=value'));
        process.exit(1);
      }
      
      // Parse value
      let parsedValue = value;
      if (value === 'true') parsedValue = true;
      else if (value === 'false') parsedValue = false;
      else if (!isNaN(value)) parsedValue = Number(value);
      
      config[key] = parsedValue;
      config.updatedAt = new Date().toISOString();
      
      await fs.writeJson(configPath, config, { spaces: 2 });
      console.log(chalk.green(`✅ Set ${key} = ${parsedValue}`));
      return;
    }
    
    if (options.reset) {
      const defaultConfig = {
        version: '1.0.0',
        testingLibrary: 'both',
        aiProvider: 'none',
        componentPath: 'src/components',
        testPattern: '[name].test.ts',
        githubActions: true,
        createdAt: config.createdAt,
        updatedAt: new Date().toISOString()
      };
      
      await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
      console.log(chalk.green('✅ Configuration reset to defaults'));
      return;
    }
    
    // Default: show current config
    console.log(chalk.cyan('\n📋 Current Configuration:\n'));
    console.log(JSON.stringify(config, null, 2));
  });

// Test command
program
  .command('test [component]')
  .description('Run tests for a component')
  .option('-w, --watch', 'Run in watch mode')
  .option('-c, --coverage', 'Generate coverage report')
  .action(async (component, options) => {
    const config = await loadConfig();
    
    if (!config) {
      console.error(chalk.red('❌ TDD automation not initialized. Run: vue-tdd init'));
      process.exit(1);
    }
    
    let testCommand = 'npx vitest';
    
    if (component) {
      const testPath = path.join(
        process.cwd(),
        config.componentPath,
        config.testPattern.replace('[name]', component)
      );
      
      if (!fs.existsSync(testPath)) {
        console.error(chalk.red(`❌ Test file not found: ${testPath}`));
        process.exit(1);
      }
      
      testCommand += ` ${testPath}`;
    }
    
    if (options.watch) testCommand += ' --watch';
    if (options.coverage) testCommand += ' --coverage';
    
    execSync(testCommand, { stdio: 'inherit' });
  });

// Doctor command (check setup)
program
  .command('doctor')
  .description('Check TDD setup and diagnose issues')
  .action(async () => {
    console.log(chalk.cyan('\n🔍 Running TDD Setup Diagnostics...\n'));
    
    const checks = [];
    
    // Check 1: Config file
    const configPath = path.join(process.cwd(), '.vue-tdd.config.json');
    if (fs.existsSync(configPath)) {
      checks.push({ name: 'Configuration file', status: '✅', message: 'Found' });
      const config = await fs.readJson(configPath);
      
      // Check 2: Component directory
      const componentDir = path.join(process.cwd(), config.componentPath);
      if (fs.existsSync(componentDir)) {
        checks.push({ name: 'Component directory', status: '✅', message: config.componentPath });
      } else {
        checks.push({ 
          name: 'Component directory', 
          status: '❌', 
          message: `Not found: ${config.componentPath}` 
        });
      }
      
      // Check 3: Scripts directory
      const scriptsDir = path.join(process.cwd(), 'scripts/tdd');
      if (fs.existsSync(scriptsDir)) {
        const scripts = fs.readdirSync(scriptsDir);
        checks.push({ 
          name: 'TDD scripts', 
          status: '✅', 
          message: `${scripts.length} scripts installed` 
        });
      } else {
        checks.push({ 
          name: 'TDD scripts', 
          status: '❌', 
          message: 'Scripts directory not found' 
        });
      }
      
      // Check 4: Test helpers
      const helpersDir = path.join(process.cwd(), 'test/helpers');
      if (fs.existsSync(helpersDir)) {
        const helpers = fs.readdirSync(helpersDir);
        checks.push({ 
          name: 'Test helpers', 
          status: '✅', 
          message: `${helpers.length} helpers installed` 
        });
      } else {
        checks.push({ 
          name: 'Test helpers', 
          status: '⚠️', 
          message: 'Helpers directory not found' 
        });
      }
      
      // Check 5: GitHub Actions
      if (config.githubActions) {
        const workflowPath = path.join(process.cwd(), '.github/workflows/auto-tdd.yml');
        if (fs.existsSync(workflowPath)) {
          checks.push({ name: 'GitHub Actions', status: '✅', message: 'Configured' });
        } else {
          checks.push({ 
            name: 'GitHub Actions', 
            status: '⚠️', 
            message: 'Workflow file not found' 
          });
        }
      }
      
      // Check 6: Dependencies
      const packageJson = await fs.readJson(path.join(process.cwd(), 'package.json'));
      const requiredDeps = ['vitest'];
      
      if (config.testingLibrary === 'both' || config.testingLibrary === 'testing-library') {
        requiredDeps.push('@testing-library/vue');
      }
      if (config.testingLibrary === 'both' || config.testingLibrary === 'vue-test-utils') {
        requiredDeps.push('@vue/test-utils');
      }
      
      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );
      
      if (missingDeps.length === 0) {
        checks.push({ name: 'Dependencies', status: '✅', message: 'All installed' });
      } else {
        checks.push({ 
          name: 'Dependencies', 
          status: '❌', 
          message: `Missing: ${missingDeps.join(', ')}` 
        });
      }
      
      // Check 7: AI configuration
      if (config.aiProvider && config.aiProvider !== 'none') {
        const hasOpenAI = !!process.env.OPENAI_API_KEY;
        const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
        
        if (config.aiProvider === 'openai' && hasOpenAI) {
          checks.push({ name: 'AI (OpenAI)', status: '✅', message: 'API key found' });
        } else if (config.aiProvider === 'anthropic' && hasAnthropic) {
          checks.push({ name: 'AI (Anthropic)', status: '✅', message: 'API key found' });
        } else if (config.aiProvider === 'both' && (hasOpenAI || hasAnthropic)) {
          checks.push({ 
            name: 'AI', 
            status: '⚠️', 
            message: `Partial: ${hasOpenAI ? 'OpenAI' : ''} ${hasAnthropic ? 'Anthropic' : ''}` 
          });
        } else {
          checks.push({ 
            name: 'AI', 
            status: '⚠️', 
            message: 'No API keys found (will use templates)' 
          });
        }
      }
      
    } else {
      checks.push({ 
        name: 'Configuration file', 
        status: '❌', 
        message: 'Not found. Run: vue-tdd init' 
      });
    }
    
    // Display results
    console.log(chalk.bold('Diagnostic Results:\n'));
    
    for (const check of checks) {
      console.log(`${check.status} ${chalk.bold(check.name)}: ${chalk.gray(check.message)}`);
    }
    
    // Summary
    const errors = checks.filter(c => c.status === '❌').length;
    const warnings = checks.filter(c => c.status === '⚠️').length;
    
    console.log('');
    if (errors === 0 && warnings === 0) {
      console.log(chalk.green('✨ Everything looks good!'));
    } else if (errors === 0) {
      console.log(chalk.yellow(`⚠️  ${warnings} warning(s) found, but TDD should work.`));
    } else {
      console.log(chalk.red(`❌ ${errors} error(s) found. Please run: vue-tdd init`));
    }
  });

// Helper function to load config
async function loadConfig() {
  const configPath = path.join(process.cwd(), '.vue-tdd.config.json');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  return await fs.readJson(configPath);
}

// Parse and execute
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
