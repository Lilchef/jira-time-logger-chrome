/**
 * Reminder.js file
 *
 * Contains the Reminder class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'Config',
    'Container/Factory'
], function(
    config,
    containerFactory
) {

    /**
     * Reminder class
     *
     * @constructor
     */
    function Reminder()
    {
        /**
         * @type Container/Abstract
         * @private
         */
        var container = containerFactory.get();

        /**
         * Get the reminder frequency minutes
         *
         * @returns Integer
         */
        this.getFrequency = function()
        {
            return config.get('reminderFrequency', 'jtl');
        };

        /**
         * Get the container
         *
         * @returns Container/Abstract
         */
        this.getContainer = function()
        {
            return container;
        };
    }

    /**
     * @constant How long to show the notification for
     */
    Reminder.NOTIFICATION_DURATION_MS = 5000;

    /**
     * Is a reminder required at this time?
     * 
     * @param StopwatchTime timeElapsed
     * @returns Boolean
     */
    Reminder.prototype.isRequired = function(timeElapsed)
    {
        var frequency = this.getFrequency();
        if (parseInt(frequency) == 0 || timeElapsed.toWholeMinutes() == 0) {
            return false;
        }
        if (timeElapsed.toWholeMinutes() % frequency == 0) {
            return true;
        }

        return false;
    };

    /**
     * Show a reminder to the user to log their time
     *
     * @param StopwatchTime timeElapsed
     * @returns self
     */
    Reminder.prototype.show = function(timeElapsed)
    {
        var jiraTime = this.getContainer().getAppInstance().stopwatchTimeToJiraTime(timeElapsed);
        var title = 'JTL Reminder';
        var message = 'You\'ve not logged any time for:\n' + jiraTime;
        this.getContainer().showNotification(title, message, Reminder.NOTIFICATION_DURATION_MS);
    };

    return new Reminder();
});