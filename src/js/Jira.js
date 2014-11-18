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
            if (!ajaxValues[key]) {
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
     * @return Boolean Success?
     */
    Jira.prototype.testConnection = function()
    {
        this.setAjaxValue('connectionSuccess', false);
        this._makeRequest(Constants.URL_SERVER_INFO, {}, Constants.REQUEST_GET, function()
        {
            this.setAjaxValue('connectionSuccess', true);
        }, function(xhr, status, ex)
        {
            // Default is failure so do nothing
            this.getLogger().error('Connection to JIRA failed: '+status+', '+ex);
        });

        return this.getAjaxValue('connectionSuccess');
    };

    /**
     * Get the issue types from JIRA
     *
     * @param Integer subtasks One of the Constants.TYPES_INC_SUBTASKS_* constants
     * @return Object Issue/subtask types keyed by ID or null on failure
     */
    Jira.prototype.fetchIssueTypes = function(subTasks)
    {
        var issueTypes = this.getIssueTypes();
        if (!issueTypes || issueTypes.length == 0) {
            this.setAjaxValue('types', null);
            var data = {};
            this._makeRequest(Constants.URL_ISSUE_TYPES, data, Constants.REQUEST_GET, function(data) {
                if (data.length > 0) {
                    var types = [];
                    types[Constants.TYPES_INC_SUBTASKS_NO] = {};
                    types[Constants.TYPES_INC_SUBTASKS_ONLY] = {};
                    types[Constants.TYPES_INC_SUBTASKS_YES] = {};
                    for (var index in data) {
                        var typeID = data[index].id;
                        var typeName = data[index].name;
                        var key = Constants.TYPES_INC_SUBTASKS_NO;
                        if (data[index].subtask) {
                            key = Constants.TYPES_INC_SUBTASKS_ONLY;
                            if ($.inArray(typeName, this.getConfig().get('subTaskTypeExclusions')) >= 0) {
                                continue;
                            }
                        }
                        types[key][typeID] = typeName;
                        types[Constants.TYPES_INC_SUBTASKS_YES][typeID] = typeName;
                    }

                    this.setAjaxValue('types', types);
                }
            });

            issueTypes = this.getAjaxValue('types');
            this.setIssueTypes(issueTypes);
        }

        if (!issueTypes[subTasks]) {
            return null;
        }

        return issueTypes[subTasks];
    };

    /**
     * Get the sub-task types from JIRA
     *
     * Helper method
     *
     * @return Object Subtask types keyed by ID or null on failure
     */
    Jira.prototype.getSubTaskTypes = function()
    {
        return this.fetchIssueTypes(Constants.TYPES_INC_SUBTASKS_ONLY);
    };

    /**
     * Get a transitions ID
     *
     * @param String issue The JIRA issue key
     * @param String transition The JIRA transition name
     * @returns Integer The JIRA transition ID
     */
    Jira.prototype.getTransitionID = function(issue, transition)
    {
        // TODO: Transitions are usually specific to projects but that's not always the case
        var transitionKey = issue.substring(0, issue.indexOf('-'))+':'+transition;

        if (!this.getTransition(transitionKey)) {
            this.setAjaxValue('requestedTransitionName', transition);
            this.setAjaxValue('requestedTransitionID', null);
            var url = Constants.URL_TRANSITION.replace('{issue}', issue);
            var data = {};

            this._makeRequest(url, data, Constants.REQUEST_GET, function(data) {
                if (data.transitions && data.transitions.length > 0) {
                    for (var index in data.transitions) {
                        if (data.transitions[index].name == this.getAjaxValue('requestedTransitionName')) {
                            this.setAjaxValue('requestedTransitionID', data.transitions[index].id);
                            return;
                        }
                    }
                }
            });

            this.setTransition(transitionKey, this.getAjaxValue('requestedTransitionID'));
        }

        return this.getTransition(transitionKey);
    };

    /**
     * Log time to JIRA
     *
     * @param String time The time to log in JIRA time format (1d 1h 1m)
     * @param String issue The JIRA issue key
     * @param String description (Optional) Description of the work done
     * @returns String The new worklog ID or null on failure
     */
    Jira.prototype.logTime = function(time, issue, description)
    {
        this.setAjaxValue('workLogID', null);

        var url = Constants.URL_LOG_WORK.replace('{issue}', issue);
        var now = new Date();
        now = now.toISOString().replace(/Z$/, '+0000');
        description = (description) ? description : "";

        var data = {
            "comment": description,
            "started": now,
            "timeSpent": time
        };

        this._makeRequest(url, data, Constants.REQUEST_POST, function(data) {
            if (!data.id) {
                return;
            }

            this.setAjaxValue('workLogID', data.id);
        });

        return this.getAjaxValue('workLogID');
    };

    /**
     * Get the parent of a subtask
     *
     * @param String issue The JIRA subtask issue key
     * @returns Object The parent issue null
     */
    Jira.prototype.getParent = function(issue)
    {
        this.setAjaxValue('requestedSubTaskParent', null);

        // Get the details of the issue
        var url = Constants.URL_GET_ISSUE.replace('{issue}', issue);
        this._makeRequest(url, null, Constants.REQUEST_GET, function(data) {
            if (!data.fields.parent) {
                return;
            }
            this.setAjaxValue('requestedSubTaskParent', data.fields.parent);
        });

        return this.getAjaxValue('requestedSubTaskParent');
    };

    /**
     * Make sure a given type of subtask exists for an issue
     *
     * @param String issue The JIRA issue key
     * @param String type (Optional) The type of subtask
     * @returns String They JIRA key of the subtask or null on failure
     */
    Jira.prototype.getIssueSubTask = function(issue, type)
    {
        this.setAjaxValue('requestedSubTaskType', type);
        this.setAjaxValue('requestedSubTaskIssue', null);

        // Get the details of the main issue
        var url = Constants.URL_GET_ISSUE.replace('{issue}', issue)+'?expand=subtasks';
        this._makeRequest(url, null, Constants.REQUEST_GET, function(data) {
            if (!data.fields.subtasks) {
                return;
            }
            for (var index in data.fields.subtasks) {
                if (data.fields.subtasks[index].fields.issuetype.name == this.getAjaxValue('requestedSubTaskType')) {
                    this.setAjaxValue('requestedSubTaskIssue', data.fields.subtasks[index].key);
                    return;
                }
            }
        });

        return this.getAjaxValue('requestedSubTaskIssue');
    };

    /**
     * Create a subtask for an issue
     *
     * @param String issue The JIRA issue key of the parent issue
     * @param String type (Optional) The type of subtask
     * @returns String They JIRA key of the new subtask or null on failure
     */
    Jira.prototype.createSubTask = function(issue, type)
    {
        this.setAjaxValue('requestedSubTaskIssue', null);

        var url = Constants.URL_CREATE_ISSUE;
        var now = new Date();

        var data = {
            "fields": {
                "project":
                {
                    "key": issue.substring(0,issue.indexOf('-'))
                },
                "parent": {
                    "key": issue
                },
                "summary": type+' '+issue,
                "description": type+' '+issue,
                "issuetype": {
                    "name": type
                }
            }
        };

        this._makeRequest(url, data, Constants.REQUEST_POST, function(data) {
            if (!data.key) {
                return;
            }

            this.setAjaxValue('requestedSubTaskIssue', data.key);
        });

        return this.getAjaxValue('requestedSubTaskIssue');
    };

    /**
     * Transition an issue
     *
     * @param String issue The JIRA issue key
     * @param Integer transition The JIRA transition ID
     * @returns Boolean Success?
     */
    Jira.prototype.transitionIssue = function(issue, transition)
    {
        this.setAjaxValue('transitionSuccess', false);

        var url = Constants.URL_TRANSITION.replace('{issue}', issue);

        var data = {
            "transition": {
                "id": transition
            }
        };

        this._makeRequest(url, data, Constants.REQUEST_POST, function(data) {
            this.setAjaxValue('transitionSuccess', true);
        });

        return this.getAjaxValue('transitionSuccess');
    };

    /**
     * Get basic details of an issue
     *
     * @param String issue The JIRA issue key
     * @returns Object
     */
    Jira.prototype.getIssueSummary = function(issue)
    {
        // Get the details of the issue
        this.setAjaxValue('requestedIssue', null);
        var url = Constants.URL_GET_ISSUE.replace('{issue}', issue)+'?fields=summary,description';
        this._makeRequest(url, null, Constants.REQUEST_GET, function(data) {
            this.setAjaxValue('requestedIssue', data);
        });

        return this.getAjaxValue('requestedIssue');
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

        $.ajax({
            type: type,
            url: urlFull,
            dataType: 'json',
            // Make requests synchronously, this is important for process flow control
            async: false,
            // Callback functions' "this" will be the current Jira instance
            context: this,
            headers: {
                'Authorization': headerAuth,
                'Content-Type': 'application/json'
            },
            data: data ? JSON.stringify(data) : '{}',
            timeout: Constants.AJAX_TIMEOUT_MS,
            success: success,
            error: failure
        });
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