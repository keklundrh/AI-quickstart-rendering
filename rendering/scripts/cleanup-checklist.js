#!/usr/bin/env node

/**
 * Cleanup Checklist Script for Red Hat AI Kickstarts Application
 * This script helps automate and track cleanup tasks
 */

const fs = require('fs');
const path = require('path');

const checklist = {
  completed: [
    '✅ Extracted KickstartCard component',
    '✅ Extracted SearchToolbar component',
    '✅ Moved CSS to separate file',
    '✅ Reduced App.js from 948 to ~300 lines',
    '✅ Cleaned up imports'
  ],
  highPriority: [
    '🔄 Extract Header component',
    '🔄 Extract Footer component',
    '🔄 Create LoadingState components',
    '🔄 Create custom hooks (useKickstarts, useFilters)',
    '🔄 Add error boundaries',
    '🔄 Set up testing framework'
  ],
  mediumPriority: [
    '⏳ Add React.memo optimizations',
    '⏳ Implement useMemo for expensive computations',
    '⏳ Add accessibility improvements',
    '⏳ Update documentation',
    '⏳ Add environment configuration',
    '⏳ Improve package.json scripts'
  ],
  lowPriority: [
    '📅 Add bundle analysis',
    '📅 Implement virtualization',
    '📅 Add monitoring and analytics',
    '📅 Security hardening',
    '📅 Performance optimizations'
  ]
};

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function checkDirectoryStructure() {
  const structure = {
    'src/components/KickstartCard.js': checkFileExists('src/components/KickstartCard.js'),
    'src/components/SearchToolbar.js': checkFileExists('src/components/SearchToolbar.js'),
    'src/styles/patternfly-custom.css': checkFileExists('src/styles/patternfly-custom.css'),
    'src/components/': checkFileExists('src/components/'),
    'src/hooks/': checkFileExists('src/hooks/'),
    'src/utils/': checkFileExists('src/utils/'),
    'src/__tests__/': checkFileExists('src/__tests__/')
  };

  return structure;
}

function displayChecklist() {
  console.log('\n🧹 Red Hat AI Kickstarts - Cleanup Checklist\n');
  console.log('=' .repeat(50));

  console.log('\n✅ COMPLETED TASKS:');
  checklist.completed.forEach(task => console.log(`  ${task}`));

  console.log('\n🔄 HIGH PRIORITY (Week 1):');
  checklist.highPriority.forEach(task => console.log(`  ${task}`));

  console.log('\n⏳ MEDIUM PRIORITY (Week 2):');
  checklist.mediumPriority.forEach(task => console.log(`  ${task}`));

  console.log('\n📅 LOW PRIORITY (Week 3+):');
  checklist.lowPriority.forEach(task => console.log(`  ${task}`));
}

function displayStructure() {
  console.log('\n📁 CURRENT PROJECT STRUCTURE:');
  console.log('=' .repeat(50));

  const structure = checkDirectoryStructure();
  Object.entries(structure).forEach(([path, exists]) => {
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${path}`);
  });
}

function generateNextSteps() {
  console.log('\n🚀 RECOMMENDED NEXT STEPS:');
  console.log('=' .repeat(50));

  const structure = checkDirectoryStructure();

  if (!structure['src/hooks/']) {
    console.log('\n1. Create hooks directory:');
    console.log('   mkdir -p src/hooks');
    console.log('   touch src/hooks/useKickstarts.js');
    console.log('   touch src/hooks/useFilters.js');
  }

  if (!structure['src/utils/']) {
    console.log('\n2. Create utils directory:');
    console.log('   mkdir -p src/utils');
    console.log('   touch src/utils/constants.js');
    console.log('   touch src/utils/helpers.js');
  }

  if (!structure['src/__tests__/']) {
    console.log('\n3. Set up testing:');
    console.log('   mkdir -p src/__tests__/components');
    console.log('   npm install --save-dev @testing-library/react @testing-library/jest-dom jest');
  }

  console.log('\n4. Extract remaining components:');
  console.log('   - Create src/components/Header.js');
  console.log('   - Create src/components/Footer.js');
  console.log('   - Create src/components/LoadingState.js');

  console.log('\n5. Add development tools:');
  console.log('   npm install --save-dev eslint prettier husky lint-staged');
}

function main() {
  const args = process.argv.slice(2);

  switch(args[0]) {
    case '--structure':
      displayStructure();
      break;
    case '--next':
      generateNextSteps();
      break;
    case '--help':
      console.log('\nUsage: node cleanup-checklist.js [option]');
      console.log('\nOptions:');
      console.log('  --checklist    Show cleanup checklist (default)');
      console.log('  --structure    Show current project structure');
      console.log('  --next         Show recommended next steps');
      console.log('  --help         Show this help message');
      break;
    default:
      displayChecklist();
      displayStructure();
      generateNextSteps();
  }
}

if (require.main === module) {
  main();
}

module.exports = { checklist, checkDirectoryStructure };