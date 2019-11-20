#!/usr/bin/env node
const { writeFileSync, mkdirSync } = require("fs");
const { sep, relative, dirname } = require("path");
const meow = require("meow");
const { hasMagic, sync } = require("glob");
const spritesheet = require(".");

const run = async (cli) => {
    const { input, flags } = cli;

    const log = (...args) => {
        if (!flags.silent) {
            console.log(...args);
        }
    };

    if (!input.length) {
        cli.showHelp();
        return;
    }

    const startingWD = process.cwd();
    process.chdir(flags.cwd);

    const paths = input.reduce((acc, val) => {
        if (hasMagic(val)) {
            return acc.concat(sync(val, {
                nodir: true,
            }));
        }

        acc.push(val);
        return acc;
    }, []);

    log(`Packing ${paths.length} files ...`);

    const { json, buffer } = await spritesheet(paths, flags);

    const imagePath = `${flags.path}${sep}${flags.name}.${flags.imageFormat}`;
    const jsonPath = `${flags.path}${sep}${flags.name}.json`;

    json.meta.image = relative(dirname(jsonPath), imagePath);

    process.chdir(startingWD);

    mkdirSync(flags.path, {
        recursive: true,
    });

    writeFileSync(imagePath, buffer);
    log("✔️ Image created");

    writeFileSync(jsonPath, JSON.stringify(json));
    log("✔️ JSON created");
};

const cli = meow(`
    Usage
        $ spritesheet <globPattern> [options]

    Options
        --path, -p          Path where to output files      (default: ./)
        --name, -n          Name for the files              (default: spritesheet)
        --imageFormat, -f   Result image format             (default: png)
        --cwd, -c           Base directory for all images   (default: ./)
        --silent, -s        Don't log success               (default: false)

    Example
        $ spritesheet *.png -cwd ./src/images/ --path ./dist/assets --name icons
`, {
    flags: {
        path: {
            alias: "p",
            type: "string",
            default: "./",
        },
        name: {
            alias: "n",
            type: "string",
            default: "spritesheet",
        },
        imageFormat: {
            alias: "f",
            type: "string",
            default: "png",
        },
        cwd: {
            alias: "c",
            type: "string",
            default: "./",
        },
        silent: {
            alias: "s",
            type: "boolean",
            default: false,
        },
    },
});

run(cli);
