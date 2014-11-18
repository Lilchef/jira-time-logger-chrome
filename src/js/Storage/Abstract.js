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
     * Acts as a Storage 'interface'.
     * All Storage classes should extend this.
     *
     * @constructor
     * @abstract
     */
    function Abstract()
    {

    }

    /**
     * Save a key-value pair
     *
     * @param String key
     * @param Mixed value
     * @param Function callback Will be passed success boolean and an optional second argument of any error message
     */
    Abstract.prototype.save = function(key, value, callback)
    {
        throw 'Storage/Abstract.save must be overridden';
    };

    /**
     * Fetch the value for a given key
     *
     * @param String key
     * @param Function callback Will be passed the matching value OR undefined if not found
     */
    Abstract.prototype.fetch = function(key, callback)
    {
        throw 'Storage/Abstract.fetch must be overridden';
    };

    // Child classes should return a singleton here
    return Abstract;
});