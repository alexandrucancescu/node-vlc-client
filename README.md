# Node VLC Client

![npm](https://img.shields.io/npm/v/vlc-client?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/vlc-client?color=crimson&style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/min/vlc-client?color=green&label=size&style=for-the-badge)
![Travis (.org)](https://img.shields.io/travis/alexandrucancescu/node-vlc-client?logo=travis-ci&logoColor=ffd700&style=for-the-badge)

An intuitive library to control VLC with simple function calls 
using VLC's own HTTP interface, written in typescript.

## Features

- [x] Play, Pause, Seek
- [x] Get and set time, length, volume
- [x] Playlist manipulation (add, remove, next, prev)
- [x] Get and set audio, subtitle delay
- [x] Add/Change video, audio, subs streams
- [ ] Auto polling for changes
- [ ] Audio eq, effects
- [ ] VLC instances discovery on the network

## Installation

```shell script
npm install --save vlc-client
```

## Usage

**Typescript**
```typescript
import * as VLC from "vlc-client"

const vlc = new VLC.Client({
    ip: "localhost",
    port: 8080,
    username: "steve_aoki", //username is optional
    password: "edm"
});
```

**Javascript**
```typescript
const VLC = require("vlc-client");

const vlc = new VLC.Client({
    ip: "localhost",
    port: 8080,
    username: "steve_aoki", //username is optional
    password: "edm"
});
```

All methods on the Client class are async
```typescript
await vlc.isPlaying();

await vlc.pause();

await vlc.setTime(3100);
```

## API

### VLC.Client
```typescript
new VLC.Client(options);
```

**options**:
- **ip**: the ip of the computer where VLC is running
- **port**: port of VLC web interface
- **username**: username of VLC web interface
- **password**: password of VLC web interface

## **Methods**

## Actions
### .play()
Resume the playback if paused

### .pause()
Pause the playback

### .togglePlay()
Pauses if playing, and resumes the playback if paused

### .stop()
Stops the playback

### .next()
Play the next media in playlist

### .previous()
Play the previous media in playlist

### .emptyPlaylist()
Removes all entries from the playlist

### .removeFromPlaylist(id: number)
Removes the item with the given id from palylist.  
To get the id see [**.getPlaylist()**](#getPlaylist).

### .playFromPlaylist(entryId: number)
Play an entry from playlist by id.  
To get the id see [**.getPlaylist()**](#getPlaylist).

### .jumpForward(seconds: number)
Seek playback forward by given seconds

### .jumpBackwards(seconds: number)
Seek playback backwards by given seconds

### .toggleFullscreen()
Toggle if VLC is fullscreen

### .increaseVolume(increaseBy: number)
Increase the volume by given int, range 0-100

### .decreaseVolume()
Decrease the volume by given int, range 0-100

## Getters

### .status() -> VlcStatus
Returns an object with all the info that VLC provides except playlist info

### .isPlaying()
Returns true/false if is playing

### .isPaused()
Returns true/false if is paused

### .isStopped()
Returns true/false if is stopped

### .isFullscreen()
Returns true/false if VLC is fullscreen

### .getPlaybackState()
State of vlc ( playing / paused / stop ) as string

### .getTime()
Time of playback in seconds

### .getProgress()
Media playback progress from 0-100

### .getLength()
Length of the current media playing in seconds

### .getVolume()
Get the volume in a 0-100 range

### .getVolumeRaw()
Get the current volume as VLC represents it
from 0-512, where 256 is 100% and 512 is 200%

### .getAudioDelay()
Audio delay from video stream in seconds

### .getSubtitleDelay()
Subtitle delay from video stream in seconds

<h3 id="getPlaylist">
.getPlaylist() -> <a href="#PlaylistEntry">
        PlaylistEntry[]
    </a>
</h3>

Get the entries in the playlist 

### .getAspectRatio()
Returns as string the current aspect ratio

### .getSubtitleTracks() -> [SubtitleTrack[]](#tracks)
Get subtitle tracks.

### .getAudioTracks() -> [AudioTrack[]](#audiotrack)
Get audio tracks.

### .getVideoTracks() -> [VideoTrack[]](#videotrack)
Get video tracks.

### .getTracks() -> [Tracks](#tracks)
Get all tracks/streams including video, audio, subtitles.

### .getChapters() -> number[]
Returns an array of numbers representing all the chapters
of a movie. Usually starts at 0.

### .getCurrentChapter() -> number
Returns the current chapter of a video that is playing.

### .availableAspectRations(): string[]
Returns **synchronous** an array of all the available aspect ratios
as string array.

## Setters

### .setTime(time: number)
Set the time of playback. Time arg should be an int. 

### .setProgress(progress: number)
Set progress of media playback 0-100 range.
Progress can be a number with decimals.

### .setVolume(volume: number)
Set the volume range 0-100.

### .setVolumeRaw()
Set volume as VLC represents it 0-512

### .setFullscreen(val: boolean)
Set if VLC should be fullscreen

### .setAspectRation(ar: string)
Set the aspect ratio of video.
To get a list of available aspect ratios
use **.availableAspectRations()**.

## Types

### PlaylistEntry
```typescript
interface PlaylistEntry{
	name: string;
	id: number;
	duration: number;
	uri: string;
	isCurrent: boolean;
}
```

### Tracks
```typescript
interface Tracks {
    video: VideoTrack[],
    audio: AudioTrack[],
    subtitle: SubtitleTrack[],
}
```

### VideoTrack
```typescript
interface VideoTrack {
    streamIndex: number,
    Type: "Audio" | "Video" | "Subtitle",
    Language?: string,
    Codec?: string,
    Frame_rate: string,
    Decoded_format: string,
    Video_resolution: string,
    Buffer_dimensions: string,
    Orientation: string,
}
```
### AudioTrack
```typescript
interface AudioTrack {
    streamIndex: number,
    Type: "Audio" | "Video" | "Subtitle",
    Language?: string,
    Codec?: string,
    Channels: string,
    Bits_per_sample: string,
    Sample_rate: string
}
```
### SubtitleTrack
```typescript
interface SubtitleTrack {
    streamIndex: number,
    Type: "Audio" | "Video" | "Subtitle",
    Language?: string,
    Codec?: string,
}
```


## License

[MIT](LICENCE)
