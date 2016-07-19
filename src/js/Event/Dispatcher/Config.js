/**
 * Config.js file
 *
 * Contains the Config class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Event/Dispatcher/Abstract',
    'ConfigConstants'
], function(
    Abstract,
    Constants
) {

    /**
     * Config class
     *
     * Dispatch events pertaining to config
     *
     * @constructor
     */
    function Config()
    {
        Abstract.call(this);
    }

    Config.prototype = Object.create(Abstract.prototype);

    /**
     * Trigger the config initialised event
     *
     * @param String forContext Where the config is being initialised
     */
    Config.prototype.configInitialised = function(forContext)
    {
        this.dispatchEvent(Constants.EVENT_INITIALISED+'_'+forContext);
    };

    /**
     * Trigger the config changed event
     */
    Config.prototype.configChanged = function()
    {
        this.dispatchEvent(Constants.EVENT_CHANGED);
    };

    return new Config();
});