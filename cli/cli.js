#!/usr/bin/env node

// Run `npm link` to test locally
import fs from 'fs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { ARCADE_GAMES, ArcadeRenderer } from '../dist/pacman-contribution-graph.min.js';

const argv = yargs(hideBin(process.argv))
	.option('game', {
		alias: 'g',
		describe: `Game to generate: ${ARCADE_GAMES.join(', ')}`,
		choices: ARCADE_GAMES,
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

const renderer = new ArcadeRenderer({
	game: argv.game,
	platform: argv.platform,
	username: argv.username,
	gameTheme: argv.gameTheme,
	svgCallback: (svg) => {
		fs.writeFileSync(argv.output, svg);
		console.log(`SVG saved to ${argv.output}`);
	}
});
renderer.start();
