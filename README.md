# JIRA Time Logger - Chrome App#

This is a little chrome app to help you log your time in [Atlassian's JIRA](https://www.atlassian.com/software/jira) software.

It acts as a stopwatch to monitor the length of time you've worked on something and then allows you to quickly log that time to JIRA.

## Features ##
* Stopwatch to record time spent on current task
    + Can be reset
    + Can be manually entered instead
    + Manual entry can be used to split the time as it is deducted from the accrued time
* Description can be added for the worklog if desired
* Once entered issue keys are looked up to show the summary
    + There's a config option to set a default project key to use so just the numbers of the key can be entered
* Recent activity is logged for reference
    + Issue keys in the log can be clicked to re-use them
    + Hover over a log entry to see the date and time it was made
* Total time logged for the day is recorded
* Shows notification reminders to log time. Their frequency is configurable and they can be turned off if desired

## Installation ##
### Linux & Mac ###
* Download the latest `.crx` file from the [source code](https://github.com/Lilchef/jira-time-logger-chrome/blob/master/jira-time-logger-chrome.crx)
* In Chrome visit [chrome://extensions](chrome://extensions)
* Drag-and-drop the `.crx` file on to the page
* Chrome should ask if you to accept the permission request (just to access JIRA) then it will be installed.
* When the app first loads it will take you to the settings screen. Fill in the details and submit.

### Windows ###
Unfortunately the Windows version of Chrome does not allow extensions to be installed from anywhere but the Chrome Store. To get around this:
* Clone or download the latest source code
* In Chrome visit [chrome://extensions](chrome://extensions)
* Tick the 'Developer Mode' tickbox at the top of the page
* You should see a new section appear underneath, click 'Load unpacked extension'
* In the file browser select the 'src' folder of the 'jira-time-logger-chrome' directory and click 'Open'


## Usage ##
Open the Chrome browser and click the 'Apps' link on the bookmarks bar (or enter chrome://apps in the URL bar).
You should see the time logger icon listed, click it to show the logger.

Note: the app must remain running to continue tracking the accrued time. If you close and re-open the app the timer will reset.

See the [usage instructions](https://github.com/Lilchef/jira-time-logger-chrome/wiki/Usage-instructions) for more.

## Known Issues ##
* Will only work with OnDemand JIRA instances with an `atlassian.net` address

See [bugs in the issues section](https://github.com/Lilchef/jira-time-logger-chrome/issues?labels=bug&page=1&state=open) for more.

## Upcoming Features ##
See [enhancements in the issues section](https://github.com/Lilchef/jira-time-logger-chrome/issues?labels=enhancement&page=1&state=open)

## Author & License ##
Copyright: Aaron Baker, 2014-2016. JIRA and the JIRA logo &copy; Atlassian, Inc.

This work is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/)

This project is in no way affiliated with or supported by Atlassian.
