import { AnimationData } from '../../shared/types';
import { BOMBERMAN_SVG } from '../core/constants';

export const buildChangingValuesAnimation = (values: string[]): AnimationData | null => {
	const totalFrames = values.length;
	if (totalFrames <= 1) return null;

	const keyTimes: number[] = [];
	const keyValues: string[] = [];
	let lastValue: string | null = null;

	values.forEach((currentValue, index) => {
		if (currentValue === lastValue) return;

		appendKeyframe(keyTimes, keyValues, frameToKeyTime(index, totalFrames), currentValue);
		lastValue = currentValue;
	});

	if (keyTimes.length === 0) return null;

	appendFinalKeyframe(keyTimes, keyValues);

	if (keyValues.length <= 1 || keyValues.every((value) => value === keyValues[0])) return null;

	return {
		keyTimes: keyTimes.join(';'),
		values: keyValues.join(';')
	};
};

export const buildStepwiseLinearAnimation = (values: string[]): AnimationData | null => {
	const totalFrames = values.length;
	if (totalFrames <= 1) return null;

	const keyTimes: number[] = [];
	const keyValues: string[] = [];
	let lastValue: string | null = null;
	let lastChangeIndex: number | null = null;

	values.forEach((currentValue, index) => {
		if (currentValue === lastValue) return;

		if (lastValue !== null && lastChangeIndex !== null && index - 1 !== lastChangeIndex) {
			appendKeyframe(keyTimes, keyValues, frameToKeyTime(index - 1, totalFrames), lastValue);
		}

		appendKeyframe(keyTimes, keyValues, frameToKeyTime(index, totalFrames), currentValue);
		lastValue = currentValue;
		lastChangeIndex = index;
	});

	appendFinalKeyframe(keyTimes, keyValues);

	if (keyValues.length <= 1 || keyValues.every((value) => value === keyValues[0])) return null;

	return {
		keyTimes: keyTimes.join(';'),
		values: keyValues.join(';')
	};
};

export const appendKeyframe = (keyTimes: number[], values: string[], time: number, value: string) => {
	if (time === keyTimes[keyTimes.length - 1]) {
		values[values.length - 1] = value;
		return;
	}

	keyTimes.push(time);
	values.push(value);
};

export const appendFinalKeyframe = (keyTimes: number[], values: string[]) => {
	if (keyTimes[keyTimes.length - 1] !== 1) {
		keyTimes.push(1);
		values.push(values[values.length - 1]);
	}
};

export const frameToKeyTime = (frameIndex: number, totalFrames: number) =>
	Number((Math.min(frameIndex, Math.max(totalFrames - 1, 1)) / Math.max(totalFrames - 1, 1)).toFixed(BOMBERMAN_SVG.PRECISION));
