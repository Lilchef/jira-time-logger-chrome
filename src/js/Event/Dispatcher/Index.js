/**
 * Index.js file
 *
 * Contains the Index class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Event/Dispatcher/Abstract',
    'AppConstants',
    'ActivityLog'
], function(
    Abstract,
    Constants,
    AL
) {

    /**
     * Index class
     *
     * Dispatch events pertaining to the application
     *
     * @constructor
     */
    function Index()
    {
        Abstract.call(this);
    }

    Index.prototype = Object.create(Abstract.prototype);

    /**
     * Trigger an event to say a new ActivityLog has been added
     *
     * @param ActivityLog activityLog
     */
    Index.prototype.activityLogAdded = function(activityLog)
    {
        // As the event may be listened to in a different window context we can't assume that it will know how to
        // handle the ActivityLog object so convert it to a plain object for transport
        this.dispatchEvent(AL.EVENT_ADDED, [activityLog.toPlainObject()]);
        return this;
    };

    /**
     * Trigger an event to say an ActivityLog has been removed
     *
     * @param ActivityLog activityLog
     */
    Index.prototype.activityLogRemoved = function(activityLog)
    {
        this.dispatchEvent(AL.EVENT_REMOVED, [activityLog.toPlainObject()]);
        return this;
    };

    /**
     * Trigger an event to say we're testing the JIRA connection
     *
     */
    Index.prototype.testingJiraConnection = function()
    {
        this.dispatchEvent(Constants.EVENT_TESTING_JIRA);
        return this;
    };

    /**
     * Trigger an event to say we're done testing the JIRA connection
     *
     */
    Index.prototype.doneTestingJiraConnection = function()
    {
        this.dispatchEvent(Constants.EVENT_DONE_TESTING_JIRA);
        return this;
    };

    /**
     * Trigger an event to say the logged total has changed
     *
     * @param String total JIRA time formatted total time
     */
    Index.prototype.loggedTotalChanged = function(total)
    {
        this.dispatchEvent(Constants.EVENT_LOGGED_TOTAL_CHANGED, [total]);
        return this;
    };

    /**
     * Trigger an event to say the daily grand total has changed
     *
     * @param String total JIRA time formatted total time
     */
    Index.prototype.dayGrandTotalChanged = function(total)
    {
        this.dispatchEvent(Constants.EVENT_DAY_GRAND_TOTAL_CHANGED, [total]);
        return this;
    };

    /**
     * Trigger an event to say the accrued time has changed
     *
     * @param String time JIRA formatted time
     */
    Index.prototype.timeChanged = function(time)
    {
        this.dispatchEvent(Constants.EVENT_TIME_CHANGED, [time]);
        return this;
    };

    /**
     * Trigger an event to say that time has been logged
     *
     * @param String time JIRA formatted time
     */
    Index.prototype.timeLogged = function(time)
    {
        this.dispatchEvent(Constants.EVENT_TIME_LOGGED, [time]);
        return this;
    };

    return new Index();
});