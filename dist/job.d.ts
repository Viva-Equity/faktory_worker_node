import { Client } from "./client";
export declare type JobType = string;
/**
 * @private
 */
export interface JobCustomParams {
    [propName: string]: unknown;
}
/**
 * @private
 */
export declare type PartialJobPayload = {
    jid?: string;
    jobtype: string;
    queue?: string | undefined;
    args?: unknown[];
    priority?: number;
    retry?: number;
    custom?: JobCustomParams;
    at?: Date | string;
    reserve_for?: number;
};
/**
 * @private
 */
export declare type JobDefaults = {
    queue: string;
    args: Array<unknown>;
    priority: number;
    retry: number;
};
/**
 * @private
 */
export declare type JobPayload = PartialJobPayload & JobDefaults & {
    jid: string;
    jobtype: string;
};
/**
 * A class wrapping a {@link JobPayload|JobPayload}
 *
 * Creating and pushing a job is typically accomplished by using
 * a faktory client, which implements `.job` and automatically
 * sets the client for the job when calling `.push` on the job later.
 *
 * You do not need to use this class directly.`
 *
 * @example <caption>with a faktory client</caption>
 * // with a client
 * const client = await faktory.connect();
 * const job = client.job('SendWelcomeEmail', id);
 */
export declare class Job {
    client: Client;
    payload: JobPayload;
    /**
     * Creates a job
     *
     * @param  {string} jobtype {@link Jobtype|Jobtype} string
     * @param  {Client} [client]  a client to use for communicating to the server (if calling push)
     */
    constructor(jobtype: string, client: Client);
    get jid(): string;
    /**
     * sets the jid
     *
     * @param  {string} value the >8 length jid
     * @see  JobPayload
     */
    set jid(value: string);
    get jobtype(): string;
    set jobtype(value: string);
    get queue(): string;
    /**
     * sets the queue
     *
     * @param  {string} value queue name
     * @see  JobPayload
     */
    set queue(value: string);
    get args(): unknown[];
    /**
     * sets the args
     *
     * @param  {Array} value array of positional arguments
     * @see  JobPayload
     */
    set args(args: unknown[]);
    get priority(): number;
    /**
     * sets the priority of this job
     *
     * @param  {number} value 0-9
     * @see  JobPayload
     */
    set priority(value: number);
    get retry(): number;
    /**
     * sets the retry count
     *
     * @param  {number} value {@see JobPayload}
     * @see  JobPayload
     */
    set retry(value: number);
    get at(): Date | string | undefined;
    /**
     * sets the scheduled time
     *
     * @param  {Date|string} value the date object or RFC3339 timestamp string
     * @see  JobPayload
     */
    set at(value: Date | string | undefined);
    get reserveFor(): number | undefined;
    /**
     * sets the reserveFor parameter
     *
     * @param  {number} value
     * @see  JobPayload
     */
    set reserveFor(value: number | undefined);
    get custom(): JobCustomParams | undefined;
    /**
     * sets the custom object property
     *
     * @param  {object} value the custom data
     * @see  JobPayload
     */
    set custom(custom: JobCustomParams | undefined);
    /**
     * Generates an object from this instance for transmission over the wire
     *
     * @return {object} the job as a serializable javascript object
     *                      @link JobPayload|JobPayload}
     * @see  JobPayload
     */
    toJSON(): PartialJobPayload;
    /**
     * Pushes this job to the faktory server. Modifications after this point are not
     * persistable to the server
     *
     * @return {string} return of client.push(job)
     */
    push(): Promise<string>;
    static get defaults(): JobDefaults;
    /**
     * generates a uuid
     *
     * @return {string} a uuid/v4 string
     */
    static jid(): string;
}
