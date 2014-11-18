/**
 * Abstract.js file
 *
 * Contains the Abstract class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Container/Factory',
], function(
    containerFactory
) {

    /**
     * Abstract class
     *
     * Common Event Dispatcher code
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
     * Dispatch an event
     *
     * Helper method
     *
     * @param String name
     * @param Array additional Zero or more items to pass to the listeners
     */
    Abstract.prototype.dispatchEvent = function(name, additional)
    {
        this.getContainer().dispatchEvent(name, additional);
    };

    return Abstract;
});