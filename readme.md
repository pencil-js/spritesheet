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

        --path, -p          Path where to output files  (default: ./)
        --name, -n          Name for the files          (default: spritesheet)
        --imageFormat, -f   Result image format         (default: png)
        --silent, -s        Don't log success

### Example

    $ spritesheet src/images/*.png -p dist/assets -n icons

## License

[MIT](license)
