/**
 * App.js file
 *
 * Contains tests for the App class
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define(["jasq", "mock/Container", "ActivityLog", "StopwatchTime"], function (jasq, mockContainer, ActivityLog, StopwatchTime)
{
    describe("The App class", {
        moduleName: "App",
        mock: function()
        {
            return {
                "Container/Factory": {
                    get: function()
                    {
                        return mockContainer;
                    }
                },
                Config: {
                    get: function(key)
                    {
                        switch (key) {
                            case 'maxLogs':
                                return 2;
                            default:
                                return '';
                        }
                    }
                },
                Jira: {},
                Logger: {
                    error: function(message)
                    {
                        // No-op
                    }
                }
            };
        },
        specify: function() {

            it("should add activity logs", function(app)
            {
                var activityLog = new ActivityLog('Test');
                app.addActivityLog(activityLog);

                expect(app.getActivityLogs()).toContain(activityLog);
            });

            it("should clear activity logs", function(app)
            {
                var activityLog = new ActivityLog('Test');
                app.addActivityLog(activityLog);
                expect(app.getActivityLogs().length).toBeGreaterThan(0);

                app.clearActivityLogs();
                expect(app.getActivityLogs().length).toBe(0);
            });

            it("should remove activity logs once the limit is reached", function(app)
            {
                app.clearActivityLogs();
                var activityLog = new ActivityLog('Test');
                app.addActivityLog(activityLog);
                expect(app.getActivityLogs().length).toBe(1);

                app.addActivityLog(activityLog);
                expect(app.getActivityLogs().length).toBe(2);

                // Limit is 2 for the tests
                app.addActivityLog(activityLog);
                expect(app.getActivityLogs().length).toBe(2);
            });

            it("should convert StopwatchTime to JIRA time", function(app)
            {
                var stopwatchTime = new StopwatchTime();
                stopwatchTime.hour = 1;
                stopwatchTime.min = 2;

                var jiraTime = app.stopwatchTimeToJiraTime(stopwatchTime);
                expect(jiraTime).toBe('1h 2m');
            });

            it("should convert JIRA time to StopwatchTime", function(app)
            {
                var jiraTime = '1h 2m';

                var stopwatchTime = app.jiraTimeToStopwatchTime(jiraTime);
                expect(stopwatchTime.hour).toEqual(1);
                expect(stopwatchTime.min).toEqual(2);
            });

            it("should add to the logged total", function(app)
            {
                app.init();
                expect(app.getLoggedTotal().hour).toEqual(0);
                expect(app.getLoggedTotal().min).toEqual(0);

                var stopwatchTime = new StopwatchTime();
                stopwatchTime.hour = 1;
                stopwatchTime.min = 2;

                app.addToLoggedTotal(stopwatchTime);
                
                expect(app.getLoggedTotal().hour).toEqual(1);
                expect(app.getLoggedTotal().min).toEqual(2);
            });

            it("should reset the logged total", function(app)
            {
                app.init();
                expect(app.getLoggedTotal().hour).toEqual(0);
                expect(app.getLoggedTotal().min).toEqual(0);

                var stopwatchTime = new StopwatchTime();
                stopwatchTime.hour = 1;
                stopwatchTime.min = 2;

                app.addToLoggedTotal(stopwatchTime);

                expect(app.getLoggedTotal().hour).toEqual(1);
                expect(app.getLoggedTotal().min).toEqual(2);

                app.resetLoggedTotal(false);
                expect(app.getLoggedTotal().hour).toEqual(0);
                expect(app.getLoggedTotal().min).toEqual(0);
            });

            it("should add to the logged total and account for hour change", function(app)
            {
                app.resetLoggedTotal(false);
                expect(app.getLoggedTotal().hour).toEqual(0);
                expect(app.getLoggedTotal().min).toEqual(0);

                var stopwatchTime1 = new StopwatchTime();
                stopwatchTime1.min = 59;

                app.addToLoggedTotal(stopwatchTime1);

                expect(app.getLoggedTotal().hour).toEqual(0);
                expect(app.getLoggedTotal().min).toEqual(59);

                var stopwatchTime2 = new StopwatchTime();
                stopwatchTime2.min = 10;

                app.addToLoggedTotal(stopwatchTime2);

                expect(app.getLoggedTotal().hour).toEqual(1);
                expect(app.getLoggedTotal().min).toEqual(9);
            });
        }
    });
});