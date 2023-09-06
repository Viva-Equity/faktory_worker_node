"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightedRandom = exports.strictlyOrdered = void 0;
function strictlyOrdered(queues) {
    return () => {
        return queues;
    };
}
exports.strictlyOrdered = strictlyOrdered;
function weightedRandom(queuesAndWeights) {
    const raffleDrum = Object.entries(queuesAndWeights).flatMap(([queue, weight]) => new Array(weight).fill(queue));
    return () => {
        return Array.from(new Set(shuffle(raffleDrum)));
    };
}
exports.weightedRandom = weightedRandom;
// https://stackoverflow.com/a/2450976/3543371
function shuffle(input) {
    if (input.length === 0)
        return input;
    const shuffled = Array.from(input);
    let currentIndex = shuffled.length;
    let randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [shuffled[currentIndex], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[currentIndex],
        ];
    }
    return shuffled;
}
