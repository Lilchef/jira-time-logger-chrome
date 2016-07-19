/**
 * index.js file
 *
 * Contains the background process for running the app
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

"use strict";
/*
 * These variables MUST be global (albeit within the extension)
 * so the popup can access them via chrome.extension.getBackgroundPage().appInstance
 */
var appInstance, configInstance;

require([
    'jquery',
    'Config',
    'ConfigConstants',
    'App',
    'Logger',
    'Container/Factory'
], function(
    $,
    config,
    ConfigConstants,
    app,
    logger,
    containerFactory
) {
    try {
        var container = containerFactory.get();
        container.initialise(function()
        {
            appInstance = app;
            configInstance = config;
            var forContext = 'index';
            container.registerCustomEventListener(ConfigConstants.EVENT_INITIALISED+'_'+forContext, function()
            {
                app.start();
            });
            config.init(forContext);
        });
    } catch (exception) {
        logger.error(exception);
        containerFactory.get().fatal(exception);
    }
});