#!/usr/bin/env node

// Run `npm link` to test locally
import fs from 'fs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { BreakoutRenderer, PacmanRenderer } from '../dist/pacman-contribution-graph.min.js';

const argv = yargs(hideBin(process.argv))
	.option('game', {
		alias: 'g',
		describe: 'Game to generate: pacman, breakout',
		choices: ['pacman', 'breakout'],
		default: 'pacman',
		type: 'string'
	})
	.option('platform', {
		alias: 'pl',
		describe: 'Platform: github, gitlab',
		choices: ['github', 'gitlab'],
		demandOption: true,
		type: 'string'
	})
	.option('gameTheme', {
		alias: 'gt',
		describe: 'Game theme: github, github-dark, gitlab, gitlab-dark',
		choices: ['github', 'github-dark', 'gitlab', 'gitlab-dark'],
		demandOption: true,
		type: 'string'
	})
	.option('username', {
		alias: 'un',
		describe: 'Username for the platform',
		demandOption: true,
		type: 'string'
	})
	.option('output', {
		alias: 'o',
		describe: 'Output file (SVG)',
		default: 'contribution-graph.svg',
		type: 'string'
	})
	.help().argv;

const config = {
	platform: argv.platform,
	username: argv.username,
	gameTheme: argv.gameTheme,
	svgCallback: (svg) => {
		fs.writeFileSync(argv.output, svg);
		console.log(`SVG saved to ${argv.output}`);
	}
};

const renderer = argv.game === 'breakout' ? new BreakoutRenderer(config) : new PacmanRenderer(config);
renderer.start();
