import { BombermanDirection, BombermanPlayer, BombermanPosition, BombermanStore } from '../types';
import {
	bombAt,
	bombWouldHitOpponent,
	bombWouldHitTarget,
	DIRECTIONS,
	getBlastCells,
	isActiveExplosionCell,
	isContributionCell,
	isInOwnFutureBlast,
	isPassableCell,
	manhattan,
	positionKey,
	samePosition
} from './rules';
import {
	canEscapeAfterPlantingBomb,
	canEscapeAfterPlantingBombAt,
	estimateFastestRoute,
	findEscapeStep,
	findPathToTarget,
	findReachableBombOrigins,
	getPreviousPlayerPosition,
	isBacktrackingStep
} from './pathfinding';
import { BOMBERMAN_AI_SCORE, BOMBERMAN_PATH_BLAST_COST } from './constants';

type BombSpot = { position: BombermanPosition; firstStep: BombermanPosition | null; contribution: BombermanPosition; score: number };

const findBestBombSpotTowardOpponent = (store: BombermanStore, player: BombermanPlayer, opponent: BombermanPlayer): BombSpot | null => {
	const currentRoute = estimateFastestRoute(store, player, opponent);
	const candidates: BombSpot[] = [];
	const origins = findReachableBombOrigins(store, player);

	for (const origin of origins) {
		if (!canEscapeAfterPlantingBombAt(store, player, origin.position)) continue;

		const contributions = getBlastCells(origin.position).filter((position) => isContributionCell(store, position));
		if (contributions.length === 0) continue;

		const openedCells = new Set(contributions.map(positionKey));
		const routeAfterBomb = estimateFastestRoute(store, origin.position, opponent, openedCells);
		if (!routeAfterBomb) continue;

		const bestContribution = contributions.sort((a, b) => manhattan(a, opponent) - manhattan(b, opponent))[0];
		const routeImprovement = currentRoute ? currentRoute.cost - routeAfterBomb.cost : BOMBERMAN_PATH_BLAST_COST;
		if (routeImprovement <= 0) continue;

		const backtrackPenalty =
			origin.firstStep && isBacktrackingStep(store, player, origin.firstStep) ? BOMBERMAN_AI_SCORE.BACKTRACK_PENALTY : 0;
		const score =
			routeAfterBomb.blastedCells * BOMBERMAN_PATH_BLAST_COST * BOMBERMAN_AI_SCORE.BLASTED_CELL_WEIGHT +
			origin.distance * BOMBERMAN_AI_SCORE.ORIGIN_DISTANCE_WEIGHT +
			routeAfterBomb.distance +
			manhattan(origin.position, opponent) * BOMBERMAN_AI_SCORE.OPPONENT_DISTANCE_WEIGHT +
			backtrackPenalty -
			contributions.length * BOMBERMAN_AI_SCORE.CONTRIBUTION_COUNT_REWARD -
			routeImprovement * BOMBERMAN_AI_SCORE.ROUTE_IMPROVEMENT_REWARD;

		candidates.push({
			position: origin.position,
			firstStep: origin.firstStep,
			contribution: bestContribution,
			score
		});
	}

	if (candidates.length === 0) return null;

	candidates.sort((a, b) => a.score - b.score || a.position.x - b.position.x || a.position.y - b.position.y);
	return candidates[0];
};

export const shouldPlaceBomb = (store: BombermanStore, player: BombermanPlayer) => {
	if (!canEscapeAfterPlantingBomb(store, player)) return false;
	if (bombWouldHitOpponent(store, player)) return true;

	const opponent = store.players.find((candidate) => candidate.id !== player.id && candidate.alive);
	if (!opponent) return false;

	const bombSpot = findBestBombSpotTowardOpponent(store, player, opponent);
	return Boolean(bombSpot && samePosition(bombSpot.position, player) && bombWouldHitTarget(store, player));
};

export const movePlayer = (store: BombermanStore, player: BombermanPlayer) => {
	const escapeStep = findEscapeStep(store, player);
	const mustEscape =
		Boolean(bombAt(store, player)) || isActiveExplosionCell(store, player, player.id) || isInOwnFutureBlast(store, player, player);

	if (mustEscape) {
		if (escapeStep) movePlayerTo(player, escapeStep);
		return;
	}

	const opponent = store.players.find((candidate) => candidate.id !== player.id && candidate.alive);
	if (!opponent) return;

	const previousPosition = getPreviousPlayerPosition(store, player.id);
	const directRoute = findPathToTarget(store, player, (position) => samePosition(position, opponent), {
		avoidFirstStep: previousPosition,
		target: opponent
	});
	const safeDirectStep =
		directRoute?.firstStep &&
		isPassableCell(store, directRoute.firstStep) &&
		!isActiveExplosionCell(store, directRoute.firstStep, player.id) &&
		!isInOwnFutureBlast(store, player, directRoute.firstStep)
			? directRoute.firstStep
			: null;
	if (safeDirectStep) {
		movePlayerTo(player, safeDirectStep);
		return;
	}

	const hasOwnActiveBomb = store.bombs.some((bomb) => !bomb.exploded && bomb.ownerId === player.id);
	if (hasOwnActiveBomb) return;

	const bombSpot = findBestBombSpotTowardOpponent(store, player, opponent);
	const next = bombSpot?.firstStep;

	if (!next || !isPassableCell(store, next) || isActiveExplosionCell(store, next, player.id) || isInOwnFutureBlast(store, player, next)) {
		return;
	}
	movePlayerTo(player, next);
};

const movePlayerTo = (player: BombermanPlayer, next: BombermanPosition & Partial<{ direction: BombermanDirection }>) => {
	const direction =
		DIRECTIONS.find((delta) => player.x + delta.x === next.x && player.y + delta.y === next.y)?.direction ?? next.direction;

	if (direction) player.direction = direction;
	player.x = next.x;
	player.y = next.y;
};
