import Container from '@mui/material/Container';
import { SyntheticEvent, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import ControlIcons from './video-player-controls';
import { ReactPlayerProps } from 'react-player';
import './video-player.scss'
import VideoPlayerProps from './video-player-props';

const format = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00';
    }

    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`
    } else {
        return `${mm}:${ss}`
    }
};

export default function VideoPlayer({URL}: Readonly<VideoPlayerProps>) {
    const [playerstate, setPlayerState] = useState({
        playing: true,
        muted: false,
        volume: 0.5,
        playerbackRate: 1.0,
        played: 0,
        seeking: false,
    })


    //Destructure State in other to get the values in it
    const { playing, muted, volume, playerbackRate, played } = playerstate;
    const playerRef = useRef<ReactPlayer | null>(null);
    const playerDivRef = useRef(null);

    //This function handles play and pause onchange button
    const handlePlayAndPause = () => {
        setPlayerState({ ...playerstate, playing: !playerstate.playing })
    }

    const handleMuting = () => {
        setPlayerState({ ...playerstate, muted: !playerstate.muted })
    }

    const handleRewind = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
        }
    }

    const handleFastForward = () => {
        if (playerRef.current) {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 30)
        }
    }

    const handleVolumeChange = (newValue: number) => {
        setPlayerState((prev) => ({
          ...prev,
          volume: newValue / 100,
          muted: newValue === 0,
        }));
      };

    const handleVolumeSeek = (newValue: number) => {
        setPlayerState((prev) => ({
            ...prev,
            volume: newValue / 100,
            muted: newValue === 0 ? true : false,
        }));
    };

    const handlePlayerRate = (rate : number) => {
        setPlayerState({ ...playerstate, playerbackRate: rate });
    }

    const handleFullScreenMode = () => {
        if (playerDivRef.current) {
          screenfull.toggle(playerDivRef.current);
        }
      };

    const handlePlayerProgress = (state: ReactPlayerProps) => {
        if (!playerstate.seeking) {
            setPlayerState({ ...playerstate, ...state });
        }
    }

    const handlePlayerSeek = (e: Event, newValue: number | number[], activeThumb: number) => {
        const parsedValue = Array.isArray(newValue) ? newValue[activeThumb] : newValue;
        
        setPlayerState({ ...playerstate, played: parsedValue / 100 });
      
        if (playerRef.current) {
          playerRef.current.seekTo(parsedValue / 100);
        }
      };

    const handlePlayerMouseSeekDown = () => {
        setPlayerState({ ...playerstate, seeking: true });
    }

    const handlePlayerMouseSeekUp = (event: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
        setPlayerState({ ...playerstate, seeking: false });
      
        const parsedValue = Array.isArray(value) ? value[0] : value;
      
        if (playerRef.current) {
          playerRef.current.seekTo(parsedValue / 100);
        }
      };

    const currentPlayerTime = playerRef.current ? playerRef.current.getCurrentTime() : 0;
    const movieDuration = playerRef.current ? playerRef.current.getDuration() : 0;

    const playedTime = format(currentPlayerTime);
    const fullMovieTime = format(movieDuration);

    return (
            <Container maxWidth="md">
                <div className='playerDiv' ref={playerDivRef}>
                    <ReactPlayer width={'100%'} height='100%'
                        ref={playerRef}
                        url={URL}
                        playing={playing}
                        volume={volume}
                        playbackRate={playerbackRate}
                        onProgress={handlePlayerProgress}
                        muted={muted}
                        type="video/mp4"  />

                    <ControlIcons
                        key={volume.toString()}
                        playandpause={handlePlayAndPause}
                        playing={playing}
                        rewind={handleRewind}
                        fastForward={handleFastForward}
                        muting={handleMuting}
                        muted={muted}
                        volumeChange={handleVolumeChange}
                        volumeSeek={handleVolumeSeek}
                        volume={volume}
                        playerbackRate={playerbackRate}
                        playRate={handlePlayerRate}
                        fullScreenMode={handleFullScreenMode}
                        played={played}
                        onSeek={handlePlayerSeek}
                        onSeekMouseUp={handlePlayerMouseSeekUp}
                        onSeekMouseDown={handlePlayerMouseSeekDown}
                        playedTime={playedTime}
                        fullMovieTime={fullMovieTime}
                    />
                </div>
            </Container>
    );
}