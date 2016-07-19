/**
 * jira.js file
 *
 * Contains the Jira class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2013
 */

define([
    'JiraConstants',
    'Logger',
    'Config',
    'jquery'
], function(
    Constants,
    logger,
    config,
    $
) {

    /**
     * Jira class
     *
     * Handles communication with JIRA
     *
     * @constructor
     */
    function Jira()
    {
        /**
         * @type Array
         * @private
         */
        var issueTypes = [];
        /**
         * @type Object
         * @private
         */
        var transitions = {};
        /**
         * @type Object
         * @private
         */
        var ajaxValues = {};

        /**
         * Get the issue types
         *
         * @returns Array
         */
        this.getIssueTypes = function()
        {
            return issueTypes;
        };

        /**
         * Set the issue types
         *
         * @param Array
         * @returns self
         */
        this.setIssueTypes = function(newIssueTypes)
        {
            if (!(newIssueTypes instanceof Array)) {
                throw 'Jira.setIssueTypes called with non-Array';
            }
            issueTypes = newIssueTypes;
            return this;
        };

        /**
         * Get an ajax value
         *
         * @param String key
         * @returns mix
         */
        this.getAjaxValue = function(key)
        {
            if (ajaxValues[key] === undefined) {
                return null;
            }
            return ajaxValues[key];
        };

        /**
         * Set an ajax value
         *
         * @param String key
         * @param mix value
         */
        this.setAjaxValue = function(key, value)
        {
            ajaxValues[key] = value;
            return this;
        };

        /**
         * Get an issue transition ID
         *
         * @param String transition
         * @returns String
         */
        this.getTransition = function(transition)
        {
            if (!transitions[transition]) {
                return null;
            }
            return transitions[transition];
        };

        /**
         * Set an issue transition
         *
         * @param String transition
         * @param String id
         */
        this.setTransition = function(transition, id)
        {
            transitions[transition] = id;
            return this;
        };

        /**
         * Get the Logger object
         *
         * @returns Logger
         */
        this.getLogger = function()
        {
            return logger;
        };

        /**
         * Get the config object
         *
         * @returns Config
         */
        this.getConfig = function()
        {
            return config;
        };
    }

    /**
     * Test the connection to JIRA
     *
     * @param Function callback
     */
    Jira.prototype.testConnection = function(callback)
    {
        var self = this;
        this._makeRequest(Constants.URL_SERVER_INFO, {}, Constants.REQUEST_GET, function()
        {
            callback(true);
        }, function(error)
        {
            self.getLogger().error('Connection to JIRA failed: '+error);
            callback(false);
        });
    };

    /**
     * Log time to JIRA
     *
     * @param String time The time to log in JIRA time format (1d 1h 1m)
     * @param String issue The JIRA issue key
     * @param String description (Optional) Description of the work done
     * @param Function callback
     */
    Jira.prototype.logTime = function(time, issue, description, callback)
    {
        var url = Constants.URL_LOG_WORK.replace('{issue}', issue);
        var now = new Date();
        now = now.toISOString().replace(/Z$/, '+0000');
        description = (description) ? description : "";

        var data = {
            "comment": description,
            "started": now,
            "timeSpent": time
        };

        this._makeRequest(url, data, Constants.REQUEST_POST, function(data)
        {
            var worklogId = null;
            if (typeof data.id != 'undefined') {
                worklogId = data.id;
            }

            callback(worklogId);
        });
    };

    /**
     * Get basic details of an issue
     *
     * @param String issue The JIRA issue key
     * @param Function callback
     */
    Jira.prototype.getIssueSummary = function(issue, callback)
    {
        var url = Constants.URL_GET_ISSUE.replace('{issue}', issue)+'?fields=summary,description';
        this._makeRequest(url, null, Constants.REQUEST_GET, callback);
    };

    /*
     * Private methods
     * No such thing in JavaScript, it's just conceptual
     */

    /**
     * Make a request to the JIRA API
     *
     * @param String url_slug The URL slug to make the request to
     * @param Object data The JSON data to send
     * @param String type (Optional) The type of request, one of the Constants.REQUEST_* constants
     * @param function success (Optional) Success callback
     * @param function failure (Optional) Failure callback
     * @private
     */
    Jira.prototype._makeRequest = function(urlSlug, data, type, success, failure)
    {
        var urlBase = this.getConfig().get('urlBase').replace(/\/$/, '');
        var urlApi = this.getConfig().get('urlApi');
        urlSlug = urlSlug.replace(/^\//, '');
        type = (type) ? type : Constants.REQUEST_GET;
        success = (success) ? success : function() {};
        failure = (failure) ? failure : this._requestFailure;

        var urlFull = urlBase+urlApi+urlSlug;
        var authBase64 = btoa(this.getConfig().get('username')+':'+this.getConfig().get('password'));
        var headerAuth = 'Basic '+authBase64;

        new Promise(function(resolve, reject)
        {
            $.ajax({
                type: type,
                url: urlFull,
                dataType: 'json',
                // Callback functions' "this" will be the current Jira instance
                context: this,
                headers: {
                    'Authorization': headerAuth,
                    'Content-Type': 'application/json'
                },
                data: data ? JSON.stringify(data) : '{}',
                timeout: Constants.AJAX_TIMEOUT_MS
            }).done(function(data)
            {
                resolve(data);
            }).fail(function(jqXHR, textStatus, errorThrown)
            {
                reject(new Error(errorThrown));
            });
        }).then(success, failure);
    };

    /**
     * Default refuest failure handler
     *
     * @param jqXhr xhr
     * @param String status
     * @param String ex
     * @private
     */
    Jira.prototype._requestFailure = function(xhr, status, ex)
    {
        this.getLogger().error('Request failure: '+status+', '+ex);
    };

    return new Jira();
});