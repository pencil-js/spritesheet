import Canvas from "canvas";
import cropping from "detect-edges";
import pack from "bin-pack";
import pkg from "./package.json";

const { homepage, version } = pkg;

const { loadImage, createCanvas } = Canvas;

const defaultOptions = {
    outputFormat: "png",
    margin: 1,
    crop: true,
};

/**
 * @typedef {Object} Options
 * @prop {String} [outputFormat="png"] - Format of the output image ("png" or "jpeg")
 * @prop {Number} [margin=1] - Added pixels between sprites
 * @prop {Boolean} [crop=true] - Cut transparent pixels around sprites
 */
/**
 * Pack some images into a spritesheet.
 * @param {Array<String>} paths - List of paths to the images
 * @param {Options} [options] - Some options
 * @returns {Promise<{json: Object, buffer: Buffer}>}
 */
export default async (paths, options) => {
    const { outputFormat, margin, crop } = {
        ...defaultOptions,
        ...options,
    };

    if (!paths || !paths.length) {
        throw new Error("No file given.");
    }

    const supportedFormat = ["png", "jpeg"];
    if (!supportedFormat.includes(outputFormat)) {
        const supported = JSON.stringify(supportedFormat);
        throw new Error(`outputFormat should only be one of ${supported}, but "${outputFormat}" was given.`);
    }

    const loads = paths.map(path => loadImage(path));
    const images = await Promise.all(loads);

    const playground = createCanvas();
    const playgroundContext = playground.getContext("2d");

    const data = await Promise.all(images.map(async (source) => {
        const { width, height } = source;
        playground.width = width;
        playground.height = height;
        playgroundContext.drawImage(source, 0, 0);

        const cropped = crop ? await cropping(playground) : {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
        return {
            width: (width - cropped.left - cropped.right) + margin,
            height: (height - cropped.top - cropped.bottom) + margin,
            source,
            cropped,
        };
    }));

    const { items, width, height } = pack(data);

    const canvas = createCanvas(width + margin, height + margin);
    const context = canvas.getContext("2d");

    items.forEach(({ x, y, item }) => {
        context.drawImage(item.source, x - item.cropped.left + margin, y - item.cropped.top + margin);
    });

    const json = {
        // Global data about the generated file
        meta: {
            app: homepage,
            version,
            size: {
                w: width,
                h: height,
            },
            scale: 1,
        },
        frames: items
            .sort((a, b) => a.item.source.src.localeCompare(b.item.source.src))
            .reduce((acc, { x, y, width: w, height: h, item }) => {
                acc[item.source.src] = {
                    // Position and size in the spritesheet
                    frame: {
                        x: x + margin,
                        y: y + margin,
                        w: w - margin,
                        h: h - margin,
                    },
                    rotated: false,
                    trimmed: Object.values(item.cropped).some(value => value > 0),
                    // Relative position and size of the content
                    spriteSourceSize: {
                        x: item.cropped.left,
                        y: item.cropped.top,
                        w: w - margin,
                        h: h - margin,
                    },
                    // File image sizes
                    sourceSize: {
                        w: item.source.width,
                        h: item.source.height,
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
