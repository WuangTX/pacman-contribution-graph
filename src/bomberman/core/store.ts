import { BombermanConfig, BombermanStore } from '../types';

export const Store: BombermanStore = {
	frameCount: 0,
	contributions: [],
	grid: [],
	monthLabels: [],
	gameInterval: 0,
	nextBombId: 0,
	players: [],
	bombs: [],
	activeExplosions: [],
	gameHistory: [],
	initialColors: [],
	cellEvents: [],
	explosionEvents: [],
	config: undefined as unknown as BombermanConfig
};
