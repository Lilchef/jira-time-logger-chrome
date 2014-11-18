/**
 * ui-config.js file
 *
 * Initialises the UI for the main app popup
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

require([
    'jquery',
    'Config',
    'ConfigConstants',
    'View/Index',
    'Event/Listener/Index',
    'Container/Factory'
], function(
    $,
    config,
    ConfigConstants,
    view,
    listener,
    containerFactory
) {
    var forContext = 'ui-index';
    containerFactory.get().registerCustomEventListener(ConfigConstants.EVENT_INITIALISED+'_'+forContext, function()
    {
        view.init();
        listener.init();
    });
    config.init(forContext);
});