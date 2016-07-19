/**
 * ConfigConstants.js file
 *
 * Contains the ConfigConstants class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define([], function()
{

    /**
     * ConfigConstants class
     *
     * Simply contains constants pertaining to Config
     *
     * @constructor
     * @abstract
     */
    function ConfigConstants()
    {

    }

    /**
     * @constants Defaults
     */
    ConfigConstants.SECTION_DEFAULT = 'jira';
    /**
     * @constants Events
     */
    ConfigConstants.EVENT_INITIALISED = 'config-initialised';
    /**
     * @constants Events
     */
    ConfigConstants.EVENT_CHANGED = 'config-changed';

    return ConfigConstants;
});