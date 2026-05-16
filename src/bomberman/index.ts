import { Providers } from '../shared/providers/providers';
import { Utils } from '../shared/utils/utils';
import { Game } from './core/game';
import { Store } from './core/store';
import { BombermanConfig, BombermanStore } from './types';

export { BombermanConfig } from './types';

export class BombermanRenderer {
	store!: BombermanStore;
	conf: BombermanConfig;

	constructor(conf: BombermanConfig) {
		this.conf = { ...conf };
	}

	public async start() {
		const defaultConfig: BombermanConfig = {
			platform: 'github',
			username: '',
			svgCallback: (_: string) => {},
			gameOverCallback: () => {},
			gameTheme: 'github',
			pointsIncreasedCallback: (_: number) => {},
			githubSettings: { accessToken: '' }
		};

		this.store = JSON.parse(JSON.stringify(Store));
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

		await Game.startGame(this.store);
		return this.store;
	}

	public stop() {
		Game.stopGame(this.store);
	}
}
