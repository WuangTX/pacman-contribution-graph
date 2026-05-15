import { Utils } from '../../shared/utils/utils';
import { BombermanBomb, BombermanDirection, BombermanPlayer, BombermanPosition, BombermanStore } from '../types';
import {
	BOMBERMAN_BLAST_RANGE,
	BOMBERMAN_BOMB_FUSE_FRAMES,
	BOMBERMAN_EXPLOSION_DURATION_FRAMES,
	BOMBERMAN_SPRITE_SETS,
	GRID_HEIGHT,
	GRID_WIDTH
} from './constants';

export type DirectionVector = BombermanPosition & { direction: BombermanDirection };

export const DIRECTIONS: DirectionVector[] = [
	{ x: 0, y: -1, direction: 'up' },
	{ x: 0, y: 1, direction: 'down' },
	{ x: -1, y: 0, direction: 'left' },
	{ x: 1, y: 0, direction: 'right' }
];

export const positionKey = ({ x, y }: BombermanPosition) => `${x}:${y}`;

export const samePosition = (a: BombermanPosition, b: BombermanPosition) => a.x === b.x && a.y === b.y;

export const manhattan = (a: BombermanPosition, b: BombermanPosition) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const inBounds = ({ x, y }: BombermanPosition) => x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;

export const isContributionCell = (store: BombermanStore, { x, y }: BombermanPosition) =>
	inBounds({ x, y }) && store.grid[x][y].commitsCount > 0;

export const isEmptyCell = (store: BombermanStore, { x, y }: BombermanPosition) =>
	inBounds({ x, y }) && store.grid[x][y].commitsCount === 0;

export const bombAt = (store: BombermanStore, { x, y }: BombermanPosition) =>
	store.bombs.find((bomb) => !bomb.exploded && bomb.x === x && bomb.y === y);

export const isPassableCell = (store: BombermanStore, position: BombermanPosition) =>
	isEmptyCell(store, position) && !bombAt(store, position);

export const getBlastCells = (position: BombermanPosition): BombermanPosition[] => [
	position,
	...DIRECTIONS.map((direction) => ({
		x: position.x + direction.x * BOMBERMAN_BLAST_RANGE,
		y: position.y + direction.y * BOMBERMAN_BLAST_RANGE
	})).filter(inBounds)
];

export const isActiveExplosionCell = (store: BombermanStore, position: BombermanPosition, ownerId?: BombermanPlayer['id']) =>
	store.activeExplosions.some(
		(explosion) =>
			(ownerId === undefined || explosion.ownerId === ownerId) && explosion.affectedCells.some((cell) => samePosition(cell, position))
	);

export const bombsThreateningAt = (store: BombermanStore, position: BombermanPosition, ownerId?: BombermanPlayer['id']) =>
	store.bombs.filter(
		(bomb) =>
			!bomb.exploded &&
			(ownerId === undefined || bomb.ownerId === ownerId) &&
			getBlastCells(bomb).some((cell) => samePosition(cell, position))
	);

export const isInOwnFutureBlast = (store: BombermanStore, player: BombermanPlayer, position: BombermanPosition) =>
	bombsThreateningAt(store, position, player.id).length > 0;

export const isSafeStandingCell = (store: BombermanStore, player: BombermanPlayer, position: BombermanPosition) =>
	isEmptyCell(store, position) &&
	!bombAt(store, position) &&
	!isActiveExplosionCell(store, position, player.id) &&
	!isInOwnFutureBlast(store, player, position);

export const getAdjacentPositions = ({ x, y }: BombermanPosition): (BombermanPosition & { direction: BombermanDirection })[] =>
	DIRECTIONS.map((delta) => ({
		x: x + delta.x,
		y: y + delta.y,
		direction: delta.direction
	})).filter(inBounds);

export const countRemainingContributions = (store: BombermanStore) =>
	store.grid.reduce((sum, col) => sum + col.filter((cell) => cell.commitsCount > 0).length, 0);

export const findNearestEmptyCell = (
	store: BombermanStore,
	origin: BombermanPosition,
	blocked: Set<string> = new Set()
): BombermanPosition => {
	let best: BombermanPosition | null = null;
	let bestDistance = Number.POSITIVE_INFINITY;

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const position = { x, y };
			if (!isEmptyCell(store, position) || blocked.has(positionKey(position))) continue;

			const distance = Math.abs(origin.x - x) + Math.abs(origin.y - y);
			if (distance < bestDistance) {
				best = position;
				bestDistance = distance;
			}
		}
	}

	return best ?? origin;
};

