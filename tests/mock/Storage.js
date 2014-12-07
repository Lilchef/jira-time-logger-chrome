/**
 * Storage.js file
 *
 * Contains the Storage mock class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Storage/Abstract'
], function(
    Abstract
) {

    /**
     * Storage mock class
     *
     * @extends Storage/Abstract
     * @constructor
     */
    function Storage()
    {
        Abstract.call(this);
    }

    Storage.prototype = Object.create(Abstract.prototype);

    /**
     * Save a key-value pair
     *
     * @param String key
     * @param Mixed value
     * @param Function callback Will be passed success boolean and an optional second argument of any error message
     */
    Storage.prototype.save = function(key, value, callback)
    {
        // No-op, just call the callback
        if (callback) {
            callback(true);
        }
    };

    /**
     * Fetch the value for a given key
     *
     * @param String key
     * @param Function callback 
     * @returns Mixed The matching value
     */
    Storage.prototype.fetch = function(key, callback)
    {
        callback(undefined);
    };

    return new Storage();
});