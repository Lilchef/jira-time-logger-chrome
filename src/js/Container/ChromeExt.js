/**
 * ChromeExt.js file
 *
 * Contains the ChromeExt class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Container/ChromeAbstract'
], function(
    ChromeAbstract
) {

    /**
     * ChromeExt class
     *
     * Chrome-extension-specific container
     *
     * @extends Container/ChromeAbstract
     * @constructor
     */
    function ChromeExt()
    {
        ChromeAbstract.call(this);
    }

    ChromeExt.prototype = Object.create(ChromeAbstract.prototype);

    /**
     * Get the application instance
     *
     * @returns App
     */
    ChromeExt.prototype.getAppInstance = function()
    {
        return chrome.extension.getBackgroundPage().appInstance;
    };

    /**
     * Get the config instance
     *
     * @returns Config
     */
    ChromeExt.getConfigInstance = function()
    {
        return chrome.extension.getBackgroundPage().configInstance;
    };

    /**
     * Show the configuration options
     *
     */
    ChromeExt.prototype.showConfiguration = function()
    {
        chrome.tabs.create({url: "config.html"});
    };

    /**
     * Close the configuration options
     *
     */
    ChromeExt.prototype.closeConfiguration = function()
    {
        var configUrl = chrome.extension.getURL('config.html');
        chrome.tabs.query({url: configUrl}, function(tabs)
        {
            // Should only be one but may as well loop them
            var ids = [];
            for (var index in tabs) {
                ids.push(tabs[index].id);
            }
            chrome.tabs.remove(ids);
        });
    };

    /**
     * Handle a configuration change
     *
     */
    ChromeExt.prototype.configurationChanged = function()
    {
        chrome.runtime.reload();
    };

    /**
     * Open the given URL
     *
     * @param String url
     */
    ChromeExt.prototype.openURL = function(url)
    {
        chrome.tabs.create({url: url});
    };

    return new ChromeExt();
});