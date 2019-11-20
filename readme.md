# @pencil.js/spritesheet
Pack some images into a spritesheet.

## Install

    npm install @pencil.js/spritesheet

## Usage

```js
const spritesheet = require("@pencil.js/spritesheet");

const files = ["image1.png", "image2.png", "image3.png"];
const { json, image } = await spritesheet(files);
```

## CLI

    spritesheet <files> [<options>]

### Options

    --path, -p          Path where to output files      (default: ./)
    --name, -n          Name for the files              (default: spritesheet)
    --imageFormat, -f   Result image format             (default: png)
    --cwd, -c           Base directory for all images   (default: ./)
    --silent, -s        Don't log success               (default: false)

### Example

    $ spritesheet *.png -cwd ./src/images/ --path ./dist/assets --name icons

## License

[MIT](license)
