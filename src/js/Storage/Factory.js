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
    'Storage/Abstract',
    'Storage/ChromeExt'
], function(
   require,
   Abstract
) {

    /**
     * Factory class
     *
     * Handles creation of storage objects.
     * Primarily exists so the rest of the code doesn't need to know or care which specific storage we're using.
     * Not strictly a Factory as we don't create a new one every time, more of an Instance Manager.
     *
     * @constructor
     */
    function Factory()
    {
        /**
         * @type Storage/Abstract
         * @private
         */
        var storage;

        /**
         * Get the storage instance
         *
         * @returns Storage/Abstract
         */
        this.getStorage = function()
        {
            return storage;
        };

        /**
         *
         * @param Storage/Abstract newStorage
         * @returns self
         */
        this.setStorage = function(newStorage)
        {
            storage = newStorage;
            return this;
        };
    }

    /**
     * @constant
     */
    Factory.DEFAULT_TYPE = 'ChromeExt';

    /**
     * Get the storage
     *
     * @throws error if the storage cannot be loaded or does not extend the Abstract
     * @returns Storage/Abstract
     */
    Factory.prototype.get = function()
    {
        if (this.getStorage()) {
            return this.getStorage();
        }

        var storage = require('Storage/'+Factory.DEFAULT_TYPE);
        if (!storage || !(storage instanceof Abstract)) {
            throw 'Storage/Factory::get encountered invalid Storage object';
        }
        this.setStorage(storage);

        return storage;
    };

    return new Factory();
});