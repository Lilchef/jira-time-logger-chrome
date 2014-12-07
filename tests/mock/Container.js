/**
 * Container.js file
 *
 * Contains the Container mock class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Container/Abstract'
], function(
    Abstract
) {

    /**
     * Container mock class
     *
     * @extends Container/Abstract
     * @constructor
     */
    function Container()
    {
        Abstract.call(this);
    }

    Container.prototype = Object.create(Abstract.prototype);

    /**
     * Get the application instance
     *
     * @returns App
     */
    Container.prototype.getAppInstance = function()
    {
        return undefined;
    };

    /**
     * Get the config instance
     *
     * @returns Config
     */
    Container.getConfigInstance = function()
    {
        return undefined;
    };

    /**
     * Get the application version number
     *
     * @returns String
     */
    Container.prototype.getVersion = function()
    {
        return '0.0.0';
    };

    /**
     * Show the configuration options
     *
     */
    Container.prototype.showConfiguration = function()
    {
        // No-op
    };

    /**
     * Close the configuration options
     *
     */
    Container.prototype.closeConfiguration = function()
    {
        // No-op
    };

    /**
     * Handle a configuration change
     *
     */
    Container.prototype.configurationChanged = function()
    {
        // No-op
    };

    /**
     * Open the given URL
     *
     * @param String url
     */
    Container.prototype.openURL = function(url)
    {
        // No-op
    };

    /**
     * Handle a fatal error
     *
     * @param String exception The exception message that was thrown, if any
     */
    Container.prototype.fatal = function(exception)
    {
        // NoOp
    };

    /**
     * Create and dispatch a custom event
     *
     * @param String name
     * @param Array additional Zero or more items to pass to the listeners
     */
    Container.prototype.dispatchEvent = function(name, additional)
    {
        // No-op
    };

    /**
     * Create a listener for a custom event
     *
     * Overridden from the Abstract as there's different window contexts in play
     * with a Chrome extension so standard events wont work, have to use Chrome's
     * messaging system.
     *
     * @param String name
     * @param Function callback
     */
    Container.prototype.registerCustomEventListener = function(name, callback)
    {
        // No-op
    };

    return new Container();
});