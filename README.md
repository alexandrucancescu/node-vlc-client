# Node VLC Client

![npm](https://img.shields.io/npm/v/vlc-client?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/vlc-client?color=crimson&style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/min/vlc-client?color=green&label=size&style=for-the-badge)


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

### .jumpForward()


### .jumpBackwards()


### .toggleFullscreen()


### .increaseVolume()


### .decreaseVolume()

## Getters

### .status(): Promise\<VlcStatus\>
Returns an object with all the info that VLC provides except playlist info

### .isPlaying(): Promise\<boolean\>


### .isPaused(): Promise\<boolean\>


### .isStopped(): Promise\<boolean\>


### .isFullscreen(): Promise\<boolean\>


### .getPlaybackState(): Promise\<string\>
State of vlc ( playing / paused / stop )

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
.getPlaylist()
</h3>
Returns an array of PlaylistEntries. 

### .getAspectRatio()


### .getSubtitleTracks()


### .getAudioTracks()


### .getVideoTracks()


### .getTracks()


### .availableAspectRations()




## License

[MIT](LICENCE)