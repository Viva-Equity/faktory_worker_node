import { Middleware as KoaMiddleware } from "koa-compose";
import { Client, ClientOptions } from "./client";
import { Worker, WorkerOptions } from "./worker";
import { Job, JobPayload, JobType } from "./job";
import { Mutation } from "./mutation";
/**
 * @private
 */
export declare type JobFunctionContextWrapper = {
    (...args: unknown[]): ContextProvider;
};
/**
 * @private
 */
export declare type UnWrappedJobFunction = {
    (...args: unknown[]): unknown;
};
/**
 * @private
 */
export declare type JobFunction = JobFunctionContextWrapper | UnWrappedJobFunction;
export declare type ContextProvider = (ctx: MiddlewareContext) => unknown;
export interface MiddlewareContext {
    job: JobPayload;
    fn?: JobFunction;
}
export declare type Middleware = KoaMiddleware<MiddlewareContext>;
export declare type Registry = {
    [jobtype: string]: JobFunction;
};
export interface FaktoryControl {
    registry: Registry;
    use(fn: Middleware): FaktoryControl;
    middleware: Middleware[];
    register(name: JobType, fn: JobFunction): FaktoryControl;
    connect(options?: ClientOptions): Promise<Client>;
    work(options?: WorkerOptions): Promise<Worker>;
    stop(): Promise<void>;
    Worker: typeof Worker;
    Client: typeof Client;
    Job: typeof Job;
    Mutation: typeof Mutation;
    create: FaktoryControlCreator;
}
export declare type FaktoryControlCreator = {
    (): FaktoryControl;
};
/**
 * creates faktory singletons
 *
 * @module faktory
 */
export declare function create(): FaktoryControl;
export { Worker, WorkerOptions, Client, ClientOptions, Job, Mutation };
declare const singleton: FaktoryControl;
export default singleton;
