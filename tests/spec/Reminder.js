/**
 * Reminder.js file
 *
 * Contains the Reminder class.
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define(["jasq", "mock/Container", "StopwatchTime"], function(jasq, mockContainer, StopwatchTime)
{
    describe("The Reminder class", {
        moduleName: "Reminder",
        mock: function()
        {
            return {
                Config: {
                    get: function(key, section)
                    {
                        switch (key) {
                            case 'reminderFrequency':
                                return 30;
                            default:
                                return '';
                        }
                    }
                },
                "Container/Factory": {
                    get: function()
                    {
                        return mockContainer;
                    }
                },
            };
        },
        specify: function()
        {
            it("should say reminder required when time is a multiple of frequency", function(reminder, deps)
            {
                var time = new StopwatchTime();
                time.min = deps.Config.get('reminderFrequency') * 2;
                var response = reminder.isRequired(time);
                expect(response).toEqual(true);
            });

            it("should say reminder not required when time is not a multiple of frequency", function(reminder, deps)
            {
                var time = new StopwatchTime();
                time.min = (deps.Config.get('reminderFrequency') * 2) + 1;
                var response = reminder.isRequired(time);
                expect(response).toEqual(false);
            });
        }
    });
});