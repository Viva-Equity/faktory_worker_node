export declare function strictlyOrdered(queues: string[]): () => string[];
export declare function weightedRandom(queuesAndWeights: {
    [string: string]: number;
}): () => string[];
