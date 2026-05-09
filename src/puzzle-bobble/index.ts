import { Providers } from '../shared/providers/providers';
import { Utils } from '../shared/utils/utils';
import { PuzzleBobbleGame } from './core/game';
import { PuzzleBobbleStore } from './core/store';
import { PBConfig, PBStoreType } from './types';

export class PuzzleBobbleRenderer {
	store!: PBStoreType;
	conf: PBConfig;

	constructor(conf: PBConfig) {
		this.conf = { ...conf };
	}

	public async start() {
		const defaultConfig: PBConfig = {
			platform: 'github',
			username: '',
			svgCallback: (_: string) => {},
			gameOverCallback: () => {},
			gameTheme: 'github',
			pointsIncreasedCallback: (_: number) => {},
			githubSettings: { accessToken: '' }
		};

		this.store = JSON.parse(JSON.stringify(PuzzleBobbleStore));
		this.store.config = { ...defaultConfig, ...this.conf };

		switch (this.store.config.platform) {
			case 'gitlab':
				this.store.contributions = await Providers.fetchGitlabContributions(this.store);
				break;
			case 'github':
				this.store.contributions = await Providers.fetchGithubContributions(this.store);
				break;
			default:
				throw new Error(`Unsupported platform: ${this.store.config.platform}`);
		}

		Utils.buildGrid(this.store);
		Utils.buildMonthLabels(this.store);

		await PuzzleBobbleGame.startGame(this.store);
		return this.store;
	}

	public stop() {
		PuzzleBobbleGame.stopGame(this.store);
	}
}
