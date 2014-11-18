/**
 * Logger.js file
 *
 * Contains the Logger class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([], function()
{
    /**
     * Logger class
     *
     * @constructor
     */
    function Logger()
    {

    }

    /**
     * Log out at debug-level
     *
     * @param string message
     * @returns self
     */
    Logger.prototype.debug = function(message)
    {
        console.log(message);
        return this;
    };

    /**
     * Log out at info-level
     *
     * @param string message
     * @returns self
     */
    Logger.prototype.info = function(message)
    {
        console.info(message);
        return this;
    };

    /**
     * Log out at warn-level
     *
     * @param string message
     * @returns self
     */
    Logger.prototype.warn = function(message)
    {
        console.warn(message);
        return this;
    };

    /**
     * Log out at error-level
     *
     * @param string message
     * @returns self
     */
    Logger.prototype.error = function(message)
    {
        console.error(message);
        return this;
    };
    
    /**
     * Log out a stack trace
     * 
     * @returns self
     */
    Logger.prototype.trace = function()
    {
        console.trace();
        return this;
    };

    return new Logger();
});