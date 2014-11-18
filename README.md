# JIRA Time Logger - Chrome Extension#

This is a little extension to help you log your time in [Atlassian's JIRA](https://www.atlassian.com/software/jira) software.

It acts as a stopwatch to monitor the length of time you've worked on something and then allows you to quickly log that time to JIRA.

## Features ##
* Stopwatch to record time spent on current task
    + Can be reset
    + Can be manually entered instead
    + Manual entry can be used to split the time as it is deducted from the accrued time
* Description can be added for the worklog if desired
* Recent activity is logged for reference
    + Issue keys in the log can be clicked to re-use them
    + Hover over a log entry to see the date and time it was made
* Total time logged for the day is recorded

## Installation ##
### Linux & Mac ###
* Download the latest `.crx` file from the [releases section](https://github.com/Lilchef/jira-time-logger-chrome/releases)
* In Chrome visit [chrome://extensions](chrome://extensions)
* Drag-and-drop the `.crx` file on to the page
* Chrome should ask if you to accept the permission request (just to access JIRA) then it will be installed.
* When the app first loads up it will check the settings which obviously wont exist yet so you will see an alert telling you this and clicking it will take you to the settings screen. Fill in the details and submit.

### Windows ###
Unfortunately the Windows version of Chrome does not allow extensions to be installed from anywhere but the Chrome Store. To get around this:
* Clone or download the latest source code
* In Chrome visit [chrome://extensions](chrome://extensions)
* Tick the 'Developer Mode' tickbox at the top of the page
* You should see a new section appear underneath, click 'Load unpacked extension'
* In the file browser select the 'src' folder of the 'jira-time-logger-chrome' directory and click 'Open'


## Usage ##
You should see the time logger icon on the top-right of Chrome, click it to show the logger (and click anywhere else to hide it).
If you don't see it try hovering over the right-most edge of the URL bar until the cursor changes to a left-right arrow then click and drag it left to, hopefully, reveal the time logger icon.

Note: as this is a Chrome extension so it is dependant on Chrome. If you close Chrome or it crashes the app will reset and you will lose any accrued time.

See the [usage instructions](https://github.com/Lilchef/jira-time-logger-chrome/wiki/Usage-instructions) for more.

## Known Issues ##
* The 'Type of work' and 'Resolve/close issue' sections do not work and will shortly be removed
* Clicking 'Reconfigure' and changing the settings will cause the app to reload and any accrued time will be lost

See [bugs in the issues section](https://github.com/Lilchef/jira-time-logger-chrome/issues?labels=bug&page=1&state=open) for more.

## Upcoming Features ##
See [enhancements in the issues section](https://github.com/Lilchef/jira-time-logger-chrome/issues?labels=enhancement&page=1&state=open)

## Author & License ##
Copyright: Aaron Baker, 2014. JIRA and the JIRA logo &copy; Atlassian, Inc.

This work is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/)

This project is in no way affiliated with or supported by Atlassian.
