/**
 * Index.js file
 *
 * Contains the Index class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Event/Listener/Abstract',
    'jquery',
    'Container/Factory',
    'AppConstants',
    'ConfigConstants',
    'View/Index',
    'ActivityLog'
], function(
    Abstract,
    $,
    containerFactory,
    AppConstants,
    ConfigConstants,
    view,
    AL
) {

    /**
     * Index class
     *
     * Listen to events on the main page
     *
     * @extends Event/Listener/Abstract
     * @constructor
     */
    function Index()
    {
        Abstract.call(this);

        /**
         * @type Boolean
         * @private
         */
        var initialised = false;

        /**
         * Set whether the listner has been initialised.
         *
         * @param Boolean val
         * @returns self
         */
        this.setInitialised = function(val)
        {
            initialised = val;
            return this;
        };

        /**
         * Has the listener been initialised?
         *
         * @returns Boolean
         */
        this.isInitialised = function()
        {
            return initialised;
        };

        /**
         * Get the App instance
         *
         * @returns App
         */
        this.getApp = function()
        {
            return containerFactory.get().getAppInstance();
        };

        /**
         * Get the View instance
         *
         * @returns View/Index
         */
        this.getView = function()
        {
            return view;
        };
    }

    Index.prototype = Object.create(Abstract.prototype);

    /**
     * Initialise the listeners
     *
     */
    Index.prototype.init = function()
    {
        // Prevent accidental double-initialisation which would cause everything to be listened to and actioned twice
        if (this.isInitialised()) {
            return;
        }
        var self = this;
        $(document).ready(function()
        {
            self._registerJiraTestListener()
                ._registerJiraTestDoneListener()
                ._registerConfigChangedListener()
                ._registerLoggedTotalChangedListener()
                ._registerDayGrandTotalChangedListener()
                ._registerTimeChangedListener()
                ._registerTimeLoggedListener()
                ._registerActivityLogAddedListener()
                ._registerActivityLogRemovedListener()
                ._registerFormListener()
                ._registerLogTimeListener()
                ._registerResetFormListener()
                ._registerReconfigureListener()
                ._registerBugListener()
                ._registerTimeManualKeyupListener()
                ._registerTimeClickListener()
                ._registerTimeClearListener()
                ._registerIssueKeyupListener()
                ._registerIssuePasteListener()
                ._registerIssueKeyClickListener()
                ._registerResetLoggedTotalClickListener();
        });
        this.setInitialised(true);
    };

    /**
     * Register a listener for when the app is testing the JIRA connection
     *
     * @returns self
     * @private
     */
    Index.prototype._registerJiraTestListener = function()
    {
        var view = this.getView();
        this._registerCustomEventListener(AppConstants.EVENT_TESTING_JIRA, function()
        {
            view.showJiraTestMessage();
        });
        return this;
    };

    /**
     * Register a listener for when the app is done testing the JIRA connection
     *
     * @returns self
     * @private
     */
    Index.prototype._registerJiraTestDoneListener = function()
    {
        var view = this.getView();
        this._registerCustomEventListener(AppConstants.EVENT_DONE_TESTING_JIRA, function()
        {
            view.hideJiraTestMessage();
        });
        return this;
    };

    Index.prototype._registerConfigChangedListener = function()
    {
        var app = this.getApp();
        var view = this.getView();
        this._registerCustomEventListener(ConfigConstants.EVENT_CHANGED, function()
        {
            app.configChanged();
            view.configChanged();
        });
        return this;
    };

    /**
     * Register a listener for when the total time logged changes
     *
     * @returns self
     * @private
     */
    Index.prototype._registerLoggedTotalChangedListener = function()
    {
        var view = this.getView();
        this._registerCustomEventListener(AppConstants.EVENT_LOGGED_TOTAL_CHANGED, function(e, total)
        {
            view.updateLoggedTotal(total);
        });
        return this;
    };

    /**
     * Register a listener for when the daily grand total time changes
     *
     * @returns self
     * @private
     */
    Index.prototype._registerDayGrandTotalChangedListener = function()
    {
        var view = this.getView();
        this._registerCustomEventListener(AppConstants.EVENT_DAY_GRAND_TOTAL_CHANGED, function(e, total)
        {
            view.updateDayGrandTotal(total);
        });
        return this;
    };

    /**
     * Register a listener for when the accrued time changes
     *
     * @returns self
     * @private
     */
    Index.prototype._registerTimeChangedListener = function()
    {
        var view = this.getView();
        this._registerCustomEventListener(AppConstants.EVENT_TIME_CHANGED, function(e, time)
        {
            view.updateTimeAuto(time);
        });
        return this;
    };

    /**
     * Register a listener for when time is logged
     *
     * @returns self
     * @private
     */
    Index.prototype._registerTimeLoggedListener = function()
    {
        var app = this.getApp();
        var view = this.getView();
        this._registerCustomEventListener(AppConstants.EVENT_TIME_LOGGED, function(e, time)
        {
            view.resetTimeForm();
            app.setTimeManual(false);
        });
        return this;
    };

    /**
     * Register a listener for when an ActivityLog is added
     *
     * @returns self
     * @private
     */
    Index.prototype._registerActivityLogAddedListener = function()
    {
        var view = this.getView();
        this._registerCustomEventListener(AL.EVENT_ADDED, function(e, activityLog)
        {
            view.addActivityLog(AL.fromPlainObject(activityLog));
        });
        return this;
    };

    /**
     * Register a listener for when an ActivityLog is removed
     *
     * @returns self
     * @private
     */
    Index.prototype._registerActivityLogRemovedListener = function()
    {
        var view = this.getView();
        this._registerCustomEventListener(AL.EVENT_REMOVED, function(e, activityLog)
        {
            view.removeActivityLog(AL.fromPlainObject(activityLog));
        });
        return this;
    };

    /**
     * Register a listener for the config form submission
     *
     * @returns self
     * @private
     */
    Index.prototype._registerReconfigureListener = function()
    {
        var app = this.getApp();
        $('#reconfigureButton').off('click').on('click', function()
        {
            app.reconfigure();
            // Prevent regular form submission
            return false;
        });
        return this;
    };

    /**
     * Register a listener for the Bug Report button
     *
     * @returns self
     * @private
     */
    Index.prototype._registerBugListener = function()
    {
        var app = this.getApp();
        $('#bugButton').off('click').on('click', function()
        {
            app.bugRequest();
        });
        return this;
    };

    /**
     * Register a listener for the main form submission
     *
     * @returns self
     * @private
     */
    Index.prototype._registerResetFormListener = function()
    {
        var view = this.getView();
        $('#resetFormButton').off('click').on('click', function()
        {
            view.resetTimeForm(true);
        });
        return this;
    };

    /**
     * Register a listener for the Log Time button
     *
     * @returns self
     * @private
     */
    Index.prototype._registerLogTimeListener = function()
    {
        var view = this.getView();
        $('#logTimeButton').off('click').on('click', function()
        {
            view.submitTimeForm();
        });
        return this;
    };

    /**
     * Register a listener for the main form submission
     *
     * @returns self
     * @private
     */
    Index.prototype._registerFormListener = function()
    {
        var app = this.getApp();
        var view = this.getView();
        $('#loggerForm').off('submit').on('submit', function(e)
        {
            // Prevent regular form submission
            e.preventDefault();

            // Validation
            var errors = view.validateTimeForm();
            if (errors.length) {
                app.alertUser(errors.join('\n'));
                return;
            }

            // No errors, submit
            var values = view.getTimeFormValues();
            app.logTime(
                values.time, values.issue.toUpperCase(), values.description, values.summary,
                function(success)
                {
                    if (!success) {
                        return;
                    }

                    if (app.getTimeManual()) {
                        app.deductTime(values.time);
                        view.showTimeAuto();
                    } else {
                        app.resetTime();
                    }
                }
            );
        });
        return this;
    };

    /**
     * Register a listener for clicks on the time field
     *
     * @returns self
     * @private
     */
    Index.prototype._registerTimeClickListener = function()
    {
        var app = this.getApp();
        var view = this.getView();
        $('#timeAuto').off('click').on('click', function()
        {
            view.showTimeManual();
            app.setTimeManual(true);
        });
        return this;
    };

    /**
     * Register a listener for clicks on the clear time button
     *
     * @returns self
     * @private
     */
    Index.prototype._registerTimeClearListener = function()
    {
        var app = this.getApp();
        var view = this.getView();
        $('#clearTimeButton').off('click').on('click', function()
        {
            if (app.getTimeManual()) {
                view.showTimeAuto();
                app.setTimeManual(false);
            } else {
                var currTime = app.getStopwatch().getTime();
                app.resetTime(true);
                // If it looks like the time logger's been running overnight offer to reset the day total
                if (currTime.hour >= AppConstants.TIME_HOUR_LIMIT) {
                    view.confirmLoggedTimeReset();
                }
            }
        });
        return this;
    };

    /**
     * Listen for keyup on the manual time field
     *
     * @returns self
     * @private
     */
    Index.prototype._registerTimeManualKeyupListener = function()
    {
        var view = this.getView();
        $('#timeManual').off('keyup').on('keyup', function()
        {
            view.manualTimeEntered();
        });
        return this;
    };

    /**
     * Register a listener for keyup on the issue field
     *
     * @returns self
     * @private
     */
    Index.prototype._registerIssueKeyupListener = function()
    {
        var view = this.getView();
        $('#issue').off('keyup').on('keyup', function()
        {
            view.issueKeyEntered();
        });
        return this;
    };

    /**
     * Register a listener for paste on the issue field
     *
     * @returns self
     * @private
     */
    Index.prototype._registerIssuePasteListener = function()
    {
        var view = this.getView();
        $('#issue').off('paste').on('paste', function()
        {
            view.issueKeyEntered();
        });
        return this;
    };

    /**
     * Register a listener for when issue key links are clicked
     *
     * @returns self
     * @private
     */
    Index.prototype._registerIssueKeyClickListener = function()
    {
        var view = this.getView();
        $('body').off('click.issueKey').on('click.issueKey', 'a.issueKey', function()
        {
            view.enterIssueKey($(this).text());
            return false;
        });
        return this;
    };

    /**
     * Register a listener for the reset day total button click
     *
     * @returns self
     * @private
     */
    Index.prototype._registerResetLoggedTotalClickListener = function()
    {
        var app = this.getApp();
        $('#resetLoggedTotalButton').off('click').on('click', function()
        {
            app.resetLoggedTotal(true);
        });
        return this;
    };

    return new Index();
});