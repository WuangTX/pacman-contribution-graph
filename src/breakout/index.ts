import { Providers } from '../shared/providers/providers';
import { Utils } from '../shared/utils/utils';
import { BreakoutGame } from './core/game';
import { BreakoutStore } from './core/store';
import { BreakoutConfig, BreakoutStoreType } from './types';

export class BreakoutRenderer {
	store!: BreakoutStoreType;
	conf: BreakoutConfig;

	constructor(conf: BreakoutConfig) {
		this.conf = { ...conf };
	}

	public async start() {
		const defaultConfig: BreakoutConfig = {
			platform: 'github',
			username: '',
			svgCallback: (_: string) => {},
			gameOverCallback: () => {},
			gameTheme: 'github',
			pointsIncreasedCallback: (_: number) => {},
			githubSettings: { accessToken: '' }
		};

		this.store = JSON.parse(JSON.stringify(BreakoutStore));
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

		await BreakoutGame.startGame(this.store);
		return this.store;
	}

	public stop() {
		BreakoutGame.stopGame(this.store);
	}
}
