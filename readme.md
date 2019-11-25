# @pencil.js/spritesheet

[![Package version](https://flat.badgen.net/npm/v/@pencil.js/spritesheet)](https://www.npmjs.com/package/@pencil.js/spritesheet)

Pack a set of images into a single spritesheet along its json description file.

## Install

    npm install @pencil.js/spritesheet

## Usage

```js
const spritesheet = require("@pencil.js/spritesheet");

// List of files to pack
const files = ["image1.png", "image2.png", "image3.png"];
// Call the async function and extract the json and image values
const { json, image } = await spritesheet(files);
```

## Documentation

### `spritesheet(files, [options])`
#### args
The methods accept two arguments.

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
|files |`Array<String>` |required |List of paths to the images |
|options |`Object` | `{ imageFormat: "png" }` |Some options |

##### options
You can specify some options on the second argument.

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
|imageFormat |`String` |`"png"` |Format of the output image (`"png"` or `"jpeg"`) |

#### returns
`spritesheet` returns a `Promise` for an `Object` containing a `json` and `image` field.

| Name | Type | Comment |
| --- | --- | --- |
|json |`Object` |All data related to the spritesheet |
|image |`Buffer` |The result image as a buffer |

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
