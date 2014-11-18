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
     * Instance public variables
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

    return StopwatchTime;
});