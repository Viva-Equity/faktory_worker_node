"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const faktory_1 = require("../faktory");
const client_1 = require("../client");
const worker_1 = require("../worker");
const _helper_1 = require("./_helper");
(0, _helper_1.registerCleaner)(ava_1.default);
(0, ava_1.default)("#register: returns self", (t) => {
    const faktory = (0, faktory_1.create)();
    const returned = faktory.register("test", () => { });
    t.is(faktory, returned, "`this` not returned by .register");
});
(0, ava_1.default)("#use: returns self", (t) => {
    const faktory = (0, faktory_1.create)();
    const returned = faktory.use(() => { });
    t.is(faktory, returned, "`this` not returned by .use");
});
(0, ava_1.default)("#use: throws when arg is not a function", (t) => {
    const faktory = (0, faktory_1.create)();
    t.throws(() => {
        // @ts-ignore
        faktory.use("");
    });
});
(0, ava_1.default)("#work: throws when called twice", (t) => {
    const faktory = (0, faktory_1.create)();
    faktory.work();
    t.throws(() => faktory.work(), { message: /once/ });
    faktory.stop();
});
(0, ava_1.default)(".registry returns the registry object", (t) => {
    const faktory = (0, faktory_1.create)();
    const myFunc = () => { };
    faktory.register("MyJob", myFunc);
    t.is(faktory.registry["MyJob"], myFunc, "job not found in registry");
});
(0, ava_1.default)(".connect() resolves a client", async (t) => {
    const faktory = (0, faktory_1.create)();
    const client = await faktory.connect();
    t.truthy(client instanceof client_1.Client);
});
(0, ava_1.default)(".work() creates a worker, runs, then resolves the worker", async (t) => {
    t.plan(3);
    await (0, _helper_1.mocked)(async (server, port) => {
        server
            .on("BEAT", ({ socket }) => {
            socket.write("+OK\r\n");
            t.true(true);
        })
            .on("FETCH", async ({ socket }) => {
            await (0, _helper_1.sleep)(10);
            t.true(true);
            socket.write("$-1\r\n");
        });
        const faktory = (0, faktory_1.create)();
        const worker = await faktory.work({ port, concurrency: 1 });
        t.true(worker instanceof worker_1.Worker);
        await worker.stop();
    });
});
(0, ava_1.default)("it exports Client", (t) => {
    t.is(require("../faktory").Client, client_1.Client);
});
(0, ava_1.default)("it exports Worker", (t) => {
    t.is(require("../faktory").Worker, worker_1.Worker);
});
(0, ava_1.default)("exports .connect", (t) => {
    t.is(typeof require("../faktory").connect, "function");
});
(0, ava_1.default)("exports .use", (t) => {
    t.is(typeof require("../faktory").use, "function");
});
(0, ava_1.default)("exports .register", (t) => {
    t.is(typeof require("../faktory").register, "function");
});
(0, ava_1.default)("exports .work", (t) => {
    t.is(typeof require("../faktory").work, "function");
});
(0, ava_1.default)("exports .stop", (t) => {
    t.is(typeof require("../faktory").stop, "function");
});
