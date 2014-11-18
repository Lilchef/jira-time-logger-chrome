/**
 * ActivityLog.js file
 * 
 * Contains the ActivityLog class.
 * 
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2013
 */

define([], function()
{

    /**
     * ActivityLog class
     *
     * Holds data for one activity log entry
     *
     * @param String message The text to log
     * @param String level One of the AL.LEVEL_* constants, defaults to INFO
     * @param Date dateTimeLogged Defaults to now
     * @constructor
     */
    function ActivityLog(message, level, dateTimeLogged)
    {
        if (!level) {
            level = AL.LEVEL_INFO;
        }
        if (!dateTimeLogged) {
            dateTimeLogged = new Date();
        }

        /**
         * Get this logs message
         *
         * @returns String
         */
        this.getMessage = function()
        {
            return message;
        };

        /**
         * Set this logs message
         *
         * @param String newMessage
         * @returns self
         */
        this.setMessage = function(newMessage)
        {
            message = newMessage;
            return this;
        };

        /**
         * Get this logs severity level
         *
         * One of the AL.LEVEL_* constants
         *
         * @returns String
         */
        this.getLevel = function()
        {
            return level;
        };

        /**
         * Set this logs severity level
         *
         * One of the AL.LEVEL_* constants
         *
         * @param String newLevel
         * @returns self
         */
        this.setLevel = function(newLevel)
        {
            level = newLevel;
            return this;
        };

        /**
         * Get this logs datetimelogged
         *
         * @returns Date
         */
        this.getDateTimeLogged = function()
        {
            return dateTimeLogged;
        };

        /**
         * Set this logs dateTimelogged
         *
         * @param Date newDateTimeLogged
         * @returns self
         */
        this.setDateTimeLogged = function(newDateTimeLogged)
        {
            if (!(dateTimeLogged instanceof Date)) {
                throw 'ActivityLog.setDateTimeLogged must be passed a Date object';
            }
            dateTimeLogged = newDateTimeLogged;
            return this;
        };
    }

    // Alias
    var AL = ActivityLog;

    /**
     * @constants Levels
     */
    AL.LEVEL_INFO = 'INFO';
    AL.LEVEL_WARN = 'WARN';
    AL.LEVEL_ERROR = 'ERROR';

    /**
     * @constants Events
     */
    AL.EVENT_ADDED = 'activity-log-added';
    AL.EVENT_REMOVED = 'activity-log-removed';

    /*
     * Static methods
     */

    /**
     * Convert a plain object to an ActivityLog instance
     *
     * @param Object plainObject
     * @returns ActivityLog
     */
    ActivityLog.fromPlainObject = function(plainObject)
    {
        return new ActivityLog(
            plainObject.message,
            plainObject.level,
            new Date(plainObject.dateTimeLogged)
        );
    };

    /*
     * Member methods
     */

    /**
     * Convert this ActivityLog to a plain object
     * 
     * @returns Object
     */
    ActivityLog.prototype.toPlainObject = function()
    {
        return {
            message: this.getMessage(),
            level: this.getLevel(),
            dateTimeLogged: this.getDateTimeLogged().toString()
        };
    };

    return ActivityLog;
});