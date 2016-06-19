/**
 * Config.js file
 *
 * Contains the Config class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([
    'jquery',
    'Config',
    'View/Config',
    'Container/Factory'
], function(
    $,
    config,
    view,
    containerFactory
) {

    /**
     * Config class
     *
     * Listens to events on the config page
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
         * Get the Config instance
         *
         * @returns Config
         */
        this.getConfig = function()
        {
            return config;
        };

        /**
         * Get the View instance
         *
         * @returns View/Config
         */
        this.getView = function()
        {
            return view;
        };

        /**
         * Set the View instance
         *
         * @param View/Config newView
         * @returns self
         */
        this.setView = function(newView)
        {
            view = newView;
            return this;
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
     * Initialise
     */
    Config.prototype.init = function()
    {
        var self = this;
        $(document).ready(function()
        {
            self._registerFormListener();
        });
    };

    /**
     * Register a listener for the config form submission
     *
     * @private
     */
    Config.prototype._registerFormListener = function()
    {
        var config = this.getConfig();
        var view = this.getView();
        var container = this.getContainer();
        $('#configForm').off('submit').on('submit', function(e) {
            // Prevent regular form submission
            e.preventDefault();

            // Validation
            var errors = view.validateForm();
            if (errors.length) {
                config.alertUser('Please address the following problems:\n\n' + errors.join('\n'));
                return;
            }

            // No errors, update the config
            var values = view.getFormValues();
            config.saveSettings(values, function(success)
            {
                if (success) {
                    container.closeConfiguration();
                }
            });
        });
    };

    return new Config();
});