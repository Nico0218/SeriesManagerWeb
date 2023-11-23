import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { SliderProps } from '@mui/material/Slider';
import React, { SyntheticEvent, useState } from 'react';
import './video-player.scss';
import IconButtonWrapper from '../../../../../../custom-components/icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../../../../../../custom-components/icon-loader/icon-selector';

interface ControlIconsProps {
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

const ControlIcons = ({
	playandpause,
	playing,
	rewind,
	fastForward,
	muting,
	muted,
	volumeChange,
	volumeSeek,
	volume,
	playRate,
	playerbackRate,
	fullScreenMode,
	onSeek,
	played,
	onSeekMouseUp,
	onSeekMouseDown,
	fullMovieTime,
	playedTime,
}: ControlIconsProps) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();

	const handleClose = () => {
		setAnchorEl(undefined);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'playbackrate-popover' : undefined;

	function ValueLabelComponent(props: SliderProps) {
		const { children, value } = props;

		const validChildren = React.isValidElement(children) ? children : <span>{value}</span>;

		return (
			<Tooltip enterTouchDelay={0} placement="top" title={value}>
				{validChildren}
			</Tooltip>
		);
	}

	const PrettoSlider = styled(Slider)({
		height: 5,
		'& .MuiSlider-track': {
			border: 'none',
		},
		'& .MuiSlider-thumb': {
			height: 16,
			width: 16,
			backgroundColor: '#fff',
			border: '2px solid currentColor',
			'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
				boxShadow: 'inherit',
			},
			'&:before': {
				display: 'none',
			},
		},
		'& .MuiSlider-valueLabel': {
			lineHeight: 1.2,
			fontSize: 12,
			background: 'unset',
			padding: 0,
			width: 32,
			height: 32,
			borderRadius: '50% 50% 50% 0',
			backgroundColor: '#52af77',
			transformOrigin: 'bottom left',
			transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
			'&:before': { display: 'none' },
			'&.MuiSlider-valueLabelOpen': {
				transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
			},
			'& > *': {
				transform: 'rotate(45deg)',
			},
		},
	});

	function handlePopOver(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
		if (event && event.currentTarget) {
			setAnchorEl(event.currentTarget);
		}
	}

	return (
		<div className="controls__div">
			<Grid
				container
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				style={{ padding: 16 }}
			>
				<Grid item xs={12}>
					<PrettoSlider
						min={0}
						max={100}
						value={played * 100}
						onChange={onSeek}
						onMouseDown={onSeekMouseDown}
						onChangeCommitted={onSeekMouseUp}
						valueLabelDisplay="auto"
						// aria-label="custom thumb label"
						components={{
							ValueLabel: ValueLabelComponent,
						}}
					/>
					<Grid container direction="row" justifyContent="space-between">
						<Typography style={{ color: 'white' }}>{playedTime}</Typography>
						<Typography style={{ color: 'white' }}>{fullMovieTime}</Typography>
					</Grid>
				</Grid>

				<Grid item xs={12}>
					<Grid container alignItems="center" direction="row">
						<IconButtonWrapper id={'rewind'} icon={IconSelector.FastRewind} onClick={rewind} />
                        <div>
                        {playing ? (
								<IconButtonWrapper id={'play'} icon={IconSelector.Pause} onClick={playandpause} />
							) : (
								<IconButtonWrapper id={'pause'} icon={IconSelector.PlayArrow} onClick={playandpause} />
							)}
                        </div>
                        
                        <IconButtonWrapper id={'forward'} icon={IconSelector.FastForward} onClick={fastForward} />
                        <div>
                        {muted ? (
								<IconButtonWrapper id={'volume-off'} icon={IconSelector.VolumeUp} onClick={muting} />
							) : (
								<IconButtonWrapper id={'volume-up'} icon={IconSelector.VolumeOff} onClick={muting} />
							)}
                        </div>

						{/* <IconButton className="controls__icons" aria-label="reqind" onClick={playandpause}>
							{playing ? (
								<PauseSharp fontSize="large" style={{ color: 'white' }} />
							) : (
								<PlayArrowSharp fontSize="large" style={{ color: 'white' }} />
							)}
						</IconButton> */}

						<Typography style={{ color: '#fff', paddingTop: '5px' }}>
							{Math.ceil(volume * 100)}
						</Typography>
						<Slider
							min={0}
							max={100}
							value={volume * 100} // Assuming volume is between 0 and 1
							onChange={(event: Event | SyntheticEvent<Element, Event>, value: number | number[]) =>
								volumeChange(value as number)
							}
							onChangeCommitted={(
								event: Event | SyntheticEvent<Element, Event>,
								value: number | number[]
							) => volumeSeek(value as number)}
							className="volume__slider"
						/>

						<Button variant="text" onClick={handlePopOver} className="bottom__icons">
							<Typography>{playerbackRate}X</Typography>
						</Button>

						<Popover
							id={id}
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
						>
							<Grid container direction="column-reverse">
								{[0.5, 1, 1.5, 2].map(rate => (
									<Button variant="text" onClick={() => playRate(rate)}>
										<Typography color={rate === playerbackRate ? 'secondary' : 'default'}>
											{rate}
										</Typography>
									</Button>
								))}
							</Grid>
						</Popover>

                        <IconButtonWrapper id={'full-screen'} icon={IconSelector.Fullsccreen} onClick={fullScreenMode} />
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default ControlIcons;
