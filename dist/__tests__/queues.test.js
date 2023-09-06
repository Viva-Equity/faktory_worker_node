"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const queues_1 = require("../queues");
(0, ava_1.default)("strictlyOrdered: always returns queues in order", (t) => {
    const qfn = (0, queues_1.strictlyOrdered)(["one", "two", "three"]);
    t.deepEqual(qfn(), ["one", "two", "three"]);
    for (let iterations = 0; iterations < 10; iterations++) {
        t.deepEqual(qfn(), ["one", "two", "three"]);
    }
});
(0, ava_1.default)("weightedRandom: always returns all queues", (t) => {
    const qfn = (0, queues_1.weightedRandom)({
        one: 1,
        ten: 10,
        twenty: 20,
    });
    t.deepEqual(qfn().sort(), ["one", "ten", "twenty"].sort());
    for (let iterations = 0; iterations < 10; iterations++) {
        t.deepEqual(qfn().sort(), ["one", "ten", "twenty"].sort());
    }
});
