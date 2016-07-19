/**
 * Factory.js file
 *
 * Contains the Factory class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'require',
    'Container/Abstract',
    'Container/ChromeExt',
    'Container/ChromeApp'
], function(
   require,
   Abstract
) {

    /**
     * Factory class
     *
     * Handles creation of container objects.
     * Primarily exists so the rest of the code doesn't need to know or care which specific container we're using.
     * Not strictly a Factory as we don't create a new one every time, more of an Instance Manager.
     *
     * @constructor
     */
    function Factory()
    {
        /**
         * @type Container/Abstract
         * @private
         */
        var container;

        /**
         * Get the container instance
         *
         * @returns Container/Abstract
         */
        this.getContainer = function()
        {
            return container;
        };

        /**
         *
         * @param Container/Abstract newContainer
         * @returns self
         */
        this.setContainer = function(newContainer)
        {
            container = newContainer;
            return this;
        };
    }

    /**
     * @constant
     */
    Factory.DEFAULT_TYPE = 'ChromeApp';

    /**
     * Get the container
     *
     * @throws error if the container cannot be loaded or does not extend the Abstract
     * @returns Container/Abstract
     */
    Factory.prototype.get = function()
    {
        if (this.getContainer()) {
            return this.getContainer();
        }

        var container = require('Container/'+Factory.DEFAULT_TYPE);
        if (!container || !(container instanceof Abstract)) {
            throw 'Container/Factory::get encountered invalid Container object';
        }
        this.setContainer(container);

        return container;
    };

    return new Factory();
});