#!/usr/bin/env node

import { build } from '../src/index.js';

async function main() {
    const [, , command, env = 'dev'] = process.argv;

    switch (command) {
        case 'build':
            await build(env);
            console.log(`✅ essencekit build completed successfully (${env})!`);
            break;

        default:
            console.log(`
🚀 essencekit CLI

Usage:
  essencekit build [env]

Example:
  essencekit build prod
`);
            break;
    }
}

main().catch(error => {
    console.error('❌ Error during execution:', error);
    process.exit(1);
});