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
    'Config'
], function(
    $,
    config
) {

    /**
     * Config class
     *
     * Handles manipulating the HTML view on the config page
     *
     * @constructor
     */
    function Config()
    {
        /**
         * Get the Config instance
         *
         * @returns Config
         */
        this.getConfig = function()
        {
            return config;
        };
    }

    /**
     * Initialise the view
     *
     */
    Config.prototype.init = function()
    {
        var self = this;
        $(document).ready(function()
        {
            self._populateForm();
        });
    };

    /**
     * Validate the config form
     *
     * @returns Array Errors
     */
    Config.prototype.validateForm = function()
    {
        $('#configForm li.warning').removeClass('warning');
        var errors = [];
        if (!$('#urlBase').val().match(/^http(s)?:\/\/.+$/)) {
            $('#urlBase').parent().addClass('warning');
            errors.push('\''+$('#urlBase').val()+'\' does not appear to be a valid URL (make sure it starts http(s))');
        }
        if ($('#username').val() == '') {
            $('#username').parent().addClass('warning');
            errors.push('Username cannot be blank');
        }
        if ($('#password').val() == '') {
            $('#password').parent().addClass('warning');
            errors.push('Password cannot be blank');
        }

        return errors;
    };

    /**
     * Get all the values of the form
     *
     * @returns Object Field name / value pairs
     */
    Config.prototype.getFormValues = function()
    {
        var values = {};
        $('#configForm').find('input, select, textarea').each(function() {
            var name = $(this).attr('name');
            var val = $(this).val();
            if (!name) {
                return true;
            }
            if (name == 'subTaskTypeExclusions') {
                val = val.replace(/,\s+/g, ',').split(',');
            }
            values[name] = val;
        });

        return values;
    };

    /**
     * Populate the configuration form
     *
     * @returns self
     * @private
     */
    Config.prototype._populateForm = function()
    {
        var json = this.getConfig().getJson();
        for (var key in json.jira) {
            if (json.jira[key] && $('#'+key).length == 1) {
                var val = this.getConfig().get(key);
                if (val instanceof Array) {
                    val = val.join(', ');
                }
                $('#'+key).val(val);
            }
        }
        return this;
    };

    return new Config();
});