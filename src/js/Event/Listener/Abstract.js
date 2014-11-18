/**
 * Abstract.js file
 *
 * Contains the Abstract class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Container/Factory'
], function(
    containerFactory
) {

    /**
     * Abstract class
     *
     * Common Event Listener code
     *
     * @constructor
     * @abstract
     */
    function Abstract()
    {
        /**
         * @type Container/Abstract
         * @private
         */
        var container = containerFactory.get();

        /**
         * Get the container object
         *
         * @returns Container/Abstract
         */
        this.getContainer = function()
        {
            return container;
        };
    }

    /**
     * Register a listener for a custom event
     *
     * Helper method
     *
     * @param String name
     * @param Function callback
     */
    Abstract.prototype._registerCustomEventListener = function(name, callback)
    {
        this.getContainer().registerCustomEventListener(name, callback);
    };

    return Abstract;
});