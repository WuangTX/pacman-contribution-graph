/******/ var __webpack_modules__ = ({

/***/ "./src/bomberman/core/ai.ts":
/*!**********************************!*\
  !*** ./src/bomberman/core/ai.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   movePlayer: () => (/* binding */ movePlayer),
/* harmony export */   shouldPlaceBomb: () => (/* binding */ shouldPlaceBomb)
/* harmony export */ });
/* harmony import */ var _rules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rules */ "./src/bomberman/core/rules.ts");
/* harmony import */ var _pathfinding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pathfinding */ "./src/bomberman/core/pathfinding.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/bomberman/core/constants.ts");



const findBestBombSpotTowardOpponent = (store, player, opponent) => {
    const currentRoute = (0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.estimateFastestRoute)(store, player, opponent);
    const candidates = [];
    const origins = (0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.findReachableBombOrigins)(store, player);
    for (const origin of origins) {
        if (!(0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.canEscapeAfterPlantingBombAt)(store, player, origin.position))
            continue;
        const contributions = (0,_rules__WEBPACK_IMPORTED_MODULE_0__.getBlastCells)(origin.position).filter((position) => (0,_rules__WEBPACK_IMPORTED_MODULE_0__.isContributionCell)(store, position));
        if (contributions.length === 0)
            continue;
        const openedCells = new Set(contributions.map(_rules__WEBPACK_IMPORTED_MODULE_0__.positionKey));
        const routeAfterBomb = (0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.estimateFastestRoute)(store, origin.position, opponent, openedCells);
        if (!routeAfterBomb)
            continue;
        const bestContribution = contributions.sort((a, b) => (0,_rules__WEBPACK_IMPORTED_MODULE_0__.manhattan)(a, opponent) - (0,_rules__WEBPACK_IMPORTED_MODULE_0__.manhattan)(b, opponent))[0];
        const routeImprovement = currentRoute ? currentRoute.cost - routeAfterBomb.cost : _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_PATH_BLAST_COST;
        if (routeImprovement <= 0)
            continue;
        const backtrackPenalty = origin.firstStep && (0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.isBacktrackingStep)(store, player, origin.firstStep) ? _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_AI_SCORE.BACKTRACK_PENALTY : 0;
        const score = routeAfterBomb.blastedCells * _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_PATH_BLAST_COST * _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_AI_SCORE.BLASTED_CELL_WEIGHT +
            origin.distance * _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_AI_SCORE.ORIGIN_DISTANCE_WEIGHT +
            routeAfterBomb.distance +
            (0,_rules__WEBPACK_IMPORTED_MODULE_0__.manhattan)(origin.position, opponent) * _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_AI_SCORE.OPPONENT_DISTANCE_WEIGHT +
            backtrackPenalty -
            contributions.length * _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_AI_SCORE.CONTRIBUTION_COUNT_REWARD -
            routeImprovement * _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_AI_SCORE.ROUTE_IMPROVEMENT_REWARD;
        candidates.push({
            position: origin.position,
            firstStep: origin.firstStep,
            contribution: bestContribution,
            score
        });
    }
    if (candidates.length === 0)
        return null;
    candidates.sort((a, b) => a.score - b.score || a.position.x - b.position.x || a.position.y - b.position.y);
    return candidates[0];
};
const shouldPlaceBomb = (store, player) => {
    if (!(0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.canEscapeAfterPlantingBomb)(store, player))
        return false;
    if ((0,_rules__WEBPACK_IMPORTED_MODULE_0__.bombWouldHitOpponent)(store, player))
        return true;
    const opponent = store.players.find((candidate) => candidate.id !== player.id && candidate.alive);
    if (!opponent)
        return false;
    const bombSpot = findBestBombSpotTowardOpponent(store, player, opponent);
    return Boolean(bombSpot && (0,_rules__WEBPACK_IMPORTED_MODULE_0__.samePosition)(bombSpot.position, player) && (0,_rules__WEBPACK_IMPORTED_MODULE_0__.bombWouldHitTarget)(store, player));
};
const movePlayer = (store, player) => {
    const escapeStep = (0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.findEscapeStep)(store, player);
    const mustEscape = Boolean((0,_rules__WEBPACK_IMPORTED_MODULE_0__.bombAt)(store, player)) || (0,_rules__WEBPACK_IMPORTED_MODULE_0__.isActiveExplosionCell)(store, player, player.id) || (0,_rules__WEBPACK_IMPORTED_MODULE_0__.isInOwnFutureBlast)(store, player, player);
    if (mustEscape) {
        if (escapeStep)
            movePlayerTo(player, escapeStep);
        return;
    }
    const opponent = store.players.find((candidate) => candidate.id !== player.id && candidate.alive);
    if (!opponent)
        return;
    const previousPosition = (0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.getPreviousPlayerPosition)(store, player.id);
    const directRoute = (0,_pathfinding__WEBPACK_IMPORTED_MODULE_1__.findPathToTarget)(store, player, (position) => (0,_rules__WEBPACK_IMPORTED_MODULE_0__.samePosition)(position, opponent), {
        avoidFirstStep: previousPosition,
        target: opponent
    });
    const safeDirectStep = (directRoute === null || directRoute === void 0 ? void 0 : directRoute.firstStep) &&
        (0,_rules__WEBPACK_IMPORTED_MODULE_0__.isPassableCell)(store, directRoute.firstStep) &&
        !(0,_rules__WEBPACK_IMPORTED_MODULE_0__.isActiveExplosionCell)(store, directRoute.firstStep, player.id) &&
        !(0,_rules__WEBPACK_IMPORTED_MODULE_0__.isInOwnFutureBlast)(store, player, directRoute.firstStep)
        ? directRoute.firstStep
        : null;
    if (safeDirectStep) {
        movePlayerTo(player, safeDirectStep);
        return;
    }
    const hasOwnActiveBomb = store.bombs.some((bomb) => !bomb.exploded && bomb.ownerId === player.id);
    if (hasOwnActiveBomb)
        return;
    const bombSpot = findBestBombSpotTowardOpponent(store, player, opponent);
    const next = bombSpot === null || bombSpot === void 0 ? void 0 : bombSpot.firstStep;
    if (!next || !(0,_rules__WEBPACK_IMPORTED_MODULE_0__.isPassableCell)(store, next) || (0,_rules__WEBPACK_IMPORTED_MODULE_0__.isActiveExplosionCell)(store, next, player.id) || (0,_rules__WEBPACK_IMPORTED_MODULE_0__.isInOwnFutureBlast)(store, player, next)) {
        return;
    }
    movePlayerTo(player, next);
};
const movePlayerTo = (player, next) => {
    var _a, _b;
    const direction = (_b = (_a = _rules__WEBPACK_IMPORTED_MODULE_0__.DIRECTIONS.find((delta) => player.x + delta.x === next.x && player.y + delta.y === next.y)) === null || _a === void 0 ? void 0 : _a.direction) !== null && _b !== void 0 ? _b : next.direction;
    if (direction)
        player.direction = direction;
    player.x = next.x;
    player.y = next.y;
};


/***/ }),

/***/ "./src/bomberman/core/constants.ts":
/*!*****************************************!*\
  !*** ./src/bomberman/core/constants.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BOMBERMAN_AI: () => (/* binding */ BOMBERMAN_AI),
/* harmony export */   BOMBERMAN_AI_SCORE: () => (/* binding */ BOMBERMAN_AI_SCORE),
/* harmony export */   BOMBERMAN_BLAST_RANGE: () => (/* binding */ BOMBERMAN_BLAST_RANGE),
/* harmony export */   BOMBERMAN_BOMB_FUSE_FRAMES: () => (/* binding */ BOMBERMAN_BOMB_FUSE_FRAMES),
/* harmony export */   BOMBERMAN_DEATH_ANIMATION_FRAMES: () => (/* binding */ BOMBERMAN_DEATH_ANIMATION_FRAMES),
/* harmony export */   BOMBERMAN_EXPLOSION_DURATION_FRAMES: () => (/* binding */ BOMBERMAN_EXPLOSION_DURATION_FRAMES),
/* harmony export */   BOMBERMAN_EXPLOSION_SPRITES: () => (/* binding */ BOMBERMAN_EXPLOSION_SPRITES),
/* harmony export */   BOMBERMAN_MAX_FRAMES: () => (/* binding */ BOMBERMAN_MAX_FRAMES),
/* harmony export */   BOMBERMAN_PATH_BLAST_COST: () => (/* binding */ BOMBERMAN_PATH_BLAST_COST),
/* harmony export */   BOMBERMAN_PLAYER_SPRITES: () => (/* binding */ BOMBERMAN_PLAYER_SPRITES),
/* harmony export */   BOMBERMAN_SPRITE_SETS: () => (/* binding */ BOMBERMAN_SPRITE_SETS),
/* harmony export */   BOMBERMAN_SVG: () => (/* binding */ BOMBERMAN_SVG),
/* harmony export */   CELL_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE),
/* harmony export */   DELTA_TIME: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME),
/* harmony export */   GAP_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE),
/* harmony export */   GRID_HEIGHT: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT),
/* harmony export */   GRID_WIDTH: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH),
/* harmony export */   PLUNDER_BOMBER_SPRITES: () => (/* binding */ PLUNDER_BOMBER_SPRITES)
/* harmony export */ });
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/constants */ "./src/shared/constants.ts");
/* ─── Re-export shared constants so bomberman code has one import location ─── */

const BOMBERMAN_BOMB_FUSE_FRAMES = 8;
const BOMBERMAN_EXPLOSION_DURATION_FRAMES = 4;
const BOMBERMAN_MAX_FRAMES = 1200;
const BOMBERMAN_BLAST_RANGE = 1;
const BOMBERMAN_SVG = {
    PRECISION: 4,
    HEADER_HEIGHT: 15,
    MONTH_LABEL_Y: 10,
    MONTH_LABEL_FONT_SIZE: 10,
    CELL_RADIUS: 3,
    PLAYER_SPRITE_WIDTH: 22,
    PLAYER_SPRITE_HEIGHT: 28,
    PLAYER_SPRITE_FRAME_INTERVAL: 2,
    BOMB_PULSE_DURATION_MS: 500,
    BOMB_X: -8,
    BOMB_Y: -9,
    BOMB_WIDTH: 16,
    BOMB_HEIGHT: 18,
    BOMB_PULSE_SCALE: 1.1,
    EXPLOSION_SPRITE_CELL_SPAN: 3,
    EXPLOSION_SPRITE_GAP_SPAN: 2,
    EXPLOSION_OPACITY: 0.9,
    MIN_DURATION_MS: 1000,
    DURATION_SPEED_DIVISOR: 2
};
const BOMBERMAN_DEATH_ANIMATION_FRAMES = 8;
const BOMBERMAN_PATH_BLAST_COST = BOMBERMAN_BOMB_FUSE_FRAMES + 2;
const BOMBERMAN_AI = {
    ESCAPE_MIN_SEARCH_DEPTH: 4
};
const BOMBERMAN_AI_SCORE = {
    BLASTED_CELL_WEIGHT: 3,
    ORIGIN_DISTANCE_WEIGHT: 2,
    OPPONENT_DISTANCE_WEIGHT: 0.1,
    CONTRIBUTION_COUNT_REWARD: 0.25,
    ROUTE_IMPROVEMENT_REWARD: 0.5,
    BACKTRACK_PENALTY: 6
};
/* ───────────── Bomberman player sprites ───────────── */
const BOMBERMAN_PLAYER_SPRITES = {
    idleDown: {
        x: 305,
        y: 5,
        width: 16,
        height: 21,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAVCAYAAABPPm7SAAABgklEQVR42o1UIW/CQBh91yAmJ7v+g5OcY8kMsssExUFCliCxzTKBRCykFjWGIEECgjCBaEKWtO6Q9w/YSZKZuU5AL71y7folJ+679959330vR2CIuk0TU/4gBUFZ1G2a1G2aTHfLJPn51tZ0t0zS80Jyh22viPnVYVtNxErJ1Amw2DP8F4s9A3UC1aaVHjTfflE1stha/lA+eKVk+2ul7Wt5sv1+B/YkwDdUA6Y5+eABYx/aGwDApDes3EIWqwSoE1QWyGJJdoyD+QiPL+VC27GPSW+oTEXyXqBOoF6537gHAHzEEQAgfL2BOPqaI0kVC5dZ2sqS+YZiMB+pPrvtCN12pHoezEfgGwqjE3nLA2YU/TUvvLm/5sCMgrc8JaJ8IOMQdqMJGYcAAHH0sXg+e4EthRGjteDKE2QcwpWnwgpMGKLKB8DWK23O7DIFfpmCOJ4dmMVb2Rs+7VsdGEdX5BSjVZBPFrVhwtUOUhAX1yL57yvvEVeecJCCEBOg6O8zYf4AxGvpYTg/OGAAAAAASUVORK5CYII='
    },
    walkDown0: {
        x: 9,
        y: 8,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABiUlEQVR42p1Uv2vCQBT+LmTo2PGa/+CNuS2CFBxbHIybAZeOrqFTR4ci6dipKkVwtIvYwaFQCrol4/0HNpuFLm7XQS8mMU2tDw7C996X9+N7dww5szkpFFgUS1aEw+akbE6qP58o9f2ZOf35RGn/AaklZgeE/GmJWUJmNidFVoDxu8Ax5l2GkCsfBgDU7jc41nSsmQbjqltK4h8vybeZJvGnC4i6RDilDEFjcdUFej4AbEs9xU4mMi1HZ9TF9W1QGjzr+Xhs3yGKJWNpLTujbilRk5KMZav22+pletTTJCuA11zAay5AVpDxZeSwOalwShisPZB1BuFU9lI4FWAZYLDeIJyOIepQUSyZme8BAORkn0HU5RZrAzeprIbNSYUNFxjS3w0OCWHDhc1JmXkfWQGEU8HD826pm0C4XECu/GIdi8hAMSmjY3pIuq/0tEVdZl4BI6/jYO0dtKaxdGVJqa/8HNypbW/K8g1X8RcAoAiPYskM/RftLL2Puxibk2L/WbfS4RyzpwDwA3eo2etvVgkzAAAAAElFTkSuQmCC'
    },
    walkDown1: {
        x: 75,
        y: 8,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABkElEQVR42p2UsUvDQBTGf1c6OHY88x/cmGwVRHBUOthuDbg4ugZxcHSQEsdOtiKCY3Uo7eAgiNBuccx/ULNVcHE7h/bSXBrb6oOD8N378t5977sT5MKVSlMQ70ksinBcqbQrle4897T++rBW57mnzf4SqekNlgj51fQGKVm4UmnlhDy8emwS/l5EPAkoAexffbNpmNxyFkx26ytJ8u0x/S5nSfJmG68WE/WVRTBYsluHVgAwa/U/UQJ4Od/amGByhRnH6f0lh2fhStKgFdA+vuA9iYXIzlI5YaraSXUHgO54lFaKJ0HqILHOar9ZzxLHqKmcEL8xwm+MUE5o7VniuFLpqK/oTn2UE+LN2wTwqjszbD4S05llgPbxBQBxb1HBq8XF43Cl0kNZgVu1/oC3iuiojiuVLuf3TKvXd3NTNyAaj4gngZUnihQ1gpjIk6w5ZkXKn8tg2VeglJ9jd+ovHa0IS1sdygqyuj+7KeMXDpJPALK49/S4aNVUio7su2iShrJi4eaH4i92WynOJj4F+AFlodcPvNujWwAAAABJRU5ErkJggg=='
    },
    walkDown2: {
        x: 108,
        y: 8,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABf0lEQVR42qVUMU8CMRT+ShgcGev9g47X7UiICSPEgWPjEjf/wcU4ODoYU0Ymwbg4IgOBgYHE5diOsf8Au0Hi4mQdzh70OOHUlzRpXt/X9/q9rw/IMZcy7VKmccBIHigvcKkkwaEs/dlQ6/c3a/VnQ51bhUuZ7vDJHiC7OnySgolLmWaOwPMrRxELzmLIVYgSANTvPlDUTGwJf7Ry1qFq/mHEfbgPVDUf9OEU/FwiHjMr3vialwI9U+r8+uTXpZaWShK5CjFYRIUADbXBUklCdnvJHIHu5+1RkCW5Y9rMSs9qhyGEOQJBO0LQjsAcYZ2lbzTZ4jHDYB2AOQLcq27Z9KqJ75tVU1najsE6QO/iBgAgh9sM/FwmGVs+8AgA0lZO80r8Tznmjd2npNygDcSLCHwUWuRYrMatRG589JKSAgByFe6xWjagKa2kh1NaQWMnOG75UIs5GmpjswoA1Ksjb28upF4dU1qB9ZFNgAFkb/9xWO2CjbSOqYcUmXB5k+4LCXHPPa24MKoAAAAASUVORK5CYII='
    },
    walkDown3: {
        x: 141,
        y: 8,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABeklEQVR42p1UIU/DQBh910wgK4/9g5Ot2xKyZHJkYpujCYagsBUIfgCiyCk2gpksCELFRJOZ1bXy/kF3jiUY3E2UK72228q+5NLm+r1+73vfuwNKYVEmLcokjoRRBgXUREBNHAOTMnBfYiI4qf2gKM6WvpTfG23Nlr6sbcGiTF7ZnxVAeXl3XzmYWJRJ1vawWNloEk4vBk/dTJz+4w+ahso1cGKcDGzVbYqL8V7AJYCpAob3Z7hZ/YHo8znsIUf8wTSQPeQIqJlRTQQnPHUxj9aNKA7EFongxFCumF4/wOnFWdXbjZ79wvI95aDGlitbzyiCVE+s7cGZrOFMMvoBNRGPxpr5jXLzAGB3uloV2ulrz8o44lE2Btvv5ooufEBEIWinDxGFugHUOVQRUDOvrpS0398wENuqc4o01PvT6xzOZA3W9iritA4pGP/OlqcuAmpqFQ8Ceerm1IvqJ4ITouQNqJlTFFGo/b32dCjOxcRjoERw8i/nFC+sHSx90I3EuUDEAAAAAElFTkSuQmCC'
    },
    walkRight0: {
        x: 8,
        y: 41,
        width: 16,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAABZ0lEQVR42p2UPU8CMRyHnxIHRsdy36Cb53YkLIw4CZskxoTBOOtAoh/A4VYmwM2RyejAwAgbN943gG6SuLjVRbB3XMvhL2ly7eX//rSCAoVSmaLzRKcifyZsg0SnIpTKqCCm+fwNQC+qAzBezBlcP+07CqUy5u7RrM8iE0plrs7fzWg6MeZrXbhG04mxM6wA6MWMlt5gR3apF9VRQbzLupLoVLT0BmAvbZfsICd27T4j3Wjvvi+AgV3CIelGGzms0dIb5LCGHNbA52C8mFNWGQezfpVjJfIAFTGQ7wFAS29IdCqEi0LXSGf9KunqYQeTcKXmm4pNoncKKogBWL4pALqdub+JZdTtzNlD2aV09ZDZv07q3N/0/pHBi2J52T7MgasHmRJue24ODk1CBXFmhKVK2E5g25P8q1RxRd5GH392vVkJ388PeYqMmn84/z48NlAVH3m2cdE+lMqIsvi6kBbH3oP8XfgBu12xmgbSwmIAAAAASUVORK5CYII='
    },
    walkRight1: {
        x: 74,
        y: 41,
        width: 16,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAABdklEQVR42p1UIW/CQBh9RyaQyGv/wbm1riQYZJcJihvJsqRqegiS7QdM1KKAuUk2QYZAIIuj8v4BnGwyM3cTW7truWvLXtKkvfS+733vvTsCDRzKpG49EZyU14i6IRGcOJRJZkfoP38BAEKvCwBY7GJMb59OCzmUSXn/KI+XnnQokzfuh5xvllJ+HrXPfLOUKsMWAIjdFr5IoXY2IfS6YHaUs24lghNfpABwQtsEtcmFOnvVJtEL8vcrAFN1hDqIXgA6s+CLFHRmgc4soKrAYhejKQoFtpM2zgUpB0iXgbIGAOCLFInghJhSaLJ0O2mDH8Z5mIiJWpUrahIrXWB2BADYrxgAYDSMq0VsgtEwxkmUTeCHceH7ddnFw134DwYvDPtBUJ8DnQbMjuC+v/1oMQjgXnNzDuqcYHZUsLDRCJkDOk2MDLLO+xUrUF7TTiGF2iirP1Ov/xfl30tnTTvI7o9ClMvz6lTPxKw8TOeESnuYmhRSXfgGrX26OKISwJ0AAAAASUVORK5CYII='
    },
    walkRight2: {
        x: 108,
        y: 42,
        width: 15,
        height: 23,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAXCAYAAADUUxW8AAABgElEQVR42qVULW/DMBB9jgoGC93+A7MlLJVKClsFNHBgpOovWDQN9AcMlA5MbcYG24JqBQWFDUug/0FiGGlkzAOZXTcfSqU9yVLs0927e/cUAgA2ZRIAEsGJ+i4jEZyU34hNmYynPkR0wljkYP0lRq8/AICZOwAAhNEZb4+LahGbMpndu9KmTD44X3J93Ej5ndWe9XEjzc6sRHBSZmzCzB2A9Zd6TEsFyq02wSSwcCPC6Awx9DF5Xuq3TluSGPoAgAkAuuoVj17eziyGPuiqh7HIL4kGdPLp5U63dysstTueBrpAYyfzDGKeXUxiBtUKzLWZAj1ZC/A00EapWK7JnnU2tZqCrF8wxnsG814rWBOz43HEe4bP97ASr8x8oF2MRV7bcjwtdu7stkgEJzc7rA6NgqkZnT+vx9EZPA2utOnUJRYihXA8DkRFEZ4GONAuAOixOuV5lQ0dj+skADrRxBUzdUfAhxKH6b+LCfNOyvIrRfWqdtt2wdqcVWemf9nzF67Fws06Dc9qAAAAAElFTkSuQmCC'
    },
    walkRight3: {
        x: 142,
        y: 42,
        width: 15,
        height: 23,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAXCAYAAADUUxW8AAABf0lEQVR42pWUr27CUBjFf20qkJMX3uDK1kEyg2RBgBzJDCE8wCoQyAlEJ6dgjwATyyYQldSBvG8AV5LMTO1OsHb9u3QnadJ70/Pdc77v9ALgCmlcIQ3/hOUKafaDIToK6elz5YcHraz8ngMkRNkK6C4+ARi3OwA8RzsAnu7mpqwArpDm1nszq+3amI9T6bPargvWbFdIkz6xCuN2B9kKSBewgYLUKjx+PWTWdt3O6uthoaFOHRKAWDahX5OcIVXABghnjQJRLJsFme/iKks+aGWpo084ayQzLVUyOdHT50xYnN/0+IZZAIsdNzkSwL09B/xsPPNhAZCtIBlLWWTj0608MY39q0zevb5iP7g00XvZcNDKcmJi3Iw44+ro4/XVn2MsHZU6+pSp8PqbIvmgldWj3v+cKEQap8qvbAV4P1nfRztGUwrddmK/ot1FR2GSqNH0QkpbyYck41m0u+hJfKP4ldLjsNjxQkdhUiB/QpqUnrtV5fkvFEJSp0j+DvsGRtzJVsVjbugAAAAASUVORK5CYII='
    },
    walkRight4: {
        x: 207,
        y: 42,
        width: 15,
        height: 23,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAXCAYAAADUUxW8AAABgklEQVR42qVUIW/CQBh9RyqQkwf/4BytK8myZLJLBSBJZpapySEQk4gJJhELdGLJJJsgmUBUtq6V9w/gZJOZqd1E28u1HAS2lzS5fs37vnfveykBAJsyCQCp4KQ815EKTuo1YlMmk14fIg7hiQysPcXl4zcA4MbtAgCCOMLs+mG3iU2Z3HZcue240qZMLtZLKb+2xmexXkpdGdFl371OKhNNGF4k4JsRUsFJoyyy9vQgUZz3EcSRuhIAWOVBL5qIdN7C1W0+YFbUGzgBnshA5y31vkMO4ujoZoocjps4FURfmWnH+r11+angpJKacmV6Ex3huKnWVJlcb7APesIahz4mK4ZkxfJwDKL9htVRkhyfqwANBxFsylREjbKTXm6O8/G+09DxuVLYwB9wlGGsPYXjdpEUweGbUYVsmTp/0jMAwD2AJI7w9hzA8bmqe2AyFZxYh+Q9/UzgiQyOXxj4kpuIwgvLJNcTmZqilBREEYcw/gz2rq1wv/xVGbN9quP/iucv403HnBp4/m8AAAAASUVORK5CYII='
    },
    walkRight5: {
        x: 241,
        y: 42,
        width: 15,
        height: 23,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAXCAYAAADUUxW8AAABeUlEQVR42qWUr2/CQBTHPyUIJPLGf3CyOEhmkKBgcglmQc02C2JyghDsxDIwS5AFsWwCUbOEuk72P4BKkhncTZTrrqX8yl5ySXPX9973vt/vPQBsIZUtpOLCsGwhVdDuEPkezWhz8MfvKLSye0WAyPeSDVkZ0RhsuavVAZj4S7x+CXBUXoEE9njhqvHCVepnvbfGC3fvagX9cf/2BJB0zAtZGWEWKNpCKlkZAduDSdF1hxbA0CHsZjo3BtuTzIrXK1oPI3JhnxNZNQr8IwoAz93HZGPiL/chf82Ieuv9ZK1drOVfgWyRj6HDpyinHWZqbZokG16/RLhyUo6zsmY5dU/dvRlt8gkL3mWyAG5vlvkPw+watDsAVOezlKuqO9dN3XoKdvEUzHDlELoxmqmbfmGpZLPjsbCFVCnCbCGVSYYJN9jJFq6cFGFHYeuk6cskfiC9MqLWiA/ns5gwUyKzclYinainjnXu7NJK6MTkzpcOP832RQ7LzrBfnle9zbyp77EAAAAASUVORK5CYII='
    },
    walkUp0: {
        x: 9,
        y: 74,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABj0lEQVR42sWUoU/DQBTGf7dMTCIv/Q9Otm7ISZKJDceSmSmCRSwBiUDU4iiCBDm1gEBUtq6TJ/CsbiQzcw8BV67dYKD41PW9e+++970vVTQQaiPswKK0yv9u+QWhNnJ2fwVAMRhSDIYAnN1fVfmtV26fZyLrpch6KaE2IqcXIqcXH+fP+O3z7Ks41EZOoscq6V9oNpT1Uk6iRwm1kTZA73pTYzDpHjJ5SXeNSu96gx17M/4V/1SYTjskebb3cpJnpNMOAMop6/bnxGkWONyML1mUVil/lyaItxR2SKcd7Ot55SC1z2rfWa8mTjE3AJggZnScMTrOMEFcyzm03WvF3JCsRpigQ+TNGHUPIY9JVhuK+QNRH1mUVrX9LjfjSwDsbJuiHcPEe7UVaiPFYAh3Zv+Ad4ZiMKTyqg8TxDWqAEWeYV/PazG1S1EnSEWzUVTboy9S1Lc01Y76tvYXaDX3mKxG21b7jPnMKqpP+gDd7QFQ5ilH5RsAu+KL0qqW6+KSvzmH2oj6i91+FOc3PgV4B9TS3qWPX7w1AAAAAElFTkSuQmCC'
    },
    walkUp1: {
        x: 75,
        y: 74,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABgklEQVR42qWUr2/CQBzFP0cQSOSF/+Bk60AilyAARxMMEotATCIQ2DlA4NkEAYGoLO6QJ/AMtyUzuJvY2l1bNiD7JhX9/uh7976vJ8iEJ5XlQuxPRrjvBXfAk8r2FyMAdLOFbrYA6C9GST016Ellg3aEPoT0qrUcWq9aQx9Cgnb0w8iTynb8tbUfr8kz3S5tjDDdLlO1jr+2nlS2CFAfn3MIvUN46ajUx2dM1znjvfH/wdkuutrs9hQBwmGJ+vicFLLKugPhsASAiJWN93ctnrqP7E9GCNcAqjLJKewimeMgcZC4ZrXfrJdSVa8UAKoyIWhHBO0IVZmkajnL6ZXCbxhUZYLviONXa1+5hkGvVMKsmKVijgPM8oY9elLZjSzDXF3vnit0s0XiVTeyVAH0LsIcB6mcuKRoLIhLP6usyP79sUhZtf2GSd0CheweZ29B3qMXcgnVjSwjq3UATruQh9M7AG7ef3n+oRojxfdLsr/vpo0sp/LxB8U9dvtTnFt8CvAJx6DEoCOKVjcAAAAASUVORK5CYII='
    },
    walkUp2: {
        x: 108,
        y: 74,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABeUlEQVR42qVULW/DMBS8TAGFhVb+gWHMUjIpsNJAW9ZKJVPRaEBB4UBBaNlKJg12A1ULBiKNJMyFBuNJ4KSSMg9MTu3E/dh2KLLfPd87nwNY4BMqfUIlzsCxkXivDwBgb6/V+q4URq2rE2yd+WeCZZZiMZ7JRgOfUDlkGyn3hZT7QiqpT++rak3uCzlkm2oExydUUi/GywerGi2zFABwH3QaCka3HCKPfqSG84OxaSMohPMDxBi4wR/xf6Ka6xz0GhcAkmkL4fxw0hSdkExbxwD4hMqH58erJC7GM+xK4Tj6XVIvbjisnyTyqAqAcyk5dSii4SpfUwAA9WKMBilGgxTUi409w1WfUMnXFOxOgHoxmGYOCzoGWSlz61JEHkGsmhLLSdt+j+Wk+FUArObU5fIshcgjwxxD6vEBR0AWG/LrcNVpW3KcYUva6GrFvNdHmSXoll/NGUkQwvatGpIgxJa0YTxkVaAI9e4nzdHJAC6SjKxeEzv9R/UNBfy0USHon8MAAAAASUVORK5CYII='
    },
    walkUp3: {
        x: 141,
        y: 74,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABTklEQVR42r2Ur27DMBDGP0cDgYFW3sAwZR2ZVFhpoB0snIZKA/IAAwV5hIxMGgyqFBAQaSRlDvQbpGarVDLmgcyRnT9NNLBPOsWK75c7350DdBRQpgLKFCbkdCG+2YJvtpiC725tmnAlBRl1Mi3JU6WuZ6WuZ5XkqRo8gumY5KkFmRbvv1qYBJQp5sf4+FxgjnYPHKIOm+KsDt+YK+3r4I/6H/DtVNp9LCIXOJR4Xt5PAkXkAgCIbsf+/XUyYhG5EHWISgpCzF4yPx6ssAbMCSJjIzYmDTrWgB8ZAID5MXZPZWsAoPcGq7p4FM1zpEj8yNqsrNvBN9sGTPugfDn3IwaUqYx67UtzrbWWF6zlpZ8qXa7QXeszMj/uFefmRea/jRd1iIx6VsSboO6dmXpAmaqkIERXKaNem6I8FdbXB4dc52w6TkHWyM2ZHPOH9QOrJroE5w6VZAAAAABJRU5ErkJggg=='
    },
    death0: {
        x: 206,
        y: 202,
        width: 16,
        height: 21,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAVCAYAAABPPm7SAAABgElEQVR42pWUoW/CQBTGvyMVk8gb/8HJ1ixgliBLEBuSZG4KS8jEJGJZaqfGDAkSEGQIRJOZNjOtvP+AnSSZmTsEveNKr4W9pObye6/93vf1gIpyKZMuZbKKIWWNALCmdQCAL3YAgFTwAu/YGgfTMQCANlsAgEEcAQDeHp5l2SC4lMnJZi7l70/lM9nMc7KIamaNALMvD5dU/zYB3w6RCk5q6rD98odLy2RzO/iII3RGQWXz5+uwfImdUQD6fg2vy5GsWA5UZ53HIDdESwifri6WYLLO0ZahROb7uVILLATJpUyuzwzxxS6XA8cG/Kdq5tuTFdMpZI0A/V6Efi8CaxycGUzHSFYM1iAld/fHoHy34GUxVpXEEWY30dGV5QKp4ERLEHEI2mxDxCG4WIDPoa30ujxj6prJSUgFJ77YQcRh5Q5MRrtgfr63XGj9ALSMJPsb+fYQIJOvmW9QFmowjgrNpzYTm/dlMmyckwpOfBSHnF4ap1eb2gOxAdYbp4TZA9mI4jenPoeaAAAAAElFTkSuQmCC'
    },
    death1: {
        x: 8,
        y: 206,
        width: 16,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAABVElEQVR42qVUMW7CMBR9RhyA8ZcbeEy2VOrCGIkBDtALsGbsyJi1U5nYgQGJgYGlEtnC6BukHiP1AO5kk3w7Lmq/FMX5/u/5++XZAoFISJpQ/qaVQCwSkiYhaTbnnTHfX71nc94ZOz8IDgGHiP4EDpGM8M8Y84R+WUYB9LnvfY84ONct6OPJvbvjXLfeAt4W6qNEOleojzKaGySwhelcRXM2BDfOiSZRDXLd9owlEpLmRBNQNoOuLsh1i9V2HQS/v76B14qEpKkXd2HSwz7aAa8dA4CuLo4VAOS0RJo994HVFaopvFpPAzktoZrCqW9F5HNOg9gJ5AShk+kRhNrn2+gSeD5QTYG6ukbBQR9wdbudWDCvuWkl3GGyqlI2c52gKu9jVjdoZRur7RqqKaCaYtBYnojWxpTNPEPVi6VbPddtX8TBe+6X+zP4Gx8NzwePEvGr/QduTytbQVkpAwAAAABJRU5ErkJggg=='
    },
    death2: {
        x: 41,
        y: 206,
        width: 16,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAABeUlEQVR42qVUsW7CMBB9sfiAjFf+wBvJlkpdGCN1gJF+BhkZGeELyi8AA8IDA0sH1CWM+QPwGKk77kDt2sEOqD0psuO79+w7P18EjyXElW/9KKsIbZYQVwlxtdgtlfo6O99it1TaHwT7gCGiP4F9JJ3mSeTLsDVN+lg5/6wJzmUNen8yoz3PZX2zAWvuUG440tcK5Ya3rgUJbIC2EBgAoua9C4pba5DL2tFFlBBXgmJQ1oc87J0AnzVjOwBAWR9mXF+rzLszB1idCvhiGQDIw/6a63oF3p1BUIzqVGB+mWJ+maI6FRAUg3dnSH820BhHwqN0q869zIjElm5CXJ17mRqlW7+kNUFQ64EYhn8a81XZdwp9W3cJcll73/1RVpHvim+EVA6GptKaSPttn/azpgLfPp+dVOyj2z5vCuVgaAQzZhMIiiEoxphNjJjKgfsanX4gD3sTkK4L5MbzC3QEZBPksoag+CbAJvc9qOheJw6ZLnD0aEsPtfZvVKwyTDYVt1sAAAAASUVORK5CYII='
    },
    death3: {
        x: 74,
        y: 206,
        width: 16,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAABpklEQVR42o1UoW7DMBB9jvYBgV7+wGwJmVqpZDBSQTu2SiODgy0sLEzh0DoyqbAJqBZQUDKp0UgL8wetYaTxZmA6106cbJaiWHfvznfP78xgWT4Xpc1+kDlD2/K5KH0uysVmVZbfJ+NbbFYl+RuDbYFNiSiOUfDz+wxPnS5kb9haJf+M8Zbt8PI4xUHmzNGdsjdEKAvw12v11/ehLGoHONUT9muBoJ9jvxattsYEBAz6eautxgEZUu62chDKwrhW5nNRptwF79xBZluEssDofoflqmsEkq2KZT4X5X5wISZIYgCA8CIjQX6c/PJRwToAILOtMggvUm3MzzPMzzPVmvAidQDFGBwILzJOIrC+1zFK2iTR001HqUwnVrcRhmyqAup5ebtDkMS1wSGuRl9dxUlNiflxYg2mcoMkVuVbhUQE2iaOrrt6OwbgIfhoHtcGTE2JOuPUCvl1H/mdqoSJJGqFSq/6rBzsB0NF0tiZIuUuUu5i7EwVyboSAeDKeA+yrQIEyQSh8lwCSYG1BKEskHK3BtCT2yaS/fUSNy0imP33SW962n8AdCQ0/3wR/FEAAAAASUVORK5CYII='
    },
    death4: {
        x: 106,
        y: 206,
        width: 18,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAABYklEQVR42p1VrW7DMBA++wkCrb6BWRyWV8g0MliwFxhsNBRYNHVwrGi8qEpAX2FSA/0GtWGk8d3QWefKzZ+lKInj73zffd85Ah4MozSm5ntvBcwZRmk0SuPxckL8ddF1vJyQvt/jxH2Qt+89PL0fRjdrP2r4em3S2VEWLi/RKI348xLu/NkojS4vQ3aEl6kdr2cNxbOF61mPzo1SgwWDUxOPguhNuk72VieDCQrSqQwqP0QBPv/2UPkBAAA6lcFONlFAwvTeCqDiGaVxW7To8nKSnstL3BYtcqwgSnpzCGlPmS6FkRzUqWx2ofnaQI0oLVGNaBHF4CMq6pLBMZLL3alslpdIZa6w5HIGKWcYsfJD5Cm5ptApTAi0k81iatygkQJrVCNMZEjeEilj8o0oo2BImrS3OqRKinCgURpJWSoF9VvIiF7WNC3hou7nJps6Rvj63lsh1h5qyfNo7q9o7Jf0D3HLEgh0oL3lAAAAAElFTkSuQmCC'
    }
};
/* ───────────── Plunder Bomber player sprites ───────────── */
const PLUNDER_BOMBER_SPRITES = {
    idleDown: {
        x: 305,
        y: 5,
        width: 16,
        height: 21,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAVCAYAAABPPm7SAAABoElEQVR42qWUoW7DMBCGf3eZFLBJhSkYCBgwdFjLFimgAQPtY3SopQEDHS1aH2AP0MIEVNpYy2YYMBCwSQksNKiUge4SJ3U3sCO2zvf9dz6dzWAw4fDS5JdFyto+ywQO4MJoDsq2kKXDBAohzAKyFiIRS4fPgpSEzmUt0sE/rdED33mq9u60GZgt9JuE1f6kgnHC4U6PgBdweAFHtjgKjhN+UkElsEXWyKZXQIKm2OoKc7sHV3EA6TFTUgNeUGd21Qhze49I5QAAJhxeroYp0jcfABD2u4h3e2PD9DN+94pxwusKIpVjbvcQ7/YI+12jAMGRyrH68bH26M7tXiOjDhKsj/YFDdG98HFZKLwcPuFb140qbm9sfHwpRCqHHnu4sh47+oTRGqm8kTXe1U1rx3YAQMrjkNM6gFuJEEzvpB3Lfnu+f5ksUsaEw8uJGAEAlnKN902KhyA8eVhSSjxvYngBhx7fGOWJGMELOGbDuCqR4NmwCZMx0z+wlGtjyQST+BYZLFmkDA7KAVxIKSuR9vdFfdJhWaSMnfsHzwm0z78BuJnMLUIpRL0AAAAASUVORK5CYII='
    },
    walkDown0: {
        x: 9,
        y: 8,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABTklEQVR42p2UoZLCMBCGv3QQSGRPIiOD49wxg6ASHgOHrryzuHsMToLAg2NlZGUrkXU90UknKaHD3apk83+b3WwSRc9MqhsiJpVV/nzUB96ZYowJIRFIafwAykEx4GFXES4USGXV6FUIaDUCpDQJ/7SuxkX6xXQ3LC72IGQhCDBbag4ry+akA8D5Divb+RKAC0UgvJ1tdOxrlUl18zl+AyCvy8FUfV2Q6u1Dc7zeo1A2nwRryjXeRcvmkyjoIJdV4op3juP1HkT253lddgcU9NHB/q5u3K8/kcoqd/xbsyavy4cd87pka9YAbE4aqaxSJtXNYWWZ7to+bs0aESEb1y1YjzHG8C0/3M6WYt/Cyt3VWD/75utGscXYs+oHVbHH68MxSCqr1CuvP/YLJEOi/nfxNFV3oWdLHb30zt+1Y6iuZ/4k+Bb+MFavHEqs/l8uArn/P6LtpgAAAABJRU5ErkJggg=='
    },
    walkDown1: {
        x: 75,
        y: 8,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABSUlEQVR42p2UL3PCQBDFf5eJiEQGiTx5OJCdiSCyfIy6aiS1df0YVIKoT1xXRkaCRMalgl64ux6ZTFddLu/t7ts/pwjM5LonYnJplPudhoQ1C4wxPkkEcnrXgbKkGOFPVBEqWuTSqHQqCbhhBMjpE/5pg8an/I3F6zi4fQeh9IkAy0Jz2DRsT9oj2LvDphnuEoCK1gN+fzXRs4tVJtf9PpsDsOvOo6m6uCHVcjWDelxjuZpxrK93jbvuDPUvecSO9XXIKr2Lx4tondgINoAtlNdH682NbM+hfhXOaUXLPpt7EXfdefhn51WZXPe25MtC82KeERHKrLsRuwxjDB/yOfRxe9K3dqxZEOtnaC4uHYYXqKR9uFahUxVbXpccI8mlUWrK9sdegWQMFD4XD1N1qxYb+mWh/Xa4FQu34JHeZNJzETmrKUWJ6f8B6XaqqsKyGRAAAAAASUVORK5CYII='
    },
    walkDown2: {
        x: 108,
        y: 8,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABVUlEQVR42p2ULXPCQBBA32UikJWJREYerriKCirhZ+BaWSS6jp8BMojOtA4cKyMjiUTiUkH3uBzXDNOdydzmbt/cftyu4Q6xWdGqLk1lANI+I18OTwXl/sQio5WmMmkIjBlire1AIsLou+rsGYViQCgiwo4aaSqT3gsBFxsBMtqEf0oK8DYpgZLha9yo/risX817FwSYbQvWVMy2RQdaTy5760k3OTeuHj6rqO4nB8DYrGiXg5zF+dgb03KQO31xPl5d9Q9CeXl8AKDcn6511MIvB7kziIlC6lkSO/T/9VNIk5Ro5mIx+h6E5wnQqZ9/q3/TmKErm3vko+fCGWiSQmhH7WAyWmOzop3bKQAr2fSWRMEd9W0/hg/eL7qu0lTGxJpXYYVCjxzY1/1zO0VEXFutZHNNjgJaI/+hKxTqxh8Zvmg8f+2bvgEVy+bdMXba6nc0AvwAu7+3SNwDlHEAAAAASUVORK5CYII='
    },
    walkDown3: {
        x: 140,
        y: 9,
        width: 15,
        height: 23,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAXCAYAAADUUxW8AAABSElEQVR42qWUIXPCQBCFv2MikMggIyOvDv4BSPgZOCqLRNflZwQJojOtA9eTkZFEVuJSkdlwt0k6MH0quby3uX377uBJ2DitbZzWANEQYUi8H09Zzia8fFFHfaI5CdbaQOSc40zJ7naFS7NmfGGfSEOKuKow0TNCoOE4IKYe8Q+0Pb8ujiTbY4dQvofvn9VbV7w+peQUrE9pQM4X97V8UQTfgm0n25Dw/VEMGta6beO03o+nzRj+mK+P3e0ahkQTfCxnEwCOl5/2J8YPh4iFqOELB+OpBRpiotE57vu7FNCejCTLG7tiTtIhyFZ3tytzEoTfiiWWOp66RxmRwPi59meosbErADJ3aOZdFcb0nV//kGTu0AoFmTvcT5WriqDImbI5OSpZurWo7/ZoRtEV6ufOtsVJv3dZ08aZR+6tvqKtYY9efr4/AL+K1aQg8bD1tAAAAABJRU5ErkJggg=='
    },
    walkRight0: {
        x: 8,
        y: 41,
        width: 16,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAABgElEQVR42qVUr3PCMBh94SImkZ1ERga3ObirADn+jDl05GZx/BkgQXC3Oer4ZGRlK5F1nei+kKQp425Ptbm8l/f9FEhAZ6pNnVNtRXwmfQLVVuhMta+Y3MS07shEQIY2FhI6U+1lpnAorjBNBSYzseeCCGeUTkQC6JHvQWsNEIAMLdVWSKqtML/WYtuPQPqxn1F2AugLzLNPAMBk3f1PcxUm8XKyAIByA6yOe7zrt4C8OipcTtYRGSN2MM0Vyk33wm5hsaU9iKjLvgd+yFWBHXw8PQMA1OwLk/XNIp8DgGmqXl9Itl9uLOz3PLjgk5cvYywxdv+H4gqToZUc9184FNdALKjCENgyO/GJQRK5NDG4sUxTwTRV4MIJcAXi+FNifhJNU4FqK1wZTVO5CnBOuLH879jFQCOFzcJNtaV956JItPI0v+0Af6x9F7F910iDk5dYLPFSGd0TiC+nNpJ4dJ0NicgUcbewbh78qUyttVHqVb+UQ4uGOeJR60Oh/DsHPyw/15lZ2SzeAAAAAElFTkSuQmCC'
    },
    walkRight1: {
        x: 74,
        y: 41,
        width: 15,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAYCAYAAAAlBadpAAABoklEQVR42o2UL3PjMBDFf8oYHCz0QUPBDWuYMxPgzhy5fILiY8WGVxp2H8MHE5CZwphZ4IBYDWMYGKYDrhQ7Vpq+GY+lHb23f6RdRQSSahezm86q4T4ZHjadVZJqtyC7CIn0RGMgxQ1FlKTaNblmW58oz0c80ZMm3o3hQIvprEqACfEziAgYIMUlprOq/AjnOtR7ULEi/ZKfo0PL9DWss5f+P1/pniypds3eAtBuYL3TQWCZvrLeaarCst7pkejML7Y/lrSbXrkqLH/M377CA49VYadhS6rd72/fAdD5G9lLHxaAtwOU5+PYsw9Z52+TggyJT48PNLmmyXWwz/gitvWJbX2K5xxDeT6OQn16fGDyPO8hCNRjgcR0Vs1Xl4LdwoKM8txCfSNsX+l20++rwtLsLVVhOdB+CBynV3X9SLw3EQnNsCDjQBvaM/GL+eryPP0h/8ZFhINpJ32tPhsG156vB4K62XqRaXI9SaIk/70/49w/3PszwXa3JYd534LprFIxYrO3zFc65BxmGIwEZ7Fc/D0PJ4qIjPbB81fGbqxo/wGMrdCob5yBZgAAAABJRU5ErkJggg=='
    },
    walkRight4: {
        x: 173,
        y: 41,
        width: 15,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAYCAYAAAAlBadpAAABnElEQVR42p2UK5PjMBCEP6UMDi7UQUPBCdswpyrAW3Xk8jOOLTbcpWH7M3wwAalaGDMLChrGMDDMBxwpcuzs44boUeqeVmtGiokQbbqpfds6Fa+T+LBtnRJtugXplUikB1oLmi4mUaJNV2eGbXWiOB/xQA8aZbeWAw22dSoBRsCPQkTAApousa1TxUXOrdTPQk2Z9Ed+Dw4t9WuYp8/9OF+ZHizadPXeAdBsYL0zgWCpX1nvDGXuWO/MgHTmJ9tfS5pNz1zmjjf7t3c4yljmbixbtOlefvwEwGTvpM+9LAC/D1Ccj8PMXrLJ3keGxMCnxwfqzFBnJuzP+GJsqxPb6jR956kozseB1KfHB0bl+VkEgmpIkNjWqfnqati9WJBSnBuo7sj2Tjebfl3mjnrvKHPHgeZCcBw/1W2R+GwiEpphQcqBJrRn4ifz1bU8/SFf4yLCwTajvk4mG933rbUhMxCyjhrjf36T2RRItOlis77VkveeKpZuW6dUDKz3jvnKBJfD33UBxW4H2f4e/n3jn0REwjoGhsxflX5r2D+I3dBkXCAzPQAAAABJRU5ErkJggg=='
    },
    walkRight2: {
        x: 107,
        y: 42,
        width: 16,
        height: 23,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAXCAYAAAAC9s/ZAAABj0lEQVR42o1UoXKDQBB9xyAqI6lEnlxccGSmgsjkM+KiK1sb18+gshHMBJe6O7kSWWRlHRXMXg64hq67W97bt++WVQgEJboP3duO1fQu9gG2Y0WJ7nOkNzKiAWwtkKCfEilKdG8KDQDIGoaABThTYS2uaB1JLImPz2/8J4gIsAAS9LZjFduOVdYM0paqhyL2e7+iHQgwJ9gkrwCA9Dics6eh7UhMrEqGqRlVyXiz7zPw/qwdUMAAEAmYmw3a01BBSKy1IyLJ+aFEwcvDIwBAFxekR4yqSO7552s2FxElujc1QxeXUVIqCRgATKFhCj26i3x5SxF66mgJJLK36xW269XfBO3pPknWcDA3M9E3qip5ZqgpNLKG3Si7ZxRwjhQH2iFHiv1ZO2UypVMlavr7HmjnkjJQcjf9kRyBvwdypCAi9/HSXlD3lomQiZoD7Zwq58EUXJW3neC3YuphvMUjKaSmlX2wtFCVjP1ZzxQFTfRJfA98sO9PFFqWV7QjsKnZnX2w7Vip/2xkmRPZCX7RX/h93PRAPh11AAAAAElFTkSuQmCC'
    },
    walkRight3: {
        x: 140,
        y: 43,
        width: 16,
        height: 22,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAABj0lEQVR42pWUoXPCMBjFf+EQyMkiKyNTN1y5Q7C7GfgTJnHMIplkjj+DSRDcDTdcIyMrqUTiOlES2jTHxnfXuzbte3l97/siCJSKZBla14UR/lo3BBoQ38iUqsBaQ0TpEwkLzlIJQHIwDIgdsKVCa37IHUmXB0spBRqIKHVhRNdKSg6VvHu7h6ql4IccRZhgGH0A8LaHZFT9csd5sDdke8NmbFjrryB4urv6dAUDdFQky83YsH0dkn9CPMeRaK1bRPZ9MIXt8YxMv4nnzV2WvT4Ai8up1RcdKz/vNWXbXSwYIEslWSoba526NJl+Yw5D9+zX9nj+OwXfJCt72evz8vzU+tYpyD9hupMsLic24yqRei0up7ACXRiRjGSjiVY7zTtb/NlYXHI4VmS2lV2M9cFRSrnM/c70kxD1SbQf24Hxwf4gOYJ7Z8C90oURrpXr3WVrpibuApyxA2JmaoKKZOlSWO1eGgdJ/X6tv9iMDclINn4z6IGdyFD5Hj3kQba/KbBgXRgh/nugWo9svDaJX3TfzZjLJgbWAAAAAElFTkSuQmCC'
    },
    walkRight5: {
        x: 239,
        y: 43,
        width: 16,
        height: 22,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAABh0lEQVR42pWUoZLCMBCGv3QQyJOprIwM7nAwg4CZM8djnOMsEuTxJmepYAYcOCIjK0EicT1RElKawtzOdJrsZnf/3X8TQUS0VGVMb85WPOo6Mac+2T2Y1pWzMSApHwOJNmfn2EBhDHsKH6QTGsPMbaK1BgNISnO2IonV1pY9JjUEe4oGiqFc+nU2u+t7I3UPoKUqjxt7MwCmQjGUS6a54ndsmeYK8iYCX0JvpChWcNzYqknG1DL/jm17CVqqctFNsbuUbLYFYNK9Ms0Vi27K+iO9HT/FEQCowbZhXHRTv568v3EcKI4DVdMnYf0Axar6z68n5td7xvXhwvpwec5CTMIgAPNdfZ+4Bj4T18A+GV/6s0a174HdDWmbSse/G7Bw0DyN8+up0UiXzSF01IYU1y6TG5g+WS2Lu0Cxqy0cC8WKatr+KYmjzjk/Nsx9fTJvCxuZAPzkE6+c5qoxzsYYvsdrX14oQktVhjXH6o0x4850zNkKJCWm/mC0BQmdzdkK8eohffW4/gGdV7r5dAGLnwAAAABJRU5ErkJggg=='
    },
    walkUp0: {
        x: 9,
        y: 74,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABkklEQVR42pWUoVLDQBCGv8v0AZCRnDx5dY1rZxBlBtM+QTUuogaegTfgEYqDutYFx4mKcz1JZCXuEOmll0sYYFXy3327m83uChLTufIMmKmtiN9HKVAgqXB8TBUA472lQEKOjx1kASqQ3OtF6/Ht/dSJeK8XFMg2gAiQ1vqSljFUOEIG4cwYA0CFu6Ta+U6t0ehBPcA9MI4WLM2oA8bAZm6RZaO7J1huoTKuKVIKVrgeACBL+Cht6yDAoxRyT2D3M24nV011706o6Q5ZwgbLchtFHILC77idXPG2nwExrPrFCZCa7pqIZ0cuuZelYAwBqOmu1wwAmamtWG5V70CWtIWKbblVmNqKNuL4RvGbde7oXPnjCu8PeJ0rr3PlX69n/rjCH1f41+tZq/tDo+lc+RHArn6ANcALBZLHLwdt+p/txDyvH87ay3Cvxh3yk4mh4U3BtHdNbYX4y/QPbYHsJ8jUVqTrIr7T2QCh/cKkB30zt5fxOsNZeAjzNvTTgxbu6Fz5XnE286aJY0u1XnH+sx6/Ad95zsZS3ogEAAAAAElFTkSuQmCC'
    },
    walkUp1: {
        x: 75,
        y: 74,
        width: 14,
        height: 24,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABeElEQVR42qWUsW7CMBCGP0d5AMaMzejRbLAlUocidSFPwMzGg7DxGLABQyXY0g0PDN7wmpE3cIfUqUmsFqk3Oef77s5/zhb0TGXSETHdGBF+p31gSk6N5VJIAMZnw5QcMlyYIPXQlBylFFprAA6f94eKSzVv9zKcbowQIdS1pTU1Ft9BbC+NnUcphULxmw3AsJq3ftUBuNE7ALZvhnzV+uwaqiPU2rJU8y62O2ONHQBAL4HsVE+BB8iuwZxLZpNRq+77HVmcyFewxVAdg1ZjkP8ds8mIw7kEQlgOxfGQLE5txe9EtheX9MEQApDFaTAMAIlujKiOcrCRr36ECa06SnRjRFdx/Cr5yx5iVCbdbYFzV5zKpFOZdPuX0t0WuNsCt38pO7+7tj6VSSdUJp0f4HogAdEJ2ujdUNXYeMWSitjlDeEYpBsjxDO3P/YKJM9C/ZgkfAH8+Pm1b/vyYbpXwMNJmCUEYqKFlRPfd43tRAjFCH3+vv5LnC/VmdRLkE3HiAAAAABJRU5ErkJggg=='
    },
    walkUp2: {
        x: 108,
        y: 75,
        width: 14,
        height: 23,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAXCAYAAAA7kX6CAAABcUlEQVR42o2UrZLCMBDH/+n0AU7WRkYGd3XtDAJmzpTHwJVnuHOH4zFAUsEMOHCsjKytRJ7ric6mm7Zwt6bTzf72O1EYiE1Miwmhxin5H08B98wAAGYXhxS6UyZopYOYoRQa1lrs6IDj7dFnYG33hQURAQlaapxSEmLZ0QEAsLZFmC4RAOCKuk9VyhCQ0RkegUSEK2r/zzXKjAKQgf3CYSMMVhUbYBpkSJehwb10XYfnfXQAUDwGCR0/cm9gsrPXz+YGKTSuqBFJqN4C+Aobo38K7+h+cr7+aGR0e8BkZ5js3EW/PbB8f+ucCglAhmSarB9KNDUvXWLUpOHeRtQ4taoMXgk3aDbv7SKbmHZtC690lxz1tmuUu+QBNBoHrxjv6CvhccRyeflguPD7hcOwnJgap/iu8QaBwt3UJYCqP6fGKfXX7V/bAnnyie9q6e+rBxlIobFZHIO0ZENkxEhCz4yn3iX16oEaOuI9/VeNz166XyietEPwUZThAAAAAElFTkSuQmCC'
    },
    walkUp3: {
        x: 140,
        y: 76,
        width: 15,
        height: 22,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAABcElEQVR42pWULXfCMBSGn3AqJpGdjKwMjrpyDqLI8jOYqp6cntp+BkgQOwdccURG1lbyD5iApJeWj+11afJ+9N6bKDowcXLiDmzjlFxHt4iHLAFgtHMApOjzgZiTFIkkMUVTUbPeH4PgwhStOAZrLcScbONUJInGGAyGd7vqESVSNMScolub90gAxlzcu/8MYK2lou47XYh3C/ZtVyxzx1fZfqs/Yb7xytdGSlZ5mTt0eSZ46FKKJCFFRd2SJdHtJgAk2bYnMpqeBSpqBjKGJM7GQ9xuEtY+zeHHhZoMuspJtiXJtqz3R2bjYRCRAh6BPJomQUSXBIFHGPgBSdHMN0nvwCOBSPavsnWI5qNK6LJNCKDkaMoB+Xh5DTXoJvLVVs+uoccyd0HkqlW2cUre1RTNwhRhxhemCN1YmIKKGts4NbjlUlGH4fd4m87aey3H81n0LunKWRJTNMvc9Qi3nqs/OUt33w3bOKX+8wB2H8FfO7ur+BAfa5QAAAAASUVORK5CYII='
    },
    death0: {
        x: 239,
        y: 175,
        width: 16,
        height: 22,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAABfUlEQVR42oWULXfCMBiFn3AqJic7GRkZ3OrgHMQ4ZwZ+BlPVyGnU/gYWxM4B1zkiIyOpROI6AQkpTeGq5uPe9+b9qADQuWq4wtRWxOsY92emtiLTuWoKJAAVDr+ucBxGCoDh3lIgIacB8PfJaQZercJRIFnoWYi4+Tux+TuF9ULP8OIewVKBRGt9s2tMuPjoLKMHWms0mmfIUkmLI3jcuwhJ7COuPyyyvOy7Fcy3UBl3S6B3EC8qXIcIIEs4lDYIxSJZiuxWYPdjpu+vl2p8nlCjHbKENZb5NuEgRfYlnL6/stmPgVhE9VfBk9Vod3FwFXSJu4OUQEwGUKNdq6E6Aqa2wluKIUtCQmPMtwpTW9FyYGorhhP1tHGGkxsZQLS6L2qo75e38Ay7H7M8H0Og3j6Iu255dhCedewMUSeJOleNn8Sf302YygLZIt+3fZaK/jWR+LavksXrKaMxJvndmdTIxSBlK+Vq/WFbM+A54n4j/r09gq+GeGTvEdHjH7yMv10HhrOYAAAAAElFTkSuQmCC'
    },
    death1: {
        x: 470,
        y: 175,
        width: 16,
        height: 22,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAABjUlEQVR42p2ULW/DMBCGn0QBhYUda6ChxxbWSAPLNNKgweEOFe837J8UtgGTWpayGgyY1WMrHCzzQObWSVxt2klRTme/9/X6LiIgciRsyK4OOurakhAwI6XGsJsIAK43mowURtiuo8QHZ6RIKVFKAbDafrWizeS0ORthnZN2BlKe/wpejgaXkX9WK9MuwUXvOpPIUCtO5aiDjpJgs5SixvRALouLTfSBiztNOm/s5hXKCmpl6GYaASzHuV0dB9SYHhDoOBJkpBSDI/cf63MJPti8gt7kFDfDho2HL8RkTTqHBZqygoKrNv/7J6x9x+6fsMtxbu3j1C7HeUv377g3k5wZ0CeHxc2Q1baJCrD6ycYEmIhDLPhgADFZ9x6Vk9hxXlaid5jOzw30pazEidJWBte3gt+keycKTd/iTqM3+amMshLs3nQPrA46ip3iPgeAhsqyEszktDVQ/kQmoZmXI2Ffjp8t+/NtQXapib8tEzfeXb23D/iHxP8FO0x8adf54o+20x0m+utCvbRYvwEe6M6uyA/L8wAAAABJRU5ErkJggg=='
    },
    death2: {
        x: 536,
        y: 176,
        width: 16,
        height: 21,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAVCAYAAABPPm7SAAABb0lEQVR42o2UIZPCMBCFv3QQSCTIyMjgwJUZBMxg2p9R17Mn0bj7GZxhhjpwPUdkZeQhkec4UVLSEo57qrOb97LdvF1BAHqorqG4OVeiG4u6RD1U1ykSgHV/xClWAEyRTT4o4IiZTlo37L8uzXemk0bIxYRP1lrfyzWGEnu/PZAz50r0eAKtNRrNKwQF/NsdulUEBXzidlEh8zpuN5AWUBqLa3BQoMQ+EAFkDqe8aoR8kV6IbDdQHWcsJ4P6JVYXVHxA5rClIi0CFYTI7gmXkwH74wzwRdTzJjqyig91BTdBGzgbhWzrkwFUfGgZyjdf5BzmSvIhc5qG+kgL1Tg28m06nquXxhnPVcvu4tn0rfsjlrtbD1Yz3n++g9Mpuv/k1D/MZ+uwH/fHWnSnscQGbetc6s44kQcnArwt9qRF+9G2i4qyUA8zEvk9yHRCphNk3rbrFInM73mfE3VXlTGmmQEfdlPnuutN/GcX/rUbfwEjELpZrMKARgAAAABJRU5ErkJggg=='
    },
    death3: {
        x: 105,
        y: 206,
        width: 20,
        height: 23,
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAYAAAALHW+jAAABpElEQVR42q2Vr1rDMBTFf9lXUYkscnLy4tgjTO4VkPUYJsEgcJO8wiQWV+QViMrKVSLrgtgSbrJu419M2iT3fPeee07iODKkmnlODO1bN7ZeHAOaM0VEuHl8SPafb+9QVajwp4ATwLpaeP+Ol2oWZ/vt3/F1tfBjVRQ52Jwpi3KIa90To9+LcoBhChXeZulywPvyktWwBeC+vNwFX1/w8vYBEPfC/mrYJmVP8pRtwMtQJv+rYcuc6ejZg5Klmvlalqx1E4NEBEG4et0AUMty3+Ld1NCxj4llTyx3AUxEaOgAWOsG7VunfevWuolAIkISs2+Qy6USgLRvnVQzn8sirB2LiRyGzGJZRzRm12pZxkwPmiIiSYmcGZaCEAtQBP7+OubsNJnI5rvZjWUZhZ3b5yeAY5dIYRuyz9J/FzRoF0BVaeiYaN+60PbYuTNXVw4WtJnIRlV/3eUQm1ivoQMlWukUn6GCWpax1APAqHj98mwObIEsb9YtRSJs/crUuiYAJy4yYCJCo116HwaS7cHcBZYvC2Z5d+ceptxFlq8x7br/fvU+Af65JJ4LToNfAAAAAElFTkSuQmCC'
    }
};
/* ───────────── Bomb and explosion sprites ───────────── */
const BOMBERMAN_EXPLOSION_SPRITES = {
    bombs: {
        fuse0: {
            x: 0,
            y: 0,
            width: 16,
            height: 16,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSUlEQVR42qWTLU/DQBjH/y0VfIEm9wVIOMdhIHWbrEMRJqmYaLIEvWUJScMHIAyHxdWQgCzuMkwrIDkxUdmGIOpGgjjEdtfXEQY/dS/P/3n+9/IY6IARJrvWkzwxqjHhyS6MTiFxQCkFAAghVps5ryWbTV3Q/Qg7NTFx4J4PceoN8flVoHgvYNs2Pt4e4I4C7B31sXiJMJu6yBYFvMu0FLMDX46vHmWWxTLLYhlGSzk4u5GMML3OCJP8dizDC18qt5ZyoCwr4nmkx4fHfXABTO45/IFTizOVdQUXFFxQpK9pK1k8j+COAtCep51b1eorUVSrQHsenq4nAAIdI57vAOIAOS+PoKhW1hBnnaScKyz1VM07UOhnJE7nvtkK7BL/gLWtoOUgyROj+ct+Rc6R5Ilh4p+Yukm2cbGuDmBzM20SNrvS+Gs7K74B0DebyxOmawAAAAAASUVORK5CYII='
        },
        fuse1: {
            x: 17,
            y: 0,
            width: 15,
            height: 16,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAABMElEQVR42qWToVMCQRTGf3vDH6DtjMZrLglpEK9rsDlEHGbMx5gY/gBGbY7NRoSIbSGxwbDBQGQjzfgMcMfCMaPiV3b37X7ve/O9fXAE5rVLAVCHLnWsJTxbb1VIPNGwslA5SIrr26A3pWSnV2uy2iHGdZIkAcA5B96QdnoAjAddnh5Slp8rzqdzqrOpKoj6oi1ZfyTDyZdk/ZHoWEvWH8lyORcdazHPmQzv2xJWUZSdXqfc3Z4BDmgyHkC11sQ46L4Z2jf1kjeRjrUkjdaum7NJaU07PfJ3uXqhvPhY8Pi63SeNFuNBF+gVMff+sjbTGwDUvlEhctMK5F3wBuutqoQPwwTOOUpt20OlpPQHRNZbtVPaT9iUDBDxD0TF3/2NeqBaGoyDf3tD2h+Qo6YqxDeExZNgQsVqAgAAAABJRU5ErkJggg=='
        },
        fuse2: {
            x: 33,
            y: 0,
            width: 14,
            height: 16,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAABJ0lEQVR42p2SoU/DQBjFf236D+BO4yoQh2J1m5xHMDtFmixBb0Et+wOWAYI0OAxpUJvsXEGtAnGCZJOtxIH7EF27NXQs22fuu8u997539+DAWl43BMA5FHRyCUsaUgvUSkvRJ1li1d1xagHKyw+yuEKSnbXgJeL04c1ytkFus1uSmHlAuzcEYDYecHfbJv38wn/9qSp1ribSH00ljL5FKy390VTSdCFaaYnv+xLe+LKtXhn1/KKF55qyjw0MnmP8jvfHo62VltITMHlKAVi8R+Xa7g0pbBSqFcXwMQDAbXaZjQdA7nH1scLMg/zRsrg6qjEG13U3LMpbgzf7nd9hjKkaUd7OMNhJlliF/N7K4jIQNkeWXcZqn+qWGoD1b+TWgLrMWseG/BdvqH5WjjsArAAAAABJRU5ErkJggg=='
        },
        blastCenter: {
            x: 48,
            y: 0,
            width: 16,
            height: 16,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVR42o2TIXODQBCFPzIRF9e4q2skouIsLvwDJhOD6zBV6S/oZKL6CzJFMnWYDFOHJC5TVUQEkkpcLI4KOCBNyPSpY3ff27d3i6GkqmiQFqkBoGNJKDjtYPFZXs0DjADiNCAJBUqqSicjR1CaPtMlBA8CTVRSVUkoiNOgExDZCtstQVqYcw+A6ZIWd6o5SAukhe2WiGwFQGdJWpimyexxBkC8XZ+PIC3OUBxIi9QY629Nfnm6byJv2O666zyAse5+DebcI8uy60xpoaAa92P5Mef9ozv/ByN90J3yY96SB7s3IwOcOcj2wc159eX1a0b9ROSIuuAGWddk+2YP0iI1dGKy8UnCAZHiQBLWNZEj2s1sHUw2PiJbcdoNGzjt6qWbbPw2ZujVzF/B+ylvv3vjLHIE0yXYblkL9N/21o0vnj2+vxLi7bpz0C9sxRohTeyvd/+vvBC4EPqDPlHjF21il6TcejMoAAAAAElFTkSuQmCC'
        },
        lit0: {
            x: 0,
            y: 18,
            width: 16,
            height: 18,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAABPElEQVR42qWTIW/DMBCFv1QDgRsLTKHBgIuqsBSWViOl5v0BU2C0HzAeWjJNZYMr84YaMBDYwfyEsA60tnKJV9Inmdzde+d79sGNiEJBnehTKF639ah+MiTqRJ+WmxKAKo2p0hiA5ab0+aCAS6jcMJsvALjX5wMwmy9QuRndcOICrtP0cQpAsbWsdh2rXUextSJXpbEXiYRikkFrPSFTDQC2UQCU68zXOE8inegTSSadaS3LTelHOXx/8vFaEKoTAkopmn1FlcaY307UupjKDU3TeIG74bOo3GD2FcXWihHMOvMmin/gDDTdDKWUMKs/AsDx5wgwvsH0Bd7fDqy+zmO4QpDEECYAx2d4eEKqX4hDcj8vntEb1zN0CEFuLXVbR97EPjnU6eoIoSW5ikv30TaKH/kPcdjw5nW+GX8GK5onNZQU+wAAAABJRU5ErkJggg=='
        },
        lit1: {
            x: 16,
            y: 18,
            width: 16,
            height: 18,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAABKUlEQVR42sWToXLDMAyGP+cKAgcDU2gw4KJeWApDy0rN8wSBeYLx0NCywZb5ihYwENjBPEJYBrb4bCdbwcD+OwNLv35LsiRYgUrUtGbvhk6EtigMVImairIGoEljmjQGoChr618VmB0y1+z2BwCe1NcB2O0PyFwvMoxmw/zS9nkLQNUajueR43mkao3na9LYighPMclgMDYgkz0AppcA1KfMcuaeCJWoiSTzOzMYirK2pbzdLry+VKzxPAEpJf21oUlj9MfocWebzDV931uBTfgtMtfoa0PVGq8EfcpsE10sMnCb5ZYAcH+/A/yegUuES3Bfwhskq+wIhcEhJ+qGTszfskb4MXgwdEMnNg+JDxDZJXGyeIjv1+0kLrYwHBgnMNxK8dd1/n98As/PkpwJ3lD2AAAAAElFTkSuQmCC'
        },
        lit2: {
            x: 32,
            y: 18,
            width: 16,
            height: 18,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAABRElEQVR42qWTrW7DMBSFv1QDgSsLTKHBgIu6sBSWViWl5n2AKTBPMG5aNpUNtswaasCAYQvzCGEdqGzFrsGkXsnA9+f4nutz4UnLUk5ZyFvK3/XdQ/4kLpSFvK12LQC6zNFlDsBq1/p4EsAFRK2YL5YAvMr7AZgvlohaPXQ4cQ730uxtBkCzN6wPA+vDQLM3QUyXuQfJAsSigt74gkpYAIwVALTbyue4mWSykDeKKpxMb1jtWk/l/HPk+7MhlRcACCGwJ40uc9R1CHKdT9QKa60HeIm/RdQKddI0exNQUNvKDzHQQdzBeFhjCgCX3wsA1lp0fkZdh8cOxolwjO734q/3M9MNsI2E5LmNgOJigOkGLh8jKcc/4agkwXvjB9r1XZakEHcSWFGhriaUctd3mRPHf80tVpbcwlgwI+HEW/n0Oj9tfwQvmoxZnLupAAAAAElFTkSuQmCC'
        },
        lit3: {
            x: 48,
            y: 18,
            width: 16,
            height: 18,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAABSklEQVR42sWTr1PDMBTHP+UQlZO1lRETQXF1q8TOVTLPH8BNTiO4Qw5ZwzEJrrgcahGIyNk6KuuKyCU0WTck7y53yTff9837kQf/bckUKDM5LPs0wF7THt3q5KyAzOQAsOxTxAzKZ4s3t2A6KwIEQhexs1isvOD3i13O3J3jegGZyaGpbcj5PEfsGkwH+t0u04HYNeTz3EZUp14kCRSzAlrFulYAFMIAoIwAYFMVnuNSSWQmB7IirEyruLnbcHVdArD/bHh7XDPFCwSEEJiPLU2dUlZ9wHWYWKwwxniBy7gtYrGirLasaxWkUFZFUGDfxjgCV0ggSAHg8HUAOB/BmAhNdD62i/HBK4+EYueY89vGqMIunVOOtArd6mQyBVrF08M+gMqqP24j2BroVicSgigO9zCTdt9pJl8/OUzj3+Yt+oF/jvMUPjXOP567nnBaLj2vAAAAAElFTkSuQmCC'
        }
    },
    crosses: {
        thinLeft: {
            x: 3,
            y: 43,
            width: 73,
            height: 73,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABJCAYAAABxcwvcAAADCklEQVR42u1cO3KDMBBdMRQuXULnNjdw60twCZ8nkzv4ErQ+RjooKd05RSwiLbsSv4zWo2UmYxuMhB5vn5anjQ0I2rrz4QkAUF2O0LcDAADU94dJfV2FRIDcV7vfvmYNkseYpv79447nCpLLHu5ztiBNwgkxSEFaGEapdKkAwZud4Sw4qXSplAZK5Yq3hltkdhMys4kBydOaAIOy1qT6/jAUADgFSMWoQhKLRlBunRgWyUwBbh0Zcil1qZSiSdXl6INz68YUQDNuLoxegGXvAnTnw9MDgdCi1HqUHKTJrEZo0QTInEAi2eEy6fWeSw+yAAmzwxNpFHbZZ9wkACjsstakuYPPmknu4KW4kPL9JIGupOhwk5Jtiwo3iVokLtz6dtCMOzRwjjGpvW1xySREDDe1b61VInQrxfrbTQ0VAHQwPLNd5l6jN9ktBFhwggNvak+b/tMRCLVbzFqfDzQS+k5sQLjcZg3z1vRPnRNq11DmFj7RHqNeQ2YaPp+68BEgq0c2V0J+N87Ct/Q/i8XO+M0eMe8yYcnjBAsQJeTOMdzH2v45FuObYdi1L+KEYFg0NZsx47aqr48paygGAUDM/17TPzkW3K/D3pK9q3Z/6Gkdr5HhC421hS/Mfj5dAb4/4w7Blv5jjoPTlvHEcy+rgllgZI+5+07Xv/0WqFB7e/TPMNYyr/QEkBtAjNqUdjDU79sBqj1uxpb+KQl4RRLWtIkmuV/kTpozZcfEc2Ste1Mwm9xws8diurSjF+WmBLOmc5wGrF1Xw1OvB/YCwZ4LQqx/Kl2gNkMtBHIncce3PmJwk0Zo2t/aPxALn9y4za7L1CtWXEkHAOVNOG/Zs/85mxFbVYIqS7J2AXZ7GM7RmaTqk7QcUOuTtD5J65O0Pknrk7Q+SeuTtD4JtPQGtD5J65O0Pgm0Pknrk7Q+SeuTdHYjbdu+HVS45zy8phbst/iFCWWSIKa8VzIp7L+4ZSaTAl1J2QsBqklTILSOGxZaJU4Nt4Yb94CLBFztW6w9kSKJFJsBYT+hKFG4fwC/z62Ejpy1NAAAAABJRU5ErkJggg=='
        },
        thinRight: {
            x: 83,
            y: 44,
            width: 73,
            height: 72,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABICAYAAAC6L9h5AAADs0lEQVR42u1crY4bMRAebwMCWqkwUckVFx0L7UvkJY5XqlRYVB7WJ8hLhB47dCoN27AGBIRtwcaXudkZ2+uk57nzrLTK/sQeezI/n8ef4kDJ0S6mHQDA7OtHAADYbfYAADC/P7rSY2u0KAcrCF/j9/j6JQ+nzoqW8/OLdavCohot7oatCG7u+Oc1Kgm7j7cYTlFSm5c6JiWVJLrQdsUqZ35/dCXcTo274TgE67a3JByfas5urEUxyqk6cA9izHIuxqNSManRYEXsxLer3u0UWFSjyor88esHcFmvFJhs1GW3dXuOSSQ2lYpLTkNMegKMOB4hdyuNup2qdRuX8k9LkyqzmweHA1dThraLKonNaoH0zyr1LSsp2SIQBBChwltVUtQiFGEkXRCABm0miFcXk6SKJGxX57ikBCdNNFjRbrOHmb/59lNdYUJXqURJaUSlu6VktyqV5N3tye0EKyqNtnXWk8zdEjETqnFXv1vCxh+8CXBywdLWps/d/CaAuVvg8DiJKKqkNTXXtIQxE2kX046SJHKCfI78WD/0vsnJOP49/qTPYoLFwLxdnc+IcnPl42QhPfP37WLauVDNBnfg34UmisusVBC+HigohLRJCRcCPIKx8lOzr8vxezooag2xCe02++dtvJJowPbWJCDvq8ln+sN9sBYSjRHL+XDgfqLSUkKyFrw7QhWFXc73K8kZI5/KpO3Q/HabPTiOZTboMGfxybXDOyHcwaV+bE1jxpAjX9iEcOy2jjRw3zkVJrlJoKgf7FOypth4xshPaXtS0oQ1SWkgN3fn+xQh0uBivyhVVO4kQ317y+S+T5KFE6l4sYnEzB+/TzFzyTr9pGjbS+VH4hLOlM/djXO1SIaRNhST3odcm/7y0jgukR/ImBhKOJHYSTrCjUPpM5Yh2fQbym4pP9RI+VyaD1UnBhAg1jinDILhBZWVnDkTQOVY+Rzw5EB1EExSxEo/uQHkktvHou5L5UsrjGAfOYvHS57hNVf3fdZ1D7f9+fd3fz7c9s9PJ16fXUs+aGaVUEscQ70pwQnQuc39n9oaP8n4ScZPMn6S8ZOMn2T8JOMngfGTjJ9k/CTjJxk/yfhJxk8C4ycZP+lNZbd12+MkVPivOnCP2RCo2t2CazdSATB3MwiQUS5hkPar5kxeHQIwrleyKgkA8E5D+n//edo/eDwAfPrTX3/5APB4gMP2WPeyxE/+WtvqdZVKFHG49a3d8NJEUfB2GvbdJNK7ln8IdKDsLxQlZF5SUf8AnXRX3gaekrMAAAAASUVORK5CYII='
        },
        fullLeft: {
            x: 0,
            y: 121,
            width: 78,
            height: 77,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABNCAYAAAAIPlKzAAAEcElEQVR42u1cvW7bQAymBA0ePcqbHiHt5DUv4RfIVGQvEKBP0N1b/QJ5iayZ0m5dvclbNWa7DjZtiuL96JxYNMwDBEuyJEqfyPtIHnUAilq7nDlpXdqeuhWgrIUAWry+F+1y5hav7wUei+s3CxwFrL6f71dWC4Dn9vi7e+lgKqB4K7UAh4D0QBN+EeCpTbdUaZ4IVvN4WgioU5qoKuBEEJpHgPnDflHYSrWkQAHD9dWip3UGHGm7l25PCN1mqIExLb15csA+LtNtuUSr1Jrqdg3QgNpWqryr53a/bNfjCOWWTbXnkty9BZl1SnPVqXGrxYAMjpqoROvKa4hRodsEzdZMVQLsz9c9aEzbpjZVVUH+MU6l5or9G2rdIdg3U/X1cTx6UNaqqyEGGllYHxdoXNsO5NAzZ9M4D5My0ChB3LwDHGXGgBsyJatWKt0QdD94f7daq9G6SpMf10Lnas6s2N/xNJORg8CaNHXOSELLgI3ekCvgkmgYY1XHqvX9fKhpysxUf6zqYVcNpqo3Axzx4ww4Vt7g9d0IaBrGVSst2jYAgpLDdn1iWmPVBCc4gWHVAJdD9aHyrNH5OIwWPGDV93NolzPnk3kpV6UMvf1YjRq/YV6ClUoEufHqR8lPrc2j+wtff4MH+WrS+HGY7pHyZb2On7ycQWkXjRgiJMHlnCt/bJdS+ADLclwzEo+Dsq5Qfya4JXj9s+V7zuUvBMErJJWkD7P79jctecjLFsb4XBw0nsSUfDouI1c+npdwLQpez+TEt89vVKrrkLSEagc9hx/780cwqI+Cd658ib0xG8PlkKrQamCe/CEarON4BPgu3By9EfrQDfG/JE1CIPD/2LgpHe3C4zkIOfJ9wM8fAGDd729XC6gBoIXO9RjJPdXO/f7i3L9frtf4Nu6T9o9p9Bp8PXaOdJ+58ul1pHUq86l27XLmyigZ4JvJyVCknJNimlILmfUY+ZKmd5v+uYKcSmRSXmKFZsH7Gb5PGplqIGwmfLvbnPoY3J8Kbq78YNQiA1z42DRIBj4NGBsy8X4KtyWgfA+LcnLlA/gTCgF2LYJlCDGaDwHsE86P4f/7yAaB8znFufI9ft/gWwuWuo86wBRI6kzGfLvUEXexdDWmIQk+2meO+PeAk1I8HxEw+z4fEkO2EIDMn0wFJibfF0ZKGETTWSmA0cCXB8HSvlAwPXCH+ELdAeIS0OUc+Z+V8RmVJTknmeme6v7CfTsG3CVTSVxGmZNojG3DZ5Z6CWZ6iYwwl2H1cWD1cVYfZ/VxYPVxVh9n9XFWH2fkYPVxVh8HVh9n9XFWH2f1cVYfZ/VxVh931e7IMYBHs+Tf4x/2a3BH9M6t5BvtUsKq+kw1dRzXgIO0FJMiV0RnPg6zIsJMN1qyv+o0bgCMsikzrmeKoOdWnALNTDVQ4NwjCYWap3uKoLs30QHWME9meRXTA3ncl5tPnVMAdi8d1Di+0Og1VZUTKA8KHIXSB8uOsAwJDtoAANQKJ9xTq3Ghfo9/KjXl/f0HEAbTOzGUl5IAAAAASUVORK5CYII='
        },
        fullRight: {
            x: 80,
            y: 120,
            width: 80,
            height: 80,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAFRklEQVR42u1cP2vbUBA/OR48pKBRpos7li6ph9DVX8JfIEuD90CgQ+fuJkvzBbx3radCIJBkKVm92UOhGkLxEFAH6Umn0917shWaK7kHgUh+eu/p9O7f735SBMra+sMgc/8nk7j222aZAgDA8GobaVlvpEFgw6tt5ASXTGKA6ZDvvFiXQtQiyN5zLwALoSa80Qzg6Cb/G83yc9NhuSu17MK+NrUthRefiP2TSQxrSDMNguxpEGApBE5100uA1bw6Rn007MJIndOYDiuVpW01B1isVTkUNTawZv9W82rXxSeiOmvYgSpsYKNJNrDYfZpaT5UDkQTk7GCxQzfLVI0XVhXG1Gzd3TgXHHUitgM9DXth7EhGs4ZjaYQ+JkBoCo86EKTipsIhG0idCLKBySS2HUgzi1rjPDBK58wGtrGBnEClANviQCK8uzHvTBQ2PQJcrOtIDKfK6WWFygDAGtLsuZ2JCgFulmnTDmKBOSeisEVa4KxSgJwdxGrsBFmAqy8eTGiEI4t1Fc44UJWqMkGmzQtzDoUCCh6A1XLhkPAYPNBqIm13HudQbAcGGhUWPkZORkM6F2mqB3shfRTGbE7v1ajwgaaq3OGbAcDPB4Af3wFe3wPEx8iJHAOk1wAA8PDtl5U1vYACjgWxPRzlOzGZxABXG0vlgoCqJ3RxjAZzIoUtqwXGnA1UCu3r8sI4C8G7j3hlTUWlvsosRIr7RjOAL59UqXBfHZjgS90UBtMRfZL4uM1Tpv13TbOy8yTzVuSkeBABCl3m5wJyev8+mURtInoq4La1Dcrl424wO0+yBpAaEh4qQOE59pm/xktkrqNyoEKNuAGkRYhFILx7nBNw5xi2Qe2mL942hSeFL06F0S7sPL/vXsj1HLkzqqVQ7kaYJ926Gkav5yB7Oq4E4fsarpt0md8H4krjoEigXxuAsgHcAPR3PDDud3RTnJw3xzvja7x7CU9CqbvO7x4KlQNuZ0U2VNRk8h148bZ5I1hdpOReUru7sT+TcL+HvC5VX6nI1GV+7jp3Hs9J/1/NYXN6T8IYigCnl/JCRp6bD6Rh4iJ9zde3y/y+69qsKztPsuz312yvtu91XcbDfZ56/l3mvX2fZedJ1tspSFWKCsO/AHiFPLznrW45fh5Vo9Bkvj7096d+KLvOj887TuIO1/aSSVxxkumNOalzxlpaBHcN54A4Ie7jSJ5yfnoceLibZQoHHx8fPx/+eQR49ypHfbe3+V+5kOv8/GDMB7SDvnyNO++uxTfoxtze5se4n9S4Nbg59p3fnUuv8xjPIeFuvEG/PiaqDj6stlBlIi4jCPFVdqFa0LhRCl53jQXbYoNt56fZCs5iuCAbBdPNfHA6DEfpIca8sDgxhaKFpJAgXcArrWHX+T35b6hvJKEp0gBtKBWhtyzxAyuJRb4XbCi4yrxw02V+DoEJgSdlLiy9OSkNIgk71N8HI7HEIk6tPcLbd/42sJcbj+sbqWRm+fiBythZxg80fqDxA40fCMYPBOMHGj/QBAjGDzR+oPEDjR9o/EDjBxo/EIwfaPxA4wf+J8G0GhUubWAoE0FfcDMBSjmttNNILmw20EeiHOkXnrpUjq2PCOVULemcqh1YE17J9SOqLREfX7INrKEqDkzw2UHDAwNOxHF1JLKPIluo8/uBXGmT1IRNhSUscLGWhQf24R3R/m2WKSQUkeHUF3F3NKRzfQ32LwjNxydVXLiaq/qiuU5AlXt1oQ071nLhohWISy2IJnbQPsAohTGU1Ei/o4q8sFXl2lLdmFeszAtLr8wW38hPWr74+NztL787JmcVH37GAAAAAElFTkSuQmCC'
        }
    }
};
const BOMBERMAN_SPRITE_SETS = {
    player: BOMBERMAN_PLAYER_SPRITES,
    plunderBomber: PLUNDER_BOMBER_SPRITES,
    explosions: BOMBERMAN_EXPLOSION_SPRITES
};


/***/ }),

/***/ "./src/bomberman/core/game.ts":
/*!************************************!*\
  !*** ./src/bomberman/core/game.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _renderers_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../renderers/svg */ "./src/bomberman/renderers/svg.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/bomberman/core/constants.ts");
/* harmony import */ var _ai__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ai */ "./src/bomberman/core/ai.ts");
/* harmony import */ var _rules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./rules */ "./src/bomberman/core/rules.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const placePlayers = (store) => {
    const playerOneStart = (0,_rules__WEBPACK_IMPORTED_MODULE_4__.findNearestEmptyCell)(store, { x: 0, y: 0 });
    const playerTwoStart = (0,_rules__WEBPACK_IMPORTED_MODULE_4__.findNearestEmptyCell)(store, { x: _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - 1, y: _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT - 1 }, new Set([(0,_rules__WEBPACK_IMPORTED_MODULE_4__.positionKey)(playerOneStart)]));
    store.players = [
        createPlayer(1, 'Bomberman', playerOneStart, 'right', _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_SPRITE_SETS.player.idleDown.data),
        createPlayer(2, 'Plunder Bomber', playerTwoStart, 'left', _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_SPRITE_SETS.plunderBomber.idleDown.data)
    ];
};
const createPlayer = (id, name, position, direction, sprite) => (Object.assign(Object.assign({ id,
    name }, position), { alive: true, direction, bombsPlaced: 0, cellsDestroyed: 0, sprite }));
const pushSnapshot = (store) => {
    store.gameHistory.push({
        players: store.players.map((player) => (Object.assign({}, player))),
        bombs: store.bombs.map((bomb) => (Object.assign({}, bomb))),
        explosions: store.activeExplosions.map((explosion) => (Object.assign(Object.assign({}, explosion), { affectedCells: explosion.affectedCells.map((cell) => (Object.assign({}, cell))), hitPlayerIds: [...explosion.hitPlayerIds] })))
    });
};
const updateGame = (store) => {
    store.frameCount++;
    (0,_rules__WEBPACK_IMPORTED_MODULE_4__.updateExplosions)(store);
    (0,_rules__WEBPACK_IMPORTED_MODULE_4__.updateBombs)(store);
    for (const player of store.players) {
        if (!player.alive)
            continue;
        if ((0,_rules__WEBPACK_IMPORTED_MODULE_4__.canPlaceBomb)(store, player) && (0,_ai__WEBPACK_IMPORTED_MODULE_3__.shouldPlaceBomb)(store, player)) {
            (0,_rules__WEBPACK_IMPORTED_MODULE_4__.placeBomb)(store, player);
        }
        (0,_ai__WEBPACK_IMPORTED_MODULE_3__.movePlayer)(store, player);
    }
    pushSnapshot(store);
};
const appendDeathAnimationSnapshots = (store) => {
    if (store.players.every((player) => player.alive))
        return;
    for (let frame = 1; frame < _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_DEATH_ANIMATION_FRAMES; frame++) {
        (0,_rules__WEBPACK_IMPORTED_MODULE_4__.updateExplosions)(store);
        pushSnapshot(store);
    }
};
const resetGameState = (store) => {
    store.frameCount = 0;
    store.nextBombId = 0;
    store.players = [];
    store.bombs = [];
    store.activeExplosions = [];
    store.gameHistory = [];
    store.cellEvents = [];
    store.explosionEvents = [];
};
const stopGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    clearInterval(store.gameInterval);
});
const startGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    resetGameState(store);
    store.grid = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.createGridFromData(store);
    store.initialColors = store.grid.map((col) => col.map((cell) => cell.color));
    placePlayers(store);
    pushSnapshot(store);
    while ((0,_rules__WEBPACK_IMPORTED_MODULE_4__.countRemainingContributions)(store) > 0 &&
        store.players.filter((player) => player.alive).length > 1 &&
        store.frameCount < _constants__WEBPACK_IMPORTED_MODULE_2__.BOMBERMAN_MAX_FRAMES) {
        updateGame(store);
    }
    appendDeathAnimationSnapshots(store);
    const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_1__.Renderer.generateAnimatedSVG(store);
    store.config.svgCallback(svg);
    if (store.config.gameStatsCallback) {
        store.config.gameStatsCallback({
            totalScore: store.cellEvents.length,
            steps: store.frameCount,
            ghostsEaten: 0
        });
    }
    store.config.gameOverCallback();
});
const Game = {
    startGame,
    stopGame
};


/***/ }),

/***/ "./src/bomberman/core/pathfinding.ts":
/*!*******************************************!*\
  !*** ./src/bomberman/core/pathfinding.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canEscapeAfterPlantingBomb: () => (/* binding */ canEscapeAfterPlantingBomb),
/* harmony export */   canEscapeAfterPlantingBombAt: () => (/* binding */ canEscapeAfterPlantingBombAt),
/* harmony export */   estimateFastestRoute: () => (/* binding */ estimateFastestRoute),
/* harmony export */   findEscapeStep: () => (/* binding */ findEscapeStep),
/* harmony export */   findPathToTarget: () => (/* binding */ findPathToTarget),
/* harmony export */   findReachableBombOrigins: () => (/* binding */ findReachableBombOrigins),
/* harmony export */   getPreviousPlayerPosition: () => (/* binding */ getPreviousPlayerPosition),
/* harmony export */   isBacktrackingStep: () => (/* binding */ isBacktrackingStep),
/* harmony export */   sortPathOptions: () => (/* binding */ sortPathOptions)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/bomberman/core/constants.ts");
/* harmony import */ var _rules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rules */ "./src/bomberman/core/rules.ts");



const getPreviousPlayerPosition = (store, playerId) => {
    const previousFrame = store.gameHistory[store.gameHistory.length - 2];
    const previousPlayer = previousFrame === null || previousFrame === void 0 ? void 0 : previousFrame.players.find((candidate) => candidate.id === playerId);
    return previousPlayer ? { x: previousPlayer.x, y: previousPlayer.y } : null;
};
const isBacktrackingStep = (store, player, next) => {
    const previousPosition = getPreviousPlayerPosition(store, player.id);
    return Boolean(previousPosition && (0,_rules__WEBPACK_IMPORTED_MODULE_1__.samePosition)(previousPosition, next));
};
const sortPathOptions = (positions, options) => positions.sort((a, b) => {
    const aBacktracks = options.avoidFirstStep && (0,_rules__WEBPACK_IMPORTED_MODULE_1__.samePosition)(a, options.avoidFirstStep) ? 1 : 0;
    const bBacktracks = options.avoidFirstStep && (0,_rules__WEBPACK_IMPORTED_MODULE_1__.samePosition)(b, options.avoidFirstStep) ? 1 : 0;
    if (aBacktracks !== bBacktracks)
        return aBacktracks - bBacktracks;
    if (options.target)
        return (0,_rules__WEBPACK_IMPORTED_MODULE_1__.manhattan)(a, options.target) - (0,_rules__WEBPACK_IMPORTED_MODULE_1__.manhattan)(b, options.target);
    return 0;
});
const findPathToTarget = (store, start, isTarget, options = {}) => {
    var _a;
    const visited = new Set([(0,_rules__WEBPACK_IMPORTED_MODULE_1__.positionKey)(start)]);
    const queue = [
        { position: start, firstStep: null, distance: 0 }
    ];
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current)
            break;
        if (current.firstStep && isTarget(current.position)) {
            return {
                firstStep: current.firstStep,
                distance: current.distance
            };
        }
        const nextPositions = sortPathOptions((0,_rules__WEBPACK_IMPORTED_MODULE_1__.getAdjacentPositions)(current.position), current.firstStep ? { target: options.target } : options);
        for (const next of nextPositions) {
            const key = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.positionKey)(next);
            if (visited.has(key) || !(0,_rules__WEBPACK_IMPORTED_MODULE_1__.isPassableCell)(store, next))
                continue;
            visited.add(key);
            queue.push({
                position: next,
                firstStep: (_a = current.firstStep) !== null && _a !== void 0 ? _a : { x: next.x, y: next.y },
                distance: current.distance + 1
            });
        }
    }
    return null;
};
const estimateFastestRoute = (store, start, target, openedCells = new Set()) => {
    var _a;
    const queue = [{ position: start, firstStep: null, distance: 0, cost: 0, blastedCells: 0 }];
    const bestCosts = new Map([[(0,_rules__WEBPACK_IMPORTED_MODULE_1__.positionKey)(start), 0]]);
    while (queue.length > 0) {
        queue.sort((a, b) => a.cost - b.cost || (0,_rules__WEBPACK_IMPORTED_MODULE_1__.manhattan)(a.position, target) - (0,_rules__WEBPACK_IMPORTED_MODULE_1__.manhattan)(b.position, target));
        const current = queue.shift();
        if (!current)
            break;
        if (current.firstStep && (0,_rules__WEBPACK_IMPORTED_MODULE_1__.samePosition)(current.position, target)) {
            return {
                firstStep: current.firstStep,
                distance: current.distance,
                cost: current.cost,
                blastedCells: current.blastedCells
            };
        }
        for (const next of (0,_rules__WEBPACK_IMPORTED_MODULE_1__.getAdjacentPositions)(current.position)) {
            if ((0,_rules__WEBPACK_IMPORTED_MODULE_1__.bombAt)(store, next) || (0,_rules__WEBPACK_IMPORTED_MODULE_1__.isActiveExplosionCell)(store, next))
                continue;
            const key = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.positionKey)(next);
            const opened = openedCells.has(key);
            const contribution = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.isContributionCell)(store, next) && !opened;
            const walkable = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.isEmptyCell)(store, next) || opened || contribution || (0,_rules__WEBPACK_IMPORTED_MODULE_1__.samePosition)(next, target);
            if (!walkable)
                continue;
            const stepCost = contribution ? _constants__WEBPACK_IMPORTED_MODULE_0__.BOMBERMAN_PATH_BLAST_COST : 1;
            const nextCost = current.cost + stepCost;
            const previousBest = bestCosts.get(key);
            if (previousBest !== undefined && previousBest <= nextCost)
                continue;
            bestCosts.set(key, nextCost);
            queue.push({
                position: { x: next.x, y: next.y },
                firstStep: (_a = current.firstStep) !== null && _a !== void 0 ? _a : { x: next.x, y: next.y },
                distance: current.distance + 1,
                cost: nextCost,
                blastedCells: current.blastedCells + (contribution ? 1 : 0)
            });
        }
    }
    return null;
};
const findEscapeStep = (store, player) => {
    var _a;
    const maxDepth = Math.max(_constants__WEBPACK_IMPORTED_MODULE_0__.BOMBERMAN_BOMB_FUSE_FRAMES, _constants__WEBPACK_IMPORTED_MODULE_0__.BOMBERMAN_AI.ESCAPE_MIN_SEARCH_DEPTH);
    const queue = [
        { position: player, firstStep: null, depth: 0 }
    ];
    const visited = new Set([(0,_rules__WEBPACK_IMPORTED_MODULE_1__.positionKey)(player)]);
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current)
            break;
        if (current.firstStep && (0,_rules__WEBPACK_IMPORTED_MODULE_1__.isSafeStandingCell)(store, player, current.position))
            return current.firstStep;
        if (current.depth >= maxDepth)
            continue;
        const nextPositions = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.getAdjacentPositions)(current.position).sort((a, b) => {
            const aThreats = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.bombsThreateningAt)(store, a, player.id).length;
            const bThreats = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.bombsThreateningAt)(store, b, player.id).length;
            return aThreats - bThreats;
        });
        for (const next of nextPositions) {
            const key = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.positionKey)(next);
            if (visited.has(key) || !(0,_rules__WEBPACK_IMPORTED_MODULE_1__.isEmptyCell)(store, next) || (0,_rules__WEBPACK_IMPORTED_MODULE_1__.bombAt)(store, next) || (0,_rules__WEBPACK_IMPORTED_MODULE_1__.isActiveExplosionCell)(store, next, player.id))
                continue;
            const nextDepth = current.depth + 1;
            const explodesBeforeNextMove = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.bombsThreateningAt)(store, next, player.id).some((bomb) => bomb.timer <= nextDepth);
            if (explodesBeforeNextMove)
                continue;
            visited.add(key);
            queue.push({
                position: next,
                firstStep: (_a = current.firstStep) !== null && _a !== void 0 ? _a : { x: next.x, y: next.y },
                depth: nextDepth
            });
        }
    }
    return null;
};
const findReachableBombOrigins = (store, player) => {
    var _a;
    const visited = new Set([(0,_rules__WEBPACK_IMPORTED_MODULE_1__.positionKey)(player)]);
    const queue = [{ position: player, firstStep: null, distance: 0 }];
    const origins = [];
    const previousPosition = getPreviousPlayerPosition(store, player.id);
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current)
            break;
        origins.push(current);
        const nextPositions = sortPathOptions((0,_rules__WEBPACK_IMPORTED_MODULE_1__.getAdjacentPositions)(current.position), current.firstStep ? { target: player } : { avoidFirstStep: previousPosition, target: player });
        for (const next of nextPositions) {
            const key = (0,_rules__WEBPACK_IMPORTED_MODULE_1__.positionKey)(next);
            if (visited.has(key) ||
                !(0,_rules__WEBPACK_IMPORTED_MODULE_1__.isPassableCell)(store, next) ||
                (0,_rules__WEBPACK_IMPORTED_MODULE_1__.isActiveExplosionCell)(store, next, player.id) ||
                (0,_rules__WEBPACK_IMPORTED_MODULE_1__.isInOwnFutureBlast)(store, player, next)) {
                continue;
            }
            visited.add(key);
            queue.push({
                position: { x: next.x, y: next.y },
                firstStep: (_a = current.firstStep) !== null && _a !== void 0 ? _a : { x: next.x, y: next.y },
                distance: current.distance + 1
            });
        }
    }
    return origins;
};
const canEscapeAfterPlantingBombAt = (store, player, position) => {
    if (!(0,_rules__WEBPACK_IMPORTED_MODULE_1__.isEmptyCell)(store, position) || (0,_rules__WEBPACK_IMPORTED_MODULE_1__.bombAt)(store, position))
        return false;
    const virtualBomb = {
        id: -1,
        ownerId: player.id,
        x: position.x,
        y: position.y,
        timer: _constants__WEBPACK_IMPORTED_MODULE_0__.BOMBERMAN_BOMB_FUSE_FRAMES,
        exploded: false,
        sprite: ''
    };
    const virtualPlayer = Object.assign(Object.assign({}, player), { x: position.x, y: position.y });
    store.bombs.push(virtualBomb);
    try {
        return Boolean(findEscapeStep(store, virtualPlayer));
    }
    finally {
        store.bombs.pop();
    }
};
const canEscapeAfterPlantingBomb = (store, player) => {
    return canEscapeAfterPlantingBombAt(store, player, player);
};


/***/ }),

/***/ "./src/bomberman/core/rules.ts":
/*!*************************************!*\
  !*** ./src/bomberman/core/rules.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DIRECTIONS: () => (/* binding */ DIRECTIONS),
/* harmony export */   bombAt: () => (/* binding */ bombAt),
/* harmony export */   bombWouldHitContribution: () => (/* binding */ bombWouldHitContribution),
/* harmony export */   bombWouldHitOpponent: () => (/* binding */ bombWouldHitOpponent),
/* harmony export */   bombWouldHitTarget: () => (/* binding */ bombWouldHitTarget),
/* harmony export */   bombsThreateningAt: () => (/* binding */ bombsThreateningAt),
/* harmony export */   canPlaceBomb: () => (/* binding */ canPlaceBomb),
/* harmony export */   clearContributionCell: () => (/* binding */ clearContributionCell),
/* harmony export */   countRemainingContributions: () => (/* binding */ countRemainingContributions),
/* harmony export */   explodeBomb: () => (/* binding */ explodeBomb),
/* harmony export */   findNearestEmptyCell: () => (/* binding */ findNearestEmptyCell),
/* harmony export */   getAdjacentPositions: () => (/* binding */ getAdjacentPositions),
/* harmony export */   getBlastCells: () => (/* binding */ getBlastCells),
/* harmony export */   inBounds: () => (/* binding */ inBounds),
/* harmony export */   isActiveExplosionCell: () => (/* binding */ isActiveExplosionCell),
/* harmony export */   isContributionCell: () => (/* binding */ isContributionCell),
/* harmony export */   isEmptyCell: () => (/* binding */ isEmptyCell),
/* harmony export */   isInOwnFutureBlast: () => (/* binding */ isInOwnFutureBlast),
/* harmony export */   isPassableCell: () => (/* binding */ isPassableCell),
/* harmony export */   isSafeStandingCell: () => (/* binding */ isSafeStandingCell),
/* harmony export */   manhattan: () => (/* binding */ manhattan),
/* harmony export */   placeBomb: () => (/* binding */ placeBomb),
/* harmony export */   positionKey: () => (/* binding */ positionKey),
/* harmony export */   samePosition: () => (/* binding */ samePosition),
/* harmony export */   updateBombs: () => (/* binding */ updateBombs),
/* harmony export */   updateExplosions: () => (/* binding */ updateExplosions)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/bomberman/core/constants.ts");


const DIRECTIONS = [
    { x: 0, y: -1, direction: 'up' },
    { x: 0, y: 1, direction: 'down' },
    { x: -1, y: 0, direction: 'left' },
    { x: 1, y: 0, direction: 'right' }
];
const positionKey = ({ x, y }) => `${x}:${y}`;
const samePosition = (a, b) => a.x === b.x && a.y === b.y;
const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const inBounds = ({ x, y }) => x >= 0 && x < _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH && y >= 0 && y < _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT;
const isContributionCell = (store, { x, y }) => inBounds({ x, y }) && store.grid[x][y].commitsCount > 0;
const isEmptyCell = (store, { x, y }) => inBounds({ x, y }) && store.grid[x][y].commitsCount === 0;
const bombAt = (store, { x, y }) => store.bombs.find((bomb) => !bomb.exploded && bomb.x === x && bomb.y === y);
const isPassableCell = (store, position) => isEmptyCell(store, position) && !bombAt(store, position);
const getBlastCells = (position) => [
    position,
    ...DIRECTIONS.map((direction) => ({
        x: position.x + direction.x * _constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_BLAST_RANGE,
        y: position.y + direction.y * _constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_BLAST_RANGE
    })).filter(inBounds)
];
const isActiveExplosionCell = (store, position, ownerId) => store.activeExplosions.some((explosion) => (ownerId === undefined || explosion.ownerId === ownerId) && explosion.affectedCells.some((cell) => samePosition(cell, position)));
const bombsThreateningAt = (store, position, ownerId) => store.bombs.filter((bomb) => !bomb.exploded &&
    (ownerId === undefined || bomb.ownerId === ownerId) &&
    getBlastCells(bomb).some((cell) => samePosition(cell, position)));
const isInOwnFutureBlast = (store, player, position) => bombsThreateningAt(store, position, player.id).length > 0;
const isSafeStandingCell = (store, player, position) => isEmptyCell(store, position) &&
    !bombAt(store, position) &&
    !isActiveExplosionCell(store, position, player.id) &&
    !isInOwnFutureBlast(store, player, position);
const getAdjacentPositions = ({ x, y }) => DIRECTIONS.map((delta) => ({
    x: x + delta.x,
    y: y + delta.y,
    direction: delta.direction
})).filter(inBounds);
const countRemainingContributions = (store) => store.grid.reduce((sum, col) => sum + col.filter((cell) => cell.commitsCount > 0).length, 0);
const findNearestEmptyCell = (store, origin, blocked = new Set()) => {
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let x = 0; x < _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        for (let y = 0; y < _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT; y++) {
            const position = { x, y };
            if (!isEmptyCell(store, position) || blocked.has(positionKey(position)))
                continue;
            const distance = Math.abs(origin.x - x) + Math.abs(origin.y - y);
            if (distance < bestDistance) {
                best = position;
                bestDistance = distance;
            }
        }
    }
    return best !== null && best !== void 0 ? best : origin;
};
const canPlaceBomb = (store, player) => player.alive &&
    isEmptyCell(store, player) &&
    !bombAt(store, player) &&
    !store.bombs.some((bomb) => !bomb.exploded && bomb.ownerId === player.id);
const bombWouldHitContribution = (store, position) => getBlastCells(position).some((cell) => isContributionCell(store, cell));
const bombWouldHitOpponent = (store, player) => {
    const opponent = store.players.find((candidate) => candidate.id !== player.id && candidate.alive);
    return Boolean(opponent && getBlastCells(player).some((cell) => samePosition(cell, opponent)));
};
const bombWouldHitTarget = (store, player) => bombWouldHitContribution(store, player) || bombWouldHitOpponent(store, player);
const placeBomb = (store, player) => {
    if (!canPlaceBomb(store, player))
        return;
    store.bombs.push({
        id: store.nextBombId++,
        ownerId: player.id,
        x: player.x,
        y: player.y,
        timer: _constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_BOMB_FUSE_FRAMES,
        exploded: false,
        sprite: _constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.explosions.bombs.fuse0.data
    });
    player.bombsPlaced++;
};
const clearContributionCell = (store, position, ownerId) => {
    if (!isContributionCell(store, position))
        return false;
    const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
    store.grid[position.x][position.y] = {
        commitsCount: 0,
        level: 'NONE',
        color: theme.intensityColors[0]
    };
    const owner = store.players.find((player) => player.id === ownerId);
    if (owner)
        owner.cellsDestroyed++;
    store.cellEvents.push({
        frameIndex: store.gameHistory.length,
        x: position.x,
        y: position.y,
        color: theme.intensityColors[0]
    });
    store.config.pointsIncreasedCallback(store.cellEvents.length);
    return true;
};
const explodeBomb = (store, bomb) => {
    if (bomb.exploded)
        return;
    bomb.exploded = true;
    const affectedCells = [{ x: bomb.x, y: bomb.y }];
    const hitPlayerIds = [];
    for (const direction of DIRECTIONS) {
        const position = {
            x: bomb.x + direction.x * _constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_BLAST_RANGE,
            y: bomb.y + direction.y * _constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_BLAST_RANGE
        };
        if (!inBounds(position))
            continue;
        affectedCells.push(position);
        clearContributionCell(store, position, bomb.ownerId);
        const chainedBomb = bombAt(store, position);
        if (chainedBomb)
            explodeBomb(store, chainedBomb);
    }
    for (const player of store.players) {
        if (!player.alive)
            continue;
        if (!affectedCells.some((position) => position.x === player.x && position.y === player.y))
            continue;
        player.alive = false;
        hitPlayerIds.push(player.id);
    }
    const explosion = {
        bombId: bomb.id,
        ownerId: bomb.ownerId,
        x: bomb.x,
        y: bomb.y,
        remainingFrames: _constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_EXPLOSION_DURATION_FRAMES,
        affectedCells,
        hitPlayerIds,
        sprite: _constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.explosions.bombs.blastCenter.data
    };
    store.activeExplosions.push(explosion);
    store.explosionEvents.push(Object.assign({ frameIndex: store.gameHistory.length }, explosion));
};
const updateBombs = (store) => {
    for (const bomb of store.bombs) {
        if (!bomb.exploded)
            bomb.timer--;
    }
    for (const bomb of [...store.bombs]) {
        if (!bomb.exploded && bomb.timer <= 0)
            explodeBomb(store, bomb);
    }
    store.bombs = store.bombs.filter((bomb) => !bomb.exploded);
};
const updateExplosions = (store) => {
    for (const explosion of store.activeExplosions) {
        explosion.remainingFrames--;
    }
    store.activeExplosions = store.activeExplosions.filter((explosion) => explosion.remainingFrames > 0);
};


/***/ }),

/***/ "./src/bomberman/core/store.ts":
/*!*************************************!*\
  !*** ./src/bomberman/core/store.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Store: () => (/* binding */ Store)
/* harmony export */ });
const Store = {
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
    config: undefined
};


/***/ }),

/***/ "./src/bomberman/index.ts":
/*!********************************!*\
  !*** ./src/bomberman/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BombermanRenderer: () => (/* binding */ BombermanRenderer)
/* harmony export */ });
/* harmony import */ var _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/providers/providers */ "./src/shared/providers/providers.ts");
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/game */ "./src/bomberman/core/game.ts");
/* harmony import */ var _core_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/store */ "./src/bomberman/core/store.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class BombermanRenderer {
    constructor(conf) {
        this.conf = Object.assign({}, conf);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultConfig = {
                platform: 'github',
                username: '',
                svgCallback: (_) => { },
                gameOverCallback: () => { },
                gameTheme: 'github',
                pointsIncreasedCallback: (_) => { },
                githubSettings: { accessToken: '' }
            };
            this.store = JSON.parse(JSON.stringify(_core_store__WEBPACK_IMPORTED_MODULE_3__.Store));
            this.store.config = Object.assign(Object.assign({}, defaultConfig), this.conf);
            switch (this.store.config.platform) {
                case 'gitlab':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGitlabContributions(this.store);
                    break;
                case 'github':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGithubContributions(this.store);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${this.store.config.platform}`);
            }
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildGrid(this.store);
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildMonthLabels(this.store);
            yield _core_game__WEBPACK_IMPORTED_MODULE_2__.Game.startGame(this.store);
            return this.store;
        });
    }
    stop() {
        _core_game__WEBPACK_IMPORTED_MODULE_2__.Game.stopGame(this.store);
    }
}


/***/ }),

/***/ "./src/bomberman/renderers/animation.ts":
/*!**********************************************!*\
  !*** ./src/bomberman/renderers/animation.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appendFinalKeyframe: () => (/* binding */ appendFinalKeyframe),
/* harmony export */   appendKeyframe: () => (/* binding */ appendKeyframe),
/* harmony export */   buildChangingValuesAnimation: () => (/* binding */ buildChangingValuesAnimation),
/* harmony export */   buildStepwiseLinearAnimation: () => (/* binding */ buildStepwiseLinearAnimation),
/* harmony export */   frameToKeyTime: () => (/* binding */ frameToKeyTime)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/bomberman/core/constants.ts");

const buildChangingValuesAnimation = (values) => {
    const totalFrames = values.length;
    if (totalFrames <= 1)
        return null;
    const keyTimes = [];
    const keyValues = [];
    let lastValue = null;
    values.forEach((currentValue, index) => {
        if (currentValue === lastValue)
            return;
        appendKeyframe(keyTimes, keyValues, frameToKeyTime(index, totalFrames), currentValue);
        lastValue = currentValue;
    });
    if (keyTimes.length === 0)
        return null;
    appendFinalKeyframe(keyTimes, keyValues);
    if (keyValues.length <= 1 || keyValues.every((value) => value === keyValues[0]))
        return null;
    return {
        keyTimes: keyTimes.join(';'),
        values: keyValues.join(';')
    };
};
const buildStepwiseLinearAnimation = (values) => {
    const totalFrames = values.length;
    if (totalFrames <= 1)
        return null;
    const keyTimes = [];
    const keyValues = [];
    let lastValue = null;
    let lastChangeIndex = null;
    values.forEach((currentValue, index) => {
        if (currentValue === lastValue)
            return;
        if (lastValue !== null && lastChangeIndex !== null && index - 1 !== lastChangeIndex) {
            appendKeyframe(keyTimes, keyValues, frameToKeyTime(index - 1, totalFrames), lastValue);
        }
        appendKeyframe(keyTimes, keyValues, frameToKeyTime(index, totalFrames), currentValue);
        lastValue = currentValue;
        lastChangeIndex = index;
    });
    appendFinalKeyframe(keyTimes, keyValues);
    if (keyValues.length <= 1 || keyValues.every((value) => value === keyValues[0]))
        return null;
    return {
        keyTimes: keyTimes.join(';'),
        values: keyValues.join(';')
    };
};
const appendKeyframe = (keyTimes, values, time, value) => {
    if (time === keyTimes[keyTimes.length - 1]) {
        values[values.length - 1] = value;
        return;
    }
    keyTimes.push(time);
    values.push(value);
};
const appendFinalKeyframe = (keyTimes, values) => {
    if (keyTimes[keyTimes.length - 1] !== 1) {
        keyTimes.push(1);
        values.push(values[values.length - 1]);
    }
};
const frameToKeyTime = (frameIndex, totalFrames) => Number((Math.min(frameIndex, Math.max(totalFrames - 1, 1)) / Math.max(totalFrames - 1, 1)).toFixed(_core_constants__WEBPACK_IMPORTED_MODULE_0__.BOMBERMAN_SVG.PRECISION));


/***/ }),

/***/ "./src/bomberman/renderers/svg.ts":
/*!****************************************!*\
  !*** ./src/bomberman/renderers/svg.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Renderer: () => (/* binding */ Renderer)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/constants */ "./src/bomberman/core/constants.ts");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./animation */ "./src/bomberman/renderers/animation.ts");



const EXPLOSION_SPRITE_SIZE = _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE * _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.EXPLOSION_SPRITE_CELL_SPAN + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE * _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.EXPLOSION_SPRITE_GAP_SPAN;
const PLAYER_SPRITE_CHAINS = {
    1: {
        down: [
            { id: 'bm-player-1-down-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkDown0 },
            { id: 'bm-player-1-down-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkDown1 },
            { id: 'bm-player-1-down-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkDown2 },
            { id: 'bm-player-1-down-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkDown3 }
        ],
        up: [
            { id: 'bm-player-1-up-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkUp0 },
            { id: 'bm-player-1-up-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkUp1 },
            { id: 'bm-player-1-up-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkUp2 },
            { id: 'bm-player-1-up-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkUp3 }
        ],
        left: [
            { id: 'bm-player-1-left-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight0, flipX: true },
            { id: 'bm-player-1-left-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight1, flipX: true },
            { id: 'bm-player-1-left-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight2, flipX: true },
            { id: 'bm-player-1-left-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight3, flipX: true },
            { id: 'bm-player-1-left-4', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight4, flipX: true },
            { id: 'bm-player-1-left-5', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight5, flipX: true }
        ],
        right: [
            { id: 'bm-player-1-right-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight0 },
            { id: 'bm-player-1-right-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight1 },
            { id: 'bm-player-1-right-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight2 },
            { id: 'bm-player-1-right-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight3 },
            { id: 'bm-player-1-right-4', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight4 },
            { id: 'bm-player-1-right-5', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.walkRight5 }
        ]
    },
    2: {
        down: [
            { id: 'bm-player-2-down-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkDown0 },
            { id: 'bm-player-2-down-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkDown1 },
            { id: 'bm-player-2-down-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkDown2 },
            { id: 'bm-player-2-down-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkDown3 }
        ],
        up: [
            { id: 'bm-player-2-up-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkUp0 },
            { id: 'bm-player-2-up-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkUp1 },
            { id: 'bm-player-2-up-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkUp2 },
            { id: 'bm-player-2-up-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkUp3 }
        ],
        left: [
            { id: 'bm-player-2-left-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight0, flipX: true },
            { id: 'bm-player-2-left-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight1, flipX: true },
            { id: 'bm-player-2-left-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight2, flipX: true },
            { id: 'bm-player-2-left-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight3, flipX: true },
            { id: 'bm-player-2-left-4', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight4, flipX: true },
            { id: 'bm-player-2-left-5', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight5, flipX: true }
        ],
        right: [
            { id: 'bm-player-2-right-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight0 },
            { id: 'bm-player-2-right-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight1 },
            { id: 'bm-player-2-right-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight2 },
            { id: 'bm-player-2-right-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight3 },
            { id: 'bm-player-2-right-4', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight4 },
            { id: 'bm-player-2-right-5', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.walkRight5 }
        ]
    }
};
const PLAYER_DEATH_SPRITE_CHAINS = {
    1: [
        { id: 'bm-player-1-death-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.death0 },
        { id: 'bm-player-1-death-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.death1 },
        { id: 'bm-player-1-death-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.death2 },
        { id: 'bm-player-1-death-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.death3 },
        { id: 'bm-player-1-death-4', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.player.death4 }
    ],
    2: [
        { id: 'bm-player-2-death-0', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.death0 },
        { id: 'bm-player-2-death-1', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.death1 },
        { id: 'bm-player-2-death-2', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.death2 },
        { id: 'bm-player-2-death-3', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.plunderBomber.death3 }
    ]
};
const BOMB_SPRITE = { id: 'bm-bomb', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.explosions.bombs.fuse0 };
const EXPLOSION_SPRITE_CHAIN = [
    { id: 'bm-explosion-thin-left', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.explosions.crosses.thinLeft },
    { id: 'bm-explosion-full-left', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.explosions.crosses.fullLeft },
    { id: 'bm-explosion-full-right', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.explosions.crosses.fullRight },
    { id: 'bm-explosion-thin-right', frame: _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SPRITE_SETS.explosions.crosses.thinRight }
];
const toSvgX = (gx) => gx * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE);
const toSvgY = (gy) => gy * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.HEADER_HEIGHT;
const generateAnimatedSVG = (store) => {
    var _a, _b, _c, _d, _e;
    const svgWidth = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE);
    const svgHeight = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.HEADER_HEIGHT;
    const totalFrames = store.gameHistory.length;
    const totalDurationMs = Math.max((totalFrames * _core_constants__WEBPACK_IMPORTED_MODULE_1__.DELTA_TIME) / _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.DURATION_SPEED_DIVISOR, _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.MIN_DURATION_MS);
    const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
    const cellEventsByPosition = indexCellEvents(store.cellEvents);
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" color-interpolation="sRGB">`;
    svg += `<style>image { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }</style>`;
    svg += buildSpriteDefs();
    svg += `<rect width="100%" height="100%" fill="${theme.gridBackground}"/>`;
    let lastMonth = '';
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        if (store.monthLabels[x] !== lastMonth) {
            const xPos = x * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2;
            svg += `<text x="${xPos}" y="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.MONTH_LABEL_Y}" text-anchor="middle" font-size="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.MONTH_LABEL_FONT_SIZE}" fill="${theme.textColor}">${store.monthLabels[x]}</text>`;
            lastMonth = store.monthLabels[x];
        }
    }
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT; y++) {
            const colorAnim = getCellAnimationData(store, x, y, cellEventsByPosition);
            svg += `<rect id="c-${x}-${y}" x="${toSvgX(x)}" y="${toSvgY(y)}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE}" rx="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.CELL_RADIUS}" fill="${(_b = (_a = store.initialColors[x]) === null || _a === void 0 ? void 0 : _a[y]) !== null && _b !== void 0 ? _b : theme.intensityColors[0]}">`;
            if (colorAnim) {
                svg += `<animate attributeName="fill" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
					values="${colorAnim.values}" keyTimes="${colorAnim.keyTimes}"/>`;
            }
            svg += `</rect>`;
        }
    }
    for (const bombEvent of collectBombs(store)) {
        const opacityAnim = buildVisibilityAnimation(totalFrames, bombEvent.startFrame, bombEvent.endFrameExclusive);
        const initialOpacity = bombEvent.startFrame === 0 ? '1' : '0';
        svg += `<g id="bomb-${bombEvent.bomb.id}" opacity="${initialOpacity}" transform="translate(${centerPosition(bombEvent.bomb.x, bombEvent.bomb.y)})" style="will-change: opacity;">`;
        if (opacityAnim) {
            svg += `<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${opacityAnim.keyTimes}" values="${opacityAnim.values}"/>`;
        }
        svg += `<use x="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.BOMB_X}" y="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.BOMB_Y}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.BOMB_WIDTH}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.BOMB_HEIGHT}" href="${getDefaultBombRef()}" style="will-change: transform;">
			<animateTransform attributeName="transform" type="scale" calcMode="linear" dur="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.BOMB_PULSE_DURATION_MS}ms" repeatCount="indefinite"
				keyTimes="0;0.5;1" values="1;${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.BOMB_PULSE_SCALE};1"/>
		</use></g>`;
    }
    for (const explosion of store.explosionEvents) {
        const opacityAnim = getExplosionOpacityAnimation(store, explosion);
        const spriteAnim = getExplosionSpriteAnimation(store, explosion);
        const cx = toSvgX(explosion.x) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2;
        const cy = toSvgY(explosion.y) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2;
        const x = cx - EXPLOSION_SPRITE_SIZE / 2;
        const y = cy - EXPLOSION_SPRITE_SIZE / 2;
        svg += `<use x="${x}" y="${y}" width="${EXPLOSION_SPRITE_SIZE}" height="${EXPLOSION_SPRITE_SIZE}" href="${getDefaultExplosionRef()}" opacity="0" style="will-change: opacity;">`;
        if (spriteAnim) {
            svg += `<animate attributeName="href" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${spriteAnim.keyTimes}" values="${spriteAnim.values}"/>`;
        }
        if (opacityAnim) {
            svg += `<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${opacityAnim.keyTimes}" values="${opacityAnim.values}"/>`;
        }
        svg += `</use>`;
    }
    for (const player of store.players) {
        const positions = getPlayerPositions(store, player.id);
        const opacities = getPlayerOpacities(store, player.id);
        const spriteRefs = getPlayerSpriteRefs(store, player.id);
        const positionAnim = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.buildStepwiseLinearAnimation)(positions);
        const opacityAnim = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.buildChangingValuesAnimation)(opacities);
        const spriteAnim = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.buildChangingValuesAnimation)(spriteRefs);
        svg += `<use id="player-${player.id}" x="${-_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.PLAYER_SPRITE_WIDTH / 2}" y="${-_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.PLAYER_SPRITE_HEIGHT + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.PLAYER_SPRITE_WIDTH}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.PLAYER_SPRITE_HEIGHT}" href="${(_c = spriteRefs[0]) !== null && _c !== void 0 ? _c : getDefaultPlayerRef(player.id)}" opacity="${(_d = opacities[0]) !== null && _d !== void 0 ? _d : '0'}" transform="translate(${(_e = positions[0]) !== null && _e !== void 0 ? _e : '0 0'})" style="will-change: transform, opacity;">`;
        if (spriteAnim) {
            svg += `<animate attributeName="href" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${spriteAnim.keyTimes}" values="${spriteAnim.values}"/>`;
        }
        if (opacityAnim) {
            svg += `<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${opacityAnim.keyTimes}" values="${opacityAnim.values}"/>`;
        }
        if (positionAnim) {
            svg += `<animateTransform attributeName="transform" type="translate" calcMode="linear" dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${positionAnim.keyTimes}" values="${positionAnim.values}"/>`;
        }
        svg += `</use>`;
    }
    svg += '</svg>';
    return svg;
};
const getCellAnimationData = (store, x, y, eventsByPosition) => {
    var _a, _b;
    const totalFrames = store.gameHistory.length;
    const initialColor = (_b = (_a = store.initialColors[x]) === null || _a === void 0 ? void 0 : _a[y]) !== null && _b !== void 0 ? _b : _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store).intensityColors[0];
    const events = eventsByPosition.get(cellEventKey(x, y));
    if (!events || events.length === 0)
        return null;
    const keyTimes = [0];
    const values = [initialColor];
    for (const event of events) {
        const time = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.frameToKeyTime)(event.frameIndex, totalFrames);
        if (time !== keyTimes[keyTimes.length - 1]) {
            keyTimes.push(time);
            values.push(event.color);
        }
        else {
            values[values.length - 1] = event.color;
        }
    }
    if (keyTimes[keyTimes.length - 1] !== 1) {
        keyTimes.push(1);
        values.push(values[values.length - 1]);
    }
    if (values.length <= 1 || values.every((v) => v === values[0]))
        return null;
    return { keyTimes: keyTimes.join(';'), values: values.join(';') };
};
const collectBombs = (store) => {
    const bombs = new Map();
    for (let frameIndex = 0; frameIndex < store.gameHistory.length; frameIndex++) {
        const frame = store.gameHistory[frameIndex];
        for (const bomb of frame.bombs) {
            const existing = bombs.get(bomb.id);
            if (existing) {
                existing.endFrameExclusive = frameIndex + 1;
            }
            else {
                bombs.set(bomb.id, {
                    bomb,
                    startFrame: frameIndex,
                    endFrameExclusive: frameIndex + 1
                });
            }
        }
    }
    return Array.from(bombs.values());
};
const getPlayerPositions = (store, playerId) => store.gameHistory.map((frame) => {
    const player = frame.players.find((candidate) => candidate.id === playerId);
    return player ? centerPosition(player.x, player.y) : '0 0';
});
const getPlayerSpriteRefs = (store, playerId) => store.gameHistory.map((frame, frameIndex) => {
    const player = frame.players.find((candidate) => candidate.id === playerId);
    if (!player)
        return getDefaultPlayerRef(playerId);
    if (!player.alive) {
        const deathFrameIndex = getPlayerDeathFrameIndex(store, playerId);
        if (deathFrameIndex !== null) {
            const chain = PLAYER_DEATH_SPRITE_CHAINS[playerId];
            const spriteIndex = Math.min(Math.max(frameIndex - deathFrameIndex, 0), chain.length - 1);
            return toSpriteRef(chain[spriteIndex]);
        }
    }
    const previousPlayer = frameIndex > 0 ? store.gameHistory[frameIndex - 1].players.find((candidate) => candidate.id === playerId) : undefined;
    const moving = Boolean(previousPlayer && (previousPlayer.x !== player.x || previousPlayer.y !== player.y));
    const cycle = PLAYER_SPRITE_CHAINS[playerId][player.direction];
    const spriteIndex = moving ? Math.floor(frameIndex / _core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.PLAYER_SPRITE_FRAME_INTERVAL) % cycle.length : 0;
    return toSpriteRef(cycle[spriteIndex]);
});
const getPlayerOpacities = (store, playerId) => store.gameHistory.map((frame, frameIndex) => {
    const player = frame.players.find((candidate) => candidate.id === playerId);
    if (!player)
        return '0';
    if (player.alive)
        return '1';
    const deathFrameIndex = getPlayerDeathFrameIndex(store, playerId);
    if (deathFrameIndex === null)
        return '0';
    const deathFrame = frameIndex - deathFrameIndex;
    return deathFrame >= 0 && deathFrame < PLAYER_DEATH_SPRITE_CHAINS[playerId].length ? '1' : '0';
});
const getPlayerDeathFrameIndex = (store, playerId) => {
    for (let frameIndex = 1; frameIndex < store.gameHistory.length; frameIndex++) {
        const previousPlayer = store.gameHistory[frameIndex - 1].players.find((candidate) => candidate.id === playerId);
        const currentPlayer = store.gameHistory[frameIndex].players.find((candidate) => candidate.id === playerId);
        if ((previousPlayer === null || previousPlayer === void 0 ? void 0 : previousPlayer.alive) && currentPlayer && !currentPlayer.alive)
            return frameIndex;
    }
    return null;
};
const centerPosition = (x, y) => `${toSvgX(x) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2} ${toSvgY(y) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2}`;
const getExplosionSpriteAnimation = (store, explosion) => {
    const totalFrames = store.gameHistory.length;
    const keyTimes = [0];
    const values = [getDefaultExplosionRef()];
    const visibleFrames = Math.max(explosion.remainingFrames, 1);
    for (let localFrame = 0; localFrame < visibleFrames; localFrame++) {
        const frameIndex = explosion.frameIndex + localFrame;
        const time = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.frameToKeyTime)(frameIndex, totalFrames);
        const spriteIndex = Math.min(localFrame, EXPLOSION_SPRITE_CHAIN.length - 1);
        (0,_animation__WEBPACK_IMPORTED_MODULE_2__.appendKeyframe)(keyTimes, values, time, toSpriteRef(EXPLOSION_SPRITE_CHAIN[spriteIndex]));
    }
    (0,_animation__WEBPACK_IMPORTED_MODULE_2__.appendFinalKeyframe)(keyTimes, values);
    if (values.length <= 1 || values.every((v) => v === values[0]))
        return null;
    return { keyTimes: keyTimes.join(';'), values: values.join(';') };
};
const getExplosionOpacityAnimation = (store, explosion) => {
    const totalFrames = store.gameHistory.length;
    const start = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.frameToKeyTime)(explosion.frameIndex, totalFrames);
    const end = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.frameToKeyTime)(explosion.frameIndex + explosion.remainingFrames, totalFrames);
    return {
        keyTimes: `0;${start};${start};${end};${end};1`,
        values: `0;0;${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.EXPLOSION_OPACITY};${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BOMBERMAN_SVG.EXPLOSION_OPACITY};0;0`
    };
};
const buildVisibilityAnimation = (totalFrames, startFrame, endFrameExclusive) => {
    if (totalFrames <= 1 || (startFrame === 0 && endFrameExclusive >= totalFrames))
        return null;
    const start = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.frameToKeyTime)(startFrame, totalFrames);
    const end = (0,_animation__WEBPACK_IMPORTED_MODULE_2__.frameToKeyTime)(endFrameExclusive, totalFrames);
    return {
        keyTimes: `0;${start};${start};${end};${end};1`,
        values: '0;0;1;1;0;0'
    };
};
const indexCellEvents = (events) => {
    const eventsByPosition = new Map();
    for (const event of events) {
        const key = cellEventKey(event.x, event.y);
        const cellEvents = eventsByPosition.get(key);
        if (cellEvents) {
            cellEvents.push(event);
        }
        else {
            eventsByPosition.set(key, [event]);
        }
    }
    return eventsByPosition;
};
const cellEventKey = (x, y) => `${x}:${y}`;
const buildSpriteDefs = () => {
    const symbols = new Map();
    for (const playerChains of Object.values(PLAYER_SPRITE_CHAINS)) {
        for (const cycle of Object.values(playerChains)) {
            for (const sprite of cycle)
                symbols.set(sprite.id, sprite);
        }
    }
    for (const cycle of Object.values(PLAYER_DEATH_SPRITE_CHAINS)) {
        for (const sprite of cycle)
            symbols.set(sprite.id, sprite);
    }
    symbols.set(BOMB_SPRITE.id, BOMB_SPRITE);
    for (const sprite of EXPLOSION_SPRITE_CHAIN)
        symbols.set(sprite.id, sprite);
    const defs = Array.from(symbols.entries())
        .map(([id, sprite]) => `<symbol id="${id}" viewBox="0 0 ${sprite.frame.width} ${sprite.frame.height}" overflow="visible">
				<image width="${sprite.frame.width}" height="${sprite.frame.height}" href="${sprite.frame.data}" preserveAspectRatio="xMidYMid meet" style="image-rendering: pixelated;"${sprite.flipX ? ` transform="translate(${sprite.frame.width} 0) scale(-1 1)"` : ''}/>
			</symbol>`)
        .join('');
    return `<defs>${defs}</defs>`;
};
const toSpriteRef = (sprite) => `#${sprite.id}`;
const getDefaultPlayerRef = (playerId) => toSpriteRef(PLAYER_SPRITE_CHAINS[playerId].down[0]);
const getDefaultBombRef = () => toSpriteRef(BOMB_SPRITE);
const getDefaultExplosionRef = () => toSpriteRef(EXPLOSION_SPRITE_CHAIN[0]);
const Renderer = {
    generateAnimatedSVG
};


/***/ }),

/***/ "./src/breakout/core/constants.ts":
/*!****************************************!*\
  !*** ./src/breakout/core/constants.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BALL_COLOR: () => (/* binding */ BALL_COLOR),
/* harmony export */   BALL_INITIAL_DX: () => (/* binding */ BALL_INITIAL_DX),
/* harmony export */   BALL_INITIAL_DY: () => (/* binding */ BALL_INITIAL_DY),
/* harmony export */   BALL_RADIUS: () => (/* binding */ BALL_RADIUS),
/* harmony export */   BALL_SHADOW_COLOR: () => (/* binding */ BALL_SHADOW_COLOR),
/* harmony export */   BALL_TARGETING_THRESHOLD: () => (/* binding */ BALL_TARGETING_THRESHOLD),
/* harmony export */   CELL_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE),
/* harmony export */   DELTA_TIME: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME),
/* harmony export */   GAME_THEMES: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAME_THEMES),
/* harmony export */   GAP_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE),
/* harmony export */   GRID_HEIGHT: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT),
/* harmony export */   GRID_WIDTH: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH),
/* harmony export */   MAX_BOUNCE_ANGLE: () => (/* binding */ MAX_BOUNCE_ANGLE),
/* harmony export */   PADDLE_COLOR: () => (/* binding */ PADDLE_COLOR),
/* harmony export */   PADDLE_HEIGHT: () => (/* binding */ PADDLE_HEIGHT),
/* harmony export */   PADDLE_SPEED: () => (/* binding */ PADDLE_SPEED),
/* harmony export */   PADDLE_WIDTH: () => (/* binding */ PADDLE_WIDTH),
/* harmony export */   PADDLE_Y: () => (/* binding */ PADDLE_Y)
/* harmony export */ });
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/constants */ "./src/shared/constants.ts");
/* ─── Re-export shared constants so breakout code has one import location ─── */

/* ───────────── Ball ───────────── */
/** Ball radius in grid units (slightly less than half a cell) */
const BALL_RADIUS = 0.21;
/** Initial ball speed components (grid units per frame). The ratio is
 *  intentionally irrational so the ball path is non-repeating.
 *  Keep each component < 1.0 so the ball never skips over a grid cell. */
const BALL_INITIAL_DX = 0.75;
const BALL_INITIAL_DY = -0.95;
/* ───────────── Paddle ───────────── */
/** Paddle width in grid units */
const PADDLE_WIDTH = 7;
/** Maximum horizontal distance the paddle moves per frame */
const PADDLE_SPEED = 2.0;
/** Paddle Y position in grid units (just below the last row) */
const PADDLE_Y = 7.4;
/** Paddle height in grid units */
const PADDLE_HEIGHT = 0.5;
/**
 * Maximum bounce angle (degrees from vertical) when the ball hits the paddle edge.
 * Centre hit = straight up (0°). Far edge = MAX_BOUNCE_ANGLE either side.
 */
const MAX_BOUNCE_ANGLE = 65;
/* ───────────── AI ───────────── */
/** If the ball has not hit a brick for this many frames, force-target
 *  the nearest remaining brick to avoid stalling. */
const BALL_TARGETING_THRESHOLD = 10;
/* ───────────── Visual ───────────── */
const BALL_COLOR = '#ffffff';
const PADDLE_COLOR = '#ffffff';
const BALL_SHADOW_COLOR = '#aaaaaa';


/***/ }),

/***/ "./src/breakout/core/game.ts":
/*!***********************************!*\
  !*** ./src/breakout/core/game.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BreakoutGame: () => (/* binding */ BreakoutGame)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _renderers_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../renderers/svg */ "./src/breakout/renderers/svg.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/breakout/core/constants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/** Fraction of a grid unit occupied by the visible brick face (gap excluded). */
const CELL_RATIO = _constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE / (_constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE + _constants__WEBPACK_IMPORTED_MODULE_2__.GAP_SIZE); // ≈ 0.909
/** Ordered levels from weakest to strongest. */
const LEVEL_ORDER = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
/** Return the level one step below the given level (minimum NONE). */
const decrementLevel = (level) => {
    const idx = LEVEL_ORDER.indexOf(level);
    return LEVEL_ORDER[Math.max(0, idx - 1)];
};
/* ────────────────── Initialise game state ────────────────── */
const placeBall = (store) => {
    store.ball = {
        x: _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH / 2,
        y: _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_Y - 1.5,
        dx: _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_INITIAL_DX,
        dy: _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_INITIAL_DY // negative = moving upward toward bricks
    };
};
const placePaddle = (store) => {
    store.paddle = {
        x: (_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH) / 2,
        width: _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH
    };
};
/* ────────────────── Main loop ────────────────── */
const startGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    store.frameCount = 0;
    store.framesSinceLastBrickHit = 0;
    store.gameHistory = [];
    store.brickEvents = [];
    store.grid = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.createGridFromData(store);
    // Snapshot initial colors before any bricks are hit (used by SVG renderer)
    store.initialColors = store.grid.map((col) => col.map((cell) => cell.color));
    const totalBricks = store.grid.reduce((sum, col) => sum + col.filter((c) => c.commitsCount > 0).length, 0);
    if (totalBricks === 0) {
        const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_1__.BreakoutSVG.generateAnimatedSVG(store);
        store.config.svgCallback(svg);
        store.config.gameOverCallback();
        return;
    }
    placeBall(store);
    placePaddle(store);
    store.targetBrick = pickRandomTarget(store);
    store.bouncesSinceTargetSet = 0;
    const MAX_FRAMES = 3000;
    while (store.grid.some((col) => col.some((c) => c.commitsCount > 0)) && store.frameCount < MAX_FRAMES) {
        updateGame(store);
        if (store.frameCount % 200 === 0) {
            const rem = store.grid.reduce((sum, col) => sum + col.filter((c) => c.commitsCount > 0).length, 0);
        }
    }
    const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_1__.BreakoutSVG.generateAnimatedSVG(store);
    store.config.svgCallback(svg);
    if (store.config.gameStatsCallback) {
        store.config.gameStatsCallback({
            totalScore: countBrokenBricks(store),
            steps: store.frameCount,
            ghostsEaten: 0
        });
    }
    store.config.gameOverCallback();
});
const stopGame = (_store) => { };
/* ────────────────── Per-frame update ────────────────── */
const updateGame = (store) => {
    var _a, _b;
    store.frameCount++;
    const { ball, paddle, grid } = store;
    // ── Sub-step movement ─────────────────────────────────────────────────
    // Split each frame into small steps so the ball never travels more than
    // BALL_RADIUS in a single step, preventing tunnelling through bricks.
    const speed = Math.hypot(ball.dx, ball.dy);
    const subSteps = Math.ceil(speed / _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS);
    const dt = 1 / subSteps;
    for (let s = 0; s < subSteps; s++) {
        ball.x += ball.dx * dt;
        ball.y += ball.dy * dt;
        // ── Wall collisions ────────────────────────────────────────────────
        if (ball.x - _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS <= 0) {
            ball.x = _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS;
            ball.dx = Math.abs(ball.dx);
        }
        if (ball.x + _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH) {
            ball.x = _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS;
            ball.dx = -Math.abs(ball.dx);
        }
        if (ball.y - _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS <= 0) {
            ball.y = _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS;
            ball.dy = Math.abs(ball.dy);
        }
        // ── Paddle collision ───────────────────────────────────────────────
        const paddleLeft = paddle.x;
        const paddleRight = paddle.x + _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH;
        if (ball.dy > 0 &&
            ball.y + _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS >= _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_Y &&
            ball.y - _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS < _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_Y + 0.5 &&
            ball.x >= paddleLeft - _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS &&
            ball.x <= paddleRight + _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS) {
            ball.y = _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_Y - _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS;
            // Angle-based bounce: hit position on paddle maps linearly to angle.
            // Centre → straight up (0°). Far edges → ±MAX_BOUNCE_ANGLE from vertical.
            const paddleCenter = paddleLeft + _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH / 2;
            const hitOffset = Math.max(-1, Math.min(1, (ball.x - paddleCenter) / (_constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH / 2)));
            const speed = Math.hypot(ball.dx, ball.dy);
            const rad = hitOffset * _constants__WEBPACK_IMPORTED_MODULE_2__.MAX_BOUNCE_ANGLE * (Math.PI / 180);
            ball.dx = speed * Math.sin(rad);
            ball.dy = -speed * Math.cos(rad); // always upward
            // Count paddle bounces without hitting the current target.
            // After 5 misses, give up and pick a new random target.
            store.bouncesSinceTargetSet++;
            if (store.bouncesSinceTargetSet >= 5) {
                store.targetBrick = pickRandomTarget(store);
                store.bouncesSinceTargetSet = 0;
            }
        }
        // Safety: ball fell past the paddle
        if (ball.y > _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_Y + 1) {
            ball.x = _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH / 2;
            ball.y = _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_Y - 1.5;
            ball.dy = -Math.abs(ball.dy);
        }
        // ── Brick collision (circle-vs-AABB, edge-precise) ────────────────
        const colMin = Math.max(0, Math.floor(ball.x - _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS));
        const colMax = Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - 1, Math.floor(ball.x + _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS));
        const rowMin = Math.max(0, Math.floor(ball.y - _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS));
        const rowMax = Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT - 1, Math.floor(ball.y + _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS));
        let flipDx = false;
        let flipDy = false;
        const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
        for (let cx = colMin; cx <= colMax; cx++) {
            for (let cy = rowMin; cy <= rowMax; cy++) {
                if (grid[cx][cy].commitsCount === 0)
                    continue;
                // Nearest point on the visible brick face (gap excluded)
                const nearX = Math.max(cx, Math.min(cx + CELL_RATIO, ball.x));
                const nearY = Math.max(cy, Math.min(cy + CELL_RATIO, ball.y));
                const distSq = Math.pow((ball.x - nearX), 2) + Math.pow((ball.y - nearY), 2);
                if (distSq >= _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS * _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS)
                    continue; // no overlap
                // ── Reduce brick level by one hit ──────────────────────────
                const oldLevel = grid[cx][cy].level;
                const newLevel = decrementLevel(oldLevel);
                grid[cx][cy].level = newLevel;
                if (newLevel === 'NONE') {
                    grid[cx][cy].commitsCount = 0;
                    grid[cx][cy].color = theme.intensityColors[0];
                    // If this was the current target, pick a new one immediately
                    if (((_a = store.targetBrick) === null || _a === void 0 ? void 0 : _a.cx) === cx && ((_b = store.targetBrick) === null || _b === void 0 ? void 0 : _b.cy) === cy) {
                        store.targetBrick = pickRandomTarget(store);
                        store.bouncesSinceTargetSet = 0;
                    }
                }
                else {
                    const levelIndex = LEVEL_ORDER.indexOf(newLevel);
                    grid[cx][cy].color = theme.intensityColors[levelIndex];
                }
                // Record color-change event keyed to the upcoming gameHistory index
                store.brickEvents.push({ frameIndex: store.gameHistory.length, x: cx, y: cy, color: grid[cx][cy].color });
                // Push ball out of brick and determine bounce axis
                const penX = _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS - Math.abs(ball.x - nearX);
                const penY = _constants__WEBPACK_IMPORTED_MODULE_2__.BALL_RADIUS - Math.abs(ball.y - nearY);
                if (penX <= penY) {
                    ball.x += ball.dx < 0 ? penX : -penX;
                    flipDx = true;
                }
                else {
                    ball.y += ball.dy < 0 ? penY : -penY;
                    flipDy = true;
                }
                store.framesSinceLastBrickHit = 0;
                store.config.pointsIncreasedCallback(countBrokenBricks(store));
            }
        }
        if (flipDx)
            ball.dx = -ball.dx;
        if (flipDy)
            ball.dy = -ball.dy;
    }
    // ── Paddle AI — position to aim at the current target brick ──────────
    if (ball.dy > 0 && store.targetBrick) {
        const target = store.targetBrick;
        // Predict where the ball will cross the paddle level (accounting for wall bounces)
        const timeToLand = (_constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_Y - ball.y) / ball.dy;
        let predictedX = ball.x + ball.dx * timeToLand;
        // Fold wall reflections
        predictedX = Math.abs(((predictedX % (2 * _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH)) + 2 * _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH) % (2 * _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH));
        if (predictedX > _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH)
            predictedX = 2 * _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - predictedX;
        // Required angle to reach target from predicted landing x
        const tx = target.cx + 0.5;
        const ty = target.cy + 0.5;
        const vertDist = _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_Y - ty; // positive: target is above paddle
        const horizDist = tx - predictedX;
        const targetAngleDeg = Math.atan2(horizDist, Math.max(vertDist, 0.5)) * (180 / Math.PI);
        const clampedAngle = Math.max(-_constants__WEBPACK_IMPORTED_MODULE_2__.MAX_BOUNCE_ANGLE, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.MAX_BOUNCE_ANGLE, targetAngleDeg));
        // Hit offset that would produce this angle
        const desiredHitOffset = clampedAngle / _constants__WEBPACK_IMPORTED_MODULE_2__.MAX_BOUNCE_ANGLE; // [-1, 1]
        // Paddle must be positioned so ball lands at the right spot
        const desiredPaddleCenter = predictedX - desiredHitOffset * (_constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH / 2);
        const desiredPaddleX = Math.max(0, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH, desiredPaddleCenter - _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH / 2));
        // Move paddle toward the desired position
        if (paddle.x < desiredPaddleX - _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_SPEED) {
            paddle.x += _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_SPEED;
        }
        else if (paddle.x > desiredPaddleX + _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_SPEED) {
            paddle.x -= _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_SPEED;
        }
        else {
            paddle.x = desiredPaddleX;
        }
    }
    else if (ball.dy > 0) {
        // No target: just track the ball so it doesn't miss
        const paddleCenter = paddle.x + _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH / 2;
        if (paddleCenter < ball.x - 0.5)
            paddle.x = Math.min(paddle.x + _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_SPEED, _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_WIDTH);
        else if (paddleCenter > ball.x + 0.5)
            paddle.x = Math.max(paddle.x - _constants__WEBPACK_IMPORTED_MODULE_2__.PADDLE_SPEED, 0);
    }
    // ── Snapshot ───────────────────────────────────────────────────────────
    pushSnapshot(store);
};
/* ────────────────── Helpers ────────────────── */
const pushSnapshot = (store) => {
    // Only ball + paddle — brick changes are tracked separately in brickEvents
    store.gameHistory.push({
        ball: Object.assign({}, store.ball),
        paddle: Object.assign({}, store.paddle)
    });
};
const countBrokenBricks = (store) => {
    let broken = 0;
    store.grid.forEach((col) => col.forEach((cell) => {
        if (cell.commitsCount === 0)
            broken++;
    }));
    return broken;
};
/** Pick a random live brick as the AI's next target. */
const pickRandomTarget = (store) => {
    var _a, _b;
    const live = [];
    for (let cx = 0; cx < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH; cx++) {
        for (let cy = 0; cy < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT; cy++) {
            if (((_b = (_a = store.grid[cx]) === null || _a === void 0 ? void 0 : _a[cy]) === null || _b === void 0 ? void 0 : _b.commitsCount) > 0)
                live.push({ cx, cy });
        }
    }
    if (live.length === 0)
        return null;
    return live[Math.floor(Math.random() * live.length)];
};
const BreakoutGame = {
    startGame,
    stopGame
};


/***/ }),

/***/ "./src/breakout/core/store.ts":
/*!************************************!*\
  !*** ./src/breakout/core/store.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BreakoutStore: () => (/* binding */ BreakoutStore)
/* harmony export */ });
const BreakoutStore = {
    frameCount: 0,
    contributions: [],
    ball: { x: 0, y: 0, dx: 0, dy: 0 },
    paddle: { x: 0, width: 7 },
    grid: [],
    monthLabels: [],
    framesSinceLastBrickHit: 0,
    targetBrick: null,
    bouncesSinceTargetSet: 0,
    gameHistory: [],
    initialColors: [],
    brickEvents: [],
    config: undefined
};


/***/ }),

/***/ "./src/breakout/index.ts":
/*!*******************************!*\
  !*** ./src/breakout/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BreakoutRenderer: () => (/* binding */ BreakoutRenderer)
/* harmony export */ });
/* harmony import */ var _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/providers/providers */ "./src/shared/providers/providers.ts");
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/game */ "./src/breakout/core/game.ts");
/* harmony import */ var _core_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/store */ "./src/breakout/core/store.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class BreakoutRenderer {
    constructor(conf) {
        this.conf = Object.assign({}, conf);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultConfig = {
                platform: 'github',
                username: '',
                svgCallback: (_) => { },
                gameOverCallback: () => { },
                gameTheme: 'github',
                pointsIncreasedCallback: (_) => { },
                githubSettings: { accessToken: '' }
            };
            this.store = JSON.parse(JSON.stringify(_core_store__WEBPACK_IMPORTED_MODULE_3__.BreakoutStore));
            this.store.config = Object.assign(Object.assign({}, defaultConfig), this.conf);
            switch (this.store.config.platform) {
                case 'gitlab':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGitlabContributions(this.store);
                    break;
                case 'github':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGithubContributions(this.store);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${this.store.config.platform}`);
            }
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildGrid(this.store);
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildMonthLabels(this.store);
            yield _core_game__WEBPACK_IMPORTED_MODULE_2__.BreakoutGame.startGame(this.store);
            return this.store;
        });
    }
    stop() {
        _core_game__WEBPACK_IMPORTED_MODULE_2__.BreakoutGame.stopGame(this.store);
    }
}


/***/ }),

/***/ "./src/breakout/renderers/svg.ts":
/*!***************************************!*\
  !*** ./src/breakout/renderers/svg.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BreakoutSVG: () => (/* binding */ BreakoutSVG)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/constants */ "./src/breakout/core/constants.ts");


const SVG_PRECISION = 4;
/** Convert a grid-unit x coordinate to SVG pixels */
const toSvgX = (gx) => gx * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE);
/** Convert a grid-unit y coordinate to SVG pixels (offset by month-label area) */
const toSvgY = (gy) => gy * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + 15;
const generateAnimatedSVG = (store) => {
    const svgWidth = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE);
    // Extra height: 15px month labels + grid + 40px paddle area
    const paddleAreaHeight = 40;
    const svgHeight = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + 15 + paddleAreaHeight;
    const totalDurationMs = (store.gameHistory.length * _core_constants__WEBPACK_IMPORTED_MODULE_1__.DELTA_TIME) / 2;
    const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<desc>Generated with breakout-contribution-graph on ${new Date()}</desc>`;
    svg += `<metadata>
		<info>
			<frames>${store.gameHistory.length}</frames>
			<frameRate>${1000 / _core_constants__WEBPACK_IMPORTED_MODULE_1__.DELTA_TIME}</frameRate>
			<durationMs>${totalDurationMs}</durationMs>
			<generatedOn>${new Date().toISOString()}</generatedOn>
		</info>
	</metadata>`;
    svg += `<rect width="100%" height="100%" fill="${theme.gridBackground}"/>`;
    // ── Month labels ─────────────────────────────────────────────────────
    let lastMonth = '';
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        if (store.monthLabels[x] !== lastMonth) {
            const xPos = x * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2;
            svg += `<text x="${xPos}" y="10" text-anchor="middle" font-size="10" fill="${theme.textColor}">${store.monthLabels[x]}</text>`;
            lastMonth = store.monthLabels[x];
        }
    }
    // ── Grid cells (bricks) ───────────────────────────────────────────────
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT; y++) {
            const cellX = toSvgX(x);
            const cellY = toSvgY(y);
            const colorAnim = getCellAnimationData(store, x, y);
            svg += `<rect id="c-${x}-${y}" x="${cellX}" y="${cellY}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE}" rx="3" fill="${theme.intensityColors[0]}">
				<animate attributeName="fill" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
					values="${colorAnim.values}" keyTimes="${colorAnim.keyTimes}"/>
			</rect>`;
        }
    }
    // ── Ball ──────────────────────────────────────────────────────────────
    const ballR = Math.round(_core_constants__WEBPACK_IMPORTED_MODULE_1__.BALL_RADIUS * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE));
    const ballPosAnim = buildChangingValuesAnimation(store, getBallPositions(store));
    // cx/cy are 0 so animateTransform translate values are absolute SVG coords
    svg += `<circle id="ball" cx="0" cy="0" r="${ballR}" fill="${theme.wallColor}" stroke="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BALL_SHADOW_COLOR}" stroke-width="1">
		<animateTransform attributeName="transform" type="translate"
			calcMode="linear"
			dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${ballPosAnim.keyTimes}"
			values="${ballPosAnim.values}"/>
	</circle>`;
    // ── Paddle ────────────────────────────────────────────────────────────
    const paddleSvgY = toSvgY(_core_constants__WEBPACK_IMPORTED_MODULE_1__.PADDLE_Y);
    const paddleW = Math.round(_core_constants__WEBPACK_IMPORTED_MODULE_1__.PADDLE_WIDTH * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE);
    const paddleH = Math.round(_core_constants__WEBPACK_IMPORTED_MODULE_1__.PADDLE_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE));
    const paddlePosAnim = buildChangingValuesAnimation(store, getPaddlePositions(store));
    // x=0 so animateTransform translate values drive the horizontal position
    svg += `<rect id="paddle" x="0" y="${paddleSvgY}" width="${paddleW}" height="${paddleH}" rx="3" fill="${theme.wallColor}">
		<animateTransform attributeName="transform" type="translate"
			calcMode="linear"
			dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${paddlePosAnim.keyTimes}"
			values="${paddlePosAnim.values}"/>
	</rect>`;
    svg += '</svg>';
    return svg;
};
/* ────────────────── Animation helpers ────────────────── */
/**
 * Build cell color animation data directly from brickEvents.
 * Much cheaper than per-frame grid snapshots: only records actual changes.
 */
const getCellAnimationData = (store, x, y) => {
    var _a, _b;
    const totalFrames = store.gameHistory.length;
    const initialColor = (_b = (_a = store.initialColors[x]) === null || _a === void 0 ? void 0 : _a[y]) !== null && _b !== void 0 ? _b : '#ebedf0';
    const events = store.brickEvents.filter((e) => e.x === x && e.y === y);
    if (events.length === 0) {
        return { keyTimes: '0;1', values: `${initialColor};${initialColor}` };
    }
    const kTimes = [0];
    const kValues = [initialColor];
    for (const ev of events) {
        const t = Number((ev.frameIndex / Math.max(totalFrames - 1, 1)).toFixed(SVG_PRECISION));
        // Avoid duplicate keyTimes (two events in the same frame)
        if (t !== kTimes[kTimes.length - 1]) {
            kTimes.push(t);
            kValues.push(ev.color);
        }
        else {
            kValues[kValues.length - 1] = ev.color; // overwrite same-frame event
        }
    }
    if (kTimes[kTimes.length - 1] !== 1) {
        kTimes.push(1);
        kValues.push(kValues[kValues.length - 1]);
    }
    return { keyTimes: kTimes.join(';'), values: kValues.join(';') };
};
const getBallPositions = (store) => store.gameHistory.map((frame) => {
    const svgX = toSvgX(frame.ball.x);
    const svgY = toSvgY(frame.ball.y);
    return `${svgX},${svgY}`;
});
const getPaddlePositions = (store) => store.gameHistory.map((frame) => `${toSvgX(frame.paddle.x)},0`);
/**
 * Compresses an array of per-frame values into a compact SVG animation
 * (keyTimes + values), skipping redundant frames.
 */
const buildChangingValuesAnimation = (store, values) => {
    var _a, _b, _c, _d;
    const totalFrames = store.gameHistory.length;
    if (totalFrames === 0) {
        const v = (_a = values[0]) !== null && _a !== void 0 ? _a : '0,0';
        return { keyTimes: '0;1', values: `${v};${v}` };
    }
    const keyTimes = [];
    const keyValues = [];
    let lastValue = null;
    let lastIndex = null;
    values.forEach((curr, idx) => {
        if (curr !== lastValue) {
            if (lastValue !== null && lastIndex !== null && idx - 1 !== lastIndex) {
                keyTimes.push(Number(((idx - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION)));
                keyValues.push(lastValue);
            }
            keyTimes.push(Number((idx / (totalFrames - 1)).toFixed(SVG_PRECISION)));
            keyValues.push(curr);
            lastValue = curr;
            lastIndex = idx;
        }
    });
    if (keyTimes.length === 0 || keyTimes[keyTimes.length - 1] !== 1) {
        if (keyTimes.length === 0) {
            keyTimes.push(0, 1);
            keyValues.push((_b = values[0]) !== null && _b !== void 0 ? _b : '0,0', (_c = values[values.length - 1]) !== null && _c !== void 0 ? _c : '0,0');
        }
        else {
            keyTimes.push(1);
            keyValues.push((_d = lastValue !== null && lastValue !== void 0 ? lastValue : values[values.length - 1]) !== null && _d !== void 0 ? _d : '0,0');
        }
    }
    return { keyTimes: keyTimes.join(';'), values: keyValues.join(';') };
};
const BreakoutSVG = { generateAnimatedSVG };


/***/ }),

/***/ "./src/galaga/core/constants.ts":
/*!**************************************!*\
  !*** ./src/galaga/core/constants.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BULLET_IMAGE_DATA: () => (/* binding */ BULLET_IMAGE_DATA),
/* harmony export */   BULLET_SPEED: () => (/* binding */ BULLET_SPEED),
/* harmony export */   BULLET_SPRITE_HEIGHT_GU: () => (/* binding */ BULLET_SPRITE_HEIGHT_GU),
/* harmony export */   CELL_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE),
/* harmony export */   DELTA_TIME: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME),
/* harmony export */   EXPLOSION_FRAMES: () => (/* binding */ EXPLOSION_FRAMES),
/* harmony export */   FIRE_RATE: () => (/* binding */ FIRE_RATE),
/* harmony export */   FRAMES_PER_TARGET_MAX: () => (/* binding */ FRAMES_PER_TARGET_MAX),
/* harmony export */   FRAMES_PER_TARGET_MIN: () => (/* binding */ FRAMES_PER_TARGET_MIN),
/* harmony export */   GAME_THEMES: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAME_THEMES),
/* harmony export */   GAP_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE),
/* harmony export */   GRID_HEIGHT: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT),
/* harmony export */   GRID_WIDTH: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH),
/* harmony export */   MAX_BULLETS: () => (/* binding */ MAX_BULLETS),
/* harmony export */   SHIP_HALF_WIDTH: () => (/* binding */ SHIP_HALF_WIDTH),
/* harmony export */   SHIP_IMAGE_DATA: () => (/* binding */ SHIP_IMAGE_DATA),
/* harmony export */   SHIP_SPEED: () => (/* binding */ SHIP_SPEED),
/* harmony export */   SHIP_Y: () => (/* binding */ SHIP_Y)
/* harmony export */ });
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/constants */ "./src/shared/constants.ts");
/* ─── Re-export shared constants so galaga code has one import location ─── */

/* ───────────── Ship ───────────── */
/** Ship center Y in grid units (just below the 7-row grid) */
const SHIP_Y = 10.5;
/** Ship horizontal speed in grid units per frame */
const SHIP_SPEED = 0.4;
/** Ship half-width in grid units (used for clamping) */
const SHIP_HALF_WIDTH = 0.8;
/* ───────────── Bullets ───────────── */
/** Upward speed of a bullet in grid units per frame */
const BULLET_SPEED = 0.6;
/** Maximum simultaneous active bullets */
const MAX_BULLETS = 10;
/** Fire a new bullet every this many frames when aligned with a target */
const FIRE_RATE = 2;
/** Minimum frames the ship shoots at one target before moving to the next */
const FRAMES_PER_TARGET_MIN = 4;
/** Maximum frames the ship shoots at one target before moving to the next */
const FRAMES_PER_TARGET_MAX = 8;
/** Number of frames an explosion animation lasts */
const EXPLOSION_FRAMES = 7;
/* ─────────────── Bullet image ─────────────── */
/** Bullet sprite height in grid units (sprite is 20px, slot is 22px) — used for leading-edge collision */
const BULLET_SPRITE_HEIGHT_GU = 20 / 22;
const BULLET_IMAGE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAByUExURQAAAP////7+/gBE/wBE/wBE/wBE/wBE/wBE/gBE/gBE/wBE/wBE/gBE/wBE/wBE/gBE/gBE/+cgMfUeJf8AAP8AAP4AAP4AAABE/wBE/hhW/y9m/y9n/yNd/4Sl/73O/7zO//8cHP4cHP8AAP4AAP///6QdcYAAAAAYdFJOUwAAAGbHk4W9hb1genq/3RYcHJPFhb2FvbKPFBsAAAABYktHRAH/Ai3eAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH6gUIFjcZmpji7QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wNS0wOFQyMjo1NToyNSswMDowMDWlEL0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDUtMDhUMjI6NTU6MjUrMDA6MDBE+KgBAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA1LTA4VDIyOjU1OjI1KzAwOjAwE+2J3gAAAk5JREFUaN7tVotWwyAMnahzvp2PSXxMZ/P/3+ggECija1N2ZDvuWmm17W1y82IyyeH0LIPzyXBMdQYXR4IjwZFATDAD0NoeYE/mT30pITBfNK/ZNx2TyAX3acvjL4QE2r/HFxIXptGHmUEkIkkXx0CmwczIl6KD4OqaccPnWx8BXtc/d9GDN/Twepmc6S5A7x1z3iCgDKJfoFxI7kEI7nrdYkGfWXQZE3DW5e2HrGM5C0Anj3aoATmCyH8XAr5B/05oxRpsYGcEvQ5vJwiFxzUAkDAlBUrpndWAshg09NsCO9TgPxEIamE8wZ5rMIzg7b2FD7t+CgiWJxl8lRJ8DyFwJbdUJ0rFLysm6AsjFFowVgMYQlBswX4TtLcSYAiUD59qhzEJGGwSmF5r80CFFAgW+JZND3ZO5zINYDgBbBFRjbdAV63GLQSqjwAghJMJXB4os7bL2e9C9iWVewlUN8H9g8OcYC8fVxY/qxhPc3rOH4T8Bvq5CUC/vgh26zEBYxQBugOrWVCNYOEVwKAE1nAB2YYxBBh/HQ8uCvUJFi7+VARIVwfmAqcBhmQWWoB1XdhFGNGFcb0cZBjjrszRLLWgkgbovJB2JJfKXIljUjlSEev0RJuArIF0vC84/AYNLX/sQtRIxoRxj4qpXkfiaeIm/J+HcbEDDSiRMRoQNV3AA8yDcgJM/G+EPdE3VUpFd5INV9+JXFMykLmAfjIjmyK0wLUj5NYkJKBx0sKrWIMEchGxsgVNsQVNCYEfLGEySrd5xSK6LArjdUwtDIrCL/JGvSI+ReIgAAAAAElFTkSuQmCC';
/* ───────────── Ship image ───────────── */
const SHIP_IMAGE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABGCAYAAAB8MJLDAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQfqBQgWJQn/24JaAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTA1LTA4VDIyOjM1OjQ2KzAwOjAwKpfJ5AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0wNS0wOFQyMjozNTo0NiswMDowMFvKcVgAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjYtMDUtMDhUMjI6Mzc6MDkrMDA6MDB6KP6pAAANdklEQVR42u2cW6wdVRnH/2vNfc++HYFKe7S0FQEDaEKjlEhaHyRi0xJJrCKpDyZo0EQu8kBTSwhJjSca0fhQNVFiYiMJiQqxtEAoD4fQRHIk1YJFsWAqtJyc0rP3zJ7Zc1uzfNhnrTN7z+zL2WdTovglO/md6VzWrPn+6/vWreCcw/d9nD9/HoIXFxdz7HkeGo1GjlutVhc3m80cu64Lx3Fy7DhOF7uum+Nms4lWq5XjRqPRxZ7n5XhxcRG+7+f4/Pnzkonv+yCEAEDnwPuMaRAEAADDMDCICSHQdT3HlFJomjaQFUWBqqo5VlW1ixVFybGmaaCUDmRd10EIybFhGAAwkAnnHO12G0EQYGpqCu12G2EYol6vd7Hv+4jjGLVarYs9z0OSJJIZY6hWq10sXLVSqUg2dR1xFAEAVF1HGEUghKBcLsN1XcmO40BRFNi23cXNZhOqqkrWNA2lUqmLG40GDMOAZVldvLi4CNM0YVnWhZXAfffdxw8dOgQA2LtnD766ezcBgN8//jj/7r59AIDbbrsNDz30ELlgEgjDULp6Eeu6jjAMpdv3snD1QSzcfn5+HqdPn8bp06fhOA6Eea2WPL6wsCAlEIahdPVBLNy+iAEgDEPp9r1M6/W6bD0FN5tNyY7joF6vgzEG13VzHMcxWq2WZM/zchyGIdrttizQINN1vUt6nuchjuMct1otya7rgjGWYxFh6vW6jEj1el1GrXq9DrXdboMQAsuyINg0zRxTSmEYRo4VRYGiKANZVVUAAGNsaAUwxqBpGgB0VVovi684iE3TLGTLsiSPLQHh3lnulYCqql0SGLUCshJQVbWvBISrZ/mCSUC4fZIkfSXg+/6qJSAiTpEEkiSR/D8jgSRJ3nsJCFeflAQEj1IBaZp2uf2kJNBPDoUSEG4/KQlEUbRiCURRNFEJZLlLAr7vg1KKUqkEwZZlSTZNU7JhGDkWrt6PH374YX7ixAkAwIsvvji0AmZnZ3HXXXdxANi8eTPuuOMOAgC+78sK9H1ffsVBLNze931YliU7eKVSSbIaRRFM04SmaVIrWdZ1HY7jwLIsqKoK13X7cqlUAqUUrVZL8uHDh3H06NGhLy7s5MmTOHnyJADg3LlzuPPOO5GmKYIgQLlcllypVJAkCaIo6svVahVRFA1kVeT8zWZT9gWE22fZ930EQZBjz/O62PM8hGHI5+fnwRgD51y+3Lp162AtfZVarSaPVyoVbNy0CQAQRRHeevNNAICmadKbhBsLFn0BwZqm5Vjk/70s+gL1eh3E8zxQSkEIAWNs1fzGG2/w/fv3w/d9pGmKZ599Fr7vAwAOHzqEbVu3kt6vzjgQLVXUKy+/zLfd+GkAwM6dO/HYY48R0ThSSmVDqSgKOOerZjWOYxiGIbuu/dg0Tdl17ceWZUHXdTz33HN4++23R3b7fsY5h6qqSNMUYRjCtm3JhmEgSRKI8hexaZqIomgg01qtJpMfwY7j5Fi0/L0sokCtVpP9AtHbWq0JCRR1w0UUEMwYy7Fo+XtZJEW1Wm14FOgXEQSLNFfw+vXrSbVa5WfPns29UMQ5gpTnjvM+FZAkCQzDkC12lk3THMrZlr9fFKBxHMvaLmJVVRHHMQghfVlRlI47UYpKpYLZ2VmysLBA3nnnHbJt27bcy/b+BklAURRQShHHcY4JIYjjGKqq9mUAiONYZpe9PFQCrusOlYDneVICvu9jzZo1MjyKWDxpCWRHovpJQAysTkwCqqri0Ucf5WmaAgAopSjiLVu2YHp6moya/vazrAReeeUVfvz48YHPpZTi1ltvlYnTKBIojAKiVc+yaDlvv/32oQV/8MEHsXfvXlBKu/KAlZqQQJqmmJmZwcGDB4deIzpx4r3iOM7x0Cgg3L5XAq7rjvQ2pmlKOQgdjmNZCQjdDrN+EshylwQ8z5MjrYItyyrkUqlEsNRu3QQTN6PTrfTB8T00ESw1aaKRmqQEkiSRx0sg2IMabHTC7SxCPIFOsmVZFiil8DxPun0vi3zC8zyoSZLk+vH9xvAVRZGF2AID30FV/v0zuDiDzstmM8TVSkDIqCulhoIHsJxKK3BkBYjokCSJ9MQiTtMUSZIsS6Co5V+tBLKDIeOY6JRNWgLZiEA9zwMhREqAEIJSqZTjpUgxUooXRREURYFhGBORgKIoXRIYZFkJlEolEEJybNu2ZCoKqCgKRuFRTLjuJKLASu8jysgYG4lptVqVEhDsum6O0zQdWQIi5LxXEkjTFNVqVbp9LwsJVKvV5Sig6zrOnj0ra7yIs27IP1BHetEGAABhKfCvM0Da8RQhgXcrCnBKwTesB1c63WPeeAtYWBTP5owxIsYLwjBEo9Ho4lqtJiWgCpc4cuQI37Vr1+iFu+PLCPbtk20Cv/JKjqUOkJh/m5QE0jTtug/f8CG0jz8pnx0fOMCxZw8AYHp6GhjcxcDTTz+NrVu3ki4JtNvtsQvaa6JPPikJZIfKJ2FicUSXBMRg4iQsiiI59z8JCQielJmmmZeAGG6qgGAeH5Yn/xMJPo4zK3rA/v37MTMzw0VljGuHDx/G1NTU2Pd5DdOYxnLkuhxv4QyYfFfGGNRqtYp2u52RAIGF5XBvYuWjO6LTsVpjjK1KmlbPuwjKSoCKIazV9Nv/20xIoNVqQRV96UmN433w0ktx6MgREEJz//bhtZcSg+afwzhHstRuf/SKK8jc8b/kWnGepvjyri/i9VOnVl3G7OhygQRWZ4auY+PGTYW1aRACWnCcQ3Yyoes6NmzYUHi9ZVnjx9SMve8lYFnWsgREgiElYOiIHrpfnhyTBLj/rrEfpmWklVWZ8sejXHlhDgCQbL4W/IvbC796vIpEKvrJA4iCTBj+/l6g2ehaJKVWKpUuCXBNRfKt3bIw7NQpjvtX9uCsqX2aFuWFOagHloa4dn8B6a7thefFq3B6dvM2JOvWLWerP93P0WxICVQqlf9LIC+BMez1xYinN+9FNQhQvqjS9zzl6AuczJ/rPO/V1+Vx+vppqL99ggMAr9fAtn+msDD2zfeieu15BHYJr54L+VUXG2MVeqAExrFT50OwDZ+CDkCr9s/Z1R8/AmU2v0aAHnsJ+rGXAADpNVeAbf9M4fXaxs3QKyEiAH9bCHDVxeOl7/+XQJEEVmrnfIaTCyEHgEaQ4mOXdL7GGnu0Xhtfuwb8oikAAFlsgrw1fDZ505QOkUd5USqfP++N11HqkoBYHT6q/fbEIh4/2NHxTR+p4KndneSHA4UToL0W3/01GW3Ug49z/VsPDL3mwI4Pyfzy3qfO8H3PdSqtPffOisrebreXJSBWZr8fJeC6LlY0WnHtNddg544dAIDj2lX485I/0lHbYoUC6lL3NHsRIcvHRxx4pQRQlu5x/Sc/iS2f6IwIHXrySfx1aVHWKLYiCXx3717s3LGjs2SFAywVIXS0h4W/+zkBT3MvmnxlJ0m+JBKh0W72g5vWkpnPru1UBr0SCul8mBtvvJFvX/pI/SwrAdV1XWiaNpIEsrkCJQBVVhiGVQVAwRemtPNbgSmUYDRfyVuXBIYlQNVaDd/4+tcBABsuu2zMR144m163TpbXtu2B5xJCoJbL5YESuOTii8mPf/SjkQtA317gtdvvln9Hh35FULLGe5uEofb5r3GwTpiLfzkDvmn9wC92+eWXDy2vkEC5XF6WgFhAvGqLIqhzy41QnDCM3Z/hHOpLJ4C4UwGJH4x/r4yJaTLXdUGzefH7xbL9n5wEwjDE3ffcs6La+Dh0fBNLnaCW964VXPvhL8Cn6hwAfo0W/oRwRdc3Gw0AQyQQxzF++cgjK7rxLSjh27jkXXtxYcofnpE8i3P4Dcar7KwEZBSo1+u44YYbkKapXLMvpqTEOp0sp2mKubm591w6qqriuuuuk1NxjLFCTpJEznVWKh1v7ZLA5s2bybFjx0beOBkEAdauXcuHTVg8ffBR/m8zH7G3XH89rr76agIA/3jtNf7888/nztmYUuxYGrXuZ9VqFc888wxZ6cZJIQE0m005BT0qB0EgtqlyAPwWlDjHZYW/z8EqWhvJfzAzwz3Hgec4+PmBA4Xn3Drgvl+FzQHwqakpHkURgiBAs9mU0/KjsirGyMVMLJBfmd3LvWt2BtlqBDLqtaI8g9YPZlmUnVK6LIFWqyX3C4itLln2fR9hGHZJQFgDKV7s0yL/HeNPkc0h7Hvfc1ie0Gm329A0DeVyWUqgXC5Lt+9lsV+gXC5DdRwHuq7LlRO6rstNy70sNjAbhtGVZs4iwPVY/fL4XnsTbOh9OeewbRuMMTiOA9u2kSQJHMdBuVwu5Gq1ijiO4TgO1KK1M2JTQT8WLlcul8ee/dUyG6hUVe00SGOY2EaTjVAABnJ2zdN7tn3e0HUkYvu8piFcWnl+wbfPN5tN6LoOTdPgeV6OxV6ALIula0VMKZUbGAWL2dgiBiB3m3DOC1nsEslyqVQCY6yQxaapLNu2jTiOc6wOW0rWTwJZFucP2p8jXLSXh7lrv2RMbMgqOmeY22eZ2rbdtYZWLCPv5TRN0W63c8wYQxAEksXeniwX1bxt23LrmuA4jnMchiEYYzkOgkByu91GmqY5FuP/vSz+kxXbtvEfwITwAX3FN6kAAAAASUVORK5CYII=';


/***/ }),

/***/ "./src/galaga/core/game.ts":
/*!*********************************!*\
  !*** ./src/galaga/core/game.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GalagaGame: () => (/* binding */ GalagaGame)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _renderers_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../renderers/svg */ "./src/galaga/renderers/svg.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/galaga/core/constants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/* ────────────────── Level helpers ────────────────── */
const LEVEL_ORDER = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
/** Return the level one step below the given level (minimum NONE). */
const decrementLevel = (level) => {
    const idx = LEVEL_ORDER.indexOf(level);
    return LEVEL_ORDER[Math.max(0, idx - 1)];
};
const randomFramesForTarget = () => Math.floor(Math.random() * (_constants__WEBPACK_IMPORTED_MODULE_2__.FRAMES_PER_TARGET_MAX - _constants__WEBPACK_IMPORTED_MODULE_2__.FRAMES_PER_TARGET_MIN + 1)) + _constants__WEBPACK_IMPORTED_MODULE_2__.FRAMES_PER_TARGET_MIN;
const hasRemainingEnemies = (store) => store.grid.some((col) => col.some((cell) => cell.commitsCount > 0));
/**
 * Find the best column to target near the ship's current position.
 * Searches within an expanding radius (starting at 5) around the ship,
 * excluding `excludeCol`. Returns the highest-scoring column found.
 */
const findTargetColumn = (store, excludeCol = -1) => {
    const shipCol = Math.round(store.ship.x - 0.5);
    const scoreCol = (x) => store.grid[x].reduce((sum, cell) => {
        var _a;
        const weights = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
        return sum + ((_a = weights[cell.level]) !== null && _a !== void 0 ? _a : 0);
    }, 0);
    for (let radius = 3; radius <= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH; radius++) {
        let bestCol = -1;
        let bestScore = 0;
        for (let offset = -radius; offset <= radius; offset++) {
            const x = shipCol + offset;
            if (x < 0 || x >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH)
                continue;
            if (x === excludeCol)
                continue;
            const s = scoreCol(x);
            if (s > bestScore) {
                bestScore = s;
                bestCol = x;
            }
        }
        if (bestCol !== -1)
            return bestCol;
    }
    // Absolute fallback: first non-empty column
    for (let x = 0; x < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH; x++) {
        if (x !== excludeCol && store.grid[x].some((cell) => cell.commitsCount > 0))
            return x;
    }
    return Math.floor(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH / 2);
};
const pushSnapshot = (store) => {
    store.gameHistory.push({
        ship: { x: store.ship.x },
        bullets: store.bullets.map((b) => (Object.assign({}, b)))
    });
};
/* ────────────────── Game lifecycle ────────────────── */
const startGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    store.frameCount = 0;
    store.nextBulletId = 0;
    store.gameHistory = [];
    store.cellEvents = [];
    store.explosionEvents = [];
    store.bullets = [];
    store.grid = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.createGridFromData(store);
    store.initialColors = store.grid.map((col) => col.map((cell) => cell.color));
    if (!hasRemainingEnemies(store)) {
        const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_1__.GalagaSVG.generateAnimatedSVG(store);
        store.config.svgCallback(svg);
        store.config.gameOverCallback();
        return;
    }
    store.ship = { x: _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH / 2 };
    store.currentTargetCol = findTargetColumn(store);
    store.framesShootingAtTarget = 0;
    store.framesAllowedForTarget = randomFramesForTarget();
    const MAX_FRAMES = 3000;
    while (hasRemainingEnemies(store) && store.frameCount < MAX_FRAMES) {
        updateGame(store);
    }
    const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_1__.GalagaSVG.generateAnimatedSVG(store);
    store.config.svgCallback(svg);
    if (store.config.gameStatsCallback) {
        store.config.gameStatsCallback({
            totalScore: store.cellEvents.length,
            steps: store.frameCount,
            ghostsEaten: 0
        });
    }
    store.config.gameOverCallback();
});
const stopGame = (_store) => { };
/* ────────────────── Per-frame update ────────────────── */
const updateGame = (store) => {
    var _a;
    store.frameCount++;
    const { grid, ship } = store;
    const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
    // ── Move bullets upward & check collisions ───────────────────────────
    for (const bullet of store.bullets) {
        if (!bullet.active)
            continue;
        bullet.y -= _constants__WEBPACK_IMPORTED_MODULE_2__.BULLET_SPEED;
        // Off the top of the screen — deactivate
        if (bullet.y < -1) {
            bullet.active = false;
            continue;
        }
        // Column index the bullet occupies (bullet.x = col + 0.5)
        const col = Math.round(bullet.x - 0.5);
        // Collision when bullet base (bottom of sprite) enters the cell's y range
        const row = Math.floor(bullet.y);
        if (col >= 0 && col < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH && row >= 0 && row < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT) {
            if (grid[col][row].commitsCount > 0) {
                const prevColor = grid[col][row].color;
                const newLevel = decrementLevel(grid[col][row].level);
                grid[col][row].level = newLevel;
                grid[col][row].color = theme.intensityColors[LEVEL_ORDER.indexOf(newLevel)];
                if (newLevel === 'NONE') {
                    grid[col][row].commitsCount = 0;
                    store.explosionEvents.push({
                        frameIndex: store.gameHistory.length,
                        x: col,
                        y: row,
                        color: prevColor
                    });
                }
                store.cellEvents.push({
                    frameIndex: store.gameHistory.length,
                    x: col,
                    y: row,
                    color: grid[col][row].color
                });
                store.config.pointsIncreasedCallback(store.cellEvents.length);
                bullet.active = false;
            }
        }
    }
    // Remove inactive bullets
    store.bullets = store.bullets.filter((b) => b.active);
    // ── Ship AI: move toward locked-on target column ────────────────────
    // If current target is depleted, pick a fresh one
    if (!((_a = grid[store.currentTargetCol]) === null || _a === void 0 ? void 0 : _a.some((cell) => cell.commitsCount > 0))) {
        store.currentTargetCol = findTargetColumn(store);
        store.framesShootingAtTarget = 0;
    }
    const targetCol = store.currentTargetCol;
    const targetX = targetCol + 0.5;
    const dx = targetX - ship.x;
    if (Math.abs(dx) > _constants__WEBPACK_IMPORTED_MODULE_2__.SHIP_SPEED) {
        ship.x += Math.sign(dx) * _constants__WEBPACK_IMPORTED_MODULE_2__.SHIP_SPEED;
    }
    else {
        ship.x = targetX;
    }
    ship.x = Math.max(_constants__WEBPACK_IMPORTED_MODULE_2__.SHIP_HALF_WIDTH, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - _constants__WEBPACK_IMPORTED_MODULE_2__.SHIP_HALF_WIDTH, ship.x));
    // ── Fire: shoot for FRAMES_PER_TARGET frames then switch target ───────
    const aligned = Math.abs(ship.x - targetX) < 0.5;
    const columnHasEnemies = grid[targetCol].some((cell) => cell.commitsCount > 0);
    if (aligned && columnHasEnemies) {
        if (store.framesShootingAtTarget >= store.framesAllowedForTarget) {
            // Done with this target — pick next column (excluding current)
            store.currentTargetCol = findTargetColumn(store, targetCol);
            store.framesShootingAtTarget = 0;
            store.framesAllowedForTarget = randomFramesForTarget();
        }
        else {
            if (store.frameCount % _constants__WEBPACK_IMPORTED_MODULE_2__.FIRE_RATE === 0 && store.bullets.length < _constants__WEBPACK_IMPORTED_MODULE_2__.MAX_BULLETS) {
                store.bullets.push({
                    id: store.nextBulletId++,
                    x: targetX,
                    y: _constants__WEBPACK_IMPORTED_MODULE_2__.SHIP_Y - 1.0,
                    active: true
                });
            }
            store.framesShootingAtTarget++;
        }
    }
    pushSnapshot(store);
};
const GalagaGame = { startGame, stopGame };


/***/ }),

/***/ "./src/galaga/core/store.ts":
/*!**********************************!*\
  !*** ./src/galaga/core/store.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GalagaStore: () => (/* binding */ GalagaStore)
/* harmony export */ });
const GalagaStore = {
    frameCount: 0,
    nextBulletId: 0,
    contributions: [],
    ship: { x: 0 },
    bullets: [],
    grid: [],
    monthLabels: [],
    gameHistory: [],
    initialColors: [],
    cellEvents: [],
    explosionEvents: [],
    currentTargetCol: -1,
    framesShootingAtTarget: 0,
    framesAllowedForTarget: 4,
    config: undefined
};


/***/ }),

/***/ "./src/galaga/index.ts":
/*!*****************************!*\
  !*** ./src/galaga/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GalagaRenderer: () => (/* binding */ GalagaRenderer)
/* harmony export */ });
/* harmony import */ var _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/providers/providers */ "./src/shared/providers/providers.ts");
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/game */ "./src/galaga/core/game.ts");
/* harmony import */ var _core_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/store */ "./src/galaga/core/store.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class GalagaRenderer {
    constructor(conf) {
        this.conf = Object.assign({}, conf);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultConfig = {
                platform: 'github',
                username: '',
                svgCallback: (_) => { },
                gameOverCallback: () => { },
                gameTheme: 'github',
                pointsIncreasedCallback: (_) => { },
                githubSettings: { accessToken: '' }
            };
            this.store = JSON.parse(JSON.stringify(_core_store__WEBPACK_IMPORTED_MODULE_3__.GalagaStore));
            this.store.config = Object.assign(Object.assign({}, defaultConfig), this.conf);
            switch (this.store.config.platform) {
                case 'gitlab':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGitlabContributions(this.store);
                    break;
                case 'github':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGithubContributions(this.store);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${this.store.config.platform}`);
            }
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildGrid(this.store);
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildMonthLabels(this.store);
            yield _core_game__WEBPACK_IMPORTED_MODULE_2__.GalagaGame.startGame(this.store);
            return this.store;
        });
    }
    stop() {
        _core_game__WEBPACK_IMPORTED_MODULE_2__.GalagaGame.stopGame(this.store);
    }
}


/***/ }),

/***/ "./src/galaga/renderers/svg.ts":
/*!*************************************!*\
  !*** ./src/galaga/renderers/svg.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GalagaSVG: () => (/* binding */ GalagaSVG)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/constants */ "./src/galaga/core/constants.ts");


const SVG_PRECISION = 4;
/** Convert a grid-unit x coordinate to SVG pixels */
const toSvgX = (gx) => gx * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE);
/** Convert a grid-unit y coordinate to SVG pixels (offset by month-label area) */
const toSvgY = (gy) => gy * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + 15;
/**
 * Extract individual bullet trajectories from the game history.
 * Bullets are matched across frames by their unique `id`.
 */
const extractBulletFlights = (store) => {
    const flights = [];
    const active = new Map();
    for (let f = 0; f < store.gameHistory.length; f++) {
        const bullets = store.gameHistory[f].bullets.filter((b) => b.active);
        const currentIds = new Set(bullets.map((b) => b.id));
        // Bullets no longer present → close their flights
        for (const [id, flight] of active) {
            if (!currentIds.has(id)) {
                flights.push({
                    id,
                    x: flight.x,
                    startFrame: flight.startFrame,
                    endFrame: f - 1,
                    yPositions: flight.yPositions
                });
                active.delete(id);
            }
        }
        // New bullets → open flights
        for (const bullet of bullets) {
            if (!active.has(bullet.id)) {
                active.set(bullet.id, { x: bullet.x, startFrame: f, yPositions: [bullet.y] });
            }
            else {
                active.get(bullet.id).yPositions.push(bullet.y);
            }
        }
    }
    // Flush any flights still open at end
    for (const [id, flight] of active) {
        flights.push({
            id,
            x: flight.x,
            startFrame: flight.startFrame,
            endFrame: store.gameHistory.length - 1,
            yPositions: flight.yPositions
        });
    }
    return flights;
};
/* ────────────────── Main SVG generator ────────────────── */
const generateAnimatedSVG = (store) => {
    const svgWidth = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE);
    const shipAreaHeight = 90;
    const svgHeight = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + 15 + shipAreaHeight;
    const totalFrames = store.gameHistory.length;
    const totalDurationMs = Math.max((totalFrames * _core_constants__WEBPACK_IMPORTED_MODULE_1__.DELTA_TIME) / 2, 1000);
    const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
    const shipSvgY = toSvgY(_core_constants__WEBPACK_IMPORTED_MODULE_1__.SHIP_Y);
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<desc>Generated with galaga-contribution-graph on ${new Date()}</desc>`;
    svg += `<rect width="100%" height="100%" fill="#000000"/>`;
    // ── Galaxy starfield ──────────────────────────────────────────────────
    {
        let starSeed = 12345;
        const starRng = () => {
            starSeed = (starSeed * 1664525 + 1013904223) >>> 0;
            return starSeed / 0xffffffff;
        };
        for (let i = 0; i < 120; i++) {
            const scx = (starRng() * svgWidth).toFixed(1);
            const sr = (0.4 + starRng() * 1.6).toFixed(1);
            const sop = (0.3 + starRng() * 0.7).toFixed(2);
            const spd = Math.floor(2500 + starRng() * 5500);
            const sph = Math.floor(starRng() * spd);
            svg += `<circle cx="${scx}" cy="0" r="${sr}" fill="white" opacity="${sop}"><animate attributeName="cy" from="-2" to="${svgHeight + 2}" dur="${spd}ms" begin="-${sph}ms" repeatCount="indefinite"/></circle>`;
        }
    }
    // ── Month labels ─────────────────────────────────────────────────────
    let lastMonth = '';
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        if (store.monthLabels[x] !== lastMonth) {
            const xPos = x * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2;
            svg += `<text x="${xPos}" y="10" text-anchor="middle" font-size="10" fill="#aaaaaa">${store.monthLabels[x]}</text>`;
            lastMonth = store.monthLabels[x];
        }
    }
    // ── Grid cells (enemy formation) ─────────────────────────────────────
    const noneColor = theme.intensityColors[0];
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT; y++) {
            const cellX = toSvgX(x);
            const cellY = toSvgY(y);
            const colorAnim = getCellAnimationData(store, x, y);
            const cellValues = colorAnim.values
                .split(';')
                .map((c) => (c === noneColor ? 'transparent' : c))
                .join(';');
            svg += `<rect x="${cellX}" y="${cellY}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE}" rx="3" fill="transparent">
				<animate attributeName="fill" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
					values="${cellValues}" keyTimes="${colorAnim.keyTimes}"/>
			</rect>`;
        }
    }
    // ── Bullets ───────────────────────────────────────────────────────────
    if (totalFrames >= 2) {
        const flights = extractBulletFlights(store);
        for (const flight of flights) {
            const svgX = toSvgX(flight.x);
            const tStart = Number((flight.startFrame / (totalFrames - 1)).toFixed(SVG_PRECISION));
            const tEndNext = Number((Math.min(flight.endFrame + 1, totalFrames - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION));
            // Build opacity keyTimes/values (discrete: 0 outside flight, 1 inside)
            let opKeyTimes, opValues;
            if (tStart <= 0 && tEndNext >= 1) {
                opKeyTimes = '0;1';
                opValues = '1;1';
            }
            else if (tStart <= 0) {
                opKeyTimes = `0;${tEndNext};${tEndNext};1`;
                opValues = `1;1;0;0`;
            }
            else if (tEndNext >= 1) {
                opKeyTimes = `0;${tStart};${tStart};1`;
                opValues = `0;0;1;1`;
            }
            else {
                opKeyTimes = `0;${tStart};${tStart};${tEndNext};${tEndNext};1`;
                opValues = `0;0;1;1;0;0`;
            }
            // Build position keyTimes/values (compact, only records changes)
            const posKeyTimes = [];
            const posValues = [];
            const firstSvgY = toSvgY(flight.yPositions[0]).toFixed(1);
            const lastSvgY = toSvgY(flight.yPositions[flight.yPositions.length - 1]).toFixed(1);
            if (flight.startFrame > 0) {
                posKeyTimes.push(0);
                posValues.push(`${svgX.toFixed(1)},${firstSvgY}`);
            }
            for (let i = 0; i < flight.yPositions.length; i++) {
                const frameIdx = flight.startFrame + i;
                const t = Number((frameIdx / (totalFrames - 1)).toFixed(SVG_PRECISION));
                const svgY = toSvgY(flight.yPositions[i]).toFixed(1);
                if (posKeyTimes.length === 0 || t !== posKeyTimes[posKeyTimes.length - 1]) {
                    posKeyTimes.push(t);
                    posValues.push(`${svgX.toFixed(1)},${svgY}`);
                }
            }
            if (posKeyTimes[posKeyTimes.length - 1] !== 1) {
                posKeyTimes.push(1);
                posValues.push(`${svgX.toFixed(1)},${lastSvgY}`);
            }
            // Bullet image: 16x20px, centered on bullet x, top at y=0
            svg += `<image x="-5" y="-13" width="10" height="13" href="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BULLET_IMAGE_DATA}" opacity="0" preserveAspectRatio="xMidYMid meet">
				<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
					keyTimes="${opKeyTimes}" values="${opValues}"/>
				<animateTransform attributeName="transform" type="translate" calcMode="linear"
					dur="${totalDurationMs}ms" repeatCount="indefinite"
					keyTimes="${posKeyTimes.join(';')}" values="${posValues.join(';')}"/>
			</image>`;
        }
    }
    // ── Explosions ────────────────────────────────────────────────────────
    if (totalFrames >= 2) {
        for (const exp of store.explosionEvents) {
            const cx = (toSvgX(exp.x) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2).toFixed(1);
            const cy = (toSvgY(exp.y) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2).toFixed(1);
            const tS = Number((exp.frameIndex / (totalFrames - 1)).toFixed(SVG_PRECISION));
            const tE = Number((Math.min(exp.frameIndex + _core_constants__WEBPACK_IMPORTED_MODULE_1__.EXPLOSION_FRAMES, totalFrames - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION));
            if (tE <= tS)
                continue;
            // keyTimes with a duplicate at tS so opacity jumps in (no pre-fade)
            const kt = `0;${tS};${tS};${tE};1`;
            const opVals = `0;0;1;0;0`;
            const dur = `${totalDurationMs}ms`;
            // Expanding ring
            svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="none" stroke="${exp.color}" stroke-width="3" opacity="0">
				<animate attributeName="r"            calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="2;2;2;${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE};${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE}"/>
				<animate attributeName="stroke-width" calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="3;3;3;0;0"/>
				<animate attributeName="opacity"      calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${opVals}"/>
			</circle>`;
            // 4 sparks flying outward
            const sparks = [
                { dx: 0, dy: -11 },
                { dx: 0, dy: 11 },
                { dx: -11, dy: 0 },
                { dx: 11, dy: 0 }
            ];
            for (const { dx, dy } of sparks) {
                const tx = (Number(cx) + dx).toFixed(1);
                const ty = (Number(cy) + dy).toFixed(1);
                svg += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${exp.color}" opacity="0">
					<animate attributeName="cx"      calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${cx};${cx};${cx};${tx};${tx}"/>
					<animate attributeName="cy"      calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${cy};${cy};${cy};${ty};${ty}"/>
					<animate attributeName="r"       calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="2.5;2.5;2.5;0;0"/>
					<animate attributeName="opacity" calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${opVals}"/>
				</circle>`;
            }
        }
    }
    // ── Ship ──────────────────────────────────────────────────────────────
    const shipPositions = store.gameHistory.map((f) => {
        const sx = toSvgX(f.ship.x);
        return `${sx.toFixed(1)},${shipSvgY.toFixed(1)}`;
    });
    const shipAnim = buildChangingValuesAnimation(store, shipPositions);
    svg += `<image x="-16" y="-35" width="32" height="35" href="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.SHIP_IMAGE_DATA}" preserveAspectRatio="xMidYMid meet">
		<animateTransform attributeName="transform" type="translate" calcMode="linear"
			dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${shipAnim.keyTimes}"
			values="${shipAnim.values}"/>
	</image>`;
    svg += '</svg>';
    return svg;
};
/* ────────────────── Animation helpers ────────────────── */
const getCellAnimationData = (store, x, y) => {
    var _a, _b;
    const totalFrames = store.gameHistory.length;
    const initialColor = (_b = (_a = store.initialColors[x]) === null || _a === void 0 ? void 0 : _a[y]) !== null && _b !== void 0 ? _b : '#ebedf0';
    const events = store.cellEvents.filter((e) => e.x === x && e.y === y);
    if (events.length === 0) {
        return { keyTimes: '0;1', values: `${initialColor};${initialColor}` };
    }
    const kTimes = [0];
    const kValues = [initialColor];
    for (const ev of events) {
        const t = Number((ev.frameIndex / Math.max(totalFrames - 1, 1)).toFixed(SVG_PRECISION));
        if (t !== kTimes[kTimes.length - 1]) {
            kTimes.push(t);
            kValues.push(ev.color);
        }
        else {
            kValues[kValues.length - 1] = ev.color;
        }
    }
    if (kTimes[kTimes.length - 1] !== 1) {
        kTimes.push(1);
        kValues.push(kValues[kValues.length - 1]);
    }
    return { keyTimes: kTimes.join(';'), values: kValues.join(';') };
};
const buildChangingValuesAnimation = (store, values) => {
    var _a, _b, _c, _d;
    const totalFrames = store.gameHistory.length;
    if (totalFrames === 0) {
        const v = (_a = values[0]) !== null && _a !== void 0 ? _a : '0,0';
        return { keyTimes: '0;1', values: `${v};${v}` };
    }
    const keyTimes = [];
    const keyValues = [];
    let lastValue = null;
    let lastIndex = null;
    values.forEach((curr, idx) => {
        if (curr !== lastValue) {
            if (lastValue !== null && lastIndex !== null && idx - 1 !== lastIndex) {
                keyTimes.push(Number(((idx - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION)));
                keyValues.push(lastValue);
            }
            keyTimes.push(Number((idx / (totalFrames - 1)).toFixed(SVG_PRECISION)));
            keyValues.push(curr);
            lastValue = curr;
            lastIndex = idx;
        }
    });
    if (keyTimes.length === 0 || keyTimes[keyTimes.length - 1] !== 1) {
        if (keyTimes.length === 0) {
            keyTimes.push(0, 1);
            keyValues.push((_b = values[0]) !== null && _b !== void 0 ? _b : '0,0', (_c = values[values.length - 1]) !== null && _c !== void 0 ? _c : '0,0');
        }
        else {
            keyTimes.push(1);
            keyValues.push((_d = lastValue !== null && lastValue !== void 0 ? lastValue : values[values.length - 1]) !== null && _d !== void 0 ? _d : '0,0');
        }
    }
    return { keyTimes: keyTimes.join(';'), values: keyValues.join(';') };
};
const GalagaSVG = { generateAnimatedSVG };


/***/ }),

/***/ "./src/pacman/core/constants.ts":
/*!**************************************!*\
  !*** ./src/pacman/core/constants.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CELL_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE),
/* harmony export */   DELTA_TIME: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME),
/* harmony export */   GAME_THEMES: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAME_THEMES),
/* harmony export */   GAP_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE),
/* harmony export */   GHOSTS: () => (/* binding */ GHOSTS),
/* harmony export */   GHOST_NAMES: () => (/* binding */ GHOST_NAMES),
/* harmony export */   GRID_HEIGHT: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT),
/* harmony export */   GRID_WIDTH: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH),
/* harmony export */   MONTHS: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.MONTHS),
/* harmony export */   PACMAN_COLOR: () => (/* binding */ PACMAN_COLOR),
/* harmony export */   PACMAN_COLOR_DEAD: () => (/* binding */ PACMAN_COLOR_DEAD),
/* harmony export */   PACMAN_COLOR_POWERUP: () => (/* binding */ PACMAN_COLOR_POWERUP),
/* harmony export */   PACMAN_DEATH_DURATION: () => (/* binding */ PACMAN_DEATH_DURATION),
/* harmony export */   PACMAN_POWERUP_DURATION: () => (/* binding */ PACMAN_POWERUP_DURATION),
/* harmony export */   WALLS: () => (/* binding */ WALLS),
/* harmony export */   hasWall: () => (/* binding */ hasWall),
/* harmony export */   setWall: () => (/* binding */ setWall)
/* harmony export */ });
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/constants */ "./src/shared/constants.ts");
/* ─── Re-export shared constants so pacman code has one import location ─── */

/* ───────────── Pacman colours ───────────── */
const PACMAN_COLOR = 'yellow';
const PACMAN_COLOR_POWERUP = 'red';
const PACMAN_COLOR_DEAD = '#80808064';
const GHOST_NAMES = ['blinky', 'clyde', 'inky', 'pinky', 'eyes'];
const PACMAN_DEATH_DURATION = 10;
const PACMAN_POWERUP_DURATION = 15;
/* ───────────── Ghost sprites (base64) ───────────── */
const GHOSTS = {
    blinky: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiklEQVR4nIXSO2sVURQF4G8mMwa8QU2KxFcjCoIgacR/oCBYCP4fsTEIBkWwEK21UAQLIdjYaKEiJIXBXhNBCFaSeDP3zLa4mdyj5rHgwNmPtffZ62z+Q4miKHlWs3yALwUvKYphbC8UjDN3nIUB/SCCSDRnWKiZVxTFrvxp5kMRHbEltaTODuIED3YkT3FnUy+uS815qQkzMSJOxAWpuSo1A72Y4f5f5DFuBpE+vmsmZ9ukF9Eu/xwV+Pw1TEYcOtum9GmxCaLmdl7jeRDp968mcnQFMqS02bSkMV5tS36UBL6t7ixO6o/uK6sKymM0Q9l5NKC/Ldb3lWGrqenRCw73hr61H9viDujjKbztnLnae50uF4sl1nf91/2xvt9q7YuyEwKCNg+2DFoGue/fnHLoGwbyZQ/akqqkykkFZW6XmNy6VJdYyhPP8eE07/PCl1kqqbbMI3BrjY1rvMH4SW4kmou86Eac5UmiOcUcxq/wep2NirugYh4TXfOah6izUauax5leB2vuwR+e2vAshd8i9AAAAABJRU5ErkJggg==',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABmUlEQVR4nHXTT0tUYRQG8N97/TOloSYpYv/BNlLYqqJli1Z9gz5SOwkKgpDaRBS5CKJ2fYFWrsyNZWKSOYliw8y9p8XMHa+Tc+ByOec8z/M+7z3nJidHwhtc7ORreIjog29H1iYunmc5iPIpyGd5h0cd8ZNPvcLzXmJBXq1N8/g/kSSlyywFkdPMaVZJvfVZnkhHImmSZyWol9jrqMSMsti5tmhwJyhSO+8bZT8ogrulQDbDQZe8/ZPt38eZA9jbZ2OjKzTFPpJxPrdoBFFsruVRxq+tI/v1nW45vn2NIFo0TvMxTdLcYRBt+DHPne/Up36GvaygDn+p17+srp+d59S1KHyvXOPHgaFLTC9gfUtQdDp/TLAbRJPDQ2O7cyIuiAgzlQlcjSkR8yLCWJS7McJGV6Df2HoXqZqPsJmVdk56J7JEVrGsmida2TATZeM+q+U4E9kcKzdYqe7Hg+OYcdN8atG41f5Zagu8KMhv8rbck9u8L8iv8xS1e3xo0TjHMgyM8BJDnUMGa7xWjrYdQ8O8cuSkNsoSsn/EzgO2a6zxyAAAAABJRU5ErkJggg==',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzklEQVR4nIWSy2tTURCHvzNnzk0TS21sQluhq4Kb+sAH4qrgyoV/oNuCUIogEUGKf4DoolBFfCC4sYKgDVXig/Tec8ZF7k1uo9GBWczvnN8H84DpcM6h6ruw14VBBwZdeIX3inPuj//18FkmS/jtDdgvYGhgBhYhvwwv2khPs8z/3R2CnIcHlWlWXsXvMleDOEBVZaM0R8gTxGljghghN7BLyK4PwY/6UeUsbNuZlsVvn3JLyWz+1MTc8mbHP8x+HpmpWgVZhh5OKsbc0/6bgxhjzM3MbDicAN4f2jj6fUsQE8R52McBrcz7VbpPaJmxWALMxoBOMPMrE0bV3hXYC42grMCziOY3SJG18lf+fQxYx6y1XupfP1t9M6vwkjZ8GQ3JR3t3YHY8MGvWZsBpsw99s8GhmZwcbBd+sQQf/7e6WdmBIynKdRqkf17ZjBCrFdMQg5SgmNbqNySuFAySGwFP1AI6rVW1g0KANoCA3oK3DqR8lIvw/Bzs17Xb8LqqBTosI70ChjfhEVnWuIC/EyHfhIc4L2jmrqH3IuTX0S2azcYmcr+A4RrymCwEafuwJaoNAB+CLKjuiGoY9+q9XxDdcSF4AFEJiyJ3QwjyGx0DPZpbZTAYAAAAAElFTkSuQmCC',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABp0lEQVR4nI3TO2tUQRQH8N+9e9eg0YBBlwR8gNHKRqz8Amph4zcSBCWgEBALQbAU0U4EUewsfDQJNuIDiaAkSNhCY3Rz79xjsdndaxKDB6aYM//HzDln2DayrMXDgrct3hXcR7Y9dhMT14/wNFEGEURFb5onuLKjzDQ3B6QgalJNauamuLYt+SA3gkiUTffBauYPbBbJmB2AalJ8+Ryx2o1oN0Qm9kSdeim9Xyh/FFm0uNzUeFSTEmUsfoxhLC6NBNbXIyIipVR+fTGf8AAKZB2qjDyoHZ0B+04wvjJleWDRbisTuzponcon5Om7OoN7Fb1hsVY+RUTE2PGIw2J0g6jjd0TYG3FBnSp6uAPzg4oPwd1vEUvdCJ2RwNRk/1mvPwyxeF5gbUtLJjtb27TcJdsyBGs58n+Mxf9E6y9yUDf3NVVNtQOmzm0Agjpr3Cb6h0VO0SQNu9WPlGNS/x3FWRaawBlenuRVU/g8b/J++2G/grlVfp3jMcaOMZsoT3O3ryM/w4OK3iEuYewiz9b4iasDtznsHpi3uG3kAu2CW0Zfery98R/+AA8N/U/uOBf2AAAAAElFTkSuQmCC'
    },
    pinky: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkElEQVR4nG2TT2hcVRTGf/fc+2bey4xJk9hoXGlMES0uCoVoF4IWW1BEkWBB6lKwEPBPLXUlhYIYEiouRDdSsGDalJYmrtIuhECLC0MQIaWmgo2RJo0WMmn+zMy997h4aScTenbn+8453+E798L2EECMFHDjCWbRwoLDTmBEcrI5TFNiDWVjhtJgX549fGV3W+nplKisV+dqu344+NuKrP1SMeZDfNSHDsgonprq//njZ7v2QpJAYZOoAhswW5lm37mXvvlX7w00rZEkiSlRHLz5/mXd1xbqEOr6kaoeq6l+qqqfqEKoP1/21bkPJrWMG7bW5uLGGIDj1/svqq/4as+LqjjVym1V/TKqnlBdW1ClRfWJPap+xVf/endcgc+NMThVBejY6UrQAn9e27JazUCA7DHQ1RwKAbq0FaBTVRFxTtpNKU1dEe5us7gG1IGwBVuGLEnoIMuMtWKAL268ef5Y73NvI8E7jhagCxhSmN/0uLsOx5Nc4NQaUVN/64+f6Lnw1rcOKJVc0WHwrCYwCFiFumncaDGBzzxEB7UClKHVpA4oOSCEGPNCFyFY8Kb5wApsuM3D50RdPECQBgSEmDc2gIYBFhAFzcVMFADbeJsKMbVeVSOqoEpIqYUitTwPqBJjwXoCaN4aBfAh+BjT6OXO786YuqgQY6rezk0VZP7XQiyqRyxGosidaRez6GMIEfACdO7IOsUt/Zc+dfbA2MTMdzVTNrJy+6orjPSdcT++cHr5n0lHBpMz3/snR1+95Jb+TtvTRwR4FOCNM6+cXOorPTMKOIF3xl77er3btn8FgMDjbufQ+OvDVYH3ALen3Ds6sv/EMtB/34FDQEtusgE4wpa/K4IAAyIPoIx8GP8DW7gOkh3Y7ZsAAAAASUVORK5CYII=',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACZ0lEQVR4nHWRy4vNYRjHP8/ze885c+GIuTSZxriMS6KkKeQSK0lRDAsbthaTzSyUqYlhxYIsJkTNiGYh+RMYKRFTM5Fxq8ll3BriMOac3+95LM45GYOn3sX79n2/l+cL/58e4CkwAtwFwr9A8tfNOQJsernr2toFtauyFPIgORp7tw68TT6PAgcA+zcBdD7be6O7pXYDVNbgkVsRJEruPR6/puH85hsfyO0uk0gJgOOdT3b1d7csbctLQVRjDXhZxrHgMQH041Cov7jx+kdye0TERERw90PDOy6fXr5yXyxfRcVRomnmzADHqiTWT4Mhc7H1ch72q7sDNC+qnI/FFkslyhwB8d+f3SBL8RTAq5otDysA11IMicSQClE6BI4CS7yYUoB6h2MKxyOYC1JItEGyeSAC6B7c2Tdhhy3xN/7nnHD3jrz7xJQ3c7cuS5L99wsKdxRoakrXVzhu1JTilt1nAI+gYlrVATQ1NxgsUyA/GSfgwBdYvB4ihVfPgRQgCuOgjSDV4O9AIlFsEmBCAfEIUOBsQsNIUajpFPCmALHDSWgag+wPkFPANyAogAbABcDBc2q396HFtYJZFBMc/S5htL0UL7ZYEBUxBUyBxA085Sb510rKIICn3fTHWNBvo4FM0aFn3PTnWPCUW0k2VmDWjFSGKCHdemXL0IMXvUYFyM9Xurh39aCcWziQez8AlWDjD3VZ3+pBHX8USGcB6gDab23r+by9dt09oErg4HDb1ck1M5feLK2RaqIzI3v7JxeEuj4gPU9nX3rc1j+RRq6Wy+kCaqeUdQaYMa28C2XCYpH0iKC/AKR7DJ4ZSbreAAAAAElFTkSuQmCC',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnklEQVR4nG2TTYiVZRTHf+c8z/vee+emNVycYBocHAqGEN3IgEgg7bIZBir72CW2aNEERZiK6Ci4sNrooi9q02KaZhYubNGuhVEkLcqmLkhpwgwqRGBzZ+6d+77POS7uxUw8yz+HP/+Pc+C+EREIIsAc8AdwBVhEEOT+bf4PxTySinQid9+z8vKFpxoDT1RB+KdzrTM69+zFDuknsni0LMoHEAhkzuzV/V+fGNmyC2qP4sENQLqirK9wa+0XHv9q+kzL7DBm9xCoImbHf33x/Mnx8amurIlqVyOSIAnUFcus9MLtxl/f5FsXJk+6yCzufc/wxqVXvvC0lgozS3624z6T3Gfc/T1zd3dvuduxjVQeKjeaz8078I6IoO4OMMaBHXjFTUSUNyswBNQcXu27rIO8nSsK45VRgG3ujoYsyAC5TDyzkxhh5UY/k0zgtlAZhXxrHxsEHNCe/xijaCrS4e9e+Pz1fQ+7Qcgl7y+XBgapfU9N6xDakvtju+3n5+deK8vytAIjw9aoXjjo5k0YbgAfJripUIXyXeg2gQ7wfgHJ8MxtRBs5MBKBdpE2oArMlUCA1dDrR7yn5IMAXevhwcGgSwGwHgHtSQb+TSCxh4iDOxQKfwOiEB3KBATUBSBEQFx64XiWmxgKBg6WU4KjySMGJMFDNMzvxqJAwhzP3WT9poJDVDyKaet61Nb16CoGCkGQ9rJ65ma9I00K1DfHOqFb5hOLey83l+eNKsja7zr82Y4ft3z65PfSWlIG4M/lBXYuPH05dDv55vwhgE0AB7+d+vj29NDEJaD2SNj01tJLX7a317adBxRBx+tji7/tX9gYjLUjQG3f0MQPFyc/WQVmCCGg6DGgAaBRBfQcSOU/n5oBH/XfHGBQ4JRq5A5IWx73SeLhogAAAABJRU5ErkJggg==',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACmUlEQVR4nGWTT4iWVRTGf+fce9/vj6Nf4/hnRlEERVcuAsFw0SKRRAhSiBJXgiQiqNRCwc1AC6FsihYVtrKYWShRkkSudBNFCPkVrSSmwj/ziVoa8c3Me99zXLzfTJTP6p57D8957nnOgf9DAUECXCxgJsGdAvmWIAF9Khv5TxAChcWJpsuO6QOXtw4v29wmOzZ3P2+Y3Nm9XT3qWvRDZPxpAkWWWXp/ev/lY8uXbwfpQGvw5sDsn/jjXxn7dOf5Ho8PDm5rgpSSpOzvTL/21Zsja3bNS1tURSL3ARWIjuGZlfD37e/jxg93n38U+wdzzo6IAJz+7dVLnk/mOR8391mvcc7dT7j78dL93Xl3d6+qqnxw6ppH+EBVUXcHWDXGSN3A4wINyEB/HzAELBV4IwFQAX+8vMUyjJkZKkG0Q7MoUgIDnqm/3VoN7RXAPaAIAPT79fHZ50Z1tFiXUiCoV/7e9b2Th2zdthz6FMzUBBs2wfBCyVwBEFvAKo27Om4/7596qaz4XIHO0tCICLWCCaAHN6/Cw3FqJ/5SOFOSSvAuXDkCK6qmAsMRKDNWmxIc5oG3HaJBqRCkNquX4HQeWB4G0igVcF0YB/fa2EpgNoDZQmKNuQh9Bwev3bN/h9PAipDd3RBAK6whuWowj/giubVCxsEGRRWwbJVZy7Le60aRSgGskKx3f4x+64fCE4YKBNBeN1rLsrlZrR5WjjQ7Gh/2musv7P7ym18+nqUNVe+7OPTZ9qk0teOTmd+vKEvgxs1J1k4+fzHc+alIjSEFRgH2Tr3w1oNtnU0XgAi8cmnPRH99Y/VHSK1ziDj+9YtnyzbFUSBsbKw998Wes/8Ahxc6cABZXB2AIyISFvdMVYATMcZBTAJeB3gCWn4PpFt1S94AAAAASUVORK5CYII='
    },
    inky: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzklEQVR4nJWTzWtTURDFf3fyXtqSCKa1GsWPTRG6UdSVa/8pV+JK6kYh4EoIIrgRuhAMgitdWGqhdtFWq0IoIsVqQUSSZ/Jy73HxkvBin6ADA3fOnXOGmbkXCqwEBrSATWAbeGhFiYeIpdgBDY7OtfiUpHgJSbz7kjBVfQrciO3vUo7aqQe0BxlJEiF4QvDZWeLNZzF15JYrJB+bb7KZiMuDHhd8OhYZ+Vmfcs2nbOyK8vRt54YyBlCqNPja1bL3KRY8Jj3JkVu/JJCO14N/5H3K1q6Amy4rDWCvCMH/8D4NA6kfJJ8TkKQkSApS2/uUrgQsA1jknDFbH+CcfQRcCWIHO7n+vgHTLqu2A+CBciWNsz7Kz9nv90bDakv68Gf/kg4kreSH+3YvAe4Dtj8GC4iFHoLnpwSsGdD5lzdyyPoC6NpoEf9v2Q5stAcAQhhM5IQwKMRyZhACAFLALEKajPMYMI6VZRnY/PAmYuHiaw76WUvfMWZmX3LizApyGba9B4tX1jGLqABQg3K1yepWh3MLTYOIk6fvst7uMVe/5xj+zPOLj1l7n1CtXY8h5tLVZ7zY6ABLWGQOuOMgAnDOGdBgcrjxEBsNbAZYMov4DRt5NkCBfZ1GAAAAAElFTkSuQmCC',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB10lEQVR4nIWT3WsTURDFfzP37hrTD1QM9hPTYlP7ov6hvgcsvhSUUpD+EfUpRKEi+CRUkYgFrTakabK5d3zYTbLRiAcG7s6eM3vmsBfmQMCRpi1uLFyQVi+oVE8UdB53Bk5EcZWXrNbbXIUMM8PMuBwNqN1/C5XnDmSu2IOyvnXMsBDNq64ZtbUjnRkigogoK5u5OISMGMNf4hAyQuFqe+/QqU6GCEn1BYOC9K+vlwf1zPDJviMPxsiudkks/jekMW5aZJQ9jIA65xwbOxERRUR/AudzNFZUsbay3YhevYPqcpss37ljU8SS7R+l/kczI8ZAP2SIPxFIuthwEeDaLOpodO2cS1XVj1OKZjGEMDSzOPS+sjh2IXKuOOmOnb0GFm6DW4J3JfttIEkt1moWW2b5ugFAekDybSblTTM25qS/YsZucY4xMDIDd+Yp/6Jmkc8yfY5xBICq52uJM4UqECcvRHRCMIuoelT9jKjMyRvpILdlRuPJKd8Lmz0zlm61uHOvRVb0OmbsPD6drAW/YGH5Fe1PPbYaBykkrNWbvO8MWK8fOBABpb53yIfLPndXnzpIePDomDdf+qSLR4hzCtJU8OSBKOizP66vR/y+Ux33EnBN71P5DQllVXyQma9lAAAAAElFTkSuQmCC',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB4ElEQVR4nH2SvWtUURDFf3Pf24+siYkYFLRRizSaSiVi7V9g7b9hpSgogmIhipVbC0IwQrTQRgQ/CiMxCbsgxi9iIMHGENndrG/vPRZv3+atbDIwMHM4Z+65946xc1SByW791cwuSNIufIiiCOASFB8z/71FU2JTor7miSpPgKtdzgAxgCtdZ2lVSGmG4AnB9/r6uijsuRlh/WLnHLjyFea+CO8TOp12T5Rlp9PG+4TlX6JYuuGcS8VmBnCRd3VNe5/U8id284Okl5kj7xNq6wIu501Mz/xck/c+kaRaTvxc2/FUSh2G4IFnABQKDtzehzYksc8nG5spuefgqDRyJMUa2YBEwsrTUeqeO7z/1uBk8CBtbXSJWQ5LVNIBH/OPu7jSAB4AvOZ3Cs5sSZv/P56kuSDV81gInqYEzMdAky0Po47zpcFffNoGgH8BaDnAMLfDau0S6m5ArwSQQj9JYSCWC9ebJgUsZyXrzVyfqL/vOGCUYQPnYianPrP8J2M6Dh5eYv+BBXx38GoTTkx9wrmYIQDGAG7zttbgzLlXDsqMjV9j4UebieOzBpGBcWziEYsrLcYP3SpCiVNnX/BmqQHcJ45jKJTvAiMAzswwqwLF7XtaDK5q2ZWhgovvRVHMP7z+WsD4PpRYAAAAAElFTkSuQmCC',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR4nI2Tu4tTURDGf2fOvUlMcAXjigpZFfGBlaAI+h/4T9nYCClslFiJLlhZbJXCJmyxrs91bdyXYLFE8UGURaImN3PG4t6blxH8YIr5+OabOXPOcUzBpeECPAAuZnRb4FqAMK2fgPce4Aa+2GTjY5dgRt+M9m9lbv4xcDuOvZtdDEixXOf9F8MsjRCUEHSYf1KjWrvv00GnEJdusvPNUE1QTYZFeagmDAY92j+NucP3GJo4l4799msqCkFbZrY7bWBmr0LQF6oJux3Dx3dlrP8SGhTVpGkjPBsrXs84VU2e7CUKPAVAxDl86RH9dMxOJtx/0ozKyCAHhzQBM/yJ5ShCABbZ+NDLl7WcCavHzCiNDLYzXiIzjgdlM+lRLLYAXrOXbTwTr5rZ1owd7JjZio1pkU4EdOlPXsjVf7yTM9OEoyuAzLrV/4KJyAQRwuCvfBY3BgECBpgFRKKRe5aLRJiFCS7P0YEAB6kAIhHnLq+z+TkzcMKR2nP2lVf47tJJOwPh7IU1yBtZFaBO680PLl1pFqBA5cB1Xm73OH1+qQBeAOaPNlh794vawp0CxCycWmR1q0up8pBsDXVwZUi/MtAACvlpXHrUhkTiMyoCbvk4dn8AgDJfwO8SCRMAAAAASUVORK5CYII='
    },
    clyde: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVR4nG2TT2hUVxSHv3PunZfJm5CMiSGSaigxUDSIFv9sutBNQSiuCl1YpO2iUdAiFURKRSUBiyC6EFEsLrJQEHHdlXShiwYpVVBQpJuaVkZDdDI248x7954u5llH8MCFy3fO+fG799wrvCfUJxLz9mXgwwL97rw/HPL8feVvw3sPcLwPrv8z1W92ELPvscdfpS2Fq8BBEXmnR7q3vdjJh1OjP4wNLmMjLyOlItNGWRjk7t8pH8/OHxKRs2bWZVk9Kcw8+Ha97RgN2eRA3rKZCbPTmJ3B7Og2+6Anb32+NmR3vh4JwHfOuUJdBAc//rV/2MLS7YxqDGBmTx+anfdms8O28OcTA7OBiRhC45fszu4+A/aKCN7MCLB1zaARKxt4VRPVAPR+BNEgKzM0vpqXDXAV0RjWtTetaHpg0szwmnjSdv6aDOAplaS/ONhzMMCaQGCgr2M5SE1DVJQQxDk0tvOLj6Yqu2xkIerspx5qQBOubIdmgPoCXPuko5k/wl3amZTWZfHu7upUCOGYBzaMVpZTKxGpPYEL46AlqNc7MwrA/Bz8XIXMYGkJW0EcqzRSYNwD/xIUYgAFGssd69o16AgsFoIFb0UFQlMB/3/CigZfNFuxKNgbMQMRA3CFnoMAMaHzVouiWCaPZXKsYHTVFFYUyLCA9RB1UTyuQ80Ttea8PhdvJSLa4foCHxPymLsIZAoMURa0lvrJs/63xccJpCDzFU1PhptjP9ltedarpPDgj0q+5Vwy5+tpub/8WoEqwIm5L4cbmwfcDSAZ8kzf/2ZVa1S5WNyi29jvbtzbs7qZIgeA8merSrd+/WJlHdiHcw6PnwZ6O/9CRXFnQN/MARHpcXCqC1UVPSIi/AeSmwjoBKJbfAAAAABJRU5ErkJggg==',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACbElEQVR4nHWSu2tUYRDFfzP37t27DzbZyOrGRyISBIPaaKNNChsbKxEEKx9EEEUUUkgKEaKCRAVfUUNasU7tH5BCQaIiEl/EmEgIebnZzd29+41FEl2DDkwz35wz35wzwv/jOrAHqAHTwDnABLCGJr8RIQJmXAJ2vz2ROt65YTmNMyajLDsGS5kqfAKu/YVZN/XK2KncjY6NFWit4ZLEABKj8l31x3yK7QNLdyO4/C+C3s+n833t++diczivTICtdgjUU1QRiN7kgpaBxXsRXGwk6Jk41XSrdd9CLCVUQPHW/c2BGc4yuPKHrJ+7X+o36FnToGvzlrIzAUl6itZXpFtTS4BQEUMtdi5TjB1wCEBX30tSFSURwtmXcGEaCh3gVsG5FrjwaSWbNyHVuqZhcW2DxxPdmSX3IFG3yoj9iWmzJ3mze56ZfWioj5l7lKtXzjdVgGEFDmxpKqcJahB2NixdgIQPosDOhnoHBEbYshACXQosEgs4hegLbXtBUlCerYBfBa8O5Sn8Ngi2AqVxRGOlqgA/FfBRD5yDwaMkPwPLkH5yBOYWIHIweJjMNwi/A0+PQVQBLwBQ/7fKMdjyRzfWW1AsC/IVBzEKWhv1F/raQWLMTToikBUDnA/EmMNCnM4GPvkZYAYDp3PqYx7WVHOSHVc8kPlAXbYaC3UViBVoIanofMbfd9tGZ95nIQCZzWt7n3vVfK02IlN5JQC+ZOm8yWudSvqEYFAAuPPuZHHpYDMvgDAHV8e7i9GuFMOAB0hRGJo4U6xtUx4DQUeCZ+9PFys+PF/zph/INNzdABA0eKfA0CohQAJ4CMgv7wr9rCokR+cAAAAASUVORK5CYII=',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACk0lEQVR4nGWTT4jVVRTHP+fcM783b97TpzNqjDMaZTCFZBJCbqRN62jbRhGrhWW4axM0BrNIEJpwCoUGghZtbOWmbWoUEU0Jok8xCMU/U6O+p7557917T4vf82V54HsvF77nfr/33HPg/yECqgp8BzQHWEQVEXmCbv85mEmM8dhG9x3XDjVeLcbuGaos/92YnD55Z6qPnDOzj2OM/+o9rt1Qjt9+t3Kw2NCFBriQEZAeShv+vLme50+0jnTUZ8kZAH20roP5y4emDtqLxLyWSA+ki8oqSmHkp0Kc3n4nNg/UPgpZPhw+R0QQmLv+wYyn9Fs/5+XkX25zP0qJb15w97Z793fPx4uUFuhf3DfuwOHHa3Lq6vmfU0qp7+7uvuy+YO6fr3Hv3PJh3P3B+1/Q8fdxYB5ArQhSlyrP7tylYS087AJsgELhxiTS2MTGmYFMYxsSUVxQEDMTjb301aV31r++o+aZh2rBAFqQUpnUg/TIafcaoUPhz3n+dd/42zHGIwo8s3n0pi3NzpBuXaUS2vD1bmglqDfxT/ewcqENqQmLr4GDV8hbK3dHga0GdHCgehn9djskg/v3y/8RQM7C4iT0EjxYLZ1k6PcN6HUMUEShl0tCoIQPsAqsPhhcBqRyF8kAQQFFHQTyGHGYDOQKMVeIQzeAG2UHBYaNFMmOF2RdKUuIlkS9LaYrZj5CxgbKbdQD2aMDJAXWURj6V2EvzY/80vqjBjWQ63VdM8f3W47qT7JSU6pw6UI9v7IwuhRa1aJWcYA6wNzS3on27gk5DVSmRmTuylubO09XWQQVsPDyhJxu7p/o1k0Og1bfmLYfz7y5qQ28h5kRkE9AxgBCCAosgIbhlAmjAp+VUw6g4wKzqso/UZISjmIm/qIAAAAASUVORK5CYII=',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVR4nG2Sz4uVZRTHP+c8z33vfe+90zg/dEaZULlUEgQa1NZ/wIXQtl8bN2HRJlq4CwRhxDEZBYtpF9QiaSHtWgiioBthwCjMizk23hrTxmruve/7nNPivd7IOnB4OHCew/mezxeeDhEQkRpczODnGqzV4RohBET+2/6vQlXqxnIT27/23tT+fPL3Jm54f8L2Lv157W6yLrXa61YU9j8DVKZFz99/d/JIbfYR5Anq4I6Jo2xmsAm7Tw2//sl4DTAABYgxyjR2vnc0PxI6D0qboySfgj7IAGUI1h6Wtk/LO8f2HH4WLsQQVMaaYal/dNrTMoV/Muvut9y97/7lPvdF3E/ivtJx94ee0kaRFg/4BHyO6nj/r+xDUjpL4eX3Po4/NtzPTbkvB3fvubt7SqnodbsJ9GolPIjOoCqeKSiEDgCNXSDtGbg/A5kDOwAI22Bu7x6dknmyKFE9+YU77zxzyHcNTYcWsZsAtCchA3CHZMA9HCDX2Mlg7f1tr2alX1dgodV8FAlACXx6EMrv2Fh9wODMy9D+ER4DK68g3MW7t7m1+BzN/KYOYCECA0wABwc2H8K5lyBTsGLECfhtHc52KvJhCASMNIgVSq+afAR2kKCf/nHKk/yrgBI8x4SKQTXfq8cyyvEnBWtQWp1ybDcBa45qDzwxkgF4humvWt1CwCOmPaKuS/SAEcADpr+ESI3RwTAFZmmArtfji6fl8r3VFrRAehO64wTfZif8G++2lTps3Z7Q50/rJek2lNxIsB3g+JU35h8fmA4XQbM2fLD65sLWC634BQQFYQ7O/PDWzmJnXZZA4+4GKzfent9qwWeoKlD7CDSvRCkCp5Rq0crtQSK1jzWOvKsaFT0ZY5S/AWqkD0QparkoAAAAAElFTkSuQmCC'
    },
    eyes: {
        up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAj0lEQVR4nO2RsQ7CMAxE79K6aQCJbuztb8Af8P8rX8HaYzCChgbanZ5kyYqezjkb2MR3K02eOUdzJiBwhBCsgPWE7RcmD9YfBsCgp9zdS5Kul/Mpn50z95tzdSkAAKSYZp/7ZDzKF6XYxIUUvw12bbvKAF1VMQCvXUhSydXIjDk2kcDkjL4kF1k+4xrmH/UA3stP0Iur7f8AAAAASUVORK5CYII=',
        down: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAm0lEQVR4nO2Ryw3CQAxE35jdEBFRAycEpUAJ9A81EBIlcMjPgazEHUbyxX47I3vhLwBiDDydUpxnQt8zgG2+kQeD1A2cTJo3JIqVzV29jod9NrCX82m3xLRt27wHTYlmY+SjquslRpJ9ZVAmDKC/wf0K0lQAuFtWddn0a88ZgAwoKKx7MdRnShxdF5hAHIc5t+Q3rp2BoRT2c3oBFX9xUA7hwq8AAAAASUVORK5CYII=',
        left: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAuUlEQVR4nO2PvRIBQRCEu+fOIaD8RkoRKCGZwNt4fwKFcutnW2LP1tWdF6CjmdmveruBvxgGSSqOJKvgmEnM6CWYxS7hkYSVbuWdABIC9pTkI2cAeHiv3WazDPsiazWeFczDS0buQQLl0CfnrmHOb10LDHkoJxtV1cXZubyohCyyH36tVuji8vvHwJI6DltMhzNM2jqpUJqmaEdMD8YV5h3l0vHNrAf9zrjV/ARQpLrPYmYBZrWpfkwv2KllZq2VZYMAAAAASUVORK5CYII=',
        right: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAArklEQVR4nO2RsQrCMBCGv0vaUq2gIlJxEBEX6eLi5jv4/g8h0qViIpxT27S0i3M/COTCx5/cBSYAiIxBA8a8IcfEIhiRjmh7tQHi3pkAVnqpIfs4sbX8KIrdmGc6qfJCBETA+XlzZeWc73r1etIJgHXw7KjZV957Btn0A8K+26bf7vMd88izmbnl+UpVtVRVrVSvnJeLICAFkiRu51WqHjlkd05bAC7Gpv9+4wT8AASmiluJhbS5AAAAAElFTkSuQmCC'
    },
    scared: {
        imgDate: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADCklEQVR4nFWSX2hbZRjGf993vnN60qSNXWva6JpR7f5km7qrWrVUXYt2HdOCk2FBoQiDsivxRmU3XggiKIIIuxgOpxeyKsL8A8IoaJVNrMy4Mant2qZbMxKX5k/TmJ6cfJ8Xyao+8PK8F89z8bzPK7gDIcHo+t42GGbwmzk8vwJCIi2HH4d7KfxcAgFCbGkFANIB7cH2l3exc+IVCHfRtn8Mzb/IJ6YQpSxzp94h9enSHY9CyLq5Z3If8ddO0xrrpwr4/B/tDz2PDbj37EW5x1k5PYeQSIyBHcfjxN84QzDWz0a1jNY+1n/MFqC1z0a1TKhnkH0nP2L7xE6MQSAkPH7lPJG9R6j4FXzlstkwBQADlBscAKiWabGbWZ39hJm+lxRGg59PgdFUpdrWDf1xWCvBpV8AG548CIEAXEiAl5aKmtF42RsYgyK4x8EKtSOFZMPo8SfggxfqJ7CPgAjA9Ov1JIffh2/PC0lYSJy2KKHdjmLw0gJN4W48o1FS3S7UxVfSdTYa0lXotKFQAiyp8IxmW98EAz88LBgtpnBaovU6G9kdoAZ4jaKdBnuAbgxAJTuvMEajgHXts1nzcJWLKyQ1YN2vANCqXCRQ1j5ezaNJKlosB6NrEltIbsKJ5zLXrp8rrr44ml1gyWiaSunfPs4tz54p3MAq32bZ6MljxdXr59ZvTR7NJ0kBtrQEQ7nlN09IVS7mkn/mOnp778olH3nw7t1/ZQs3f5q3bNuynIE4tIbc8MU/iqnFW8GOAztKmU3jht869XdOIYRMZyuFzy/H+jO/Ctl1wN+MdRZTiRU7cPbLth4UNDnF1T1dpczZ75vbM4lgZPaxYGSkN30VI6TgUH4FK9xNevpd2iL307J/jIzRmHySyldvo4HmZ08iWu8lIiTFxBS57ArRg6/ip6/C4VKapy9/Rug+m8gzXYzOX2DcGIYSU1uvPHTta8aN4dDcd3Q81U5wl8PI718wkl2A4eRFQg+4W+LosRhH1xZ5dPo9hAJhw8DMh4ytLdI5Ft3ShfuCDC/N/AMdtzXsl7IlxgAAAABJRU5ErkJggg=='
    }
};
/* ───────────── Wall data ───────────── */

const WALLS = {
    horizontal: Array(_shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH + 1)
        .fill(null)
        .map(() => Array(_shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT + 1).fill({ active: false, id: '' })),
    vertical: Array(_shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH + 1)
        .fill(null)
        .map(() => Array(_shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT + 1).fill({ active: false, id: '' }))
};
const setWall = (x, y, direction, lineId, color) => {
    if (direction === 'horizontal') {
        if (x >= 0 && x < WALLS.horizontal.length && y >= 0 && y < WALLS.horizontal[0].length) {
            WALLS.horizontal[x][y] = { active: true, id: lineId, color };
        }
    }
    else {
        if (x >= 0 && x < WALLS.vertical.length && y >= 0 && y < WALLS.vertical[0].length) {
            WALLS.vertical[x][y] = { active: true, id: lineId, color };
        }
    }
};
const hasWall = (x, y, direction) => {
    switch (direction) {
        case 'up':
            return WALLS.horizontal[x][y].active;
        case 'down':
            return WALLS.horizontal[x + 1][y].active;
        case 'left':
            return WALLS.vertical[x][y].active;
        case 'right':
            return WALLS.vertical[x][y + 1].active;
    }
};


/***/ }),

/***/ "./src/pacman/core/game.ts":
/*!*********************************!*\
  !*** ./src/pacman/core/game.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game),
/* harmony export */   determineGhostName: () => (/* binding */ determineGhostName)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _movement_ghosts_movement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../movement/ghosts-movement */ "./src/pacman/movement/ghosts-movement.ts");
/* harmony import */ var _movement_pacman_movement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../movement/pacman-movement */ "./src/pacman/movement/pacman-movement.ts");
/* harmony import */ var _renderers_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../renderers/svg */ "./src/pacman/renderers/svg.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ "./src/pacman/core/constants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





/* ---------- positioning helpers ---------- */
const placePacman = (store) => {
    store.pacman = {
        x: 0,
        y: 0,
        direction: 'right',
        points: 0,
        totalPoints: 0,
        deadRemainingDuration: 0,
        powerupRemainingDuration: 0,
        recentPositions: [],
        ghostsEaten: 0
    };
};
const placeGhosts = (store) => {
    store.ghosts = [
        {
            x: 26,
            y: 2,
            name: 'blinky',
            direction: 'left',
            scared: false,
            target: undefined,
            inHouse: false,
            respawnCounter: 0,
            freezeCounter: 0,
            justReleasedFromHouse: false
        },
        {
            x: 25,
            y: 3,
            name: 'inky',
            direction: 'up',
            scared: false,
            target: undefined,
            inHouse: true,
            respawnCounter: 0,
            freezeCounter: 10,
            justReleasedFromHouse: false
        },
        {
            x: 26,
            y: 3,
            name: 'pinky',
            direction: 'down',
            scared: false,
            target: undefined,
            inHouse: true,
            respawnCounter: 0,
            freezeCounter: 20,
            justReleasedFromHouse: false
        },
        {
            x: 27,
            y: 3,
            name: 'clyde',
            direction: 'up',
            scared: false,
            target: undefined,
            inHouse: true,
            respawnCounter: 0,
            freezeCounter: 30,
            justReleasedFromHouse: false
        }
    ];
    store.ghosts.forEach((g) => {
        g.justReleasedFromHouse = false;
        g.respawnCounter = 0;
        if (g.inHouse) {
            if (g.name === 'inky')
                g.direction = 'up';
            else if (g.name === 'pinky')
                g.direction = 'down';
            else if (g.name === 'clyde')
                g.direction = 'up';
        }
    });
};
/* ---------- main cycle ---------- */
const stopGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    clearInterval(store.gameInterval);
});
const startGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    store.frameCount = 0;
    store.aliveSteps = 0;
    store.gameHistory = [];
    store.ghosts.forEach((g) => (g.scared = false));
    store.grid = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.createGridFromData(store);
    const remainingCells = () => store.grid.some((row) => row.some((cell) => cell.commitsCount > 0));
    if (remainingCells()) {
        placePacman(store);
        placeGhosts(store);
    }
    while (remainingCells()) {
        yield updateGame(store);
    }
    yield updateGame(store);
});
/* ---------- utilities ---------- */
const resetPacman = (store) => {
    store.pacman.x = 27;
    store.pacman.y = 7;
    store.pacman.direction = 'right';
    store.pacman.recentPositions = [];
};
const determineGhostName = (index) => {
    const names = ['blinky', 'inky', 'pinky', 'clyde'];
    return names[index % names.length];
};
/* ---------- update per frame ---------- */
const updateGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    store.frameCount++;
    if (store.pacman.deadRemainingDuration > 0) {
        store.pacman.deadRemainingDuration--;
        if (store.pacman.deadRemainingDuration === 0) {
            resetPacman(store);
            placeGhosts(store);
        }
    }
    if (store.pacman.powerupRemainingDuration > 0) {
        store.pacman.powerupRemainingDuration--;
        if (store.pacman.powerupRemainingDuration === 0) {
            store.ghosts.forEach((g) => {
                var _a, _b;
                if (g.name === 'eyes')
                    return;
                const atBoundary = ((_a = g.subX) !== null && _a !== void 0 ? _a : 0) === 0 && ((_b = g.subY) !== null && _b !== void 0 ? _b : 0) === 0;
                if (atBoundary) {
                    g.scared = false;
                }
            });
            store.pacman.points = 0;
        }
    }
    store.ghosts.forEach((ghost) => {
        if (ghost.inHouse && ghost.respawnCounter && ghost.respawnCounter > 0) {
            ghost.respawnCounter--;
            if (ghost.respawnCounter === 0) {
                ghost.name = ghost.originalName || determineGhostName(store.ghosts.indexOf(ghost));
                ghost.inHouse = false;
                ghost.scared = store.pacman.powerupRemainingDuration > 0;
                ghost.justReleasedFromHouse = true;
            }
        }
        if (ghost.freezeCounter) {
            ghost.freezeCounter--;
            if (ghost.freezeCounter === 0) {
                releaseGhostFromHouse(store, ghost.name);
            }
        }
    });
    const remaining = store.grid.some((row) => row.some((c) => c.commitsCount > 0));
    if (!remaining) {
        const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_3__.SVG.generateAnimatedSVG(store);
        store.config.svgCallback(svg);
        if (store.config.gameStatsCallback) {
            store.config.gameStatsCallback({
                totalScore: store.pacman.totalPoints,
                steps: store.aliveSteps,
                ghostsEaten: (_a = store.pacman.ghostsEaten) !== null && _a !== void 0 ? _a : 0
            });
        }
        store.config.gameOverCallback();
        return;
    }
    _movement_pacman_movement__WEBPACK_IMPORTED_MODULE_2__.PacmanMovement.movePacman(store);
    checkCollisions(store);
    if (store.pacman.deadRemainingDuration === 0) {
        _movement_ghosts_movement__WEBPACK_IMPORTED_MODULE_1__.GhostsMovement.moveGhosts(store);
        checkCollisions(store);
    }
    store.pacmanMouthOpen = !store.pacmanMouthOpen;
    if (store.pacman.deadRemainingDuration === 0) {
        store.aliveSteps++;
    }
    if (store.config.gameStatsCallback) {
        store.config.gameStatsCallback({
            totalScore: store.pacman.totalPoints,
            steps: store.aliveSteps,
            ghostsEaten: (_b = store.pacman.ghostsEaten) !== null && _b !== void 0 ? _b : 0
        });
    }
    pushSnapshot(store);
});
/* ---------- snapshot helper ---------- */
const pushSnapshot = (store) => {
    store.gameHistory.push({
        pacman: Object.assign({}, store.pacman),
        ghosts: store.ghosts.map((g) => (Object.assign({}, g))),
        grid: store.grid.map((row) => row.map((col) => (Object.assign({}, col))))
    });
};
/* ---------- collisions & house ---------- */
const checkCollisions = (store) => {
    if (store.pacman.deadRemainingDuration)
        return;
    store.ghosts.forEach((ghost) => {
        var _a;
        if (ghost.name === 'eyes')
            return;
        if (ghost.x === store.pacman.x && ghost.y === store.pacman.y) {
            if (store.pacman.powerupRemainingDuration && ghost.scared) {
                ghost.originalName = ghost.name;
                ghost.name = 'eyes';
                ghost.scared = false;
                ghost.target = { x: 26, y: 3 };
                ghost.subX = 0;
                ghost.subY = 0;
                store.pacman.points += 10;
                store.pacman.ghostsEaten = ((_a = store.pacman.ghostsEaten) !== null && _a !== void 0 ? _a : 0) + 1;
            }
            else {
                store.pacman.points = 0;
                store.pacman.powerupRemainingDuration = 0;
                if (store.pacman.deadRemainingDuration === 0) {
                    store.pacman.deadRemainingDuration = _constants__WEBPACK_IMPORTED_MODULE_4__.PACMAN_DEATH_DURATION;
                }
            }
        }
    });
};
const releaseGhostFromHouse = (store, name) => {
    const ghost = store.ghosts.find((g) => g.name === name && g.inHouse);
    if (ghost) {
        ghost.justReleasedFromHouse = true;
        ghost.y = 2;
        ghost.direction = 'up';
    }
};
const Game = {
    startGame,
    stopGame
};


/***/ }),

/***/ "./src/pacman/core/store.ts":
/*!**********************************!*\
  !*** ./src/pacman/core/store.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Store: () => (/* binding */ Store)
/* harmony export */ });
const Store = {
    frameCount: 0,
    aliveSteps: 0,
    contributions: [],
    pacman: {
        x: 0,
        y: 0,
        direction: 'right',
        points: 0,
        totalPoints: 0,
        deadRemainingDuration: 0,
        powerupRemainingDuration: 0,
        recentPositions: [],
        ghostsEaten: 0
    },
    ghosts: [],
    grid: [],
    monthLabels: [],
    pacmanMouthOpen: true,
    gameInterval: 0,
    gameHistory: [],
    config: undefined,
    useGithubThemeColor: true
};


/***/ }),

/***/ "./src/pacman/index.ts":
/*!*****************************!*\
  !*** ./src/pacman/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PacmanRenderer: () => (/* binding */ PacmanRenderer),
/* harmony export */   PlayerStyle: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_4__.PlayerStyle)
/* harmony export */ });
/* harmony import */ var _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/providers/providers */ "./src/shared/providers/providers.ts");
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/game */ "./src/pacman/core/game.ts");
/* harmony import */ var _core_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/store */ "./src/pacman/core/store.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types */ "./src/pacman/types.ts");
/* harmony import */ var _utils_grid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/grid */ "./src/pacman/utils/grid.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







class PacmanRenderer {
    constructor(conf) {
        this.conf = Object.assign({}, conf);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultConfig = {
                platform: 'github',
                username: '',
                svgCallback: (_) => { },
                gameOverCallback: () => { },
                gameTheme: 'github',
                pointsIncreasedCallback: (_) => { },
                githubSettings: { accessToken: '' },
                playerStyle: _types__WEBPACK_IMPORTED_MODULE_4__.PlayerStyle.OPPORTUNISTIC
            };
            this.store = JSON.parse(JSON.stringify(_core_store__WEBPACK_IMPORTED_MODULE_3__.Store));
            this.store.config = Object.assign(Object.assign({}, defaultConfig), this.conf);
            switch (this.store.config.platform) {
                case 'gitlab':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGitlabContributions(this.store);
                    break;
                case 'github':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGithubContributions(this.store);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${this.store.config.platform}`);
            }
            _utils_grid__WEBPACK_IMPORTED_MODULE_5__.Grid.buildWalls();
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildGrid(this.store);
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildMonthLabels(this.store);
            yield _core_game__WEBPACK_IMPORTED_MODULE_2__.Game.startGame(this.store);
            return this.store;
        });
    }
    stop() {
        _core_game__WEBPACK_IMPORTED_MODULE_2__.Game.stopGame(this.store);
    }
}


/***/ }),

/***/ "./src/pacman/movement/ghosts-movement.ts":
/*!************************************************!*\
  !*** ./src/pacman/movement/ghosts-movement.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GhostsMovement: () => (/* binding */ GhostsMovement)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/pacman/core/constants.ts");
/* harmony import */ var _movement_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./movement-utils */ "./src/pacman/movement/movement-utils.ts");


// Constants for ghost behavior
const SCATTER_MODE_DURATION = 7; // Duration of "scatter" mode in seconds (frames)
const CHASE_MODE_DURATION = 20; // Duration of "chase" mode in seconds (frames)
const SCATTER_CORNERS = {
    blinky: { x: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 3, y: 0 },
    pinky: { x: 0, y: 0 },
    inky: { x: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 3, y: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1 },
    clyde: { x: 0, y: _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1 } // Bottom left corner
};
// Global status of game modes
let currentMode = 'scatter';
let modeTimer = 0;
let dotsRemaining = 0;
const moveGhosts = (store) => {
    // Calculate the total number of points remaining to define the behavior
    dotsRemaining = countRemainingDots(store);
    // Update game mode (scatter or chase)
    updateGameMode(store);
    for (const ghost of store.ghosts) {
        // Special logic for ghosts inside the house
        if (ghost.inHouse) {
            moveGhostInHouse(ghost, store);
            continue;
        }
        if (ghost.name === 'eyes') {
            ghost.scared = false;
        }
        // Main movement logic
        if (ghost.scared) {
            moveScaredGhost(ghost, store);
        }
        else if (ghost.name === 'eyes') {
            moveEyesToHome(ghost, store);
        }
        else {
            // Choose behavior based on current mode
            if (currentMode === 'scatter') {
                moveGhostToScatterTarget(ghost, store);
            }
            else {
                moveGhostWithPersonality(ghost, store);
            }
        }
    }
};
// Function to count remaining points on the grid
const countRemainingDots = (store) => {
    let count = 0;
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            if (store.grid[x][y].level !== 'NONE') {
                count++;
            }
        }
    }
    return count;
};
// Updates game mode between "scatter" and "chase"
const updateGameMode = (store) => {
    // If Pac-Man is powered up, do not change the mode
    if (store.pacman.powerupRemainingDuration > 0)
        return;
    // Increment the current mode timer
    modeTimer++;
    // Check if it's time to change mode
    const modeDuration = currentMode === 'scatter' ? SCATTER_MODE_DURATION : CHASE_MODE_DURATION;
    if (modeTimer >= modeDuration * (1000 / 200)) {
        // Converting to frames (assuming 200ms per frame)
        // Switch between scatter and chase
        currentMode = currentMode === 'scatter' ? 'chase' : 'scatter';
        modeTimer = 0;
        // Reverse ghost direction when changing mode
        store.ghosts.forEach((ghost) => {
            if (!ghost.inHouse && ghost.name !== 'eyes' && !ghost.scared) {
                reverseDirection(ghost);
            }
        });
    }
};
// Function to reverse the direction of a ghost
const reverseDirection = (ghost) => {
    switch (ghost.direction) {
        case 'up':
            ghost.direction = 'down';
            break;
        case 'down':
            ghost.direction = 'up';
            break;
        case 'left':
            ghost.direction = 'right';
            break;
        case 'right':
            ghost.direction = 'left';
            break;
    }
};
const moveGhostInHouse = (ghost, store) => {
    // If the ghost is being released, allow it to leave the house.
    if (ghost.justReleasedFromHouse) {
        // The ghost can only leave through the door, which is at position x=26
        if (ghost.x === 26) {
            ghost.y = 2; // Door position
            ghost.direction = 'up';
            ghost.inHouse = false;
            ghost.justReleasedFromHouse = false;
        }
        else {
            // If not in the door position, move towards it.
            if (ghost.x < 26) {
                ghost.x += 1;
                ghost.direction = 'right';
            }
            else if (ghost.x > 26) {
                ghost.x -= 1;
                ghost.direction = 'left';
            }
        }
        return;
    }
    // If the ghost is in the process of respawn, just decrement the counter
    if (ghost.respawnCounter && ghost.respawnCounter > 0) {
        ghost.respawnCounter--;
        // When the counter reaches zero, restore the ghost
        if (ghost.respawnCounter === 0) {
            if (ghost.originalName) {
                ghost.name = ghost.originalName;
                ghost.inHouse = false;
                ghost.scared = store.pacman.powerupRemainingDuration > 0;
            }
        }
        return;
    }
    // Vertical movement inside the house
    const topWall = 3; // The position y=2 is where the door is
    const bottomWall = 4;
    // If it is going up and hits the upper limit
    if (ghost.direction === 'up' && ghost.y <= topWall) {
        ghost.direction = 'down';
        ghost.y = topWall; // Make sure it doesn't go over the wall
    }
    // If it is going down and hits the lower limit
    else if (ghost.direction === 'down' && ghost.y >= bottomWall - 1) {
        ghost.direction = 'up';
        ghost.y = bottomWall - 1; // Make sure it doesn't go over the wall
    }
    // Apply movement in the current direction (discrete movement instead of fractional)
    if (ghost.direction === 'up') {
        ghost.y -= 1; // Move up in whole increments
    }
    else {
        ghost.y += 1; // Move down in whole increments
    }
    // If the move resulted in an invalid position, reverse
    if (ghost.y < topWall || ghost.y >= bottomWall) {
        // Revert to previous position
        ghost.y = ghost.direction === 'up' ? topWall : bottomWall - 1;
        // Change direction
        ghost.direction = ghost.direction === 'up' ? 'down' : 'up';
    }
};
// Move to "scatter" mode - each ghost goes to its corner
const moveGhostToScatterTarget = (ghost, store) => {
    const target = SCATTER_CORNERS[ghost.name] || SCATTER_CORNERS['blinky'];
    ghost.target = target;
    // At the corner, step to an adjacent cell so BFS loops the ghost back next frame
    if (ghost.x === target.x && ghost.y === target.y) {
        const moves = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.getValidMoves(ghost.x, ghost.y);
        if (moves.length > 0) {
            const [dx, dy] = moves[0];
            ghost.x += dx;
            ghost.y += dy;
            if (dx > 0)
                ghost.direction = 'right';
            else if (dx < 0)
                ghost.direction = 'left';
            else if (dy > 0)
                ghost.direction = 'down';
            else if (dy < 0)
                ghost.direction = 'up';
        }
        return;
    }
    const nextMove = BFSTargetLocation(ghost.x, ghost.y, target.x, target.y, ghost.direction);
    if (nextMove) {
        ghost.x = nextMove.x;
        ghost.y = nextMove.y;
        if (nextMove.direction) {
            ghost.direction = nextMove.direction;
        }
    }
};
// When scared, ghosts move randomly but with some intelligence
const moveScaredGhost = (ghost, store) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // Ghosts move at half speed during power-up (one cell per two frames)
    const SCARED_SPEED = 0.5;
    const subX = (_a = ghost.subX) !== null && _a !== void 0 ? _a : 0;
    const subY = (_b = ghost.subY) !== null && _b !== void 0 ? _b : 0;
    const atBoundary = subX === 0 && subY === 0;
    if (!atBoundary) {
        const dirX = subX > 0 ? 1 : subX < 0 ? -1 : 0;
        const dirY = subY > 0 ? 1 : subY < 0 ? -1 : 0;
        ghost.subX = subX + dirX * SCARED_SPEED;
        ghost.subY = subY + dirY * SCARED_SPEED;
        if (((_c = ghost.subX) !== null && _c !== void 0 ? _c : 0) >= 1) {
            ghost.x += 1;
            ghost.subX = 0;
        }
        else if (((_d = ghost.subX) !== null && _d !== void 0 ? _d : 0) <= -1) {
            ghost.x -= 1;
            ghost.subX = 0;
        }
        if (((_e = ghost.subY) !== null && _e !== void 0 ? _e : 0) >= 1) {
            ghost.y += 1;
            ghost.subY = 0;
        }
        else if (((_f = ghost.subY) !== null && _f !== void 0 ? _f : 0) <= -1) {
            ghost.y -= 1;
            ghost.subY = 0;
        }
        const nowAtBoundary = ((_g = ghost.subX) !== null && _g !== void 0 ? _g : 0) === 0 && ((_h = ghost.subY) !== null && _h !== void 0 ? _h : 0) === 0;
        if (nowAtBoundary && store.pacman.powerupRemainingDuration === 0) {
            ghost.scared = false;
        }
        return;
    }
    if (store.pacman.powerupRemainingDuration === 0) {
        ghost.scared = false;
        return;
    }
    // Check if you already have a target or if you have already reached the current target
    if (!ghost.target || (ghost.x === ghost.target.x && ghost.y === ghost.target.y)) {
        ghost.target = getRandomDestination(ghost.x, ghost.y);
    }
    const validMoves = getValidMovesWithoutReverse(ghost);
    if (validMoves.length === 0)
        return;
    // Move toward target but with some randomness to appear "scared"
    const dx = ghost.target.x - ghost.x;
    const dy = ghost.target.y - ghost.y;
    // Filter moves that generally go toward the target but with randomness
    let possibleMoves = validMoves;
    // 50% chance to choose a completely random move
    if (Math.random() < 0.5) {
        // Choose any valid move
    }
    else {
        // Try to choose a move that goes in the direction of the target.
        const goodMoves = validMoves.filter((move) => {
            const moveX = move[0];
            const moveY = move[1];
            return (dx > 0 && moveX > 0) || (dx < 0 && moveX < 0) || (dy > 0 && moveY > 0) || (dy < 0 && moveY < 0);
        });
        // If there are "good" moves, use them.
        if (goodMoves.length > 0) {
            possibleMoves = goodMoves;
        }
    }
    // Choose a random move from the possible moves
    const [moveX, moveY] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    // Update ghost direction based on movement
    if (moveX > 0)
        ghost.direction = 'right';
    else if (moveX < 0)
        ghost.direction = 'left';
    else if (moveY > 0)
        ghost.direction = 'down';
    else if (moveY < 0)
        ghost.direction = 'up';
    ghost.subX = moveX * SCARED_SPEED;
    ghost.subY = moveY * SCARED_SPEED;
};
// Function to get valid moves that are not reversals of the current direction
const getValidMovesWithoutReverse = (ghost) => {
    const validMoves = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.getValidMoves(ghost.x, ghost.y);
    // Do not allow the ghost to reverse its direction unless it is the only way
    return validMoves.filter((move) => {
        const [dx, dy] = move;
        // Checks whether the movement would be a reversal of the current direction
        if ((ghost.direction === 'right' && dx < 0) ||
            (ghost.direction === 'left' && dx > 0) ||
            (ghost.direction === 'up' && dy > 0) ||
            (ghost.direction === 'down' && dy < 0)) {
            return false;
        }
        return true;
    });
};
// Special movement for eyes to return home
const moveEyesToHome = (ghost, store) => {
    const respawnPosition = { x: 26, y: 3 }; // Center of the ghost house
    // Check if you are already close to/inside the house
    if (Math.abs(ghost.x - respawnPosition.x) <= 1 && Math.abs(ghost.y - respawnPosition.y) <= 1) {
        // Adjust to the exact respawn position and start the respawn process
        ghost.x = respawnPosition.x;
        ghost.y = respawnPosition.y;
        ghost.inHouse = true;
        ghost.respawnCounter = 1; // Time to respawn
        return;
    }
    // Eyes move faster than normal ghosts
    const nextMove = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.findNextStepDijkstra({ x: ghost.x, y: ghost.y }, respawnPosition);
    if (nextMove) {
        // Calculate direction based on movement
        const dx = nextMove.x - ghost.x;
        const dy = nextMove.y - ghost.y;
        // Update direction based on actual movement
        if (dx > 0)
            ghost.direction = 'right';
        else if (dx < 0)
            ghost.direction = 'left';
        else if (dy > 0)
            ghost.direction = 'down';
        else if (dy < 0)
            ghost.direction = 'up';
        // Update position
        ghost.x = nextMove.x;
        ghost.y = nextMove.y;
    }
    else {
        // If you can't find a path, use BFSTargetedLocation as a fallback
        const alternativeMove = BFSTargetLocation(ghost.x, ghost.y, respawnPosition.x, respawnPosition.y, ghost.direction);
        if (alternativeMove) {
            ghost.x = alternativeMove.x;
            ghost.y = alternativeMove.y;
            if (alternativeMove.direction) {
                ghost.direction = alternativeMove.direction;
            }
        }
    }
};
// Specific movement for each ghost personality
const moveGhostWithPersonality = (ghost, store) => {
    // If the ghost is respawning (eyes only), use expert logic
    if (ghost.name === 'eyes') {
        moveEyesToHome(ghost, store);
        return;
    }
    // Target calculation based on ghost personality
    const target = calculateGhostTarget(ghost, store);
    ghost.target = target;
    // Finds the next move using BFS, respecting no-reversal rules
    const nextMove = BFSTargetLocation(ghost.x, ghost.y, target.x, target.y, ghost.direction);
    if (nextMove) {
        ghost.x = nextMove.x;
        ghost.y = nextMove.y;
        if (nextMove.direction) {
            ghost.direction = nextMove.direction;
        }
    }
};
// Improved version of BFS that respects the no-reversion rule
const BFSTargetLocation = (startX, startY, targetX, targetY, currentDirection) => {
    // If we are already on target, no need to move
    if (startX === targetX && startY === targetY)
        return null;
    const queue = [{ x: startX, y: startY, path: [], direction: currentDirection || 'right' }];
    const visited = new Set();
    visited.add(`${startX},${startY}`);
    while (queue.length > 0) {
        const current = queue.shift();
        const { x, y, path, direction } = current;
        // Get valid moves
        const validMoves = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.getValidMoves(x, y);
        // Filter out moves that would reverse the current direction
        const filteredMoves = validMoves.filter((move) => {
            const [dx, dy] = move;
            // If we have no defined direction, allow any movement
            if (!direction)
                return true;
            // Check if it would be a reversal
            if ((direction === 'right' && dx < 0) ||
                (direction === 'left' && dx > 0) ||
                (direction === 'up' && dy > 0) ||
                (direction === 'down' && dy < 0)) {
                // If there is only one valid move and it would be a reversal, allow it anyway
                return validMoves.length === 1;
            }
            return true;
        });
        for (const [dx, dy] of filteredMoves) {
            const newX = x + dx;
            const newY = y + dy;
            const key = `${newX},${newY}`;
            if (visited.has(key))
                continue;
            visited.add(key);
            // Determine the new direction
            let newDirection;
            if (dx > 0)
                newDirection = 'right';
            else if (dx < 0)
                newDirection = 'left';
            else if (dy > 0)
                newDirection = 'down';
            else if (dy < 0)
                newDirection = 'up';
            else
                newDirection = direction;
            const pathNode = {
                x: newX,
                y: newY,
                pathDirection: newDirection
            };
            const newPath = [...path, pathNode];
            if (newX === targetX && newY === targetY) {
                // Return the first position of the path with the direction
                return newPath.length > 0
                    ? {
                        x: newPath[0].x,
                        y: newPath[0].y,
                        direction: newPath[0].pathDirection
                    }
                    : null;
            }
            queue.push({ x: newX, y: newY, path: newPath, direction: newDirection });
        }
    }
    // If we don't find a path, check if there is any valid movement
    const validMoves = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.getValidMoves(startX, startY);
    if (validMoves.length > 0) {
        // Choose a random move if we can't find a path
        const [dx, dy] = validMoves[Math.floor(Math.random() * validMoves.length)];
        let direction = currentDirection;
        if (dx > 0)
            direction = 'right';
        else if (dx < 0)
            direction = 'left';
        else if (dy > 0)
            direction = 'down';
        else if (dy < 0)
            direction = 'up';
        return {
            x: startX + dx,
            y: startY + dy,
            direction
        };
    }
    // If there is no valid movement, do not move
    return null;
};
// Calculates the fate for each ghost based on their personality
const calculateGhostTarget = (ghost, store) => {
    const { pacman } = store;
    let pacDirection = getPacmanDirection(store);
    // Adjust Blinky's speed based on remaining points (becomes more aggressive)
    let speedMultiplier = 1;
    if (ghost.name === 'blinky') {
        // When there are few points left, Blinky becomes faster ("Elroy mode")
        const totalDots = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH * _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT;
        const dotsEaten = totalDots - dotsRemaining;
        const percentageEaten = dotsEaten / totalDots;
        if (percentageEaten > 0.7) {
            speedMultiplier = 1.2; // 20% faster
        }
        if (percentageEaten > 0.9) {
            speedMultiplier = 1.4; // 40% faster
        }
        // Apply speed multiplier if chasing Pac-Man
        if (Math.random() < 0.8 * speedMultiplier) {
            // Blinky aims directly at Pac-Man
            return { x: pacman.x, y: pacman.y };
        }
    }
    switch (ghost.name) {
        case 'blinky': // Red - Aim directly at Pac-Man
            return { x: pacman.x, y: pacman.y };
        case 'pinky': // Pink - tries to ambush Pac-Man by positioning herself in front of him
            const lookAhead = 4; // 4 cells ahead of Pac-Man
            // Special calculation for the original "bug": when Pac-Man looks up,
            // the calculation also adds 4 cells to the left
            let targetX = pacman.x;
            let targetY = pacman.y;
            if (pacman.direction === 'up') {
                // Reproducing the original bug
                targetX = pacman.x - 4;
                targetY = pacman.y - 4;
            }
            else {
                targetX = pacman.x + pacDirection[0] * lookAhead;
                targetY = pacman.y + pacDirection[1] * lookAhead;
            }
            // Ensure the target is within the grid
            targetX = Math.min(Math.max(targetX, 0), _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 1);
            targetY = Math.min(Math.max(targetY, 0), _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1);
            return { x: targetX, y: targetY };
        case 'inky': // Blue - Coordinated behavior with Blinky
            const blinky = store.ghosts.find((g) => g.name === 'blinky');
            // Landmark: 2 cells ahead of Pac-Man
            let twoAhead = {
                x: pacman.x + pacDirection[0] * 2,
                y: pacman.y + pacDirection[1] * 2
            };
            // Again, reproducing the Pinky bug upwards
            if (pacman.direction === 'up') {
                twoAhead.x = pacman.x - 2;
                twoAhead.y = pacman.y - 2;
            }
            // If Blinky exists, calculate the vector from it
            if (blinky) {
                // Fold Blinky's vector to the reference point
                const vectorX = twoAhead.x - blinky.x;
                const vectorY = twoAhead.y - blinky.y;
                twoAhead = {
                    x: twoAhead.x + vectorX,
                    y: twoAhead.y + vectorY
                };
            }
            // Ensure the target is within the grid
            twoAhead.x = Math.min(Math.max(twoAhead.x, 0), _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 1);
            twoAhead.y = Math.min(Math.max(twoAhead.y, 0), _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1);
            return twoAhead;
        case 'clyde': // Orange - Toggles between chasing and random
            const distanceToPacman = _movement_utils__WEBPACK_IMPORTED_MODULE_1__.MovementUtils.calculateDistance(ghost.x, ghost.y, pacman.x, pacman.y);
            // Clyde's special behavior: if he's too close, he runs away to his corner
            if (distanceToPacman < 8) {
                return SCATTER_CORNERS['clyde']; // Go to your corner when close
            }
            else {
                // When far away, chases Pac-Man directly
                return { x: pacman.x, y: pacman.y };
            }
        default:
            // Default behavior: Aim at Pac-Man
            return { x: pacman.x, y: pacman.y };
    }
};
const getPacmanDirection = (store) => {
    switch (store.pacman.direction) {
        case 'right':
            return [1, 0];
        case 'left':
            return [-1, 0];
        case 'up':
            return [0, -1];
        case 'down':
            return [0, 1];
        default:
            return [0, 0];
    }
};
// Get a random destination for spooked ghosts
const getRandomDestination = (x, y) => {
    const maxDistance = 8;
    const randomX = x + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;
    const randomY = y + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;
    return {
        x: Math.max(0, Math.min(randomX, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - 1)),
        y: Math.max(0, Math.min(randomY, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - 1))
    };
};
const GhostsMovement = {
    moveGhosts
};


/***/ }),

/***/ "./src/pacman/movement/movement-utils.ts":
/*!***********************************************!*\
  !*** ./src/pacman/movement/movement-utils.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MovementUtils: () => (/* binding */ MovementUtils)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/pacman/core/constants.ts");

const getValidMoves = (x, y) => {
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];
    return directions.filter(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX < 0 || newX >= _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH || newY < 0 || newY >= _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT) {
            return false;
        }
        if (dx === -1) {
            return !_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.vertical[x][y].active;
        }
        else if (dx === 1) {
            return !_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.vertical[x + 1][y].active;
        }
        else if (dy === -1) {
            return !_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.horizontal[x][y].active;
        }
        else if (dy === 1) {
            return !_core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.horizontal[x][y + 1].active;
        }
        return true;
    });
};
const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
const MovementUtils = {
    getValidMoves,
    calculateDistance,
    findNextStepDijkstra(start, target) {
        if (start.x === target.x && start.y === target.y)
            return null;
        const pq = [Object.assign(Object.assign({}, start), { cost: 0, path: [] })];
        const visited = new Set([`${start.x},${start.y}`]);
        while (pq.length) {
            pq.sort((a, b) => a.cost - b.cost);
            const { x, y, cost, path } = pq.shift();
            for (const [dx, dy] of getValidMoves(x, y)) {
                const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
                if (visited.has(key))
                    continue;
                visited.add(key);
                const newPath = [...path, { x: nx, y: ny }];
                if (nx === target.x && ny === target.y) {
                    return newPath.length > 0 ? newPath[0] : null;
                }
                pq.push({ x: nx, y: ny, cost: cost + 1, path: newPath });
            }
        }
        return null;
    }
};


/***/ }),

/***/ "./src/pacman/movement/pacman-movement.ts":
/*!************************************************!*\
  !*** ./src/pacman/movement/pacman-movement.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PacmanMovement: () => (/* binding */ PacmanMovement)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/pacman/core/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./src/pacman/types.ts");
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _movement_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./movement-utils */ "./src/pacman/movement/movement-utils.ts");




const RECENT_POSITIONS_LIMIT = 5;
const movePacman = (store) => {
    if (store.pacman.deadRemainingDuration)
        return;
    const hasPowerup = !!store.pacman.powerupRemainingDuration;
    const scaredGhosts = store.ghosts.filter((ghost) => ghost.scared);
    let targetPosition;
    // Find a target position, ensuring it's never undefined
    try {
        if (hasPowerup && scaredGhosts.length > 0) {
            const ghostPosition = findClosestScaredGhost(store);
            targetPosition = ghostPosition !== null && ghostPosition !== void 0 ? ghostPosition : findOptimalTarget(store);
        }
        else if (store.pacman.target) {
            if (store.pacman.x === store.pacman.target.x && store.pacman.y === store.pacman.target.y) {
                targetPosition = findOptimalTarget(store);
                store.pacman.target = targetPosition;
            }
            else {
                targetPosition = store.pacman.target;
            }
        }
        else {
            targetPosition = findOptimalTarget(store);
            store.pacman.target = targetPosition;
        }
        // Safety check to ensure targetPosition is never undefined
        if (!targetPosition) {
            targetPosition = { x: store.pacman.x, y: store.pacman.y };
        }
        const nextPosition = calculateOptimalPath(store, targetPosition);
        nextPosition ? updatePacmanPosition(store, nextPosition) : makeDesperationMove(store);
        checkAndEatPoint(store);
    }
    catch (error) {
        console.error('Error in movePacman:', error);
        // If all else fails, don't move
    }
};
const findClosestScaredGhost = (store) => {
    const scaredGhosts = store.ghosts.filter((g) => g.scared);
    if (scaredGhosts.length === 0)
        return null;
    return scaredGhosts.reduce((closest, ghost) => {
        const distance = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(ghost.x, ghost.y, store.pacman.x, store.pacman.y);
        return distance < closest.distance ? { x: ghost.x, y: ghost.y, distance } : closest;
    }, { x: store.pacman.x, y: store.pacman.y, distance: Infinity });
};
const findOptimalTarget = (store) => {
    const pointCells = [];
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            const cell = store.grid[x][y];
            if (cell.level !== 'NONE') {
                const distance = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(x, y, store.pacman.x, store.pacman.y);
                const value = cell.commitsCount / (distance + 1);
                pointCells.push({ x, y, value });
            }
        }
    }
    pointCells.sort((a, b) => b.value - a.value);
    // Check if there are any cells with points left
    if (pointCells.length === 0) {
        // Return Pac-Man's current position as fallback
        return { x: store.pacman.x, y: store.pacman.y, value: 0 };
    }
    return pointCells[0];
};
const REVISIT_PENALTY = 100;
const GHOST_ADJACENT_DANGER = 14;
const GHOST_ADJACENT_PENALTY = 1000000;
const resolveSafetyWeight = (store) => {
    let safetyWeight = 0.5;
    switch (store.config.playerStyle) {
        case _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.CONSERVATIVE:
            safetyWeight = 3.0;
            break;
        case _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.AGGRESSIVE:
            safetyWeight = 0.3;
            break;
        case _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.OPPORTUNISTIC:
        default:
            safetyWeight = 0.8;
            break;
    }
    let closestGhostDistance = Infinity;
    store.ghosts.forEach((ghost) => {
        if (!ghost.scared) {
            const dist = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(store.pacman.x, store.pacman.y, ghost.x, ghost.y);
            closestGhostDistance = Math.min(closestGhostDistance, dist);
        }
    });
    const proximityThreshold = store.config.playerStyle === _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.CONSERVATIVE ? 5 : 7;
    const dangerNearby = closestGhostDistance < proximityThreshold;
    if (store.config.playerStyle === _types__WEBPACK_IMPORTED_MODULE_1__.PlayerStyle.CONSERVATIVE && dangerNearby) {
        safetyWeight *= 5;
    }
    return safetyWeight;
};
const stepCost = (store, dangerMap, safetyWeight, x, y) => {
    var _a, _b;
    const key = `${x},${y}`;
    const danger = (_a = dangerMap.get(key)) !== null && _a !== void 0 ? _a : 0;
    const revisit = ((_b = store.pacman.recentPositions) === null || _b === void 0 ? void 0 : _b.includes(key)) ? REVISIT_PENALTY : 0;
    const ghostAdjacentPenalty = danger >= GHOST_ADJACENT_DANGER ? GHOST_ADJACENT_PENALTY : 0;
    return 1 + danger * safetyWeight + revisit + ghostAdjacentPenalty;
};
const heuristic = (from, target) => {
    return Math.abs(from.x - target.x) + Math.abs(from.y - target.y);
};
const reconstructFirstStep = (cameFrom, targetKey, startKey) => {
    let cursor = targetKey;
    let parent = cameFrom.get(cursor);
    while (parent !== undefined && parent !== startKey) {
        cursor = parent;
        parent = cameFrom.get(cursor);
    }
    if (parent === undefined)
        return null;
    const [x, y] = cursor.split(',').map(Number);
    return { x, y };
};
const calculateOptimalPath = (store, target) => {
    var _a, _b;
    const start = { x: store.pacman.x, y: store.pacman.y };
    if (start.x === target.x && start.y === target.y)
        return null;
    const dangerMap = createDangerMap(store);
    const safetyWeight = resolveSafetyWeight(store);
    const startKey = `${start.x},${start.y}`;
    const targetKey = `${target.x},${target.y}`;
    const open = [{ x: start.x, y: start.y, g: 0, f: heuristic(start, target) }];
    const gScore = new Map([[startKey, 0]]);
    const cameFrom = new Map();
    while (open.length > 0) {
        let bestIdx = 0;
        for (let i = 1; i < open.length; i++) {
            if (open[i].f < open[bestIdx].f)
                bestIdx = i;
        }
        const current = open.splice(bestIdx, 1)[0];
        const currentKey = `${current.x},${current.y}`;
        if (current.g > ((_a = gScore.get(currentKey)) !== null && _a !== void 0 ? _a : Infinity))
            continue;
        if (currentKey === targetKey) {
            return reconstructFirstStep(cameFrom, targetKey, startKey);
        }
        for (const [dx, dy] of _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.getValidMoves(current.x, current.y)) {
            const nx = current.x + dx;
            const ny = current.y + dy;
            const neighborKey = `${nx},${ny}`;
            const tentativeG = current.g + stepCost(store, dangerMap, safetyWeight, nx, ny);
            if (tentativeG < ((_b = gScore.get(neighborKey)) !== null && _b !== void 0 ? _b : Infinity)) {
                gScore.set(neighborKey, tentativeG);
                cameFrom.set(neighborKey, currentKey);
                open.push({
                    x: nx,
                    y: ny,
                    g: tentativeG,
                    f: tentativeG + heuristic({ x: nx, y: ny }, target)
                });
            }
        }
    }
    return null;
};
const createDangerMap = (store) => {
    const map = new Map();
    const hasPowerup = !!store.pacman.powerupRemainingDuration;
    store.ghosts.forEach((ghost) => {
        if (ghost.scared)
            return;
        for (let dx = -5; dx <= 5; dx++) {
            for (let dy = -5; dy <= 5; dy++) {
                const x = ghost.x + dx;
                const y = ghost.y + dy;
                if (x >= 0 && x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH && y >= 0 && y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT) {
                    const key = `${x},${y}`;
                    const distance = Math.abs(dx) + Math.abs(dy);
                    const value = 15 - distance;
                    if (value > 0) {
                        const current = map.get(key) || 0;
                        map.set(key, Math.max(current, value));
                    }
                }
            }
        }
    });
    if (hasPowerup) {
        for (const [key, value] of map.entries()) {
            map.set(key, value / 5);
        }
    }
    return map;
};
const makeDesperationMove = (store) => {
    const validMoves = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.getValidMoves(store.pacman.x, store.pacman.y);
    if (validMoves.length === 0)
        return;
    const safest = validMoves.reduce((best, [dx, dy]) => {
        const newX = store.pacman.x + dx;
        const newY = store.pacman.y + dy;
        let minDist = Infinity;
        store.ghosts.forEach((ghost) => {
            if (!ghost.scared) {
                const dist = _movement_utils__WEBPACK_IMPORTED_MODULE_3__.MovementUtils.calculateDistance(ghost.x, ghost.y, newX, newY);
                minDist = Math.min(minDist, dist);
            }
        });
        return minDist > best.distance ? { dx, dy, distance: minDist } : best;
    }, { dx: 0, dy: 0, distance: -Infinity });
    updatePacmanPosition(store, {
        x: store.pacman.x + safest.dx,
        y: store.pacman.y + safest.dy
    });
};
const updatePacmanPosition = (store, position) => {
    var _a;
    (_a = store.pacman).recentPositions || (_a.recentPositions = []);
    store.pacman.recentPositions.push(`${position.x},${position.y}`);
    if (store.pacman.recentPositions.length > RECENT_POSITIONS_LIMIT) {
        store.pacman.recentPositions.shift();
    }
    const dx = position.x - store.pacman.x;
    const dy = position.y - store.pacman.y;
    store.pacman.direction = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : dy < 0 ? 'up' : store.pacman.direction;
    store.pacman.x = position.x;
    store.pacman.y = position.y;
};
const checkAndEatPoint = (store) => {
    const cell = store.grid[store.pacman.x][store.pacman.y];
    if (cell.level !== 'NONE') {
        store.pacman.totalPoints += cell.commitsCount;
        store.pacman.points++;
        store.config.pointsIncreasedCallback(store.pacman.totalPoints);
        const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_2__.Utils.getCurrentTheme(store);
        // Power-up activated in the cell
        if (cell.level === 'FOURTH_QUARTILE') {
            activatePowerUp(store);
        }
        // "Delete" point from cell
        cell.level = 'NONE';
        cell.color = theme.intensityColors[0];
        cell.commitsCount = 0;
    }
};
const activatePowerUp = (store) => {
    store.pacman.powerupRemainingDuration = _core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_POWERUP_DURATION;
    store.ghosts.forEach((g) => {
        if (g.name !== 'eyes')
            g.scared = true;
    });
};
const PacmanMovement = {
    movePacman
};


/***/ }),

/***/ "./src/pacman/renderers/renderer-units.ts":
/*!************************************************!*\
  !*** ./src/pacman/renderers/renderer-units.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RendererUnits: () => (/* binding */ RendererUnits)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/pacman/core/constants.ts");

const generatePacManColors = (pacman) => {
    if (pacman.deadRemainingDuration) {
        return _core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_COLOR_DEAD;
    }
    else if (pacman.powerupRemainingDuration) {
        return _core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_COLOR_POWERUP;
    }
    else {
        return _core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_COLOR;
    }
};
const RendererUnits = {
    generatePacManColors
};


/***/ }),

/***/ "./src/pacman/renderers/svg.ts":
/*!*************************************!*\
  !*** ./src/pacman/renderers/svg.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SVG: () => (/* binding */ SVG)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/pacman/core/constants.ts");
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _renderer_units__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderer-units */ "./src/pacman/renderers/renderer-units.ts");



const SVG_KEY_TIMES_PRECISION = 4;
const generateAnimatedSVG = (store) => {
    // Dimensions and duration
    const svgWidth = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
    const svgHeight = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 30; // Extra height for time counter
    const totalDurationMs = store.gameHistory.length * _core_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME;
    // Basic SVG structure
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<desc>Generated with pacman-contribution-graph on ${new Date()}</desc>`;
    svg += `<metadata>
		<info>
			<frames>${store.gameHistory.length}</frames>
			<frameRate>${1000 / _core_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME}</frameRate>
			<durationMs>${totalDurationMs}</durationMs>
			<generatedOn>${new Date().toISOString()}</generatedOn>
		</info>
	</metadata>`;
    svg += `<rect width="100%" height="100%" fill="${_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).gridBackground}"/>`;
    svg += generateGhostsPredefinition();
    // Month labels
    let lastMonth = '';
    for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; y++) {
        if (store.monthLabels[y] !== lastMonth) {
            const xPos = y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
            svg += `<text x="${xPos}" y="10" text-anchor="middle" font-size="10" fill="${_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).textColor}">${store.monthLabels[y]}</text>`;
            lastMonth = store.monthLabels[y];
        }
    }
    // Grid
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            const cellX = x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
            const cellY = y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 15;
            const cellColorAnimation = generateChangingValuesAnimation(store, generateCellColorValues(store, x, y));
            svg += `<rect id="c-${x}-${y}" x="${cellX}" y="${cellY}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" rx="5" fill="${_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).intensityColors[0]}">
				<animate attributeName="fill" dur="${totalDurationMs}ms" repeatCount="indefinite" 
					values="${cellColorAnimation.values}" 
					keyTimes="${cellColorAnimation.keyTimes}"/>
			</rect>`;
        }
    }
    // Horizontal walls
    for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
        let runStart = null;
        for (let x = 0; x <= _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
            let active = x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH && _core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.horizontal[x][y].active;
            if (active && runStart === null) {
                runStart = x;
            }
            if ((!active || x === _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH) && runStart !== null) {
                let length = x - runStart;
                svg += `<rect id="wh-${runStart}-${y}" x="${runStart * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" y="${y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE + 15}" width="${length * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE)}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" fill="${_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).wallColor}"></rect>`;
                runStart = null;
            }
        }
    }
    // Vertical walls
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH; x++) {
        let runStart = null;
        for (let y = 0; y <= _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT; y++) {
            let active = y < _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT && _core_constants__WEBPACK_IMPORTED_MODULE_0__.WALLS.vertical[x][y].active;
            if (active && runStart === null) {
                runStart = y;
            }
            if ((!active || y === _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT) && runStart !== null) {
                let length = y - runStart;
                svg += `<rect id="wv-${x}-${runStart}" x="${x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" y="${runStart * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) - _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE + 15}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE}" height="${length * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE)}" fill="${_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.getCurrentTheme(store).wallColor}"></rect>`;
                runStart = null;
            }
        }
    }
    // Pacman
    const pacmanColorAnimation = generateChangingValuesAnimation(store, store.gameHistory.map((el) => _renderer_units__WEBPACK_IMPORTED_MODULE_2__.RendererUnits.generatePacManColors(el.pacman)));
    const pacmanPositionAnimation = generateChangingValuesAnimation(store, generatePacManPositions(store));
    const pacmanRotationAnimation = generateChangingValuesAnimation(store, generatePacManRotations(store));
    svg += `<path id="pacman" d="${generatePacManPath(0.55)}" fill="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.PACMAN_COLOR}">
		<animate attributeName="fill" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanColorAnimation.keyTimes}"
			values="${pacmanColorAnimation.values}"/>
		<animateTransform attributeName="transform" type="translate" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanPositionAnimation.keyTimes}"
			values="${pacmanPositionAnimation.values}"
			additive="sum"/>
		<animateTransform attributeName="transform" type="rotate" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanRotationAnimation.keyTimes}"
			values="${pacmanRotationAnimation.values}"
			calcMode="discrete"
			additive="sum"/>
		<animate attributeName="d" dur="0.5s" repeatCount="indefinite"
			values="${generatePacManPath(0.55)};${generatePacManPath(0.05)};${generatePacManPath(0.55)}"/>
	</path>`;
    // Process each ghost separately
    store.ghosts.forEach((ghost, index) => {
        // Generate position animation for this ghost
        const ghostPositionAnimation = generateChangingValuesAnimation(store, generateGhostPositions(store, index));
        // Create a group for the ghost
        svg += `<g id="ghost${index}" transform="translate(0,0)">
			<animateTransform attributeName="transform" type="translate" 
				dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${ghostPositionAnimation.keyTimes}"
				values="${ghostPositionAnimation.values}"
				additive="replace"/>`;
        // Map all possible state + direction combinations for this ghost
        const stateChanges = mapGhostStateChanges(store, index);
        // For each possible state, create a <use> element with visibility animation
        for (const [state, keyframes] of Object.entries(stateChanges)) {
            // Ignore empty states
            if (keyframes.length === 0)
                continue;
            // Use the correct ID for reference (blinky-right, scared, etc)
            const href = `#ghost-${state}`;
            // Build the strings for the animation
            const keyTimes = keyframes.map((kf) => kf.time.toFixed(SVG_KEY_TIMES_PRECISION)).join(';');
            const values = keyframes.map((kf) => (kf.visible ? 'visible' : 'hidden')).join(';');
            // Initial visibility
            const initialVisibility = keyframes[0].visible ? 'visible' : 'hidden';
            svg += `<use href="${href}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" visibility="${initialVisibility}">
				<animate attributeName="visibility" 
					dur="${totalDurationMs}ms" repeatCount="indefinite"
					keyTimes="${keyTimes}"
					values="${values}" />
			</use>`;
        }
        // Close the ghost group
        svg += `</g>`;
    });
    svg += '</svg>';
    return svg;
};
// Helper function to map all ghost state changes
function mapGhostStateChanges(store, ghostIndex) {
    // A map of states for frames where they are visible
    // Key: "name-direction" or "scared" or "eyes-direction"
    // Value: array of {time: number, visible: boolean}
    const stateChanges = {};
    // Initialize possible states for all ghosts
    const allPossibleStates = [
        'blinky-up',
        'blinky-down',
        'blinky-left',
        'blinky-right',
        'inky-up',
        'inky-down',
        'inky-left',
        'inky-right',
        'pinky-up',
        'pinky-down',
        'pinky-left',
        'pinky-right',
        'clyde-up',
        'clyde-down',
        'clyde-left',
        'clyde-right',
        'eyes-up',
        'eyes-down',
        'eyes-left',
        'eyes-right',
        'scared'
    ];
    // Initialize all states as hidden
    allPossibleStates.forEach((state) => {
        stateChanges[state] = [{ time: 0, visible: false }];
    });
    // Get the initial ghost
    const initialGhost = store.ghosts[ghostIndex];
    if (!initialGhost)
        return stateChanges;
    // Set the initial state correctly
    const initialState = initialGhost.scared
        ? 'scared'
        : initialGhost.name === 'eyes'
            ? `eyes-${initialGhost.direction || 'right'}`
            : `${initialGhost.name}-${initialGhost.direction || 'right'}`;
    // Mark this state as visible initially
    stateChanges[initialState] = [{ time: 0, visible: true }];
    // Track last state
    let lastState = initialState;
    // Process each frame of the game history
    store.gameHistory.forEach((state, frameIndex) => {
        // If the ghost does not exist in this frame, skip
        if (ghostIndex >= state.ghosts.length)
            return;
        const ghost = state.ghosts[ghostIndex];
        const currentTime = frameIndex / (store.gameHistory.length - 1);
        // Determine the current state
        const currentState = ghost.scared
            ? 'scared'
            : ghost.name === 'eyes'
                ? `eyes-${ghost.direction || 'right'}`
                : `${ghost.name}-${ghost.direction || 'right'}`;
        // If the status has changed
        if (currentState !== lastState) {
            // Hide previous state
            stateChanges[lastState].push({ time: currentTime, visible: false });
            // Show new status
            if (!stateChanges[currentState]) {
                stateChanges[currentState] = [{ time: 0, visible: false }];
            }
            stateChanges[currentState].push({ time: currentTime, visible: true });
            // Update the latest status
            lastState = currentState;
        }
    });
    // Ensure the last state remains visible until the end
    stateChanges[lastState].push({ time: 1, visible: true });
    // Ensure all other states are hidden until the end
    Object.keys(stateChanges).forEach((state) => {
        if (state !== lastState && stateChanges[state].length > 0) {
            const lastKeyframe = stateChanges[state][stateChanges[state].length - 1];
            if (lastKeyframe.time < 1) {
                stateChanges[state].push({ time: 1, visible: false });
            }
        }
    });
    return stateChanges;
}
const generatePacManPath = (mouthAngle) => {
    const radius = _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
    const startAngle = mouthAngle;
    const endAngle = 2 * Math.PI - mouthAngle;
    return `M ${radius},${radius}
            L ${radius + radius * Math.cos(startAngle)},${radius + radius * Math.sin(startAngle)}
            A ${radius},${radius} 0 1,1 ${radius + radius * Math.cos(endAngle)},${radius + radius * Math.sin(endAngle)}
            Z`;
};
const generatePacManPositions = (store) => {
    return store.gameHistory.map((state) => {
        const x = state.pacman.x * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
        const y = state.pacman.y * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 15;
        return `${x},${y}`;
    });
};
const generatePacManRotations = (store) => {
    const pivit = _core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2;
    const directionToRotation = (direction) => {
        switch (direction) {
            case 'right':
                return `0 ${pivit} ${pivit}`;
            case 'left':
                return `180 ${pivit} ${pivit}`;
            case 'up':
                return `270 ${pivit} ${pivit}`;
            case 'down':
                return `90 ${pivit} ${pivit}`;
            default:
                return `0 ${pivit} ${pivit}`;
        }
    };
    // Position interpolates linearly between snapshot[i] and snapshot[i+1]
    // during interval i. The direction stored in snapshot[i+1] is the
    // direction Pac-Man took during that move, so it must be displayed for
    // the entire slide, not just at its end. Shift the rotation values one
    // frame forward so the discrete keyframe at time keyTimes[i] holds the
    // direction of the slide that begins there.
    return store.gameHistory.map((_, i) => {
        const lookaheadIndex = Math.min(i + 1, store.gameHistory.length - 1);
        return directionToRotation(store.gameHistory[lookaheadIndex].pacman.direction);
    });
};
const generateCellColorValues = (store, x, y) => {
    return store.gameHistory.map((state) => state.grid[x][y].color);
};
const generateGhostPositions = (store, ghostIndex) => {
    return store.gameHistory.map((state) => {
        var _a, _b;
        if (ghostIndex >= state.ghosts.length) {
            return '0,0'; // Default value for cases where the ghost does not exist
        }
        const ghost = state.ghosts[ghostIndex];
        const fx = ghost.x + ((_a = ghost.subX) !== null && _a !== void 0 ? _a : 0);
        const fy = ghost.y + ((_b = ghost.subY) !== null && _b !== void 0 ? _b : 0);
        const x = fx * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE);
        const y = fy * (_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE) + 15;
        return `${x},${y}`;
    });
};
const generateGhostsPredefinition = () => {
    let defs = `<defs>`;
    // For every regular ghost
    ['blinky', 'inky', 'pinky', 'clyde'].forEach((ghostName) => {
        // For each direction
        ['up', 'down', 'left', 'right'].forEach((direction) => {
            const ghostObj = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS[ghostName];
            if (direction in ghostObj) {
                defs += `
                <symbol id="ghost-${ghostName}-${direction}" viewBox="0 0 ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE} ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}">
                    <image href="${ghostObj[direction]}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}"/>
                </symbol>
                `;
            }
        });
    });
    // Add the scared ghost
    defs += `
    <symbol id="ghost-scared" viewBox="0 0 ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE} ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}">
        <image href="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS['scared'].imgDate}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}"/>
    </symbol>`;
    // Add ghost eyes (for each direction)
    ['up', 'down', 'left', 'right'].forEach((direction) => {
        if (_core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS['eyes'] && direction in _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS['eyes']) {
            const eyesObj = _core_constants__WEBPACK_IMPORTED_MODULE_0__.GHOSTS['eyes'];
            defs += `
            <symbol id="ghost-eyes-${direction}" viewBox="0 0 ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE} ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}">
                <image href="${eyesObj[direction]}" width="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}" height="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}"/>
            </symbol>
            `;
        }
        else {
            // Fallback if direction is not set
            console.warn(`Imagem para eyes-${direction} não encontrada, usando placeholder`);
            defs += `
            <symbol id="ghost-eyes-${direction}" viewBox="0 0 ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE} ${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE}">
                <circle cx="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2}" cy="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 2}" r="${_core_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE / 3}" fill="white"/>
            </symbol>
            `;
        }
    });
    defs += `</defs>`;
    return defs;
};
const generateChangingValuesAnimation = (store, changingValues) => {
    if (store.gameHistory.length !== changingValues.length) {
        throw new Error(`The amount of values (${changingValues.length}) does not match the size of the game history (${store.gameHistory.length})`);
    }
    const totalFrames = store.gameHistory.length;
    if (totalFrames === 0) {
        return { keyTimes: '0;1', values: changingValues[0] || '#000;#000' };
    }
    let keyTimes = [];
    let values = [];
    let lastValue = null;
    let lastIndex = null;
    changingValues.forEach((currentValue, index) => {
        if (currentValue !== lastValue) {
            if (lastValue !== null && lastIndex !== null && index - 1 !== lastIndex) {
                // Add a keyframe right before the value change
                keyTimes.push(Number(((index - 1 / (10 * SVG_KEY_TIMES_PRECISION)) / (totalFrames - 1)).toFixed(SVG_KEY_TIMES_PRECISION)));
                values.push(lastValue);
            }
            // Add the new value keyframe
            keyTimes.push(Number((index / (totalFrames - 1)).toFixed(SVG_KEY_TIMES_PRECISION)));
            values.push(currentValue);
            lastValue = currentValue;
            lastIndex = index;
        }
    });
    // Ensure the last frame is always included
    if (keyTimes.length === 0 || keyTimes[keyTimes.length - 1] !== 1) {
        // If there are no keyframes, add start and end frames
        if (keyTimes.length === 0) {
            keyTimes.push(0, 1);
            values.push(changingValues[0] || '#000', changingValues[changingValues.length - 1] || '#000');
        }
        else {
            keyTimes.push(1);
            values.push(lastValue || changingValues[changingValues.length - 1] || '#000');
        }
    }
    return {
        keyTimes: keyTimes.join(';'),
        values: values.join(';')
    };
};
const SVG = {
    generateAnimatedSVG
};


/***/ }),

/***/ "./src/pacman/types.ts":
/*!*****************************!*\
  !*** ./src/pacman/types.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlayerStyle: () => (/* binding */ PlayerStyle)
/* harmony export */ });
var PlayerStyle;
(function (PlayerStyle) {
    PlayerStyle["CONSERVATIVE"] = "conservative";
    PlayerStyle["AGGRESSIVE"] = "aggressive";
    PlayerStyle["OPPORTUNISTIC"] = "opportunistic";
})(PlayerStyle || (PlayerStyle = {}));


/***/ }),

/***/ "./src/pacman/utils/grid.ts":
/*!**********************************!*\
  !*** ./src/pacman/utils/grid.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Grid: () => (/* binding */ Grid)
/* harmony export */ });
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/constants */ "./src/pacman/core/constants.ts");

const setSymmetricWall = (x, y, direction, sym, lineId) => {
    if (direction == 'horizontal') {
        (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, y, 'horizontal', lineId);
        if (sym == 'x') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x - 1, y, 'horizontal', lineId);
        }
        else if (sym == 'y') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y, 'horizontal', lineId);
        }
        else if (sym == 'xy') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x - 1, y, 'horizontal', lineId);
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y, 'horizontal', lineId);
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x - 1, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y, 'horizontal', lineId);
        }
    }
    else {
        (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, y, 'vertical', lineId);
        if (sym == 'x') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x, y, 'vertical', lineId);
        }
        else if (sym == 'y') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y - 1, 'vertical', lineId);
        }
        else if (sym == 'xy') {
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x, y, 'vertical', lineId);
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y - 1, 'vertical', lineId);
            (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(_core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH - x, _core_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT - y - 1, 'vertical', lineId);
        }
    }
};
const buildWalls = () => {
    setSymmetricWall(0, 2, 'horizontal', 'xy', 'L1');
    setSymmetricWall(1, 2, 'horizontal', 'xy', 'L1');
    //setSymmetricWall(4, 0, 'vertical', 'x', 'L2');
    setSymmetricWall(4, 1, 'vertical', 'x', 'L2');
    setSymmetricWall(4, 2, 'vertical', 'x', 'L2');
    setSymmetricWall(4, 3, 'vertical', 'x', 'L2');
    setSymmetricWall(4, 4, 'vertical', 'x', 'L2');
    setSymmetricWall(3, 3, 'horizontal', 'x', 'L3');
    setSymmetricWall(2, 3, 'horizontal', 'x', 'L3');
    setSymmetricWall(4, 5, 'horizontal', 'x', 'L4');
    setSymmetricWall(6, 4, 'vertical', 'x', 'L5');
    setSymmetricWall(6, 3, 'vertical', 'x', 'L5');
    setSymmetricWall(6, 2, 'vertical', 'x', 'L5');
    setSymmetricWall(6, 2, 'horizontal', 'x', 'L6');
    setSymmetricWall(7, 2, 'horizontal', 'x', 'L6');
    setSymmetricWall(8, 2, 'horizontal', 'x', 'L6');
    setSymmetricWall(9, 2, 'horizontal', 'x', 'L6');
    setSymmetricWall(13, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(14, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(15, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(16, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(17, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(18, 2, 'horizontal', 'xy', 'L7');
    setSymmetricWall(16, 2, 'vertical', 'xy', 'L8');
    setSymmetricWall(8, 1, 'horizontal', 'x', 'L9');
    setSymmetricWall(9, 1, 'horizontal', 'x', 'L9');
    setSymmetricWall(10, 1, 'horizontal', 'x', 'L9');
    setSymmetricWall(11, 1, 'horizontal', 'x', 'L9');
    setSymmetricWall(12, 1, 'vertical', 'x', 'L10');
    setSymmetricWall(12, 3, 'vertical', 'x', 'L10');
    setSymmetricWall(11, 4, 'horizontal', 'x', 'L11');
    setSymmetricWall(10, 4, 'horizontal', 'x', 'L11');
    setSymmetricWall(9, 4, 'horizontal', 'x', 'L11');
    setSymmetricWall(8, 4, 'horizontal', 'x', 'L11');
    setSymmetricWall(8, 4, 'vertical', 'x', 'L12');
    setSymmetricWall(8, 5, 'vertical', 'x', 'L12');
    //setSymmetricWall(8, 6, 'vertical', 'x', 'L12');
    // setSymmetricWall(23, 2, 'horizontal', 'x', 'L13');
    // setSymmetricWall(24, 2, 'horizontal', 'x', 'L13');
    // setSymmetricWall(23, 4, 'horizontal', 'x', 'L13');
    // setSymmetricWall(24, 4, 'horizontal', 'x', 'L13');
    // setSymmetricWall(25, 4, 'horizontal', 'x', 'L13');
    // setSymmetricWall(23, 2, 'vertical', 'x', 'L14');
    // setSymmetricWall(23, 3, 'vertical', 'x', 'L14');
    // setSymmetricWall(26, 4, 'vertical', 'x', 'L15');
    // setSymmetricWall(26, 5, 'vertical', 'x', 'L15');
    // setSymmetricWall(23, 6, 'horizontal', 'x', 'L16');
    // setSymmetricWall(24, 6, 'horizontal', 'x', 'L16');
    // setSymmetricWall(25, 6, 'horizontal', 'x', 'L16');
    // setSymmetricWall(26, 0, 'vertical', 'x', 'L17');
    // setSymmetricWall(24, 1, 'vertical', 'x', 'L18');
    setSymmetricWall(23, 1, 'horizontal', 'x', 'L18');
    setSymmetricWall(22, 1, 'horizontal', 'x', 'L18');
    setSymmetricWall(21, 1, 'horizontal', 'x', 'L18');
    setSymmetricWall(21, 1, 'vertical', 'x', 'L18');
    setSymmetricWall(21, 2, 'vertical', 'x', 'L18');
    setSymmetricWall(21, 3, 'vertical', 'x', 'L18');
    setSymmetricWall(20, 4, 'horizontal', 'x', 'L18');
    setSymmetricWall(19, 4, 'horizontal', 'x', 'L18');
    setSymmetricWall(19, 3, 'vertical', 'x', 'L18');
    setSymmetricWall(18, 3, 'horizontal', 'x', 'L18');
    setSymmetricWall(22, 5, 'vertical', 'x', 'L19');
    setSymmetricWall(21, 5, 'horizontal', 'x', 'L19');
    setSymmetricWall(20, 5, 'horizontal', 'x', 'L19');
    setSymmetricWall(20, 5, 'vertical', 'x', 'L19');
    setSymmetricWall(1, 6, 'horizontal', 'x', 'L20');
    setSymmetricWall(2, 6, 'horizontal', 'x', 'L20');
    //setSymmetricWall(3, 5, 'vertical', 'x', 'L20');
    setSymmetricWall(3, 4, 'vertical', 'x', 'L20');
    setSymmetricWall(5, 6, 'horizontal', 'x', 'L21');
    setSymmetricWall(6, 6, 'horizontal', 'x', 'L21');
    // Ghost House
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(25, 2, 'horizontal', 'GH_TOP');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(27, 2, 'horizontal', 'GH_TOP');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(25, 4, 'horizontal', 'GH_BOTTOM');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(26, 4, 'horizontal', 'GH_BOTTOM');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(27, 4, 'horizontal', 'GH_BOTTOM');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(25, 3, 'vertical', 'GH_LEFT');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(28, 3, 'vertical', 'GH_RIGHT');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(25, 2, 'vertical', 'GH_LEFT');
    (0,_core_constants__WEBPACK_IMPORTED_MODULE_0__.setWall)(28, 2, 'vertical', 'GH_RIGHT');
};
const Grid = {
    buildWalls
};


/***/ }),

/***/ "./src/puzzle-bobble/core/constants.ts":
/*!*********************************************!*\
  !*** ./src/puzzle-bobble/core/constants.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUBBLE_RADIUS: () => (/* binding */ BUBBLE_RADIUS),
/* harmony export */   BUBBLE_SPEED: () => (/* binding */ BUBBLE_SPEED),
/* harmony export */   CANNON_ANGLE_MAX: () => (/* binding */ CANNON_ANGLE_MAX),
/* harmony export */   CANNON_ANGLE_MIN: () => (/* binding */ CANNON_ANGLE_MIN),
/* harmony export */   CANNON_AREA_HEIGHT: () => (/* binding */ CANNON_AREA_HEIGHT),
/* harmony export */   CANNON_TURN_SPEED: () => (/* binding */ CANNON_TURN_SPEED),
/* harmony export */   CANNON_Y_OFFSET: () => (/* binding */ CANNON_Y_OFFSET),
/* harmony export */   CELL_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.CELL_SIZE),
/* harmony export */   DELTA_TIME: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.DELTA_TIME),
/* harmony export */   GAME_THEMES: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAME_THEMES),
/* harmony export */   GAP_SIZE: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GAP_SIZE),
/* harmony export */   GRID_HEIGHT: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT),
/* harmony export */   GRID_WIDTH: () => (/* reexport safe */ _shared_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH),
/* harmony export */   PB_ANIM_SPEED_FACTOR: () => (/* binding */ PB_ANIM_SPEED_FACTOR),
/* harmony export */   PB_COLORS: () => (/* binding */ PB_COLORS),
/* harmony export */   POP_BURST_FRAMES: () => (/* binding */ POP_BURST_FRAMES),
/* harmony export */   POP_MIN_CLUSTER: () => (/* binding */ POP_MIN_CLUSTER)
/* harmony export */ });
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/constants */ "./src/shared/constants.ts");
/* ─── Re-export shared constants so puzzle-bobble code has one import location ─── */

/* ───────────── Cannon ───────────── */
/** SVG-space X of the cannon (horizontally centered on the grid) */
const CANNON_Y_OFFSET = 55; // px below grid bottom, within cannon area
/** Min/max cannon angle in degrees (90 = straight up) */
const CANNON_ANGLE_MIN = 10;
const CANNON_ANGLE_MAX = 170;
/** Cannon turn speed in degrees per frame */
const CANNON_TURN_SPEED = 6;
/* ───────────── Bubble physics ───────────── */
/** Bubble travel speed in SVG pixels per frame */
const BUBBLE_SPEED = 10;
/** Radius of a bubble in SVG pixels (slightly smaller than half CELL_SIZE so it fits) */
const BUBBLE_RADIUS = 9;
/* ───────────── Pop logic ───────────── */
/** Minimum connected same-color cluster size to trigger a pop */
const POP_MIN_CLUSTER = 3;
/** Number of frames the pop burst animation lasts */
const POP_BURST_FRAMES = 8;
/* ───────────── Cannon area ───────────── */
/** Height in SVG pixels reserved below the grid for the cannon */
const CANNON_AREA_HEIGHT = 80;
/** Divisor applied to total frame count when computing SVG animation duration.
 *  Higher = faster playback. */
const PB_ANIM_SPEED_FACTOR = 6;
/* ───────────── Bubble palette ───────────── */
/**
 * Fixed 6-colour palette used for Puzzle Bobble bubbles.
 * A subset of these is used depending on how many cells are occupied:
 * ≤50 → 2 colours, ≤150 → 3, ≤250 → 4, ≤350 → 5, >350 → 6
 */
const PB_COLORS = [
    '#e74c3c',
    '#f1c40f',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#e67e22' // orange
];


/***/ }),

/***/ "./src/puzzle-bobble/core/game.ts":
/*!****************************************!*\
  !*** ./src/puzzle-bobble/core/game.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PuzzleBobbleGame: () => (/* binding */ PuzzleBobbleGame)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _renderers_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../renderers/svg */ "./src/puzzle-bobble/renderers/svg.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/puzzle-bobble/core/constants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/* ────────────────── Coord helpers ────────────────── */
/** Center SVG-x of grid column col */
const cellCx = (col) => col * (_constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE + _constants__WEBPACK_IMPORTED_MODULE_2__.GAP_SIZE) + _constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE / 2;
/** Center SVG-y of grid row row */
const cellCy = (row) => row * (_constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE + _constants__WEBPACK_IMPORTED_MODULE_2__.GAP_SIZE) + 15 + _constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE / 2;
/** Column index from SVG x (clamped) */
const svgXToCol = (x) => Math.round((x - _constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE / 2) / (_constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE + _constants__WEBPACK_IMPORTED_MODULE_2__.GAP_SIZE));
/** Row index from SVG y */
const svgYToRow = (y) => Math.round((y - 15 - _constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE / 2) / (_constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE + _constants__WEBPACK_IMPORTED_MODULE_2__.GAP_SIZE));
/* ────────────────── Grid helpers ────────────────── */
const hasRemainingBubbles = (store) => store.grid.some((col) => col.some((cell) => cell.commitsCount > 0));
/** Return all cells reachable from (startCol, startRow) sharing the same color index (flood-fill, 4-dir). */
const floodFillSameColor = (store, startCol, startRow, colorIdx) => {
    var _a, _b, _c;
    const visited = new Set();
    const result = [];
    const stack = [{ x: startCol, y: startRow }];
    while (stack.length) {
        const { x, y } = stack.pop();
        const key = `${x},${y}`;
        if (visited.has(key))
            continue;
        if (x < 0 || x >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH || y < 0 || y >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT)
            continue;
        const cell = (_a = store.grid[x]) === null || _a === void 0 ? void 0 : _a[y];
        if (!cell || cell.commitsCount === 0)
            continue;
        if (((_c = (_b = store.cellBubbleColors[x]) === null || _b === void 0 ? void 0 : _b[y]) !== null && _c !== void 0 ? _c : -1) !== colorIdx)
            continue;
        visited.add(key);
        result.push({ x, y });
        stack.push({ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 });
    }
    return result;
};
/** Return all cells connected (4-dir, any non-NONE) to row 0 — these are "anchored". */
const findAnchoredCells = (store) => {
    var _a, _b, _c;
    const anchored = new Set();
    const stack = [];
    for (let x = 0; x < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH; x++) {
        if (((_b = (_a = store.grid[x]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.commitsCount) > 0) {
            stack.push({ x, y: 0 });
        }
    }
    while (stack.length) {
        const { x, y } = stack.pop();
        const key = `${x},${y}`;
        if (anchored.has(key))
            continue;
        if (x < 0 || x >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH || y < 0 || y >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT)
            continue;
        if (!((_c = store.grid[x]) === null || _c === void 0 ? void 0 : _c[y]) || store.grid[x][y].commitsCount === 0)
            continue;
        anchored.add(key);
        stack.push({ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 });
    }
    return anchored;
};
/* ────────────────── AI: pick next shot ────────────────── */
/**
 * Simulate bubble path (with wall bounces) and return the grid cell it lands in,
 * plus the final angle used.
 */
const simulateShot = (startX, startY, angleDeg, store) => {
    var _a, _b, _c, _d;
    const rad = (angleDeg * Math.PI) / 180;
    let vx = _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_SPEED * Math.cos(rad);
    let vy = -_constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_SPEED * Math.sin(rad); // up = negative y
    const svgWidth = _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH * (_constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE + _constants__WEBPACK_IMPORTED_MODULE_2__.GAP_SIZE);
    let x = startX;
    let y = startY;
    for (let step = 0; step < 2000; step++) {
        x += vx;
        y += vy;
        // Wall bounce
        if (x < _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_RADIUS) {
            x = _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_RADIUS;
            vx = Math.abs(vx);
        }
        if (x > svgWidth - _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_RADIUS) {
            x = svgWidth - _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_RADIUS;
            vx = -Math.abs(vx);
        }
        // Off top → miss
        if (y < 0)
            return null;
        const col = svgXToCol(x);
        const row = svgYToRow(y);
        if (row < 0 || row >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT || col < 0 || col >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH)
            continue;
        // Check if bubble center is close enough to a filled cell
        for (const [dc, dr] of [
            [0, 0],
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ]) {
            const nc = col + dc;
            const nr = row + dr;
            if (nc < 0 || nc >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH || nr < 0 || nr >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT)
                continue;
            if (((_b = (_a = store.grid[nc]) === null || _a === void 0 ? void 0 : _a[nr]) === null || _b === void 0 ? void 0 : _b.commitsCount) > 0) {
                const cx = cellCx(nc);
                const cy = cellCy(nr);
                const dist = Math.hypot(x - cx, y - cy);
                if (dist < _constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE) {
                    // Land in adjacent empty cell toward the shot direction
                    const landCol = Math.max(0, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - 1, svgXToCol(x)));
                    const landRow = Math.max(0, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT - 1, svgYToRow(y)));
                    return { col: landCol, row: landRow };
                }
            }
        }
        // Hit first row ceiling
        if (row === 0 && ((_d = (_c = store.grid[col]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.commitsCount) === 0) {
            return { col: Math.max(0, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - 1, col)), row: 0 };
        }
    }
    return null;
};
/**
 * Choose an angle for the next shot of `bubbleColorIdx`.
 *
 * Priority tiers (stable per-shot seed = nextBubbleId):
 *   1. Pop: lands adjacent to ≥(POP_MIN_CLUSTER-1) same-color cells → cluster pops
 *   2. Build: lands adjacent to at least 1 same-color cell (within 2 rows)
 *   3. Any:  lands adjacent to any occupied cell (within 2 rows)
 *   4. Closest: no adjacency found → pick the angle whose landing is geometrically
 *      closest to any remaining occupied cell (avoids wasting shots at empty ceiling)
 */
const chooseBestAngle = (store, cannonSvgX, cannonSvgY, bubbleColorIdx) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const seed = (store.nextBubbleId * 1664525 + 1013904223) >>> 0;
    const popCandidates = [];
    const sameColorCandidates = [];
    const anyCandidates = [];
    // Wider neighbourhood: same row ±1 col, plus up to 2 rows below (row+1, row+2)
    const NEIGHBOURHOOD = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, 1],
        [0, 1],
        [1, 1],
        [-1, 2],
        [0, 2],
        [1, 2]
    ];
    for (let angleDeg = _constants__WEBPACK_IMPORTED_MODULE_2__.CANNON_ANGLE_MIN + 2; angleDeg <= _constants__WEBPACK_IMPORTED_MODULE_2__.CANNON_ANGLE_MAX - 2; angleDeg += 2) {
        const hit = simulateShot(cannonSvgX, cannonSvgY, angleDeg, store);
        if (!hit)
            continue;
        if (((_c = (_b = (_a = store.grid[hit.col]) === null || _a === void 0 ? void 0 : _a[hit.row]) === null || _b === void 0 ? void 0 : _b.commitsCount) !== null && _c !== void 0 ? _c : 0) > 0)
            continue;
        let hasSameColorAdj = false;
        let hasAnyAdj = false;
        let bestCluster = 0;
        for (const [dc, dr] of NEIGHBOURHOOD) {
            const nc = hit.col + dc;
            const nr = hit.row + dr;
            if (nc < 0 || nc >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH || nr < 0 || nr >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT)
                continue;
            if (((_f = (_e = (_d = store.grid[nc]) === null || _d === void 0 ? void 0 : _d[nr]) === null || _e === void 0 ? void 0 : _e.commitsCount) !== null && _f !== void 0 ? _f : 0) === 0)
                continue;
            hasAnyAdj = true;
            if (((_h = (_g = store.cellBubbleColors[nc]) === null || _g === void 0 ? void 0 : _g[nr]) !== null && _h !== void 0 ? _h : -1) === bubbleColorIdx) {
                hasSameColorAdj = true;
                const sz = floodFillSameColor(store, nc, nr, bubbleColorIdx).length + 1;
                if (sz > bestCluster)
                    bestCluster = sz;
            }
        }
        if (bestCluster >= _constants__WEBPACK_IMPORTED_MODULE_2__.POP_MIN_CLUSTER) {
            popCandidates.push({ angleDeg, score: bestCluster });
        }
        else if (hasSameColorAdj) {
            sameColorCandidates.push(angleDeg);
        }
        else if (hasAnyAdj) {
            anyCandidates.push(angleDeg);
        }
    }
    if (popCandidates.length > 0) {
        const maxScore = Math.max(...popCandidates.map((c) => c.score));
        const best = popCandidates.filter((c) => c.score === maxScore);
        return best[seed % best.length].angleDeg;
    }
    if (sameColorCandidates.length > 0) {
        return sameColorCandidates[seed % sameColorCandidates.length];
    }
    if (anyCandidates.length > 0) {
        return anyCandidates[seed % anyCandidates.length];
    }
    // Tier 4: no adjacency at all — aim the landing as close as possible to any filled cell
    let closestAngle = 90;
    let closestDist = Infinity;
    for (let angleDeg = _constants__WEBPACK_IMPORTED_MODULE_2__.CANNON_ANGLE_MIN + 2; angleDeg <= _constants__WEBPACK_IMPORTED_MODULE_2__.CANNON_ANGLE_MAX - 2; angleDeg += 2) {
        const hit = simulateShot(cannonSvgX, cannonSvgY, angleDeg, store);
        if (!hit)
            continue;
        if (((_l = (_k = (_j = store.grid[hit.col]) === null || _j === void 0 ? void 0 : _j[hit.row]) === null || _k === void 0 ? void 0 : _k.commitsCount) !== null && _l !== void 0 ? _l : 0) > 0)
            continue;
        const lx = cellCx(hit.col);
        const ly = cellCy(hit.row);
        let minDist = Infinity;
        for (let x = 0; x < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH; x++) {
            for (let y = 0; y < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT; y++) {
                if (((_p = (_o = (_m = store.grid[x]) === null || _m === void 0 ? void 0 : _m[y]) === null || _o === void 0 ? void 0 : _o.commitsCount) !== null && _p !== void 0 ? _p : 0) > 0) {
                    const d = Math.hypot(lx - cellCx(x), ly - cellCy(y));
                    if (d < minDist)
                        minDist = d;
                }
            }
        }
        if (minDist < closestDist) {
            closestDist = minDist;
            closestAngle = angleDeg;
        }
    }
    return closestAngle;
};
/* ────────────────── Snapshot ────────────────── */
const pushSnapshot = (store) => {
    store.gameHistory.push({
        cannon: Object.assign({}, store.cannon),
        activeBubble: store.activeBubble ? Object.assign({}, store.activeBubble) : null,
        nextBubbleColorIndex: store.nextBubbleColorIndex,
        currentBubbleColorIndex: store.currentBubbleColorIndex
    });
};
/* ────────────────── Game lifecycle ────────────────── */
const startGame = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    store.frameCount = 0;
    store.nextBubbleId = 0;
    store.gameHistory = [];
    store.cellEvents = [];
    store.popEvents = [];
    store.activeBubble = null;
    store.grid = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.createGridFromData(store);
    // Assign fixed palette colors to occupied cells
    const _theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
    const _noneColor = _theme.intensityColors[0];
    const _occupied = [];
    for (let _x = 0; _x < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH; _x++) {
        for (let _y = 0; _y < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT; _y++) {
            if (store.grid[_x][_y].commitsCount > 0)
                _occupied.push({ x: _x, y: _y });
        }
    }
    const _numColors = _occupied.length <= 50 ? 2 : _occupied.length <= 150 ? 3 : _occupied.length <= 250 ? 4 : _occupied.length <= 350 ? 5 : 6;
    // ── Seeded RNG (LCG) ────────────────────────────────────────────────
    let _rngState = (_occupied.length * 2654435761) >>> 0;
    const _rng = () => {
        _rngState = (Math.imul(_rngState, 1664525) + 1013904223) >>> 0;
        return _rngState / 0x100000000;
    };
    store.cellBubbleColors = Array.from({ length: _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH }, () => new Array(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT).fill(-1));
    // Step 1: random initial assignment
    for (const { x: _x, y: _y } of _occupied) {
        store.cellBubbleColors[_x][_y] = Math.floor(_rng() * _numColors);
    }
    // Step 2: 3 rounds of majority-vote smoothing → natural color clusters
    for (let _round = 0; _round < 3; _round++) {
        const _prev = store.cellBubbleColors.map((col) => [...col]);
        for (const { x: _x, y: _y } of _occupied) {
            const _counts = new Array(_numColors).fill(0);
            let _total = 0;
            for (const [_dx, _dy] of [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
                [-1, -1],
                [1, -1],
                [-1, 1],
                [1, 1]
            ]) {
                const _ni = (_b = (_a = _prev[_x + _dx]) === null || _a === void 0 ? void 0 : _a[_y + _dy]) !== null && _b !== void 0 ? _b : -1;
                if (_ni >= 0) {
                    _counts[_ni]++;
                    _total++;
                }
            }
            if (_total > 0) {
                const _max = Math.max(..._counts);
                // Switch only when neighbours strongly agree (≥50 %) to preserve some variety
                if (_max >= _total * 0.5) {
                    store.cellBubbleColors[_x][_y] = _counts.indexOf(_max);
                }
            }
        }
    }
    // Apply palette color back to grid cells
    for (const { x: _x, y: _y } of _occupied) {
        const _ci = store.cellBubbleColors[_x][_y];
        store.grid[_x][_y] = Object.assign(Object.assign({}, store.grid[_x][_y]), { color: _constants__WEBPACK_IMPORTED_MODULE_2__.PB_COLORS[_ci] });
    }
    store.initialColors = store.grid.map((col) => col.map((cell) => (cell.commitsCount > 0 ? cell.color : _noneColor)));
    // Initialise next-bubble color (random from occupied palette)
    const _availableCI = [...new Set(_occupied.map(({ x, y }) => store.cellBubbleColors[x][y]))];
    store.nextBubbleColorIndex = (_c = _availableCI[Math.floor(_rng() * _availableCI.length)]) !== null && _c !== void 0 ? _c : 0;
    if (!hasRemainingBubbles(store)) {
        const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_1__.PuzzleBobblesVG.generateAnimatedSVG(store);
        store.config.svgCallback(svg);
        store.config.gameOverCallback();
        return;
    }
    store.cannon = { angleDeg: 90 };
    store.cannonTargetAngle = -1;
    store.currentBubbleColorIndex = store.nextBubbleColorIndex;
    const MAX_FRAMES = 5000;
    while (hasRemainingBubbles(store) && store.frameCount < MAX_FRAMES) {
        updateGame(store);
    }
    const svg = _renderers_svg__WEBPACK_IMPORTED_MODULE_1__.PuzzleBobblesVG.generateAnimatedSVG(store);
    store.config.svgCallback(svg);
    if (store.config.gameStatsCallback) {
        store.config.gameStatsCallback({
            totalScore: store.cellEvents.length,
            steps: store.frameCount,
            ghostsEaten: 0
        });
    }
    store.config.gameOverCallback();
});
const stopGame = (_store) => { };
/* ────────────────── Per-frame update ────────────────── */
const updateGame = (store) => {
    var _a, _b, _c, _d, _e, _f, _g;
    store.frameCount++;
    const svgWidth = _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH * (_constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE + _constants__WEBPACK_IMPORTED_MODULE_2__.GAP_SIZE);
    const gridBottomY = _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT * (_constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE + _constants__WEBPACK_IMPORTED_MODULE_2__.GAP_SIZE) + 15;
    const cannonSvgX = svgWidth / 2;
    const cannonSvgY = gridBottomY + 30; // cannon center
    // ── No active bubble: aim and fire ───────────────────────────────────
    if (!store.activeBubble) {
        // Compute target angle once per shot (stable during rotation)
        if (store.cannonTargetAngle === -1) {
            store.cannonTargetAngle = chooseBestAngle(store, cannonSvgX, cannonSvgY, store.nextBubbleColorIndex);
        }
        const targetAngle = store.cannonTargetAngle;
        store.currentBubbleColorIndex = store.nextBubbleColorIndex;
        // Rotate cannon toward target (up to CANNON_TURN_SPEED per frame)
        const diff = targetAngle - store.cannon.angleDeg;
        if (Math.abs(diff) <= _constants__WEBPACK_IMPORTED_MODULE_2__.CANNON_TURN_SPEED) {
            store.cannon.angleDeg = targetAngle;
        }
        else {
            store.cannon.angleDeg += Math.sign(diff) * _constants__WEBPACK_IMPORTED_MODULE_2__.CANNON_TURN_SPEED;
            store.cannon.angleDeg = Math.max(_constants__WEBPACK_IMPORTED_MODULE_2__.CANNON_ANGLE_MIN, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.CANNON_ANGLE_MAX, store.cannon.angleDeg));
            pushSnapshot(store);
            return;
        }
        // Fire the pre-selected bubble color
        const chosenColorIdx = store.nextBubbleColorIndex;
        store.currentBubbleColorIndex = chosenColorIdx;
        store.cannonTargetAngle = -1; // will recompute after this bubble lands
        // Pre-pick the NEXT bubble's color: random from colors still on the board
        const _existingCI = new Set();
        for (let _x = 0; _x < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH; _x++) {
            for (let _y = 0; _y < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT; _y++) {
                if (store.grid[_x][_y].commitsCount > 0)
                    _existingCI.add((_b = (_a = store.cellBubbleColors[_x]) === null || _a === void 0 ? void 0 : _a[_y]) !== null && _b !== void 0 ? _b : 0);
            }
        }
        const _ciList = [..._existingCI];
        if (_ciList.length > 0) {
            const _seed = (store.frameCount * 1664525 + 1013904223) >>> 0;
            store.nextBubbleColorIndex = _ciList[_seed % _ciList.length];
        }
        const rad = (store.cannon.angleDeg * Math.PI) / 180;
        store.activeBubble = {
            id: store.nextBubbleId++,
            x: cannonSvgX,
            y: cannonSvgY,
            vx: _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_SPEED * Math.cos(rad),
            vy: -_constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_SPEED * Math.sin(rad),
            colorIndex: chosenColorIdx,
            active: true
        };
        pushSnapshot(store);
        return;
    }
    // ── Move active bubble ───────────────────────────────────────────────
    const bubble = store.activeBubble;
    bubble.x += bubble.vx;
    bubble.y += bubble.vy;
    // Wall bounces
    if (bubble.x < _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_RADIUS) {
        bubble.x = _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_RADIUS;
        bubble.vx = Math.abs(bubble.vx);
    }
    if (bubble.x > svgWidth - _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_RADIUS) {
        bubble.x = svgWidth - _constants__WEBPACK_IMPORTED_MODULE_2__.BUBBLE_RADIUS;
        bubble.vx = -Math.abs(bubble.vx);
    }
    // Off top or bottom — discard
    if (bubble.y < 0 || bubble.y > cannonSvgY + 10) {
        store.activeBubble = null;
        store.cannonTargetAngle = -1;
        pushSnapshot(store);
        return;
    }
    // ── Collision detection ──────────────────────────────────────────────
    let landed = false;
    let landCol = -1;
    let landRow = -1;
    const bCol = svgXToCol(bubble.x);
    const bRow = svgYToRow(bubble.y);
    // Check proximity to every neighbor cell
    outer: for (let dc = -1; dc <= 1; dc++) {
        for (let dr = -1; dr <= 1; dr++) {
            const nc = bCol + dc;
            const nr = bRow + dr;
            if (nc < 0 || nc >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH || nr < 0 || nr >= _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT)
                continue;
            const cx = cellCx(nc);
            const cy = cellCy(nr);
            const dist = Math.hypot(bubble.x - cx, bubble.y - cy);
            if (dist < _constants__WEBPACK_IMPORTED_MODULE_2__.CELL_SIZE * 0.9) {
                // Filled cell → land in the adjacent empty slot toward the shooter
                if (((_d = (_c = store.grid[nc]) === null || _c === void 0 ? void 0 : _c[nr]) === null || _d === void 0 ? void 0 : _d.commitsCount) > 0) {
                    // Land in bCol/bRow if empty, otherwise find nearest empty neighbor
                    if (((_f = (_e = store.grid[bCol]) === null || _e === void 0 ? void 0 : _e[bRow]) === null || _f === void 0 ? void 0 : _f.commitsCount) === 0 && bCol >= 0 && bCol < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH && bRow >= 0 && bRow < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT) {
                        landCol = bCol;
                        landRow = bRow;
                    }
                    else {
                        // Find first empty neighbor
                        for (const [edc, edr] of [
                            [0, 1],
                            [-1, 0],
                            [1, 0],
                            [0, -1]
                        ]) {
                            const ec = nc + edc;
                            const er = nr + edr;
                            if (ec >= 0 && ec < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH && er >= 0 && er < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT && store.grid[ec][er].commitsCount === 0) {
                                landCol = ec;
                                landRow = er;
                                break;
                            }
                        }
                    }
                    landed = true;
                    break outer;
                }
                // Empty cell that's at row 0 (ceiling)
                if (nr === 0) {
                    landCol = nc;
                    landRow = 0;
                    landed = true;
                    break outer;
                }
            }
        }
    }
    // Ceiling collision
    if (!landed && bRow <= 0 && bCol >= 0 && bCol < _constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH) {
        landCol = bCol;
        landRow = 0;
        landed = true;
    }
    if (landed && landCol >= 0 && landRow >= 0) {
        landCol = Math.max(0, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_WIDTH - 1, landCol));
        landRow = Math.max(0, Math.min(_constants__WEBPACK_IMPORTED_MODULE_2__.GRID_HEIGHT - 1, landRow));
        // Place bubble in the grid
        const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
        const noneColor = theme.intensityColors[0];
        const bubbleColor = ((_g = _constants__WEBPACK_IMPORTED_MODULE_2__.PB_COLORS[bubble.colorIndex]) !== null && _g !== void 0 ? _g : _constants__WEBPACK_IMPORTED_MODULE_2__.PB_COLORS[0]);
        store.grid[landCol][landRow] = {
            commitsCount: 1,
            color: bubbleColor,
            level: 'FIRST_QUARTILE'
        };
        store.cellBubbleColors[landCol][landRow] = bubble.colorIndex;
        // Record color event
        store.cellEvents.push({
            frameIndex: store.gameHistory.length,
            x: landCol,
            y: landRow,
            color: bubbleColor
        });
        // ── Pop check ────────────────────────────────────────────────────
        const cluster = floodFillSameColor(store, landCol, landRow, bubble.colorIndex);
        if (cluster.length >= _constants__WEBPACK_IMPORTED_MODULE_2__.POP_MIN_CLUSTER) {
            const popColor = bubbleColor;
            // Clear only the same-color cluster — no cascade drop
            for (const { x, y } of cluster) {
                store.grid[x][y] = {
                    commitsCount: 0,
                    color: noneColor,
                    level: 'NONE'
                };
                store.cellBubbleColors[x][y] = -1;
                store.cellEvents.push({
                    frameIndex: store.gameHistory.length,
                    x,
                    y,
                    color: noneColor
                });
            }
            // Record pop event (cluster only — no cascade)
            store.popEvents.push({
                frameIndex: store.gameHistory.length,
                cells: cluster,
                color: popColor
            });
            store.config.pointsIncreasedCallback(store.cellEvents.length);
        }
        store.activeBubble = null;
        store.cannonTargetAngle = -1;
    }
    pushSnapshot(store);
};
const PuzzleBobbleGame = { startGame, stopGame };


/***/ }),

/***/ "./src/puzzle-bobble/core/store.ts":
/*!*****************************************!*\
  !*** ./src/puzzle-bobble/core/store.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PuzzleBobbleStore: () => (/* binding */ PuzzleBobbleStore)
/* harmony export */ });
const PuzzleBobbleStore = {
    frameCount: 0,
    nextBubbleId: 0,
    nextBubbleColorIndex: 0,
    currentBubbleColorIndex: 0,
    cannonTargetAngle: -1,
    contributions: [],
    cannon: { angleDeg: 90 },
    activeBubble: null,
    grid: [],
    monthLabels: [],
    gameHistory: [],
    initialColors: [],
    cellBubbleColors: [],
    cellEvents: [],
    popEvents: [],
    config: undefined
};


/***/ }),

/***/ "./src/puzzle-bobble/index.ts":
/*!************************************!*\
  !*** ./src/puzzle-bobble/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PuzzleBobbleRenderer: () => (/* binding */ PuzzleBobbleRenderer)
/* harmony export */ });
/* harmony import */ var _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/providers/providers */ "./src/shared/providers/providers.ts");
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/game */ "./src/puzzle-bobble/core/game.ts");
/* harmony import */ var _core_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/store */ "./src/puzzle-bobble/core/store.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class PuzzleBobbleRenderer {
    constructor(conf) {
        this.conf = Object.assign({}, conf);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultConfig = {
                platform: 'github',
                username: '',
                svgCallback: (_) => { },
                gameOverCallback: () => { },
                gameTheme: 'github',
                pointsIncreasedCallback: (_) => { },
                githubSettings: { accessToken: '' }
            };
            this.store = JSON.parse(JSON.stringify(_core_store__WEBPACK_IMPORTED_MODULE_3__.PuzzleBobbleStore));
            this.store.config = Object.assign(Object.assign({}, defaultConfig), this.conf);
            switch (this.store.config.platform) {
                case 'gitlab':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGitlabContributions(this.store);
                    break;
                case 'github':
                    this.store.contributions = yield _shared_providers_providers__WEBPACK_IMPORTED_MODULE_0__.Providers.fetchGithubContributions(this.store);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${this.store.config.platform}`);
            }
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildGrid(this.store);
            _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.Utils.buildMonthLabels(this.store);
            yield _core_game__WEBPACK_IMPORTED_MODULE_2__.PuzzleBobbleGame.startGame(this.store);
            return this.store;
        });
    }
    stop() {
        _core_game__WEBPACK_IMPORTED_MODULE_2__.PuzzleBobbleGame.stopGame(this.store);
    }
}


/***/ }),

/***/ "./src/puzzle-bobble/renderers/svg.ts":
/*!********************************************!*\
  !*** ./src/puzzle-bobble/renderers/svg.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PuzzleBobblesVG: () => (/* binding */ PuzzleBobblesVG)
/* harmony export */ });
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/utils */ "./src/shared/utils/utils.ts");
/* harmony import */ var _core_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/constants */ "./src/puzzle-bobble/core/constants.ts");


const SVG_PRECISION = 4;
/** Center SVG-x of grid column */
const toSvgCx = (col) => col * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2;
/** Center SVG-y of grid row */
const toSvgCy = (row) => row * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + 15 + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2;
const trackPush = (track, t, v) => {
    if (track.keyTimes.length === 0 || t !== track.keyTimes[track.keyTimes.length - 1]) {
        track.keyTimes.push(t);
        track.values.push(v);
    }
    else {
        track.values[track.values.length - 1] = v;
    }
};
const finishTrack = (track) => {
    if (track.keyTimes[track.keyTimes.length - 1] !== 1) {
        track.keyTimes.push(1);
        track.values.push(track.values[track.values.length - 1]);
    }
    return {
        keyTimes: track.keyTimes.join(';'),
        values: track.values.join(';')
    };
};
const t = (frameIdx, totalFrames) => Number((frameIdx / Math.max(totalFrames - 1, 1)).toFixed(SVG_PRECISION));
/* ────────────────── Cell animation ────────────────── */
const getCellAnimData = (store, x, y, noneColor) => {
    var _a, _b;
    const totalFrames = store.gameHistory.length;
    const initialColor = (_b = (_a = store.initialColors[x]) === null || _a === void 0 ? void 0 : _a[y]) !== null && _b !== void 0 ? _b : noneColor;
    const events = store.cellEvents.filter((e) => e.x === x && e.y === y);
    if (events.length === 0) {
        return { keyTimes: '0;1', values: `${initialColor};${initialColor}` };
    }
    const track = { keyTimes: [0], values: [initialColor] };
    for (const ev of events) {
        const ti = t(ev.frameIndex, totalFrames);
        trackPush(track, ti, ev.color);
    }
    return finishTrack(track);
};
const extractBubbleFlights = (store) => {
    const flights = [];
    const active = new Map();
    for (let f = 0; f < store.gameHistory.length; f++) {
        const ab = store.gameHistory[f].activeBubble;
        // Close flights no longer active
        for (const [id, flight] of active) {
            if (!ab || ab.id !== id) {
                flights.push({
                    id,
                    colorIndex: flight.colorIndex,
                    startFrame: flight.startFrame,
                    endFrame: f - 1,
                    xPositions: flight.xs,
                    yPositions: flight.ys
                });
                active.delete(id);
            }
        }
        if (ab && ab.active) {
            if (!active.has(ab.id)) {
                active.set(ab.id, { colorIndex: ab.colorIndex, startFrame: f, xs: [ab.x], ys: [ab.y] });
            }
            else {
                const fl = active.get(ab.id);
                fl.xs.push(ab.x);
                fl.ys.push(ab.y);
            }
        }
    }
    for (const [id, flight] of active) {
        flights.push({
            id,
            colorIndex: flight.colorIndex,
            startFrame: flight.startFrame,
            endFrame: store.gameHistory.length - 1,
            xPositions: flight.xs,
            yPositions: flight.ys
        });
    }
    return flights;
};
/* ────────────────── Main SVG generator ────────────────── */
const generateAnimatedSVG = (store) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const svgWidth = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE);
    const svgHeight = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + 15 + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CANNON_AREA_HEIGHT;
    const totalFrames = store.gameHistory.length;
    const totalDurationMs = Math.max((totalFrames * _core_constants__WEBPACK_IMPORTED_MODULE_1__.DELTA_TIME) / _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_ANIM_SPEED_FACTOR, 1000);
    const dur = `${totalDurationMs}ms`;
    const theme = _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.getCurrentTheme(store);
    const noneColor = theme.intensityColors[0];
    // SVG canvas
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<desc>Generated with puzzle-bobble-contribution-graph on ${new Date()}</desc>`;
    // Background
    svg += `<rect width="100%" height="100%" fill="${theme.gridBackground}"/>`;
    // ── Month labels ─────────────────────────────────────────────────────
    let lastMonth = '';
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        if (store.monthLabels[x] !== lastMonth) {
            const xPos = x * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + _core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE / 2;
            svg += `<text x="${xPos}" y="10" text-anchor="middle" font-size="10" fill="${theme.textColor}">${store.monthLabels[x]}</text>`;
            lastMonth = store.monthLabels[x];
        }
    }
    // ── Grid cells as circles (bubbles) ──────────────────────────────────
    for (let x = 0; x < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_WIDTH; x++) {
        for (let y = 0; y < _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT; y++) {
            const cx = toSvgCx(x);
            const cy = toSvgCy(y);
            const anim = getCellAnimData(store, x, y, noneColor);
            svg += `<circle cx="${cx}" cy="${cy}" r="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BUBBLE_RADIUS}" fill="${noneColor}">
				<animate attributeName="fill" calcMode="discrete" dur="${dur}" repeatCount="indefinite"
					values="${anim.values}" keyTimes="${anim.keyTimes}"/>
			</circle>`;
        }
    }
    // ── Flying bubbles (shots from cannon) ───────────────────────────────
    if (totalFrames >= 2) {
        const flights = extractBubbleFlights(store);
        for (const flight of flights) {
            const tStart = Number((flight.startFrame / (totalFrames - 1)).toFixed(SVG_PRECISION));
            const tEnd = Number((Math.min(flight.endFrame + 1, totalFrames - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION));
            const color = ((_a = _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[flight.colorIndex]) !== null && _a !== void 0 ? _a : _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[0]);
            // Opacity (discrete)
            let opKt, opVals;
            if (tStart <= 0 && tEnd >= 1) {
                opKt = '0;1';
                opVals = '1;1';
            }
            else if (tStart <= 0) {
                opKt = `0;${tEnd};${tEnd};1`;
                opVals = '1;1;0;0';
            }
            else if (tEnd >= 1) {
                opKt = `0;${tStart};${tStart};1`;
                opVals = '0;0;1;1';
            }
            else {
                opKt = `0;${tStart};${tStart};${tEnd};${tEnd};1`;
                opVals = '0;0;1;1;0;0';
            }
            // Position keyTimes/values (linear)
            const posKts = [];
            const posVals = [];
            const firstX = flight.xPositions[0].toFixed(1);
            const firstY = flight.yPositions[0].toFixed(1);
            if (flight.startFrame > 0) {
                posKts.push(0);
                posVals.push(`${firstX},${firstY}`);
            }
            for (let i = 0; i < flight.xPositions.length; i++) {
                const fi = flight.startFrame + i;
                const ti = Number((fi / (totalFrames - 1)).toFixed(SVG_PRECISION));
                const px = flight.xPositions[i].toFixed(1);
                const py = flight.yPositions[i].toFixed(1);
                if (posKts.length === 0 || ti !== posKts[posKts.length - 1]) {
                    posKts.push(ti);
                    posVals.push(`${px},${py}`);
                }
            }
            if (posKts[posKts.length - 1] !== 1) {
                const lx = flight.xPositions[flight.xPositions.length - 1].toFixed(1);
                const ly = flight.yPositions[flight.yPositions.length - 1].toFixed(1);
                posKts.push(1);
                posVals.push(`${lx},${ly}`);
            }
            svg += `<circle cx="0" cy="0" r="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BUBBLE_RADIUS}" fill="${color}" opacity="0" stroke="white" stroke-width="1" stroke-opacity="0.4">
				<animate attributeName="opacity" calcMode="discrete" dur="${dur}" repeatCount="indefinite"
					keyTimes="${opKt}" values="${opVals}"/>
				<animateTransform attributeName="transform" type="translate" calcMode="linear"
					dur="${dur}" repeatCount="indefinite"
					keyTimes="${posKts.join(';')}" values="${posVals.join(';')}"/>
			</circle>`;
        }
    }
    // ── Pop burst effects ────────────────────────────────────────────────
    if (totalFrames >= 2) {
        for (const pop of store.popEvents) {
            const tS = Number((pop.frameIndex / (totalFrames - 1)).toFixed(SVG_PRECISION));
            const tE = Number((Math.min(pop.frameIndex + _core_constants__WEBPACK_IMPORTED_MODULE_1__.POP_BURST_FRAMES, totalFrames - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION));
            if (tE <= tS)
                continue;
            const kt = `0;${tS};${tS};${tE};1`;
            const opVals = `0;0;1;0;0`;
            for (const { x, y } of pop.cells) {
                const cx = toSvgCx(x).toFixed(1);
                const cy = toSvgCy(y).toFixed(1);
                // Expanding ring
                svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="none" stroke="${pop.color}" stroke-width="2" opacity="0">
					<animate attributeName="r"            calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="4;4;4;${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE};${_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE}"/>
					<animate attributeName="stroke-width" calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="2;2;2;0;0"/>
					<animate attributeName="opacity"      calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${opVals}"/>
				</circle>`;
            }
        }
    }
    // ── Cannon ────────────────────────────────────────────────────────────
    if (totalFrames >= 2) {
        const gridBottomY = _core_constants__WEBPACK_IMPORTED_MODULE_1__.GRID_HEIGHT * (_core_constants__WEBPACK_IMPORTED_MODULE_1__.CELL_SIZE + _core_constants__WEBPACK_IMPORTED_MODULE_1__.GAP_SIZE) + 15;
        const cannonCx = (svgWidth / 2).toFixed(1);
        const cannonCy = (gridBottomY + 30).toFixed(1);
        // Barrel: a line rotated by cannon angle
        // Collect angle keyTimes/values
        const cannonTrack = { keyTimes: [], values: [] };
        for (let f = 0; f < store.gameHistory.length; f++) {
            const ti = t(f, totalFrames);
            const angleDeg = store.gameHistory[f].cannon.angleDeg;
            // SVG rotation: 0° = right, so we rotate from 90°-angleDeg
            const svgRot = (90 - angleDeg).toFixed(1);
            trackPush(cannonTrack, ti, `${svgRot} ${cannonCx} ${cannonCy}`);
        }
        const cannonAnim = finishTrack(cannonTrack);
        const barrelLen = 22;
        const bx2 = Number(cannonCx);
        const by1 = Number(cannonCy);
        const by2 = by1 - barrelLen;
        // Base circle — fill animates to match current bubble color
        const baseColorTrack = { keyTimes: [], values: [] };
        for (let f = 0; f < store.gameHistory.length; f++) {
            const ti = t(f, totalFrames);
            const ci = store.gameHistory[f].currentBubbleColorIndex;
            trackPush(baseColorTrack, ti, ((_b = _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[ci]) !== null && _b !== void 0 ? _b : _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[0]));
        }
        const baseColorAnim = finishTrack(baseColorTrack);
        const baseInitColor = ((_e = _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[(_d = (_c = store.gameHistory[0]) === null || _c === void 0 ? void 0 : _c.currentBubbleColorIndex) !== null && _d !== void 0 ? _d : 0]) !== null && _e !== void 0 ? _e : _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[0]);
        svg += `<circle cx="${cannonCx}" cy="${cannonCy}" r="10" fill="${baseInitColor}" stroke="white" stroke-width="2">
			<animate attributeName="fill" calcMode="discrete" dur="${dur}" repeatCount="indefinite"
				values="${baseColorAnim.values}" keyTimes="${baseColorAnim.keyTimes}"/>
			<animateTransform attributeName="transform" type="rotate" calcMode="linear"
				dur="${dur}" repeatCount="indefinite"
				keyTimes="${cannonAnim.keyTimes}" values="${cannonAnim.values}"/>
		</circle>`;
        // Barrel (rotates with linear interpolation so the sweep is visible)
        svg += `<line x1="${bx2}" y1="${by1}" x2="${bx2}" y2="${by2}" stroke="#cccccc" stroke-width="6" stroke-linecap="round">
			<animateTransform attributeName="transform" type="rotate" calcMode="linear"
				dur="${dur}" repeatCount="indefinite"
				keyTimes="${cannonAnim.keyTimes}" values="${cannonAnim.values}"/>
		</line>`;
        // ── Next bubble indicator ────────────────────────────────────────
        const nextTrack = { keyTimes: [], values: [] };
        for (let f = 0; f < store.gameHistory.length; f++) {
            const ti = t(f, totalFrames);
            const nci = store.gameHistory[f].nextBubbleColorIndex;
            trackPush(nextTrack, ti, ((_f = _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[nci]) !== null && _f !== void 0 ? _f : _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[0]));
        }
        const nextAnim = finishTrack(nextTrack);
        const nextCx = (Number(cannonCx) + 28).toFixed(1);
        const nextCy = cannonCy;
        const nextInitColor = ((_j = _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[(_h = (_g = store.gameHistory[0]) === null || _g === void 0 ? void 0 : _g.nextBubbleColorIndex) !== null && _h !== void 0 ? _h : 0]) !== null && _j !== void 0 ? _j : _core_constants__WEBPACK_IMPORTED_MODULE_1__.PB_COLORS[0]);
        svg += `<text x="${nextCx}" y="${(Number(cannonCy) - 16).toFixed(1)}" text-anchor="middle" font-size="8" fill="${theme.textColor}" opacity="0.8">NEXT</text>`;
        svg += `<circle cx="${nextCx}" cy="${nextCy}" r="${_core_constants__WEBPACK_IMPORTED_MODULE_1__.BUBBLE_RADIUS}" fill="${nextInitColor}" stroke="white" stroke-width="1" stroke-opacity="0.5">
			<animate attributeName="fill" calcMode="discrete" dur="${dur}" repeatCount="indefinite"
				values="${nextAnim.values}" keyTimes="${nextAnim.keyTimes}"/>
		</circle>`;
    }
    svg += '</svg>';
    return svg;
};
const PuzzleBobblesVG = { generateAnimatedSVG };


/***/ }),

/***/ "./src/shared/arcade-renderer.ts":
/*!***************************************!*\
  !*** ./src/shared/arcade-renderer.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ARCADE_GAMES: () => (/* binding */ ARCADE_GAMES),
/* harmony export */   ArcadeRenderer: () => (/* binding */ ArcadeRenderer),
/* harmony export */   GAME_REGISTRY: () => (/* binding */ GAME_REGISTRY),
/* harmony export */   PlayerStyle: () => (/* reexport safe */ _pacman_index__WEBPACK_IMPORTED_MODULE_3__.PlayerStyle)
/* harmony export */ });
/* harmony import */ var _bomberman_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../bomberman/index */ "./src/bomberman/index.ts");
/* harmony import */ var _breakout_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../breakout/index */ "./src/breakout/index.ts");
/* harmony import */ var _galaga_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../galaga/index */ "./src/galaga/index.ts");
/* harmony import */ var _pacman_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pacman/index */ "./src/pacman/index.ts");
/* harmony import */ var _puzzle_bobble_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../puzzle-bobble/index */ "./src/puzzle-bobble/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const gameRegistry = {
    pacman: {
        label: '👻 Pac-Man',
        factory: (conf) => new _pacman_index__WEBPACK_IMPORTED_MODULE_3__.PacmanRenderer(conf)
    },
    breakout: {
        label: '🧱 Breakout',
        factory: (conf) => new _breakout_index__WEBPACK_IMPORTED_MODULE_1__.BreakoutRenderer(conf)
    },
    galaga: {
        label: '🚀 Galaga',
        factory: (conf) => new _galaga_index__WEBPACK_IMPORTED_MODULE_2__.GalagaRenderer(conf)
    },
    'puzzle-bobble': {
        label: '🫧 Puzzle Bobble',
        factory: (conf) => new _puzzle_bobble_index__WEBPACK_IMPORTED_MODULE_4__.PuzzleBobbleRenderer(conf)
    },
    bomberman: {
        label: '💣 Bomberman',
        factory: (conf) => new _bomberman_index__WEBPACK_IMPORTED_MODULE_0__.BombermanRenderer(conf)
    }
};
const GAME_REGISTRY = gameRegistry;
const ARCADE_GAMES = Object.keys(GAME_REGISTRY);
class ArcadeRenderer {
    constructor(conf) {
        const entry = GAME_REGISTRY[conf.game];
        if (!entry) {
            throw new Error(`Unknown game "${conf.game}". Valid games: ${ARCADE_GAMES.join(', ')}`);
        }
        this.renderer = entry.factory(conf);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.renderer.start();
        });
    }
    stop() {
        this.renderer.stop();
    }
}


/***/ }),

/***/ "./src/shared/constants.ts":
/*!*********************************!*\
  !*** ./src/shared/constants.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CELL_SIZE: () => (/* binding */ CELL_SIZE),
/* harmony export */   DELTA_TIME: () => (/* binding */ DELTA_TIME),
/* harmony export */   GAME_THEMES: () => (/* binding */ GAME_THEMES),
/* harmony export */   GAP_SIZE: () => (/* binding */ GAP_SIZE),
/* harmony export */   GRID_HEIGHT: () => (/* binding */ GRID_HEIGHT),
/* harmony export */   GRID_WIDTH: () => (/* binding */ GRID_WIDTH),
/* harmony export */   MONTHS: () => (/* binding */ MONTHS)
/* harmony export */ });
/* ───────────── Grid dimensions ───────────── */
const CELL_SIZE = 20;
const GAP_SIZE = 2;
const GRID_WIDTH = 53; // 52 weeks + current week
const GRID_HEIGHT = 7; // Sun … Sat
const DELTA_TIME = 200;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/* ───────────── Official GitHub / GitLab Palettes ─────────────
   5-color array: 0 = NONE … 4 = FOURTH_QUARTILE               */
const GITHUB_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const GITHUB_DARK = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const GITLAB_LIGHT = ['#ececef', '#d2dcff', '#7992f5', '#4e65cd', '#303470'];
const GITLAB_DARK = ['#2a2a3d', '#4a5bdc', '#2e3dbf', '#1b2e8a', '#0f1a4e'];
/* ───────────── Game Themes ───────────── */
const GAME_THEMES = {
    github: {
        textColor: '#57606a',
        gridBackground: '#ffffff',
        wallColor: '#000000',
        intensityColors: GITHUB_LIGHT
    },
    'github-dark': {
        textColor: '#8b949e',
        gridBackground: '#0d1117',
        wallColor: '#ffffff',
        intensityColors: GITHUB_DARK
    },
    gitlab: {
        textColor: '#626167',
        gridBackground: '#ffffff',
        wallColor: '#000000',
        intensityColors: GITLAB_LIGHT
    },
    'gitlab-dark': {
        textColor: '#999999',
        gridBackground: '#1f1f1f',
        wallColor: '#ffffff',
        intensityColors: GITLAB_DARK
    }
};


/***/ }),

/***/ "./src/shared/providers/github-contributions.ts":
/*!******************************************************!*\
  !*** ./src/shared/providers/github-contributions.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchGithubContributions: () => (/* binding */ fetchGithubContributions)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/shared/utils/utils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const fetchGithubContributions = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = store.config.githubSettings) === null || _a === void 0 ? void 0 : _a.accessToken) {
        return yield fetchGithubContributionsGraphQL(store);
    }
    else {
        return yield fetchGithubContributionsRest(store);
    }
});
const fetchGithubContributionsRest = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const commits = [];
    let isComplete = false;
    let page = 1;
    do {
        try {
            const headers = {};
            if ((_b = store.config.githubSettings) === null || _b === void 0 ? void 0 : _b.accessToken) {
                headers['Authorization'] = 'Bearer ' + store.config.githubSettings.accessToken;
            }
            const response = yield fetch(`https://api.github.com/search/commits?q=author:${store.config.username}&sort=author-date&order=desc&page=${page}&per_page=100`, { headers });
            const data = yield response.json();
            isComplete = !data.items || data.items.length === 0;
            commits.push(...((_c = data.items) !== null && _c !== void 0 ? _c : []));
            page++;
        }
        catch (_d) {
            isComplete = true;
        }
    } while (!isComplete);
    const contributions = Array.from(commits
        .reduce((map, item) => {
        var _a, _b, _c, _d;
        const authorDateStr = (_b = (_a = item.commit.author) === null || _a === void 0 ? void 0 : _a.date) === null || _b === void 0 ? void 0 : _b.split('T')[0];
        const committerDateStr = (_d = (_c = item.commit.committer) === null || _c === void 0 ? void 0 : _c.date) === null || _d === void 0 ? void 0 : _d.split('T')[0];
        const keyDate = committerDateStr || authorDateStr;
        const count = (map.get(keyDate) || { count: 0 }).count + 1;
        return map.set(keyDate, {
            date: new Date(keyDate),
            count,
            color: '',
            level: 'NONE'
        });
    }, new Map())
        .values());
    const maxCount = Math.max(...contributions.map((el) => el.count).filter((c) => c > 0));
    return contributions.map((c) => {
        const level = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.calculateContributionLevel)(c.count, maxCount);
        const theme = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentTheme)(store);
        return {
            date: new Date(c.date),
            count: c.count,
            color: theme.intensityColors[(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.levelToIndex)(level)],
            level
        };
    });
});
const fetchGithubContributionsGraphQL = (store) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const query = /* GraphQL */ `
		query ($login: String!) {
			user(login: $login) {
				contributionsCollection {
					contributionCalendar {
						weeks {
							contributionDays {
								date
								contributionCount
								color
								contributionLevel
							}
						}
					}
				}
			}
		}
	`;
    const response = yield fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${(_e = store.config.githubSettings) === null || _e === void 0 ? void 0 : _e.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables: { login: store.config.username } })
    });
    if (!response.ok) {
        throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}`);
    }
    const json = (yield response.json());
    return json.data.user.contributionsCollection.contributionCalendar.weeks
        .map((week) => week.contributionDays)
        .reduce((acc, days) => acc.concat(days), [])
        .map((d) => {
        const level = d.contributionLevel;
        const theme = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentTheme)(store);
        return {
            date: new Date(d.date),
            count: d.contributionCount,
            color: theme.intensityColors[(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.levelToIndex)(level)],
            level
        };
    });
});


/***/ }),

/***/ "./src/shared/providers/gitlab-contributions.ts":
/*!******************************************************!*\
  !*** ./src/shared/providers/gitlab-contributions.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchGitlabContributions: () => (/* binding */ fetchGitlabContributions)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/shared/utils/utils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const fetchGitlabContributions = (store) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://v0-new-project-q1hhrdodoye-abozanona-gmailcoms-projects.vercel.app/api/contributions?username=${store.config.username}`);
    const contributionsList = yield response.json();
    const contributions = Object.entries(contributionsList).map(([date, count]) => ({
        date: new Date(date),
        count: Number(count),
        color: '',
        level: 'NONE'
    }));
    const maxCount = Math.max(...contributions.map((el) => el.count).filter((c) => c > 0));
    return contributions.map((c) => {
        const level = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.calculateContributionLevel)(c.count, maxCount);
        const theme = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentTheme)(store);
        return {
            date: new Date(c.date),
            count: c.count,
            color: theme.intensityColors[(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.levelToIndex)(level)],
            level
        };
    });
});


/***/ }),

/***/ "./src/shared/providers/providers.ts":
/*!*******************************************!*\
  !*** ./src/shared/providers/providers.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Providers: () => (/* binding */ Providers)
/* harmony export */ });
/* harmony import */ var _github_contributions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./github-contributions */ "./src/shared/providers/github-contributions.ts");
/* harmony import */ var _gitlab_contributions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gitlab-contributions */ "./src/shared/providers/gitlab-contributions.ts");


const Providers = {
    fetchGithubContributions: _github_contributions__WEBPACK_IMPORTED_MODULE_0__.fetchGithubContributions,
    fetchGitlabContributions: _gitlab_contributions__WEBPACK_IMPORTED_MODULE_1__.fetchGitlabContributions
};


/***/ }),

/***/ "./src/shared/utils/utils.ts":
/*!***********************************!*\
  !*** ./src/shared/utils/utils.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utils: () => (/* binding */ Utils),
/* harmony export */   buildGrid: () => (/* binding */ buildGrid),
/* harmony export */   buildMonthLabels: () => (/* binding */ buildMonthLabels),
/* harmony export */   calculateContributionLevel: () => (/* binding */ calculateContributionLevel),
/* harmony export */   createGridFromData: () => (/* binding */ createGridFromData),
/* harmony export */   getCurrentTheme: () => (/* binding */ getCurrentTheme),
/* harmony export */   levelToIndex: () => (/* binding */ levelToIndex)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/shared/constants.ts");

/* ─────────────────────────── Helpers ─────────────────────────── */
const weeksBetween = (start, end) => Math.floor((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
const truncateToUTCDate = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
/* ───────────────────────── Theme helpers ────────────────────── */
const getCurrentTheme = (store) => { var _a; return (_a = _constants__WEBPACK_IMPORTED_MODULE_0__.GAME_THEMES[store.config.gameTheme]) !== null && _a !== void 0 ? _a : _constants__WEBPACK_IMPORTED_MODULE_0__.GAME_THEMES['github']; };
const levelToIndex = (level) => {
    switch (level) {
        case 'NONE':
            return 0;
        case 'FIRST_QUARTILE':
            return 1;
        case 'SECOND_QUARTILE':
            return 2;
        case 'THIRD_QUARTILE':
            return 3;
        case 'FOURTH_QUARTILE':
            return 4;
        default:
            return 0;
    }
};
const calculateContributionLevel = (contribution, maxContribution) => {
    const q = maxContribution / 4;
    if (contribution === 0)
        return 'NONE';
    if (contribution < q)
        return 'FIRST_QUARTILE';
    if (contribution < 2 * q)
        return 'SECOND_QUARTILE';
    if (contribution < 3 * q)
        return 'THIRD_QUARTILE';
    return 'FOURTH_QUARTILE';
};
const buildGrid = (store) => {
    const endDate = truncateToUTCDate(new Date());
    const startDate = new Date(endDate);
    startDate.setUTCDate(endDate.getUTCDate() - 365);
    startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());
    const realWidth = 53;
    const grid = Array.from({ length: realWidth }, () => Array.from({ length: _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_HEIGHT }, () => ({
        commitsCount: 0,
        color: getCurrentTheme(store).intensityColors[0],
        level: 'NONE'
    })));
    store.contributions.forEach((c) => {
        const date = truncateToUTCDate(new Date(c.date));
        if (date < startDate || date > endDate)
            return;
        const day = date.getUTCDay();
        const week = weeksBetween(startDate, date);
        if (week >= 0 && week < realWidth) {
            const theme = getCurrentTheme(store);
            grid[week][day] = {
                commitsCount: c.count,
                color: theme.intensityColors[levelToIndex(c.level)],
                level: c.level
            };
        }
    });
    store.grid = grid;
};
const buildMonthLabels = (store) => {
    const endDate = truncateToUTCDate(new Date());
    const startDate = new Date(endDate);
    startDate.setUTCDate(endDate.getUTCDate() - 365);
    startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());
    const realWidth = weeksBetween(startDate, endDate) + 1;
    const labels = Array(realWidth).fill('');
    let lastMonth = '';
    for (let week = 0; week < realWidth; week++) {
        const date = new Date(startDate);
        date.setUTCDate(date.getUTCDate() + week * 7);
        const currentMonth = date.toLocaleString('default', { month: 'short' });
        if (currentMonth !== lastMonth) {
            labels[week] = currentMonth;
            lastMonth = currentMonth;
        }
    }
    store.monthLabels = realWidth > _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH ? labels.slice(realWidth - _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_WIDTH) : labels;
};
const createGridFromData = (store) => {
    buildGrid(store);
    return store.grid;
};
const Utils = {
    getCurrentTheme,
    buildGrid,
    buildMonthLabels,
    createGridFromData,
    levelToIndex
};


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ARCADE_GAMES: () => (/* reexport safe */ _shared_arcade_renderer__WEBPACK_IMPORTED_MODULE_5__.ARCADE_GAMES),
/* harmony export */   ArcadeRenderer: () => (/* reexport safe */ _shared_arcade_renderer__WEBPACK_IMPORTED_MODULE_5__.ArcadeRenderer),
/* harmony export */   BombermanRenderer: () => (/* reexport safe */ _bomberman_index__WEBPACK_IMPORTED_MODULE_0__.BombermanRenderer),
/* harmony export */   BreakoutRenderer: () => (/* reexport safe */ _breakout_index__WEBPACK_IMPORTED_MODULE_1__.BreakoutRenderer),
/* harmony export */   GAME_REGISTRY: () => (/* reexport safe */ _shared_arcade_renderer__WEBPACK_IMPORTED_MODULE_5__.GAME_REGISTRY),
/* harmony export */   GalagaRenderer: () => (/* reexport safe */ _galaga_index__WEBPACK_IMPORTED_MODULE_2__.GalagaRenderer),
/* harmony export */   PacmanRenderer: () => (/* reexport safe */ _pacman_index__WEBPACK_IMPORTED_MODULE_3__.PacmanRenderer),
/* harmony export */   PlayerStyle: () => (/* reexport safe */ _pacman_index__WEBPACK_IMPORTED_MODULE_3__.PlayerStyle),
/* harmony export */   PuzzleBobbleRenderer: () => (/* reexport safe */ _puzzle_bobble_index__WEBPACK_IMPORTED_MODULE_4__.PuzzleBobbleRenderer)
/* harmony export */ });
/* harmony import */ var _bomberman_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bomberman/index */ "./src/bomberman/index.ts");
/* harmony import */ var _breakout_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./breakout/index */ "./src/breakout/index.ts");
/* harmony import */ var _galaga_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./galaga/index */ "./src/galaga/index.ts");
/* harmony import */ var _pacman_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pacman/index */ "./src/pacman/index.ts");
/* harmony import */ var _puzzle_bobble_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./puzzle-bobble/index */ "./src/puzzle-bobble/index.ts");
/* harmony import */ var _shared_arcade_renderer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shared/arcade-renderer */ "./src/shared/arcade-renderer.ts");







})();

var __webpack_exports__ARCADE_GAMES = __webpack_exports__.ARCADE_GAMES;
var __webpack_exports__ArcadeRenderer = __webpack_exports__.ArcadeRenderer;
var __webpack_exports__BombermanRenderer = __webpack_exports__.BombermanRenderer;
var __webpack_exports__BreakoutRenderer = __webpack_exports__.BreakoutRenderer;
var __webpack_exports__GAME_REGISTRY = __webpack_exports__.GAME_REGISTRY;
var __webpack_exports__GalagaRenderer = __webpack_exports__.GalagaRenderer;
var __webpack_exports__PacmanRenderer = __webpack_exports__.PacmanRenderer;
var __webpack_exports__PlayerStyle = __webpack_exports__.PlayerStyle;
var __webpack_exports__PuzzleBobbleRenderer = __webpack_exports__.PuzzleBobbleRenderer;
export { __webpack_exports__ARCADE_GAMES as ARCADE_GAMES, __webpack_exports__ArcadeRenderer as ArcadeRenderer, __webpack_exports__BombermanRenderer as BombermanRenderer, __webpack_exports__BreakoutRenderer as BreakoutRenderer, __webpack_exports__GAME_REGISTRY as GAME_REGISTRY, __webpack_exports__GalagaRenderer as GalagaRenderer, __webpack_exports__PacmanRenderer as PacmanRenderer, __webpack_exports__PlayerStyle as PlayerStyle, __webpack_exports__PuzzleBobbleRenderer as PuzzleBobbleRenderer };

//# sourceMappingURL=pacman-contribution-graph.js.map