/**
 * JiraConstants.js file
 *
 * Contains the JiraConstants class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([

], function(

) {

    /**
     * JiraConstants class
     *
     * Simply contains constants pertaining to JIRA
     *
     * @constructor
     * @abstract
     */
    function JiraConstants()
    {

    }

    /**
     * @constants Regex
     */
    JiraConstants.TIME_REGEX = "^([0-9]+[dD] ?)?([0-9]+[hH] ?)?([0-9]+[mM])?$";
    JiraConstants.ISSUE_KEY_REGEX = "^[A-Za-z]{1,10}-[0-9]+$";

    /**
     * @constants URLS
     */
    JiraConstants.URL_SERVER_INFO = 'serverInfo';
    JiraConstants.URL_CREATE_ISSUE = 'issue';
    JiraConstants.URL_GET_ISSUE = 'issue/{issue}';
    JiraConstants.URL_LOG_WORK = 'issue/{issue}/worklog';
    JiraConstants.URL_ISSUE_TYPES = 'issuetype';
    JiraConstants.URL_TRANSITION = 'issue/{issue}/transitions';

    /**
     * @constants Request types
     */
    JiraConstants.REQUEST_GET = 'GET';
    JiraConstants.REQUEST_POST = 'POST';

    /**
     * @constants Defaults
     */
    JiraConstants.AJAX_TIMEOUT_MS = 8000;

    /**
     * @constants Types
     */
    JiraConstants.TYPES_INC_SUBTASKS_NO = 0;
    JiraConstants.TYPES_INC_SUBTASKS_ONLY = 1;
    JiraConstants.TYPES_INC_SUBTASKS_YES = 2;

    return JiraConstants;
});