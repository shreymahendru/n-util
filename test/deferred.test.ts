import assert from "node:assert";
import { describe, test } from "node:test";
import { Deferred } from "../src/index.js";


await describe("Deferred Tests", async () =>
{
    await test(`Given a deferred, 
            when a then callback is chained to its promise,
            then the deferred should be able to control the execution of the callback`,
        async () =>
        {
            const deferred = new Deferred<void>();

            let callbackExecuted = false;

            const p = deferred.promise
                .then(() =>
                {
                    callbackExecuted = true;
                })
                .catch();

            assert.strictEqual(callbackExecuted, false, "callback has not executed");

            deferred.resolve();
            await p;

            assert.strictEqual(callbackExecuted, true, "callback has executed");
        });

    await test(`Given a deferred, 
            when a catch callback is chained to its promise,
            then the deferred should be able to control the execution of the callback`,
        async () =>
        {
            const deferred = new Deferred();

            let callbackExecuted = false;

            const p = deferred.promise
                .then()
                .catch(() =>
                {
                    callbackExecuted = true;
                });

            assert.strictEqual(callbackExecuted, false, "callback has not executed");

            deferred.reject();
            await p;

            assert.strictEqual(callbackExecuted, true, "callback has executed");
        });
});