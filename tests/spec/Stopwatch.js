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
            jasmine.clock().mockDate();
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
            stopwatch.start();
            var timeToPass = (2 * StopwatchTime.MILLISEC_IN_HOUR) + (2 * StopwatchTime.MILLISEC_IN_MIN) + (2 * StopwatchTime.MILLISEC_IN_SEC) + 1;
            jasmine.clock().tick(timeToPass);
            var time = stopwatch.getTime();
            expectTime(time, 2, 2, 2);

            var deduct = new StopwatchTime();
            deduct.sec = 1;
            deduct.min = 1;
            deduct.hour = 1;
            stopwatch.deductTime(deduct);
            var time = stopwatch.getTime();
            expectTime(time, 1, 1, 1);
        });

        it("should deduct time and account for hour change", function()
        {
            stopwatch.start();
            var timeToPass = (1 * StopwatchTime.MILLISEC_IN_HOUR) + 1;
            jasmine.clock().tick(timeToPass);
            var time = stopwatch.getTime();
            expectTime(time, 0, 0, 1);

            var deduct = new StopwatchTime();
            deduct.min = 10;
            stopwatch.deductTime(deduct);
            var time = stopwatch.getTime();
            expectTime(time, 0, 50, 0);
        });

        it("should deduct time without going past zero", function()
        {
            stopwatch.start();
            var timeToPass = (1 * StopwatchTime.MILLISEC_IN_HOUR) + 1;
            jasmine.clock().tick(timeToPass);
            var time = stopwatch.getTime();
            expectTime(time, 0, 0, 1);

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
            stopwatch.addListener(listener);
            stopwatch.start();

            jasmine.clock().tick(59000);
            expect(listener).not.toHaveBeenCalled();

            jasmine.clock().tick(1001);
            expect(listener).toHaveBeenCalled();

            jasmine.clock().tick(60000);
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