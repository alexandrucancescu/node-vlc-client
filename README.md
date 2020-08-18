# Node VLC Client

![npm](https://img.shields.io/npm/v/vlc-client?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/vlc-client?color=crimson&style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/min/vlc-client?color=green&label=size&style=for-the-badge)


An intuitive library to control VLC with simple function calls 
using VLC's own HTTP interface, written in typescript.

### Features

- [x] Play, Pause, Seek
- [x] Get and set time, length, volume
- [x] Playlist manipulation (add, remove, next, prev)
- [x] Get and set audio, subtitle delay
- [x] Add/Change video, audio, subs streams
- [ ] Auto polling for changes
- [ ] Audio eq, effects
- [ ] VLC instances discovery on the network

### Installation

```shell script
npm install --save vlc-client
```

### Usage

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

### API

#### VLC.Client
```typescript
new VLC.Client(options);
```

**options**:
- **ip**: the ip of the computer where VLC is running
- **port**: port of VLC web interface
- **username**: username of VLC web interface
- **password**: password of VLC web interface


### License

[MIT](LICENCE)