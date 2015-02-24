/**
 * StopwatchTime.js file
 * 
 * Contains the StopwatchTime class.
 * 
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2013
 */

define([], function()
{

    /**
     * StopwatchTime class
     *
     * Represents a time in hours, minutes and seconds
     *
     * @constructor
     */
    function StopwatchTime()
    {
        
    }

    /*
     * Alias
     */
    var Time = StopwatchTime;

    /*
     * Constants
     */
    Time.MILLISEC_IN_HOUR = 36e5;
    Time.MILLISEC_IN_MIN = 6e4;
    Time.MILLISEC_IN_SEC = 1000;

    /*
     * Static methods
     */

    /**
     * Create an instance of StopwatchTime from a number of milliseconds
     *
     * @param Integer ms
     * @returns StopwatchTime
     */
    Time.fromMilliseconds = function(ms)
    {
        var time = new StopwatchTime();
        time.hour = Math.floor(ms / Time.MILLISEC_IN_HOUR);
        time.min = Math.floor((ms % Time.MILLISEC_IN_HOUR) / Time.MILLISEC_IN_MIN);
        time.sec = Math.floor((ms % Time.MILLISEC_IN_MIN) / Time.MILLISEC_IN_SEC);
        return time;
    };

    /*
     * Public instance variables
     */

    /**
     * @type Integer
     */
    Time.prototype.sec = 0;

    /**
     * @type Integer
     */
    Time.prototype.min = 0;

    /**
     * @type Integer
     */
    Time.prototype.hour = 0;

    /*
     * Public instance methods
     */

    Time.prototype.toMilliseconds = function()
    {
        var ms = 0;
        ms += (this.hour * Time.MILLISEC_IN_HOUR);
        ms += (this.min * Time.MILLISEC_IN_MIN);
        ms += (this.sec * Time.MILLISEC_IN_SEC);
        return ms;
    };

    Time.prototype.toWholeMinutes = function()
    {
        var mins = 0;
        mins += this.min;
        mins += this.hour * 60;
        return mins;
    };

    return StopwatchTime;
});