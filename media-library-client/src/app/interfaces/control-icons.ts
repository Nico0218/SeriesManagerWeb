import { SyntheticEvent } from "react";

export default interface ControlIconsProps {
	playandpause: () => void;
	playing: boolean;
	rewind: () => void;
	fastForward: () => void;
	muting: () => void;
	muted: boolean;
	volumeChange: (newValue: number) => void;
	volumeSeek: (newValue: number) => void;
	volume: number;
	playRate: (rate: number) => void;
	playerbackRate: number;
	fullScreenMode: () => void;
	onSeek: (event: Event, value: number | number[], activeThumb: number) => void;
	played: number;
	onSeekMouseUp: (event: Event | SyntheticEvent<Element, Event>, value: number | number[]) => void;
	onSeekMouseDown: () => void;
	fullMovieTime: string;
	playedTime: string;
}