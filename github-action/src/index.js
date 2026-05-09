import * as core from '@actions/core';
import * as fs from 'fs';
import { BreakoutRenderer, GalagaRenderer, PacmanRenderer, PuzzleBobbleRenderer } from 'pacman-contribution-graph';
import * as path from 'path';

const STATS_ENDPOINT = 'https://elec.abozanona.me/receive_stats.php';

const reportStats = async (username, platform, stats) => {
	try {
		await fetch(STATS_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username,
				platform,
				score: stats.totalScore,
				steps: stats.steps,
				ghosts_eaten: stats.ghostsEaten
			})
		});
		console.log('📊 Stats reported to leaderboard');
	} catch (e) {
		console.warn('⚠️  Could not report stats:', e.message);
	}
};

const generateSvg = async (game, userName, githubToken, theme, playerStyle) => {
	return new Promise((resolve, reject) => {
		let generatedSvg = '';
		let gameStats = null;
		const conf = {
			platform: 'github',
			username: userName,
			gameTheme: theme,
			playerStyle,
			githubSettings: {
				accessToken: githubToken
			},
			svgCallback: (svg) => {
				generatedSvg = svg;
			},
			gameStatsCallback: (stats) => {
				gameStats = stats;
			},
			gameOverCallback: () => {
				resolve({ svg: generatedSvg, stats: gameStats });
			},
			pointsIncreasedCallback: () => {}
		};

		let renderer;
		switch (game) {
			case 'breakout':
				renderer = new BreakoutRenderer(conf);
				break;
			case 'galaga':
				renderer = new GalagaRenderer(conf);
				break;
			case 'puzzle-bobble':
				renderer = new PuzzleBobbleRenderer(conf);
				break;
			default:
				renderer = new PacmanRenderer(conf);
		}
		renderer.start().catch(reject);
	});
};

(async () => {
	try {
		const userName = core.getInput('github_user_name');
		const githubToken = core.getInput('github_token');
		const playerStyle = core.getInput('player_style') || 'opportunistic';
		const gamesInput = core.getInput('games') || 'pacman';

		// Parse comma-separated games list, trim whitespace, deduplicate
		const games = [
			...new Set(
				gamesInput
					.split(',')
					.map((g) => g.trim().toLowerCase())
					.filter(Boolean)
			)
		];
		const validGames = ['pacman', 'breakout', 'galaga', 'puzzle-bobble'];
		for (const game of games) {
			if (!validGames.includes(game)) {
				core.warning(`Unknown game "${game}" — skipping. Valid values: ${validGames.join(', ')}`);
			}
		}
		const selectedGames = games.filter((g) => validGames.includes(g));
		if (selectedGames.length === 0) {
			core.setFailed(`No valid games specified. Valid values: ${validGames.join(', ')}`);
			return;
		}

		// Track analytics (best-effort)
		fetch('https://elec.abozanona.me/github-action-analytics.php?username=' + userName).catch(() => {});

		const allStats = [];

		for (const game of selectedGames) {
			let prefix;
			switch (game) {
				case 'breakout':
					prefix = 'breakout-contribution-graph';
					break;
				case 'galaga':
					prefix = 'galaga-contribution-graph';
					break;
				case 'puzzle-bobble':
					prefix = 'puzzle-bobble-contribution-graph';
					break;
				default:
					prefix = 'pacman-contribution-graph';
			}

			const lightResult = await generateSvg(game, userName, githubToken, game === 'breakout' ? 'github' : 'github', playerStyle);
			const lightFile = `dist/${prefix}.svg`;
			console.log(`💾 writing to ${lightFile}`);
			fs.mkdirSync(path.dirname(lightFile), { recursive: true });
			fs.writeFileSync(lightFile, lightResult.svg);

			const darkResult = await generateSvg(game, userName, githubToken, 'github-dark', playerStyle);
			const darkFile = `dist/${prefix}-dark.svg`;
			console.log(`💾 writing to ${darkFile}`);
			fs.mkdirSync(path.dirname(darkFile), { recursive: true });
			fs.writeFileSync(darkFile, darkResult.svg);

			if (lightResult.stats) allStats.push(lightResult.stats);
			if (darkResult.stats) allStats.push(darkResult.stats);
		}

		if (allStats.length > 0) {
			const bestStats = {
				totalScore: Math.max(...allStats.map((s) => s.totalScore)),
				steps: Math.min(...allStats.map((s) => s.steps)),
				ghostsEaten: Math.max(...allStats.map((s) => s.ghostsEaten ?? 0))
			};
			await reportStats(userName, 'github', bestStats);
		}
	} catch (e) {
		core.setFailed(`Action failed with "${e.message}"`);
	}
})();
