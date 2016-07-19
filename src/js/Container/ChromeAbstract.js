/**
 * ChromeAbstract.js file
 *
 * Contains the ChromeAbstract class.
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
     * ChromeAbstract class
     *
     * Chrome-extension-specific container
     *
     * @extends Container/Abstract
     * @constructor
     */
    function ChromeAbstract()
    {
        Abstract.call(this);

        /**
         * @type Object
         * @private
         */
        var listeners = {};

        /**
         * Get listeners (callbacks) for a given event
         *
         * @param string event The name of the event to get listeners for
         * @returns Array
         */
        this.getListenersForEvent = function(event)
        {
            if (typeof listeners[event] == 'undefined')
            {
                return [];
            }
            return listeners[event];
        };

        /**
         * Add a listener (callback) for the given event
         *
         * @param string event The name of the event to add the listener for
         * @param Function callback
         * @returns self
         */
        this.addListener = function(event, callback)
        {
            if (typeof listeners[event] == 'undefined') {
                listeners[event] = [];
            }
            listeners[event].push(callback);
            return this;
        };

        (function()
        {
            this.setupMessageListener();
        }).call(this);
    }

    ChromeAbstract.prototype = Object.create(Abstract.prototype);


    /**
     * Get the application version number
     *
     * @returns String
     */
    ChromeAbstract.prototype.getVersion = function()
    {
        var manifest = chrome.runtime.getManifest();
        return manifest.version;
    };

    /**
     * Handle a fatal error
     *
     * @param String exception The exception message that was thrown, if any
     */
    ChromeAbstract.prototype.fatal = function(exception)
    {
        this.showNotification('Fatal error', exception, 5000);
    };

    /**
     * Show a notification to the user
     *
     * @param String title
     * @param String message
     * @param Integer duration
     * @returns self
     */
    ChromeAbstract.prototype.showNotification = function(title, message, duration)
    {
        if (!message) {
            return;
        }
        title = title || 'JTL';
        chrome.notifications.create('', {
          title: title,
          message: message,
          iconUrl: 'images/jira_time_logger_logo.png',
          type: 'basic',
        }, function(notificationId){
            if (!duration) {
                return;
            }
            setTimeout(function()
            {
                chrome.notifications.clear(notificationId, function() {});
            }, duration);
        });
    };

    /**
     * Create and dispatch a custom event
     *
     * @param String name
     * @param Array additional Zero or more items to pass to the listeners
     */
    ChromeAbstract.prototype.dispatchEvent = function(name, additional)
    {
        Abstract.prototype.dispatchEvent.call(this, name, additional);
        chrome.runtime.sendMessage({
            type: name,
            data: additional
        });
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
    ChromeAbstract.prototype.registerCustomEventListener = function(name, callback)
    {
        Abstract.prototype.registerCustomEventListener.call(this, name, callback);
        this.addListener(name, callback);
    };

    /**
     * Listen for internal messages and see if we have any registered listeners to hand them off to
     *
     * @returns self
     */
    ChromeAbstract.prototype.setupMessageListener = function()
    {
        var self = this;
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
        {
            var listeners = self.getListenersForEvent(request.type);
            if (!listeners) {
                return;
            }
            var additional = request.data || [];
            // Replicate normal events by making the first argument to the callback an Event object
            if (additional.length == 0 || !(additional[0] instanceof Event)) {
                additional.unshift(new Event(name));
            }
            for (var index in listeners)
            {
                var callback = listeners[index];
                callback.apply(null, additional);
            }
            return true;
        });
        return this;
    };

    return ChromeAbstract;
});