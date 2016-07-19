/**
 * ChromeApp.js file
 *
 * Contains the ChromeApp class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Container/ChromeAbstract',
    'jquery'
], function(
    ChromeAbstract,
    $
) {

    /**
     * ChromeApp class
     *
     * Chrome-app-specific container
     *
     * @extends Container/ChromeAbstract
     * @constructor
     */
    function ChromeApp()
    {
        ChromeAbstract.call(this);

        /**
         * @type Window
         * @private
         */
        var backgroundPage = null;

        /**
         * Get the background page's window context
         *
         * @returns Window
         */
        this.getBackgroundPage = function()
        {
            return backgroundPage;
        };

        /**
         * Store the background page's window context
         *
         * @returns self
         */
        this.setBackgroundPage = function(newBackgroundPage)
        {
            backgroundPage = newBackgroundPage;
            return this;
        };

        (function()
        {
            this.fetchBackgroundPage();
        }).call(this);
    }

    ChromeApp.prototype = Object.create(ChromeAbstract.prototype);

    /**
     * Get the application instance
     *
     * @returns App
     */
    ChromeApp.prototype.getAppInstance = function()
    {
        return this.getBackgroundPage().appInstance;
    };

    /**
     * Get the config instance
     *
     * @returns Config
     */
    ChromeApp.getConfigInstance = function()
    {
        return this.getBackgroundPage().configInstance;
    };

    /**
     * Show the configuration options
     *
     */
    ChromeApp.prototype.showConfiguration = function()
    {
        var window = chrome.app.window.get('jira-time-logger-config');
        if (window) {
            window.show(true);
            return;
        }
        chrome.app.window.create('config.html', {
            'id': 'jira-time-logger-config',
            'outerBounds': {
                'width': 500,
                'height': 500
            }
        });
    };

    /**
     * Close the configuration options
     *
     */
    ChromeApp.prototype.closeConfiguration = function()
    {
        chrome.app.window.get('jira-time-logger-config').close();
    };

    /**
     * Handle a configuration change
     *
     */
    ChromeApp.prototype.configurationChanged = function()
    {
        // No-op
    };

    /**
     * Open the given URL
     *
     * @param String url
     */
    ChromeApp.prototype.openURL = function(url)
    {
        chrome.browser.openTab({url: url});
    };


    /**
     * Create and dispatch a custom event
     *
     * @param String name
     * @param Array additional Zero or more items to pass to the listeners
     */
    ChromeApp.prototype.dispatchEvent = function(name, additional)
    {
        chrome.runtime.sendMessage({
            type: name,
            data: additional
        });
    };

    /**
     * Create a listener for a custom event
     *
     * Overridden from the Abstract as, unlike extensions, Chrome apps seem capable of listening to both event and
     * messages from all contexts so we only need to use one or the other.
     *
     * @param String name
     * @param Function callback
     */
    ChromeApp.prototype.registerCustomEventListener = function(name, callback)
    {
        this.addListener(name, callback);
    };

    /**
     * Ask the user to confirm an action
     *
     * @param String message
     * @param function yesCallback (Optional)
     * @param function noCallback (Optional)
     */
    ChromeApp.prototype.confirm = function(message, yesCallback, noCallback)
    {
        var dialog = '<div class="modal active" id="confirmDialog"><div class="content">'
            + '<div class="row"><div class="six columns text-center">'
            + '<p>' + message.replace(/\n/g, '<br />') + '</p>'
            + '<div class="rounded pretty info btn confirm-yes"><a href="#">Yes</a></div>'
            + '<div class="rounded pretty info btn confirm-no"><a href="#">No</a></div>'
            + '</div></div>'
            + '</div></div>';
        $('body').append(dialog);
        $('#confirmDialog .btn').click(function()
        {
            if ($(this).hasClass('confirm-yes') && yesCallback) {
                yesCallback();
            } else if (noCallback) {
                noCallback();
            }
            $('#confirmDialog').remove();
        });
    };

    /**
     * Perform any initilisation required by the container
     *
     * @param Function callback
     */
    ChromeApp.prototype.initialise = function(callback)
    {
        chrome.app.runtime.onLaunched.addListener(function()
        {
            chrome.app.window.create('index.html', {
                'id': 'jira-time-logger-index',
                'outerBounds': {
                    'width': 500,
                    'height': 500
                }
            });
            callback();
        });
    };

    /**
     * Get the background page context and store it for later use
     *
     * @returns self
     */
    ChromeApp.prototype.fetchBackgroundPage = function()
    {
        var self = this;
        chrome.runtime.getBackgroundPage(function(backgroundPage)
        {
            self.setBackgroundPage(backgroundPage);
        });
        return this;
    };

    return new ChromeApp();
});