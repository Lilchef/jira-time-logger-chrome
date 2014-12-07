/**
 * Stopwatch.js file
 *
 * Contains tests for the Stopwatch class
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

/*
 * Jasq and Jasmine.clock don't play nice together, have to go without Jasq
 */
define(["Stopwatch", "StopwatchTime"], function (stopwatch, StopwatchTime)
{
    describe("The Stopwatch", function ()
    {
        beforeEach(function()
        {
            jasmine.clock().install();
        });

        afterEach(function()
        {
            stopwatch.stop();
            stopwatch.reset();
            jasmine.clock().uninstall();
        });

        it("should return an instance of StopwatchTime", function()
        {
            var time = stopwatch.getTime();
            expect(typeof time).toEqual('object');
            expect(time instanceof StopwatchTime).toBe(true);
        });

        it("should tick once started", function()
        {
            stopwatch.start();
            var time = stopwatch.getTime();
            expectTime(time, 0, 0, 0);

            jasmine.clock().tick(1001);

            time = stopwatch.getTime();
            expectTime(time, 1, 0, 0);

            stopwatch.stop();
        });

        it("should stop ticking once stopped", function()
        {
            stopwatch.start();
            var time = stopwatch.getTime();
            expectTime(time, 0, 0, 0);

            jasmine.clock().tick(1001);

            time = stopwatch.getTime();
            expectTime(time, 1, 0, 0);

            stopwatch.stop();

            jasmine.clock().tick(1001);

            time = stopwatch.getTime();
            expectTime(time, 1, 0, 0);
        });

        it("should reset", function()
        {
            stopwatch.start();
            jasmine.clock().tick(1001);

            var time = stopwatch.getTime();
            expectTime(time, 1, 0, 0);

            stopwatch.reset();
            time = stopwatch.getTime();
            expectTime(time, 0, 0, 0);
        });

        it("should round time", function()
        {
            var time = new StopwatchTime();
            time.sec = 31;
            var roundedTime = stopwatch.roundTime(time, 'min');
            expectTime(roundedTime, 0, 1, 0);

            var time2 = new StopwatchTime();
            time2.min = 31;
            var roundedTime2 = stopwatch.roundTime(time2, 'hour');
            expectTime(roundedTime2, 0, 0, 1);

            var time3 = new StopwatchTime();
            time3.sec = 31;
            time3.min = 59;
            var roundedTime3 = stopwatch.roundTime(time3, 'min');
            expectTime(roundedTime3, 0, 0, 1);
        });

        it("should deduct time", function()
        {
            var setTime = new StopwatchTime();
            setTime.sec = 2;
            setTime.min = 2;
            setTime.hour = 2;
            stopwatch.setTime(setTime);

            var deduct = new StopwatchTime();
            deduct.sec = 1;
            deduct.min = 1;
            deduct.hour = 1;
            stopwatch.deductTime(deduct);
            var time = stopwatch.getTime();
            expectTime(time, 1, 1, 1);

            deduct.sec = 0;
            deduct.min = 10;
            deduct.hour = 0;
        });

        it("should deduct time and account for hour change", function()
        {
            var setTime = new StopwatchTime();
            setTime.sec = 0;
            setTime.min = 0;
            setTime.hour = 1;
            stopwatch.setTime(setTime);

            var deduct = new StopwatchTime();
            deduct.min = 10;
            stopwatch.deductTime(deduct);
            var time = stopwatch.getTime();
            expectTime(time, 0, 50, 0);
        });

        it("should deduct time without going past zero", function()
        {
            var setTime = new StopwatchTime();
            setTime.sec = 0;
            setTime.min = 0;
            setTime.hour = 1;
            stopwatch.setTime(setTime);

            var deduct = new StopwatchTime();
            deduct.min = 1;
            deduct.hour = 1;
            stopwatch.deductTime(deduct);
            var time = stopwatch.getTime();
            expectTime(time, 0, 0, 0);
        });

        it("should notify listeners on minute change", function()
        {
            var listener = jasmine.createSpy('listener');
            stopwatch.addMinListener(listener);
            stopwatch.start();

            jasmine.clock().tick(59000);
            expect(listener).not.toHaveBeenCalled();

            jasmine.clock().tick(1001);
            expect(listener).toHaveBeenCalled();

            jasmine.clock().tick(60000);
            expect(listener.calls.count()).toEqual(2);
        });

        it("should notify listeners on hour change", function()
        {
            var listener = jasmine.createSpy('listener');
            stopwatch.addHourListener(listener);
            stopwatch.start();

            // 35400ms === 59m
            jasmine.clock().tick(3540000);
            expect(listener).not.toHaveBeenCalled();

            jasmine.clock().tick(60001);
            expect(listener).toHaveBeenCalled();

            jasmine.clock().tick(3600000);
            expect(listener.calls.count()).toEqual(2);
        });

        function expectTime(time, sec, min, hour)
        {
            expect(time.sec).toEqual(sec);
            expect(time.min).toEqual(min);
            expect(time.hour).toEqual(hour);
        }
    });
});