/**
 * stopwatch.js file
 * 
 * Contains the Stopwatch class.
 * 
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2013
 */

define([
   'StopwatchTime'
], function(
    StopwatchTime
) {

    /**
     * Stopwatch class
     *
     * @constructor
     */
    function Stopwatch()
    {
        /**
         * @type Date
         * @private
         */
        var start = null;
        /**
         * @type Date
         * @private
         */
        var end = null;
        /**
         * @type Integer
         * @private
         */
        var interval = null;
        /**
         * @type Array
         * @private
         */
        var listeners = [];

        /**
         * Get the start time
         *
         * @returns Date
         * @private
         */
        this.getStart = function()
        {
            return start;
        };

        /**
         * Set the start time
         *
         * @param Date newStart
         * @returns self
         */
        this.setStart = function(newStart)
        {
            start = newStart;
            return this;
        };

        /**
         * Get the end time
         *
         * @returns Date
         * @private
         */
        this.getEnd = function()
        {
            return end;
        };

        /**
         * Set the end time
         *
         * @param Date newEnd
         * @returns self
         */
        this.setEnd = function(newEnd)
        {
            end = newEnd;
            return this;
        };

        /**
         * Get the interval identifier
         *
         * @returns Integer
         */
        this.getInterval = function()
        {
            return interval;
        };

        /**
         * Set the interval identifier
         *
         * @param Integer newInterval
         * @returns self
         */
        this.setInterval = function(newInterval)
        {
            interval = newInterval;
            return this;
        };

        /**
         * Clear the interval identifier
         *
         * @returns self
         */
        this.clearInterval = function()
        {
            interval = null;
            return this;
        };

        /**
         * Get the listeners
         *
         * @returns Array
         */
        this.getListeners = function()
        {
            return listeners;
        };

        /**
         * Add a listener
         *
         * @param function
         * @returns self
         * @throws error if passed anything other than a function
         */
        this.addListener = function(listener)
        {
            if (!(listener instanceof Function)) {
                throw 'Stopwatch.addListener called with non-Function';
            }
            listeners.push(listener);
            return this;
        };

        /**
         * Check if there are some listeners
         *
         * @returns Boolean
         */
        this.hasListeners = function()
        {
            return (listeners.length > 0);
        };

        this.reset();
    }

    /**
     * Start the clock
     *
     * @returns self
     */
    Stopwatch.prototype.start = function()
    {
        if (this.getInterval()) {
            return this;
        }
        this.reset();
        this.setStart(new Date());
        var self = this;
        var interval = setInterval(function ()
        {
            return self._tick();
        },
        StopwatchTime.MILLISEC_IN_MIN);
        this.setInterval(interval);

        return this;
    };

    /**
     * Stop the clock
     *
     * @param Boolean reset (Optional) Reset the time?
     * @returns self
     */
    Stopwatch.prototype.stop = function(reset)
    {
        if (!this.getInterval()) {
            return this;
        }
        clearInterval(this.getInterval());
        this.clearInterval();
        if (reset) {
            this.reset();
        } else {
            this.setEnd(new Date());
        }

        return this;
    };

    /**
     * Reset the clock
     *
     * @returns self
     */
    Stopwatch.prototype.reset = function()
    {
        this.setStart(null);
        this.setEnd(null);

        return this;
    };

    /**
     * Restart the stopwatch
     *
     * Helper method
     *
     * @returns self
     */
    Stopwatch.prototype.restart = function()
    {
        this.stop(true).start();

        return this;
    };

    /**
     * Get the time passed since start/reset was called
     *
     * @param String (Optional) Either hour or min to round to the nearest of
     * @returns StopwatchTime
     */
    Stopwatch.prototype.getTime = function(round)
    {
        var start = this.getStart();
        if (!start) {
            return new StopwatchTime();
        }
        var end = this.getEnd() || new Date();
        var diffMS = end - start;

        var time = StopwatchTime.fromMilliseconds(diffMS);

        if (round) {
            time = this.roundTime(time, round);
        }
        return time;
    };

    /**
     * Round a time to the nearest minute or hour
     *
     * @param StopwatchTime time
     * @param String Either hour or min (or nothing) to round to the nearest of
     * @returns StopwatchTime Modified time
     */
    Stopwatch.prototype.roundTime = function(time, round)
    {
        if (round == 'min') {
            var currSec = time.sec;
            time.sec = 0;
            if (currSec >= 30) {
                time.min++;
                if (time.min == 60) {
                    time.min = 0;
                    time.hour++;
                }
            }
        } else if (round == 'hour') {
            var currMin = time.min;
            time.min = 0;
            if (currMin >= 30) {
                time.hour++;
            }
        }

        return time;
    };

    /**
     * Deduct some time from the elapsed time
     *
     * @param StopwatchTime time
     * @returns self
     */
    Stopwatch.prototype.deductTime = function(time)
    {
        var deductMs = time.toMilliseconds();
        var newStart = new Date(this.getStart().getTime() + deductMs);
        var now = new Date();
        if (newStart.getTime() > now.getTime()) {
            newStart = now;
        }

        this.setStart(newStart);
        this._notifyListeners();

        return this;
    };

    /*
     * Private methods
     * No such thing in JavaScript, it's just conceptual
     */

    /**
     * Tick over an interval period
     *
     * @private
     */
    Stopwatch.prototype._tick = function()
    {
        this._notifyListeners();
    };

    /**
     * Notify listeners that time has passed
     *
     * @private
     */
    Stopwatch.prototype._notifyListeners = function()
    {
        if (!this.hasListeners()) {
            return;
        }

        var time = this.getTime();
        var listeners = this.getListeners();
        for (var count in listeners) {
            var listener = listeners[count];
            listener(time);
        }
    };

    return new Stopwatch();
});