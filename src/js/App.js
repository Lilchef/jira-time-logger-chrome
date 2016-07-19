/**
 * app.js file
 *
 * Contains the App class.
 * Requires the Config class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2013
 */

define([
    'Container/Factory',
    'Logger',
    'Config',
    'Event/Dispatcher/Index',
    'Jira',
    'JiraConstants',
    'Stopwatch',
    'ActivityLog',
    'StopwatchTime',
    'Reminder'
], function(
    containerFactory,
    logger,
    config,
    eventDispatcher,
    jira,
    JiraConstants,
    stopwatch,
    ActivityLog,
    StopwatchTime,
    reminder
) {

    /**
     * App class
     *
     * @constructor
     */
    function App()
    {
        /**
         * @type Container/Abstract
         * @private
         */
        var container = containerFactory.get();
        /**
         * @type String
         * @private
         */
        var bugReportEmail = 'bugs@aaronbaker.co.uk';
        /**
         * @type Boolean
         * @private
         */
        var timeManual = false;
        /**
         * @type StopwatchTime
         * @private
         */
        var loggedTotal = null;
        /**
         * @type Array of ActivityLogs
         * @private
         */
        var activityLogs = [];

         /**
          * Get the container
          *
          * @returns Container/Abstract
          */
         this.getContainer = function()
         {
             return container;
         };

         /**
          * Get the logger
          *
          * @returns Logger
          */
         this.getLogger = function()
         {
             return logger;
         };

        /**
         * Get the version number of the app
         *
         * @returns String
         */
        this.getVersion = function()
        {
            return this.getContainer().getVersion();
        };

        /**
         * Get the email address to send bug reports to
         *
         * @returns String
         */
        this.getBugReportEmail = function()
        {
            return bugReportEmail;
        };

        /**
         * Get the config
         *
         * @returns Config
         */
        this.getConfig = function()
        {
            return config;
        };

        /**
         * Get the eventDispatcher
         *
         * @returns Event/Index
         */
        this.getEventDispatcher = function()
        {
            return eventDispatcher;
        };

        /**
         * Get the Jira instance
         *
         * @returns Jira
         */
        this.getJira = function()
        {
            return jira;
        };

        /**
         * Get the stopwatch
         *
         * @returns Stopwatch
         */
        this.getStopwatch = function()
        {
            return stopwatch;
        };

        /**
         * Get the reminder
         *
         * @returns Reminder
         */
        this.getReminder = function()
        {
            return reminder;
        };

        /**
         * Get whether to use manually entered time
         *
         * @return Boolean
         */
        this.getTimeManual = function()
        {
            return timeManual;
        };

        /**
         * Set whether to use manually entered time
         *
         * @param Boolean manual
         * @returns self
         */
        this.setTimeManual = function(manual)
        {
            timeManual = Boolean(manual);
            return this;
        };

        /**
         * Get the logged total
         *
         * @return StopwatchTime
         */
        this.getLoggedTotal = function()
        {
            return loggedTotal;
        };

        /**
         * Set the logged total
         *
         * @param StopwatchTime newLoggedTotal
         * @returns self
         */
        this.setLoggedTotal = function(newLoggedTotal)
        {
            if (!(newLoggedTotal instanceof StopwatchTime)) {
                throw 'App.setLoggedTotal called with non-StopwatchTime';
            }
            loggedTotal = newLoggedTotal;
            return this;
        };

        /**
         * Get the ActivityLogs
         *
         * @returns Array of ActivityLogs
         */
        this.getActivityLogs = function()
        {
            return activityLogs;
        };

        /**
         * Add a new ActivityLog entry
         *
         * @param ActivityLog activityLog
         * @returns self
         */
        this.addActivityLog = function(activityLog)
        {
            this.getActivityLogs().push(activityLog);
            this.getEventDispatcher().activityLogAdded(activityLog);
            if (this.getActivityLogs().length > this.getConfig().get('maxLogs', 'jtl')) {
                var oldestLog = this.getActivityLogs().shift();
                this.getEventDispatcher().activityLogRemoved(oldestLog);
            }

            return this;
        };

        /**
         * Remove all ActivityLogs
         *
         * @returns self
         */
        this.clearActivityLogs = function()
        {
            var log;
            while (log = this.getActivityLogs().pop()) {
                this.getEventDispatcher().activityLogRemoved(log);
            }

            return this;
        };
    }

    /*
     * Static variables and functions
     */

    /**
     * @static
     * @private
     */
    App._instance = null;

    /**
     * Get the singleton instance
     *
     * @static
     * @returns App
     */
    App.getInstance = function()
    {
        if (!App._instance) {
            App._instance = new App();
            App._instance.init();
        }

        return App._instance;
    };

    /**
     * Format an issue key for entry in the activity log
     *
     * Makes it clickable for easy re-use
     *
     * @param String JIRA issue key
     * @returns String
     */
    App.formatIssueKeyForLog = function(issue)
    {
        return '<a href="#" class="issueKey" title="Click to use as current issue">'+issue+'</a>';
    };

    /*
     * Instances public methods
     */

    /**
     * Alert the user to something (intrusive)
     *
     * @param String message
     */
    App.prototype.alertUser = function(message)
    {
        var log = new ActivityLog(message, ActivityLog.LEVEL_ERROR);
        this.addActivityLog(log);
    };

    /**
     * Warn the user of something (non-intrusive)
     *
     * @param String message
     */
    App.prototype.warnUser = function(message)
    {
        var log = new ActivityLog(message, ActivityLog.LEVEL_WARN);
        this.addActivityLog(log);
    };

    /**
     * Alert the user to something (non-intrusive)
     *
     * @param String message
     */
    App.prototype.notifyUser = function(message)
    {
        var log = new ActivityLog(message, ActivityLog.LEVEL_INFO);
        this.addActivityLog(log);
    };

    /**
     * Initialise the app
     *
     */
    App.prototype.init = function()
    {
        if (this.getLoggedTotal() == null) {
            this.setLoggedTotal(new StopwatchTime());
        }
    };

    /**
     * Launch the app
     *
     */
    App.prototype.start = function()
    {
        var self = this;
        this.resetLoggedTotal();
        this.getStopwatch().addListener(function(time)
        {
            self.updateTime(time);
            if (self.getReminder().isRequired(time)) {
                self.getReminder().show(time);
            }
        });
        this.resetTime();

        // See if config needs setting
        this._testConfig();
    };

    App.prototype.configChanged = function()
    {
        var self = this;
        // The config will have been changed in the UI context, need to reload the version in the background page
        this.getConfig().load(function()
        {
            self._testConfig();
        });
    };

    /**
     * Get summary (subject) of an issue
     *
     * @param String issue The JIRA issue key
     * @returns String The summary line OR null
     */
    App.prototype.getIssueSummary = function(issue, callback)
    {
        var details = this.getJira().getIssueSummary(issue, function(details)
        {
            var summary = null;
            if (details && details.fields.summary) {
                summary = details.fields.summary;
            }
            callback(summary);
        });
    };

    /**
     * Log time to JIRA
     *
     * @param String time The time to log in JIRA time format (1d 1h 1m)
     * @param String issue The JIRA issue key
     * @param String description (Optional) Description of the work done
     * @param String logAdditional (Optional) Extra text to add on to the ActivityLog message
     * @return Boolean Success?
     */
    App.prototype.logTime = function(time, issue, description, logAdditional, callback)
    {
        var self = this;
        this.getJira().logTime(time, issue, description, function(workLogID)
        {
            self.timeLogged(time, issue, description, logAdditional, callback, workLogID);
        });
    };

    App.prototype.timeLogged = function(time, issue, description, logAdditional, callback, workLogID)
    {
        if (!workLogID) {
            this.alertUser('Failed to log '+time+' against '+App.formatIssueKeyForLog(issue)+': no work log was returned by JIRA!');
            callback(false);
        }

        var notification = time+' was successfully logged against '+App.formatIssueKeyForLog(issue);
        if (logAdditional) {
            notification += ' ('+logAdditional+')';
        }
        this.notifyUser(notification);

        this.addToLoggedTotal(this.jiraTimeToStopwatchTime(time));
        this.getEventDispatcher().timeLogged(time);

        callback(true);
    };

    /**
     * Convert a Stopwatch time object to a JIRA time string
     *
     * @param StopwatchTime time
     * @returns String
     */
    App.prototype.stopwatchTimeToJiraTime = function(time)
    {
        var jiraTime = '';
        if (time.hour) {
            jiraTime = time.hour+'h ';
        }
        jiraTime += time.min+'m';

        return jiraTime;
    };

    /**
     * Convert a JIRA time string to a Stopwatch time object
     *
     * @param String time
     * @returns StopwatchTime
     */
    App.prototype.jiraTimeToStopwatchTime = function(time)
    {
        var stopwatchTime = new StopwatchTime();

        var timeParts = time.match(new RegExp(JiraConstants.TIME_REGEX));
        if (timeParts[1]) {
            var days = parseInt(timeParts[1].replace(/[dD] ?/, ''));
            stopwatchTime.hour += (days * 24);
        }
        if (timeParts[2]) {
            var hours = parseInt(timeParts[2].replace(/[hH] ?/, ''));
            stopwatchTime.hour += hours;
        }
        if (timeParts[3]) {
            var mins = parseInt(timeParts[3].replace(/[mM]/, ''));
            stopwatchTime.min += mins;
        }

        return stopwatchTime;
    };

    /**
     * Update the elapsed time
     *
     * @param Object (Optional) hour, min, sec. If not specified it is fetched from Stopwatch
     */
    App.prototype.updateTime = function(time)
    {
        if (!time) {
            time = this.getStopwatch().getTime();
        }

        var jiraTime = this.stopwatchTimeToJiraTime(time);
        this.getEventDispatcher().timeChanged(jiraTime);

        this.updateDayGrandTotal();
    };

    /**
     * Reset the automatic timer
     *
     * @param Boolean log Log the fact the time was reset?
     */
    App.prototype.resetTime = function(log)
    {
        var currTime = this.getStopwatch().getTime();
        this.getStopwatch().restart();
        this.updateTime();
        if (log && currTime && (currTime.min || currTime.hour)) {
            this.notifyUser('The accrued time has been reset ('+this.stopwatchTimeToJiraTime(currTime)+' dropped)');
        }
    };

    /**
     * Remove time from the elapsed total
     *
     * @param String time JIRA time phrase
     */
    App.prototype.deductTime = function(time)
    {
        this.getStopwatch().deductTime(this.jiraTimeToStopwatchTime(time));
        this.updateTime();
    };

    /**
     * Get the accrued time as a JIRA time string
     *
     * @param String roundToNearest 'min' or 'hour' (or neither)
     * @returns String JIRA time phrase
     */
    App.prototype.getTimeAutoAsString = function(roundToNearest)
    {
        var time = this.getStopwatch().getTime(roundToNearest);
        var jiraTime = this.stopwatchTimeToJiraTime(time);
        return jiraTime;
    };

    /**
     * Get the logged total as a JIRA time string
     *
     * @returns String
     */
    App.prototype.getLoggedTotalAsString = function()
    {
        var total = this.getLoggedTotal();
        var jiraTime = this.stopwatchTimeToJiraTime(total);
        return jiraTime;
    };

    /**
     * Add to the daily total
     *
     * @param StopwatchTime time
     * @throws error if passed anything other than a StopwatchTime
     */
    App.prototype.addToLoggedTotal = function(time)
    {
        var loggedTotal = this.getLoggedTotal();
        loggedTotal.hour += parseInt(time.hour);

        loggedTotal.min += parseInt(time.min);
        if (loggedTotal.min >= 60) {
            loggedTotal.min -= 60;
            loggedTotal.hour++;
        }

        this.setLoggedTotal(loggedTotal);
        this.updateLoggedTotal();
    };

    /**
     * Update the daily total time
     *
     * @param StopwatchTime total (Optional) if not specified it is loaded from App
     * @throws error if passed anything other than a StopwatchTime
     */
    App.prototype.updateLoggedTotal = function(total)
    {
        if (total && !(total instanceof StopwatchTime)) {
            throw 'App.updateLoggedTotal called with non-StopwatchTime';
        }
        if (!total) {
            total = this.getLoggedTotal();
        }

        var jiraTime = this.stopwatchTimeToJiraTime(total);
        this.getEventDispatcher().loggedTotalChanged(jiraTime);

        this.updateDayGrandTotal();
    };

    /**
     * Reset the daily total
     *
     * @param Boolean log Log the fact the time was reset?
     */
    App.prototype.resetLoggedTotal = function(log)
    {
        var currTotal = this.getLoggedTotal();
        var loggedTotal = new StopwatchTime();
        this.setLoggedTotal(loggedTotal);
        this.updateLoggedTotal();

        if (log && currTotal && (currTotal.min || currTotal.hour)) {
            this.notifyUser('The total logged time has been reset ('+this.stopwatchTimeToJiraTime(currTotal)+' dropped)');
        }
    };

    /**
     * Update the daily grand total time
     *
     */
    App.prototype.updateDayGrandTotal = function()
    {
        var total = this.getDayGrandTotalAsString();
        this.getEventDispatcher().dayGrandTotalChanged(total);
    };

    /**
     * Get the grand total for the day (logged + unlogged)
     *
     * @returns StopwatchTime
     */
    App.prototype.getDayGrandTotal = function()
    {
        var logged = this.getLoggedTotal();
        var unlogged = this.getStopwatch().getTime();
        if (!logged || !unlogged) {
            return;
        }
        var grandTotal = new StopwatchTime();
        grandTotal.min = logged.min;
        grandTotal.hour = logged.hour;

        grandTotal.min += unlogged.min;
        if (grandTotal.min >= 60) {
            grandTotal.min -= 60;
            grandTotal.hour++;
        }
        grandTotal.hour += unlogged.hour;

        return grandTotal;
    };

    /**
     * Get the daily grand total as a JIRA time string
     *
     * @returns String
     */
    App.prototype.getDayGrandTotalAsString = function()
    {
        var grandTotal = this.getDayGrandTotal();
        return this.stopwatchTimeToJiraTime(grandTotal);
    };

    /**
     * Handle a request to reconfigure the app
     *
     */
    App.prototype.reconfigure = function()
    {
        this.getContainer().showConfiguration();
    };

    /**
     * Handle a request to submit a bug
     *
     */
    App.prototype.bugRequest = function()
    {
        var email = this.getBugReportEmail();
        var subject = encodeURIComponent('JIRA Time Logger bug report');
        this.getContainer().openURL('mailto:'+email+'?subject='+subject);
    };

    /*
     * Private methods
     * No such thing in JavaScript, it's just conceptual
     */

    /**
     * Check the configuration is correct
     *
     * @return Promise
     * @private
     */
    App.prototype._testConfig = function()
    {
        var self = this;
        var promise = new Promise(function(resolve, reject)
        {
            if (!self.getConfig().ready()) {
                reject(new Error('Config not ready'));
                return;
            }

            self.getEventDispatcher().testingJiraConnection();
            self.getJira().testConnection(function(success)
            {
                self.getEventDispatcher().doneTestingJiraConnection();
                if (success) {
                    resolve();
                } else {
                    reject(new Error('JIRA connection failed'));
                }
            });
        });
        promise.then(function()
        {
            self.notifyUser('Connected to JIRA successfully');
        }, function(error)
        {
            self.getLogger().error('Config problem: '+error);
            self.alertUser('Connection to JIRA failed, please check your settings are correct then try again');
            self.reconfigure();
        });
        return promise;
    };

    return App.getInstance();
});