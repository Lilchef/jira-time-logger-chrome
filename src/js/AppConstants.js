/**
 * AppConstants.js file
 *
 * Contains the AppConstants class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([], function()
{

    /**
     * AppConstants class
     *
     * Simply contains constants pertaining to the main Application
     *
     * @constructor
     * @abstract
     */
    function AppConstants()
    {

    }

    /**
     * @constants Events
     */
    AppConstants.EVENT_TESTING_JIRA = 'testing-jira-connection';
    AppConstants.EVENT_DONE_TESTING_JIRA = 'done-testing-jira-connection';
    AppConstants.EVENT_LOGGED_TOTAL_CHANGED = 'logged-total-changed';
    AppConstants.EVENT_DAY_GRAND_TOTAL_CHANGED = 'day-grand-total-changed';
    AppConstants.EVENT_TIME_CHANGED = 'time-changed';
    AppConstants.EVENT_TIME_LOGGED = 'time-logged';

    /**
     * @constants Defaults
     */
    AppConstants.TIME_HOUR_LIMIT = 10;

    return AppConstants;
});