/**
 * ui-config.js file
 *
 * Initialises the UI for the config page
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

require([
    'jquery',
    'Config',
    'ConfigConstants',
    'View/Config',
    'Event/Listener/Config',
    'Container/Factory'
], function(
    $,
    config,
    ConfigConstants,
    view,
    listener,
    containerFactory
) {
    var forContext = 'ui-config';
    containerFactory.get().registerCustomEventListener(ConfigConstants.EVENT_INITIALISED+'_'+forContext, function()
    {
        view.init();
        listener.init();
    });
    config.init(forContext);
});