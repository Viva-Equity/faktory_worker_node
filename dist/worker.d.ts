/// <reference types="node" />
import { Middleware as KoaMiddleware } from "koa-compose";
import { EventEmitter } from "events";
import { JobPayload, JobType } from "./job";
import { Client, ClientOptions } from "./client";
export declare type Registry = {
    [jobtype: string]: JobFunction;
};
export declare type JobFunctionContextWrapper = {
    (...args: unknown[]): ContextProvider;
};
export declare type UnWrappedJobFunction = {
    (...args: unknown[]): unknown;
};
export declare type JobFunction = JobFunctionContextWrapper | UnWrappedJobFunction;
export declare type ContextProvider = (ctx: MiddlewareContext) => unknown;
export interface MiddlewareContext {
    job: JobPayload;
    fn?: JobFunction;
}
export declare type Middleware = KoaMiddleware<MiddlewareContext>;
export declare type WorkerOptions = {
    wid?: string;
    concurrency?: number;
    timeout?: number;
    beatInterval?: number;
    queues?: string[] | {
        [name: string]: number;
    } | (() => string[]);
    middleware?: Middleware[];
    registry?: Registry;
    poolSize?: number;
} & ClientOptions;
/**
 * Representation of a worker process with many concurrent job processors. Works at the
 * concurrency set in options during construction. Will hold at most `concurrency` jobs
 * in-memory while processing at any one time. Listens for signals to quiet or shutdown.
 * Should not be started more than once per-process, nor should more than one worker be
 * started per-process.
 *
 * @example
 * const worker = new Worker({
 *   queues: ['critical', 'default', 'low'],
 * });
 *
 * worker.work();
 */
export declare class Worker extends EventEmitter {
    readonly wid: string;
    private concurrency;
    private shutdownTimeout;
    private beatInterval;
    private readonly queueFn;
    readonly middleware: Middleware[];
    private readonly registry;
    private quieted;
    private working;
    private execute;
    private pulse;
    readonly client: Client;
    /**
     * @param {object} [options]
     * @param  {String} [options.wid=uuid().slice(0, 8)]: the wid the worker will use
     * @param  {Number} [options.concurrency=20]: how many jobs this worker can process at once
     * @param  {Number} [options.shutdownTimeout=8]: the amount of time in seconds that the worker
     *                                             may take to finish a job before exiting
     *                                             ungracefully
     * @param  {Number} [options.beatInterval=15]: the amount of time in seconds between each
     *                                             heartbeat
     * @param  {string[]} [options.queues=['default']]: the queues this worker will fetch jobs from
     * @param  {function[]} [options.middleware=[]]: a set of middleware to run before performing
     *                                               each job
     *                                       in koa.js-style middleware execution signature
     * @param  {Registry} [options.registry=Registry]: the job registry to use when working
     * @param {Number} [options.poolSize=concurrency+2] the client connection pool size for
     *                                                  this worker
     */
    constructor(options?: WorkerOptions);
    private tick;
    /**
     * starts the worker fetch loop and job processing
     *
     * @return self, when working has been stopped by a signal or concurrent
     *                        call to stop or quiet
     * @see  Worker.quiet
     * @see  Worker.stop
     */
    work(): Promise<Worker>;
    /**
     * Signals to the worker to discontinue fetching new jobs and allows the worker
     * to continue processing any currently-running jobs
     */
    quiet(): void;
    /**
     * stops the worker
     *
     * @return {promise} resolved when worker stops
     */
    stop(): Promise<void>;
    /**
     * Sends a heartbeat for this server and interprets the response state (if present)
     * to quiet or terminate the worker
     */
    beat(): Promise<void>;
    get queues(): string[];
    /**
     * Fetches a job from the defined queues.
     *
     * @private
     * @return {JobPayload|null} a job payload from the server or null when there are
     *                             no jobs
     */
    private fetch;
    /**
     * Handles a job from the server by executing it and either acknowledging
     * or failing the job when done
     *
     * @private
     * @param  {JobPayload} job the job payload from the server
     * @return {Promise<string>} 'ack' or 'fail' depending on job handling resu
     */
    private handle;
    /**
     * Adds a middleware function to the stack
     *
     * @param  {Function} fn koa-compose-style middleware function
     * @return {FaktoryControl}      this
     * @instance
     * @see  {@link https://github.com/koajs/koa/blob/master/docs/guide.md#writing-middleware|koa middleware}
     * @example
     * faktory.use(async (ctx, next) => {
     *   // a pool you created to hold database connections
     *   pool.use(async (conn) => {
     *     ctx.db = conn;
     *     await next();
     *   });
     * });
     */
    use(fn: Middleware): Worker;
    onerror(error: Error): void;
    /**
     * Adds a {@link JobFunction|JobFunction} to the {@link Registry}
     *
     * @param  {Jobtype}   name string descriptor for the jobtype
     * @param  {JobFunction} fn
     * @return {FaktoryControl}        this
     * @instance
     * @example
     * faktory.register('MyJob', (...args) => {
     *   // some work
     * });
     */
    register(name: JobType, fn: JobFunction): Worker;
    /**
     * @private
     */
    private trapSignals;
    private static removeSignalHandlers;
}
