const test = require("ava");
const spritesheet = require("..");

test("main", async (t) => {
    const fixtures = "./test/fixtures/";
    const files = [`${fixtures}clay.png`, `${fixtures}shell.png`, `${fixtures}wood.png`];

    const { json, image } = await spritesheet(files);

    t.deepEqual(Object.keys(json.frames), files);
    t.not(json.meta, undefined);
    t.true(image instanceof Buffer);

    await t.throwsAsync(() => spritesheet());
    await t.throwsAsync(() => spritesheet([]));

    await t.throwsAsync(() => spritesheet(["fail"]));

    await t.throwsAsync(() => spritesheet([`${fixtures}clay.png`], {
        imageFormat: "what",
    }));
});
