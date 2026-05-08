export type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';

export interface Contribution {
	date: Date;
	count: number;
	color: string;
	level: ContributionLevel;
}

export interface GameStats {
	totalScore: number;
	steps: number;
	ghostsEaten: number;
}

export interface GridCell {
	commitsCount: number;
	color: string;
	level: ContributionLevel;
}

export type ThemeKeys = 'github' | 'github-dark' | 'gitlab' | 'gitlab-dark';

export interface GameTheme {
	textColor: string;
	gridBackground: string;
	wallColor: string;
	intensityColors: string[];
}

export interface AnimationData {
	keyTimes: string;
	values: string;
}

export interface BaseConfig {
	platform: 'github' | 'gitlab';
	username: string;
	svgCallback: (blobUrl: string) => void;
	gameOverCallback: () => void;
	gameTheme: ThemeKeys;
	pointsIncreasedCallback: (pointsSum: number) => void;
	gameStatsCallback?: (stats: GameStats) => void;
	githubSettings?: {
		accessToken: string;
	};
	maxFrames?: number;
	maxHistorySize?: number;
}

/** Minimal shape that all game stores share, accepted by shared providers & utils. */
export interface BaseStore {
	config: BaseConfig;
	contributions: Contribution[];
	grid: GridCell[][];
	monthLabels: string[];
}
