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
         * @type StopwatchTime
         * @private
         */
        var time = null;
        /**
         * @type Integer
         * @private
         */
        var interval = null;
        /**
         * @type Array
         * @private
         */
        var secListeners = [];
        /**
         * @type Array
         * @private
         */
        var minListeners = [];
        /**
         * @type Array
         * @private
         */
        var hourListeners = [];

        /**
         * Get the time
         *
         * @returns StopwatchTime
         */
        this.getTime = function()
        {
            return time;
        };

        /**
         * Set the time
         *
         * @param StopwatchTime newTime
         * @returns self
         * @throws error if passed anything other than a StopwatchTime
         */
        this.setTime = function(newTime)
        {
            if (!(newTime instanceof StopwatchTime)) {
                throw 'Stopwatch.setTime called with non-StopwatchTime';
            }
            time = newTime;
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
         * Get the second listeners
         *
         * @returns Array
         */
        this.getSecListeners = function()
        {
            return secListeners;
        };

        /**
         * Add a second listener
         *
         * @param function
         * @returns self
         * @throws error if passed anything other than a function
         */
        this.addSecListener = function(listener)
        {
            if (!(listener instanceof Function)) {
                throw 'Stopwatch.addListener called with non-Function';
            }
            secListeners.push(listener);
            return this;
        };

        /**
         * Check if there are some second listeners
         *
         * @returns Boolean
         */
        this.hasSecListeners = function()
        {
            return (secListeners.length > 0);
        };

        /**
         * Get the minute listeners
         *
         * @returns Array
         */
        this.getMinListeners = function()
        {
            return minListeners;
        };

        /**
         * Add a minute listener
         *
         * @param function
         * @returns self
         * @throws error if passed anything other than a function
         */
        this.addMinListener = function(listener)
        {
            if (!(listener instanceof Function)) {
                throw 'Stopwatch.addListener called with non-Function';
            }
            minListeners.push(listener);
            return this;
        };

        /**
         * Check if there are some minute listeners
         *
         * @returns Boolean
         */
        this.hasMinListeners = function()
        {
            return (minListeners.length > 0);
        };

        /**
         * Get the hour listeners
         *
         * @returns Array
         */
        this.getHourListeners = function()
        {
            return hourListeners;
        };

        /**
         * Add a hour listener
         *
         * @param function
         * @returns self
         * @throws error if passed anything other than a function
         */
        this.addHourListener = function(listener)
        {
            if (!(listener instanceof Function)) {
                throw 'Stopwatch.addListener called with non-Function';
            }
            hourListeners.push(listener);
            return this;
        };

        /**
         * Check if there are some hour listeners
         *
         * @returns Boolean
         */
        this.hasHourListeners = function()
        {
            return (hourListeners.length > 0);
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
        if (!this.getTime().sec) {
            this.reset();
        }
        var self = this;
        var interval = setInterval(function ()
        {
            return self._tick();
        },
        1000);
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
        var time = new StopwatchTime();
        this.setTime(time);

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
     * Get the elapsed time
     *
     * @param String (Optional) Either hour or min to round to the nearest of
     * @returns StopwatchTime
     */
    Stopwatch.prototype.getTime = function(round)
    {
        var time = this.getTime();
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
        var currTime = this.getTime();
        var secChanged = false;
        var minChanged = false;
        var hourChanged = false;

        if (time.hour) {
            currTime.hour -= time.hour;
            hourChanged = true;

            if (currTime.hour < 0) {
                currTime.hour = 0;
            }
        }
        if (time.min) {
            currTime.min -= time.min;
            minChanged = true;

            if (currTime.min < 0) {
                if (currTime.hour > 0) {
                    currTime.min += 60;
                    currTime.hour--;
                    hourChanged = true;
                } else {
                    currTime.min = 0;
                }
            }
        }
        if (time.sec) {
            currTime.sec -= time.sec;
            secChanged = true;

            if (currTime.sec < 0) {
                if (currTime.min > 0) {
                    currTime.sec += 60;
                    currTime.min--;
                    minChanged = true;
                } else {
                    currTime.sec = 0;
                }
            }
        }

        this.setTime(currTime);

        // Listeners
        if (secChanged) {
            this._notifySecListeners();
        }
        if (minChanged) {
            this._notifyMinListeners();
        }
        if (hourChanged) {
            this._notifyHourListeners();
        }

        return this;
    };

    /*
     * Private methods
     * No such thing in JavaScript, it's just conceptual
     */

    /**
     * Tick over a second
     *
     * @private
     */
    Stopwatch.prototype._tick = function()
    {
        var currTime = this.getTime();
        var secChanged = false;
        var minChanged = false;
        var hourChanged = false;

        // Seconds
        currTime.sec++;
        secChanged = true;

        // Minutes
        if (currTime.sec == 60) {
            currTime.sec = 0;
            currTime.min++;
            minChanged = true;
        }

        // Hours
        if (currTime.min == 60) {
            currTime.min = 0;
            currTime.hour++;
            hourChanged = true;
        }

        this.setTime(currTime);

        // Listeners
        if (secChanged) {
            this._notifySecListeners();
        }
        if (minChanged) {
            this._notifyMinListeners();
        }
        if (hourChanged) {
            this._notifyHourListeners();
        }
    };

    /**
     * Notify listeners that the seconds have changed
     *
     * @private
     */
    Stopwatch.prototype._notifySecListeners = function()
    {
        if (this.hasSecListeners()) {
            var listeners = this.getSecListeners();
            for (var count in listeners) {
                var listener = listeners[count];
                listener(this.getTime());
            }
        }
    };

    /**
     * Notify listeners that the minutes have changed
     *
     * @private
     */
    Stopwatch.prototype._notifyMinListeners = function()
    {
        if (this.hasMinListeners()) {
            var listeners = this.getMinListeners();
            for (var count in listeners) {
                var listener = listeners[count];
                listener(this.getTime());
            }
        }
    };

    /**
     * Notify listeners that the hours have changed
     *
     * @private
     */
    Stopwatch.prototype._notifyHourListeners = function()
    {
        if (this.hasHourListeners()) {
            var listeners = this.getHourListeners();
            for (var count in listeners) {
                var listener = listeners[count];
                listener(this.getTime());
            }
        }
    };

    return new Stopwatch();
});