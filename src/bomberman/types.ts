import { BaseConfig, BaseStore, Contribution, GridCell } from '../shared/types';

export interface BombermanStore extends BaseStore {
	frameCount: number;
	gameInterval: number;
	nextBombId: number;
	players: BombermanPlayer[];
	bombs: BombermanBomb[];
	activeExplosions: BombermanExplosion[];
	gameHistory: BombermanSnapshot[];
	initialColors: string[][];
	cellEvents: BombermanCellEvent[];
	explosionEvents: BombermanExplosionEvent[];
	contributions: Contribution[];
	grid: GridCell[][];
	monthLabels: string[];
	config: BombermanConfig;
}

export interface BombermanConfig extends BaseConfig {}

export type BombermanPlayerId = 1 | 2;
export type BombermanDirection = 'up' | 'down' | 'left' | 'right';

export interface BombermanPosition {
	x: number;
	y: number;
}

export interface BombermanPlayer extends BombermanPosition {
	id: BombermanPlayerId;
	name: string;
	alive: boolean;
	direction: BombermanDirection;
	bombsPlaced: number;
	cellsDestroyed: number;
	sprite: string;
}

export interface BombermanBomb extends BombermanPosition {
	id: number;
	ownerId: BombermanPlayerId;
	timer: number;
	exploded: boolean;
	sprite: string;
}

export interface BombermanExplosion {
	bombId: number;
	ownerId: BombermanPlayerId;
	x: number;
	y: number;
	remainingFrames: number;
	affectedCells: BombermanPosition[];
	hitPlayerIds: BombermanPlayerId[];
	sprite: string;
}

export interface BombermanCellEvent extends BombermanPosition {
	frameIndex: number;
	color: string;
}

export interface BombermanExplosionEvent extends BombermanExplosion {
	frameIndex: number;
}

export interface BombermanSnapshot {
	players: BombermanPlayer[];
	bombs: BombermanBomb[];
	explosions: BombermanExplosion[];
}