export const canPlaceBomb = (store: BombermanStore, player: BombermanPlayer) =>
	player.alive &&
	isEmptyCell(store, player) &&
	!bombAt(store, player) &&
	!store.bombs.some((bomb) => !bomb.exploded && bomb.ownerId === player.id);

export const bombWouldHitContribution = (store: BombermanStore, position: BombermanPosition) =>
	getBlastCells(position).some((cell) => isContributionCell(store, cell));

export const bombWouldHitOpponent = (store: BombermanStore, player: BombermanPlayer) => {
	const opponent = store.players.find((candidate) => candidate.id !== player.id && candidate.alive);
	return Boolean(opponent && getBlastCells(player).some((cell) => samePosition(cell, opponent)));
};

export const bombWouldHitTarget = (store: BombermanStore, player: BombermanPlayer) =>
	bombWouldHitContribution(store, player) || bombWouldHitOpponent(store, player);

export const placeBomb = (store: BombermanStore, player: BombermanPlayer) => {
	if (!canPlaceBomb(store, player)) return;

	store.bombs.push({
		id: store.nextBombId++,
		ownerId: player.id,
		x: player.x,
		y: player.y,
		timer: BOMBERMAN_BOMB_FUSE_FRAMES,
		exploded: false,
		sprite: BOMBERMAN_SPRITE_SETS.explosions.bombs.fuse0.data
	});
	player.bombsPlaced++;
};

export const clearContributionCell = (store: BombermanStore, position: BombermanPosition, ownerId: number) => {
	if (!isContributionCell(store, position)) return false;

	const theme = Utils.getCurrentTheme(store);
	store.grid[position.x][position.y] = {
		commitsCount: 0,
		level: 'NONE',
		color: theme.intensityColors[0]
	};

	const owner = store.players.find((player) => player.id === ownerId);
	if (owner) owner.cellsDestroyed++;

	store.cellEvents.push({
		frameIndex: store.gameHistory.length,
		x: position.x,
		y: position.y,
		color: theme.intensityColors[0]
	});
	store.config.pointsIncreasedCallback(store.cellEvents.length);

	return true;
};

export const explodeBomb = (store: BombermanStore, bomb: BombermanBomb) => {
	if (bomb.exploded) return;

	bomb.exploded = true;
	const affectedCells: BombermanPosition[] = [{ x: bomb.x, y: bomb.y }];
	const hitPlayerIds: BombermanPlayer['id'][] = [];

	for (const direction of DIRECTIONS) {
		const position = {
			x: bomb.x + direction.x * BOMBERMAN_BLAST_RANGE,
			y: bomb.y + direction.y * BOMBERMAN_BLAST_RANGE
		};

		if (!inBounds(position)) continue;
		affectedCells.push(position);
		clearContributionCell(store, position, bomb.ownerId);

		const chainedBomb = bombAt(store, position);
		if (chainedBomb) explodeBomb(store, chainedBomb);
	}

	for (const player of store.players) {
		if (!player.alive) continue;
		if (!affectedCells.some((position) => position.x === player.x && position.y === player.y)) continue;

		player.alive = false;
		hitPlayerIds.push(player.id);
	}

	const explosion = {
		bombId: bomb.id,
		ownerId: bomb.ownerId,
		x: bomb.x,
		y: bomb.y,
		remainingFrames: BOMBERMAN_EXPLOSION_DURATION_FRAMES,
		affectedCells,
		hitPlayerIds,
		sprite: BOMBERMAN_SPRITE_SETS.explosions.bombs.blastCenter.data
	};

	store.activeExplosions.push(explosion);
	store.explosionEvents.push({
		frameIndex: store.gameHistory.length,
		...explosion
	});
};

export const updateBombs = (store: BombermanStore) => {
	for (const bomb of store.bombs) {
		if (!bomb.exploded) bomb.timer--;
	}

	for (const bomb of [...store.bombs]) {
		if (!bomb.exploded && bomb.timer <= 0) explodeBomb(store, bomb);
	}

	store.bombs = store.bombs.filter((bomb) => !bomb.exploded);
};

export const updateExplosions = (store: BombermanStore) => {
	for (const explosion of store.activeExplosions) {
		explosion.remainingFrames--;
	}
	store.activeExplosions = store.activeExplosions.filter((explosion) => explosion.remainingFrames > 0);
};
