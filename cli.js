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

    const paths = input.reduce((acc, val) => {
        if (hasMagic(val)) {
            return acc.concat(sync(val, {
                nodir: true,
            }));
        }

        acc.push(val);
        return acc;
    }, []);

    if (!paths.length) {
        cli.showHelp();
        return;
    }

    const { json, buffer } = await spritesheet(paths, flags);

    mkdirSync(flags.path, {
        recursive: true,
    });

    const imagePath = `${flags.path}${sep}${flags.name}.${flags.imageFormat}`;
    const jsonPath = `${flags.path}${sep}${flags.name}.json`;

    json.meta.image = relative(dirname(jsonPath), imagePath);

    writeFileSync(imagePath, buffer);
    log("✔️ Image created");

    writeFileSync(jsonPath, JSON.stringify(json));
    log("✔️ JSON created");
};

const cli = meow(`
    Usage
        $ spritesheet <globPattern> [options]

    Options
        --path, -p          Path where to output files  (default: ./)
        --name, -n          Name for the files          (default: spritesheet)
        --imageFormat, -f   Result image format         (default: png)
        --silent, -s        Don't log success

    Example
        $ spritesheet src/images/*.png -p dist/assets -n icons
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
        silent: {
            alias: "s",
            type: "boolean",
            default: false,
        },
    },
});

run(cli);
