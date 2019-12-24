const { createCanvas, loadImage } = require("canvas");
const pack = require("bin-pack");

const { homepage, version } = require("./package.json");

const defaultOptions = {
    outputFormat: "png",
    margin: 1,
    crop: false, // TODO
};

/**
 * @typedef {Object} Options
 * @prop {String} [outputFormat="png"] - Format of the output image ("png" or "jpeg")
 */
/**
 * Pack some images into a spritesheet.
 * @param {Array<String>} paths - List of paths to the images
 * @param {Options} [options] - Some options
 * @returns {Promise<{json: Object, buffer: Buffer}>}
 */
module.exports = async (paths, options) => {
    const { outputFormat, margin } = {
        ...defaultOptions,
        ...options,
    };

    const supportedFormat = ["png", "jpeg"];
    if (!supportedFormat.includes(outputFormat)) {
        const supported = JSON.stringify(supportedFormat);
        throw new Error(`outputFormat should only be one of ${supported}, but "${outputFormat}" was given.`);
    }

    if (!paths || !paths.length) {
        throw new Error("No file given.");
    }

    const loads = paths.map(path => loadImage(path));
    const images = await Promise.all(loads);

    const { items, width, height } = pack(images);

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    items.forEach(({ x, y, item }) => context.drawImage(item, x, y));

    const json = {
        meta: {
            app: homepage,
            version,
            size: {
                w: width,
                h: height,
            },
            scale: 1,
        },
        frames: paths.reduce((acc, path, index) => {
            const { x, y, width: w, height: h } = items[index];
            acc[path] = {
                frame: {
                    x,
                    y,
                    w,
                    h,
                },
                rotated: false,
                trimmed: false,
                spriteSourceSize: {
                    x: 0,
                    y: 0,
                    w,
                    h,
                },
                sourceSize: {
                    w,
                    h,
                },
            };
            return acc;
        }, {}),
    };

    const image = canvas.toBuffer(`image/${outputFormat}`);

    return {
        json,
        image,
    };
};
