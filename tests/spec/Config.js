/**
 * Config.js file
 *
 * Contains tests for the Config class
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define(["jasq", "mock/Storage", "mock/Container"], function (jasq, mockStorage, mockContainer)
{
    describe("The Config class", {
        moduleName: "Config",
        mock: function()
        {
            return {
                "Container/Factory": {
                    get: function()
                    {
                        return mockContainer;
                    }
                },
                "Storage/ChromeExt": mockStorage,
                "json!/config/config.json": {
                    "jira": {
                        "urlBase":  'https://test.atlassian.net',
                        "urlApi": "/rest/api/2/",
                        "username": 'test',
                        "password": btoa('password')
                    },
                    "jtl": {
                        "maxLogs": 50
                    }
                }
            };
        },
        specify: function() {

            it("should get config settings", function(config)
            {
                config.init();
                var username = config.get('username');
                expect(username).toEqual('test');
            });

            it("should set config settings", function(config)
            {
                config.init();
                var newUsername = 'override';
                config.set('username', newUsername, 'jira');

                var username = config.get('username');
                expect(username).toEqual(newUsername);
            });

            it("should encode passwords", function(config)
            {
                config.init();
                var json = config.getJson();
                var newPassword = 'override';
                config.set('password', newPassword, 'jira');

                expect(json.jira.password).toEqual(btoa(newPassword));
            });

            it("should save", function(config, deps)
            {
                config.init();
                var mockStorage = deps["Storage/ChromeExt"];
                spyOn(mockStorage, 'save').and.callThrough();
                var callback = jasmine.createSpy('callback');

                config.save(false, callback);

                expect(mockStorage.save).toHaveBeenCalled();
                expect(callback).toHaveBeenCalledWith(true);
            });
        }
    });
});