/**
 * Abstract.js file
 *
 * Contains the Abstract class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([], function()
{

    /**
     * Abstract class
     *
     * Acts as a Container 'interface'.
     * All Container classes should extend this.
     *
     * @constructor
     * @abstract
     */
    function Abstract()
    {

    };

    /**
     * Get the application instance
     *
     * @returns App
     */
    Abstract.prototype.getAppInstance = function()
    {
        throw 'Container/Abstract.getAppInstance must be overridden';
    };

    /**
     * Get the config instance
     *
     * @returns Config
     */
    Abstract.getConfigInstance = function()
    {
        throw 'Container/Abstract.getConfigInstance must be overridden';
    };

    /**
     * Get the application version number
     *
     * @returns String
     */
    Abstract.prototype.getVersion = function()
    {
        throw 'Container/Abstract.getVersion must be overridden';
    };

    /**
     * Show the configuration options
     * 
     */
    Abstract.prototype.showConfiguration = function()
    {
        throw 'Container/Abstract.showConfiguration must be overridden';
    };

    /**
     * Close the configuration options
     *
     */
    Abstract.prototype.closeConfiguration = function()
    {
        throw 'Container/Abstract.closeConfiguration must be overridden';
    };

    /**
     * Handle a configuration change
     * 
     */
    Abstract.prototype.configurationChanged = function()
    {
        throw 'Container/Abstract.configurationChanged must be overridden';
    };

    /**
     * Open the given URL
     *
     * @param String url
     */
    Abstract.prototype.openURL = function(url)
    {
        throw 'Container/Abstract.openUrl must be overridden';
    };

    /**
     * Handle a fatal error
     *
     * @param String exception The exception message that was thrown, if any
     */
    Abstract.prototype.fatal = function(exception)
    {
        throw 'Container/Abstract.fatal must be overridden';
    };

    /**
     * Create and dispatch a custom event
     *
     * Can be overriden if a container needs to handle bespoke events differently
     *
     * @param String name
     * @param Array additional Zero or more items to pass to the listeners
     */
    Abstract.prototype.dispatchEvent = function(name, additional)
    {
        var data = {detail: []};
        if (additional) {
            data.details = additional;
        }
        document.dispatchEvent(new Event(name, data));
    };

    /**
     * Create a listener for a custom event
     *
     * Can be overriden if a container needs to handle bespoke events differently
     *
     * @param String name
     * @param Function callback
     */
    Abstract.prototype.registerCustomEventListener = function(name, callback)
    {
        document.addEventListener(name, callback);
    };

    // Child classes should return a singleton here
    return Abstract;
});