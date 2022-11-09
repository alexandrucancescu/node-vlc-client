# Node VLC Client

![npm](https://img.shields.io/npm/v/vlc-client?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/vlc-client?color=crimson&style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/min/vlc-client?color=green&label=size&style=for-the-badge)
![Travis (.org)](https://img.shields.io/travis/alexandrucancescu/node-vlc-client?logo=travis-ci&logoColor=ffd700&style=for-the-badge)

An intuitive library to control VLC with simple function calls 
using VLC's own HTTP interface, written in typescript. Covers almost all
of VLC's functions that can be controlled with the HTTP interface

## Features

- [x] Play, Pause, Seek
- [x] Get and set time, length, volume, shuffle, repeat, loop
- [x] Playlist manipulation (add, remove, next, prev)
- [x] Get and set audio, subtitle delay
- [x] Change subtitle and audio tracks
- [x] Add/Change video, audio, subs streams
- [x] Request album art
- [x] Lots of helper methods
- [x] Browse for files
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

# API

## Contents

- [Actions](#actions)
- [Getters](#getters)
- [Setters](#setters)
- [Types](#types)

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
To get the id see [**.getPlaylist()**](#getplaylist--playlistentry).

### .playFromPlaylist(entryId: number)
Play an entry from playlist by id.  
To get the id see [**.getPlaylist()**](#getplaylist--playlistentry).

### .addToPlaylist(uri: string)
Add a file to playlist using an URI.
Can be file, http, rtsp, etc. Anything 
VLC supports.

### .playFile(uri: string, options)
Play a file by specifing URI. Adds a
file to the playlist and plays it imediately.
Only one of the noaudio/novideo options can
be set.

**options**:
- **noaudio**: _boolean_
- **novideo**: _boolean_
- **wait**: _boolean_ - If set to true, the promise 
will only return after vlc opens the file.
- **timeout**: _number_ - Set the timeout in ms to wait
for vlc to open the file. **Default** = **3000**

The options object is optional

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

### .browse(dir: string) => [VlcFile](#vlcfile)
Browse the remote computer running the VLC instance
for files in a given directory.  
Default dir: /

## Getters

### .status() => VlcStatus
Returns an object with all the info that VLC provides except playlist info

### .meta() => [VlcMeta](#vlcmeta)
Returns an object with various informations about the current media playing.

### .getFileName() => string
Returns the file name of the current media playing

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

### .getPlaylist() => [PlaylistEntry[]](#playlistentry)

Get the entries in the playlist 

### .getAspectRatio()
Returns as string the current aspect ratio

### .getSubtitleTracks() => [SubtitleTrack[]](#tracks)
Get subtitle tracks.

### .getAudioTracks() => [AudioTrack[]](#audiotrack)
Get audio tracks.

### .getVideoTracks() => [VideoTrack[]](#videotrack)
Get video tracks.

### .getTracks() => [Tracks](#tracks)
Get all tracks/streams including video, audio, subtitles.

### .getChapters() => number[]
Returns an array of numbers representing all the chapters
of a movie. Usually starts at 0.

### .getCurrentChapter() => number
Returns the current chapter of a video that is playing.

### .availableAspectRations(): string[]
Returns **synchronous** an array of all the available aspect ratios
as string array.

### .isLooping() => boolean
Return true if VLC's loop function is activated

### .isRandom() => boolean
Return true if items in playlist are played in random order. Random is same as shuffle.

### .isRepeating() => boolean
Return true if repeat is on.

### .getPlaybackRate() => number
Playback rate. Normal speed is 1. Range 0.25 - 4.

### .getAlbumArt(playlistEntryId?: number) => [AlbumArtResult](#albumartresult)
Returns the album art of an item in the playlist.  
If **playlistEntryId** is not specified, returns the album art of the current item that is playing.  
Returns **null** if the media has no album art.

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

### .setRepeating(shouldRepeat: boolean)
Set if playlist entries should be repeated.

### .setLooping(shouldLoop: boolean)
Set if VLC's looping function should be activated

### .setRandom(random: boolean)
Set if playlist entries should be played in random order

### .setPlaybackRate(rate: number)
Playback rate. Normal speed is 1. Range 0.25 - 4

### .setSubtitleDelay(delay: number)
Set a delay in seconds, can have decimals, of
the subtitle track from video track.

### .setAudioDelay(delay: number)
Set a delay in seconds, can have decimals, of
the audio track from video track.

### .setChapter(chapter: number)
Set the chapter of the movie playing.  
See [.getChapters](#getchapters--number)

### .setAudioTrack(trackId: number)
Select the audio track. Get the audio tracks id from [.getTracks()](#gettracks--tracks) or [.getAudioTracks](#getaudiotracks--audiotrack).

### .setSubtitleTrack(trackId: number)
Select the sub track. Get the sub tracks id from [.getTracks()](#gettracks--tracks) or [.getSubtitleTracks](#getsubtitletracks--subtitletrack).

### .setVideoTrack(trackId: number)
Select the video track. Get the video track id from [.getTracks()](#gettracks--tracks) or [.getVideoTracks](#getvideotracks--videotrack).

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

### AlbumArtResult

```typescript
interface AlbumArtResult {
	contentType: string, // image/jpeg , image/png , etc
	buffer: Buffer, // album art image as buffer
}
```

### VlcMeta

```typescript
interface VlcMeta{
	showName?: string, //optional
	seasonNumber?: string, //optional
	episodeNumber?: string, //optional
	filename:string,
    [key: string]: string,
    ... // much more properties
}
```

### VlcFile
```typescript
export enum VlcFileType {
	FILE = "file",
	DIR = "dir"
}

export interface VlcFile {
	type: VlcFileType,
	path: string,
	name: string,
	access_time: number,
	uid: number,
	creation_time: number,
	gid: number,
	modification_time: number,
	mode: number,
	uri: string,
	size: number;
}
```


## License

[MIT](LICENSE)
