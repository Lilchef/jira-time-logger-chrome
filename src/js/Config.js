/**
 * config.js file
 * 
 * Contains the Config class
 * 
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2013
 */

define([
    'Container/Factory',
    'Storage/Abstract',
    'Storage/Factory',
    'Event/Dispatcher/Config',
    'Logger',
    'ConfigConstants',
    'json!/config/config.json'
], function(
    containerFactory,
    StorageAbstract,
    storageFactory,
    eventDispatcher,
    logger,
    Constants,
    defaultJson
) {
    /**
     * Config class
     *
     * @constructor
     */
    function Config()
    {
        /**
         * @type Container/Abstract
         * @private
         */
        var container = containerFactory.get();
        /**
         * @type Storage/Abstract
         * @private
         */
        var storage = storageFactory.get();
        /**
         * @type Object
         * @private
         */
        var json = {};
        /**
         * @type Array
         * @private
         */
        var requiredConfigs = ["urlBase", "urlApi", "username", "password"];

        /**
         * Get the config JSON
         *
         * @returns Object
         */
        this.getJson = function()
        {
            return json;
        };

        /**
         * Set the config JSON
         *
         * @param Object newJson
         * @returns self
         */
        this.setJson = function(newJson)
        {
            json = newJson;
            return this;
        };

        /**
         * Get the config options that are required
         *
         * @returns Array
         */
        this.getRequiredConfigs = function()
        {
            return requiredConfigs;
        };

        /**
         * Get the container object
         *
         * @returns Container/Abstract
         */
        this.getContainer = function()
        {
            return container;
        };

        /**
         * Get the storage object
         *
         * @returns Storage/Abstract
         */
        this.getStorage = function()
        {
            return storage;
        };

        /**
         * Get the eventDispatcher object
         *
         * @returns Event/Config
         */
        this.getEventDispatcher = function()
        {
            return eventDispatcher;
        };

        /**
         * Get the Logger instance
         *
         * @returns Logger
         */
        this.getLogger = function()
        {
            return logger;
        };

        /**
         * Get the default JSON from the config file
         *
         * @returns Object
         */
        this.getDefaultJson = function()
        {
            return defaultJson;
        };
    }

    /**
     * Alert the user to something (intrusive)
     *
     * @param String message
     * @static
     */
    Config.prototype.alertUser = function(message) {
        alert(message);
    };

    /**
     * Alert the user to something (non-intrusive)
     *
     * @param String message
     */
    Config.prototype.notifyUser = function(message)
    {
        // TODO: improve this
        alert(message);
    };


    /**
     * Initialise
     *
     * @param String forContext A unique name for the calling context.
     *        Config may be intialised from multiple places but that causes us problems as they then all try to respond
     *        to the config initialised event. Making this context name part of the event prevents that. Not ideal but it works.
     */
    Config.prototype.init = function(forContext)
    {
        var self = this;
        var defaultJson = this.getDefaultJson();
        this.getStorage().fetch('config', function(customJson)
        {
            self._buildJson(defaultJson, customJson);
            self.getEventDispatcher().configInitialised(forContext);
        });
    };

    /**
     * Check if the config is ready
     *
     * @return Boolean
     */
    Config.prototype.ready = function()
    {
        var requiredConfigs = this.getRequiredConfigs();
        var json = this.getJson();
        if (!json || !json.jira) {
            return false;
        }
        for (var key in requiredConfigs) {
            if (json.jira[requiredConfigs[key]] === null) {
                return false;
            }
        }

        return true;
    };

    /**
     * Get a config option
     *
     * @param String attribute
     * @param String section
     * @returns Mixed The value
     */
    Config.prototype.get = function(attribute, section)
    {
        section = (section) ? section : 'jira';

        var json = this.getJson();
        if (!json.hasOwnProperty(section) || !json[section].hasOwnProperty(attribute)) {
            throw 'Unknown config requested: '+section+':'+attribute;
        }

        var val = json[section][attribute];
        // If its password that's been requested decode it
        if (attribute == 'password') {
            val = this._decodePassword(val);
        }

        return val;
    };

    /**
     * Set a config option
     *
     * @param String attribute
     * @param String value
     * @param String section
     */
    Config.prototype.set = function(attribute, value, section)
    {
        if (attribute == 'password') {
            value = this._encodePassword(value);
        }
        var json = this.getJson();
        json[section][attribute] = value;
        this.setJson(json);
    };

    /**
     * Save the config options
     *
     * @param Boolean notify Tell the user when done? Defaults to true
     * @param Function callback (Optional) Called when done with the success state
     */
    Config.prototype.save = function(notify, callback)
    {
        notify = (notify === undefined ? true : notify);
        var self = this;
        this.getStorage().save('config', this.getJson(), function(success, errorMsg)
        {
            if (!success) {
                self.alertUser('There was a problem saving your settings, please try again');
                self.getLogger().error(errorMsg);
            }

            if (success && notify) {
                self.notifyUser('Your settings have been saved.');
            }

            if (callback) {
                callback(success);
            }
        });
    };

    /**
     * Save user-entered settings
     * 
     * @param Array settings Key-value pairs
     * @param Function callback (Optional) Called when done with the success state
     */
    Config.prototype.saveSettings = function(settings, callback)
    {
        for (var name in settings) {
            var nameParts = name.split('.');
            if (nameParts.length == 2)
            {
                var section = nameParts[0];
                var key = nameParts[1];
            } else {
                var section = Constants.SECTION_DEFAULT;
                var key = nameParts[0];
            }
            this.set(key, settings[name], section);
        }

        this.save(true, callback);
        this.getContainer().configurationChanged();
    };

    /*
     * Private methods
     * No such thing in JavaScript, it's just conceptual
     */

    /**
     * Build up the JSON config
     *
     * @param Object defaultJson The config JSON loaded from file
     * @param Object customJson The config JSON loaded from Storage
     * @private
     */
    Config.prototype._buildJson = function(defaultJson, customJson)
    {
        var changes = false;
        // If the local config doesn't exist yet set it up
        if (!customJson) {
            customJson = defaultJson;
            changes = true;

        // Otherwise compare it to the base config to see if anything's missing
        } else {

            // TODO: this method expects there to only be two levels of config, make it recursive
            for (var key in defaultJson) {
                if (!customJson.hasOwnProperty(key)) {
                    customJson[key] = defaultJson[key];
                    changes = true;
                    continue;
                }
                for (var subKey in defaultJson[key]) {
                    if (!customJson[key].hasOwnProperty(subKey)) {
                        customJson[key][subKey] = defaultJson[key][subKey];
                        changes = true;
                    }
                }
            }
        }

        this.setJson(customJson);
        if (changes) {
            var notify = false;
            this.save(notify);
        }
    };

    /**
     * Encode the user password
     *
     * @param String value
     * @returns String
     */
    Config.prototype._encodePassword = function(value)
    {
        // Obfuscate the password
        // Not great but its only accessible by the extension so not a big security risk
        return btoa(value);
    };

    /**
     * Decode the user password
     *
     * @param String value
     * @returns String
     */
    Config.prototype._decodePassword = function(value)
    {
        return atob(value);
    };

    return new Config();
});