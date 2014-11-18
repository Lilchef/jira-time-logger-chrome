/**
 * ChromeExt.js file
 *
 * Contains the ChromeExt class.
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
     * ChromeExt class
     *
     * Chrome-extension-specific storage
     *
     * @extends Storage/Abstract
     * @constructor
     */
    function ChromeExt()
    {
        Abstract.call(this);
    }

    ChromeExt.prototype = Object.create(Abstract.prototype);

    /**
     * Save a key-value pair
     *
     * @param String key
     * @param Mixed value
     * @param Function callback Will be passed success boolean and an optional second argument of any error message
     */
    ChromeExt.prototype.save = function(key, value, callback)
    {
        var data = {};
        data[key] = value;
        chrome.storage.sync.set(data, function()
        {
            var success = !(chrome.runtime.lastError);
            callback(success, chrome.runtime.lastError);
        });
    };

    /**
     * Fetch the value for a given key
     *
     * @param String key
     * @param Function callback 
     * @returns Mixed The matching value
     */
    ChromeExt.prototype.fetch = function(key, callback)
    {
        chrome.storage.sync.get(key, function(items)
        {
            if (!items || !items.hasOwnProperty(key)) {
                callback(undefined);
                return;
            }
            callback(items[key]);
        });
    };

    return new ChromeExt();
});