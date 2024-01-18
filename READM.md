# Test in Colyseus & Phaser 3.7

Source code built with Phaser + Colyseus.

- [Phaser Tutorial](https://phaser.io/)
- [See Colyseus documentation](https://docs.colyseus.io/)

## How to run the **server**

- Download and install [Node.js LTS](https://nodejs.org/en/download/)
- Clone or download this repository.
- Run the following commands:

```
cd server
npm install
npm start
```

The WebSocket server should be available locally at `ws://localhost:2567` ([http://localhost:2567](http://localhost:2567) should be accessible.)

## How to run the **client**

In a new Terminal tab, run the following commands:

```
cd client
npm install
npm start
```

The client should be accessible at [`http://localhost:5173`](`http://localhost:5173`).

### Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served from the root. For example: http://localhost:8000/images/my-image.png

Example `public` structure maybe:

```
    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...
```

They can then be loaded by Phaser with `this.image.load('my-image', 'images/my-image.png')`.

## License

- Source-code is licensed under [MIT License](https://github.com/ourcade/phaser3-vite-template/blob/master/LICENSE).
- The [assets](https://www.kenney.nl/assets/pixel-shmup) are licensed under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
