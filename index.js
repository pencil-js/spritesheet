const { createCanvas, loadImage } = require("canvas");
const pack = require("bin-pack");

const { homepage, version } = require("./package.json");

const defaultOptions = {
    imageFormat: "png",
};

/**
 * @typedef {Object} Options
 * @prop {String} [imageFormat="png"] - Format of the output image (png or jpeg)
 */
/**
 * Pack some images into a spritesheet.
 * @param {Array<String>} paths - List of path to the images
 * @param {Options} [userOptions] - Some options
 * @returns {Promise<{json: Object, buffer: Buffer}>}
 */
module.exports = async (paths, userOptions) => {
    const options = {
        ...defaultOptions,
        ...userOptions,
    };

    const supportedFormat = ["png", "jpeg"];
    if (!supportedFormat.includes(options.imageFormat)) {
        const supported = JSON.stringify(supportedFormat);
        throw new Error(`imageFormat should only be one of ${supported}, but "${options.imageFormat}" was given.`);
    }

    if (!paths || !paths.length) {
        throw new Error("No file given.");
    }

    const loads = paths.map(path => loadImage(path));

    const images = await Promise.all(loads);

    const result = pack(images);

    const canvas = createCanvas(result.width, result.height);
    const context = canvas.getContext("2d");

    result.items.forEach(({ x, y, item }) => context.drawImage(item, x, y));

    const json = {
        meta: {
            app: homepage,
            version,
        },
        frames: paths.map((path, index) => {
            const { x, y, width, height } = result.items[index];
            return {
                frame: {
                    x,
                    y,
                    width,
                    height,
                    rotated: false,
                    trimmed: false,
                    spriteSourceSize: {
                        x: 0,
                        y: 0,
                        width,
                        height,
                    },
                    sourceSize: {
                        width,
                        height,
                    },
                },
            };
        }),
    };

    const buffer = canvas.toBuffer(`image/${options.imageFormat}`);

    return {
        json,
        buffer,
    };
};
