/**
 * Jira.js file
 *
 * Contains tests for the Jira class
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

define(["jasq"], function()
{
    describe("The Jira class", {
        moduleName: "Jira",
        mock: function()
        {
            return {
                Config: {
                    get: function(key)
                    {
                        return '';
                    }
                },
                Logger: {
                    error: function(message)
                    {
                        // No-op
                    }
                }
            };
        },
        specify: function() {
            beforeEach(function()
            {
                jasmine.Ajax.install();
            });

            afterEach(function()
            {
                jasmine.Ajax.uninstall();
            });

            it("should test the connection and return true if successful", function(jira)
            {
                jasmine.Ajax.stubRequest(/.*/).andReturn({
                    "status": 200,
                    "contentType": 'application/json;charset=UTF-8',
                    "responseText": '{"baseUrl":"https://test.atlassian.net","version":"6.4-OD-11-012","versionNumbers":[6,4,0],"buildNumber":64007,"buildDate":"2014-11-26T00:00:00.000+0000","scmInfo":"af469b7337b45c5b85b57027f049854a8257d66d","serverTitle":"JIRA"}'
                });

                var response = jira.testConnection();
                expect(response).toEqual(true);
            });

            it("should test the connection and return false if unsuccessful", function(jira)
            {
                jasmine.Ajax.stubRequest(/.*/).andReturn({
                    "status": 401,
                    "contentType": 'application/json;charset=UTF-8',
                    "responseText": '{"errorMessages":["You do not have the permission to see the specified issue.","Login Required"],"errors":{}}'
                });

                var response = jira.testConnection();
                expect(response).toEqual(false);
            });

            it("should log time and return a worklog ID", function(jira)
            {
                var worklogId = '100028';
                jasmine.Ajax.stubRequest(/.*/).andReturn({
                    "status": 200,
                    "contentType": 'application/json;charset=UTF-8',
                    "responseText": '{ "self": "http://www.example.com/jira/rest/api/2/issue/10010/worklog/10000", "author": { "self": "http://www.example.com/jira/rest/api/2/user?username=fred", "name": "fred", "displayName": "Fred F. User", "active": false }, "updateAuthor": { "self": "http://www.example.com/jira/rest/api/2/user?username=fred", "name": "fred", "displayName": "Fred F. User", "active": false }, "comment": "", "visibility": { "type": "group", "value": "jira-developers" }, "started": "2014-11-25T12:28:32.041+0000", "timeSpent": "3h 20m", "timeSpentSeconds": 12000, "id": "'+worklogId+'"}'
                });

                var response = jira.logTime('3h 20m', '10010');
                expect(response).toEqual(worklogId);
            });

            it("should not return a worklog ID if time logging fails", function(jira)
            {
                jasmine.Ajax.stubRequest(/.*/).andReturn({
                    "status": 400,
                    "contentType": 'application/json;charset=UTF-8',
                    "responseText": '{"errorMessages":["No content to map to Object due to end of input"]}'
                });

                var response = jira.logTime('3h 20m', '10010');
                expect(response).toEqual(null);
            });

            it("should get an issue's summary", function(jira)
            {
                var summary = 'An example summary';
                jasmine.Ajax.stubRequest(/.*/).andReturn({
                    "status": 200,
                    "contentType": 'application/json;charset=UTF-8',
                    "responseText": '{ "expand": "renderedFields,names,schema,transitions,operations,editmeta,changelog", "id": "10010", "self": "https://test.atlassian.net/jira/rest/api/2/issue/10010", "key": "EX-1", "fields": { "summary": "'+summary+'", "description": "An example description" } }'
                });

                var response = jira.getIssueSummary('10010');
                expect(response.fields.summary).toEqual(summary);

            });

            it("should not get an issue's summary for a non-existant issue", function(jira)
            {
                jasmine.Ajax.stubRequest(/.*/).andReturn({
                    "status": 404,
                    "contentType": 'application/json;charset=UTF-8',
                    "responseText": '{"errorMessages":["The requested issue was not found.","Not Found"],"errors":{}}'
                });

                var response = jira.getIssueSummary('10010');
                expect(response).toEqual(null);

            });
        }
    });
});