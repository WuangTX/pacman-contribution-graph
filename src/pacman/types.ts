import { AnimationData, BaseConfig, BaseStore, Contribution, GameStats, GridCell } from '../shared/types';
export type { AnimationData, GameStats };

export type Point2d = {
	x: number;
	y: number;
	direction?: 'right' | 'left' | 'up' | 'down';
};

export enum PlayerStyle {
	CONSERVATIVE = 'conservative',
	AGGRESSIVE = 'aggressive',
	OPPORTUNISTIC = 'opportunistic'
}

/* ───────────────────────── Pac-Man & Ghosts ────────────────────── */
export interface Pacman {
	x: number;
	y: number;
	direction: 'right' | 'left' | 'up' | 'down';
	points: number;
	totalPoints: number;
	deadRemainingDuration: number;
	powerupRemainingDuration: number;
	recentPositions: string[];
	target?: Point2d;
	ghostsEaten: number;
}

export type GhostName = 'blinky' | 'clyde' | 'inky' | 'pinky' | 'eyes';

export interface Ghost {
	x: number;
	y: number;
	name: GhostName;
	originalName?: GhostName;
	scared: boolean;
	direction: 'right' | 'left' | 'up' | 'down';
	target?: Point2d;
	inHouse: boolean;
	respawnCounter: number;
	freezeCounter: number;
	justReleasedFromHouse: boolean;
}

/* ───────────────────────── Store ───────────────────────────── */
export interface StoreType extends BaseStore {
	frameCount: number;
	aliveSteps: number;
	contributions: Contribution[];
	pacman: Pacman;
	ghosts: Ghost[];
	grid: GridCell[][];
	monthLabels: string[];
	pacmanMouthOpen: boolean;
	gameInterval: number;
	gameHistory: {
		pacman: Pacman;
		ghosts: Ghost[];
		grid: GridCell[][];
	}[];
	config: Config;
	useGithubThemeColor: boolean;
}

/* ───────────────────────── Config ───────────────────────────── */
export interface Config extends BaseConfig {
	playerStyle: PlayerStyle;
}
