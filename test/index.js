const test = require("ava");
const spritesheet = require("..");

test("main", async (t) => {
    const fixtures = "./test/fixtures/";
    const files = [`${fixtures}clay.png`, `${fixtures}shell.png`, `${fixtures}wood.png`];

    const { json, buffer } = await spritesheet(files);

    t.is(json.frames.length, files.length);
    t.not(json.meta, undefined);
    t.not(buffer, undefined);

    await t.throwsAsync(() => spritesheet());
    await t.throwsAsync(() => spritesheet([]));

    await t.throwsAsync(() => spritesheet(["fail"]));

    await t.throwsAsync(() => spritesheet([`${fixtures}clay.png`], {
        imageFormat: "what",
    }));
});
