# Changelog #

## 2.2.0 ##
* Added notification reminders to log time. Their frequency is configurable, defaulting to every 30mins.
* Added config option for a default JIRA project key so one can simply enter a number and JTL will prepend the default key

## 2.1.2 ##
* Fixed a bug introduced in 2.1.1 that was: preventing the issue summary from updating when an issue key was typed in,
preventing the click of issue keys in the log being picked up and preventing clicks of the reset logged total button
being picked up.

## 2.1.1 ##
* Pasting an issue key in via the context menu (or via middle-click in Linux) will now trigger the issue summary to be loaded
* Accrued time is now always calculated from a start time rather than being counted up second by second which lead to inaccuracies

## 2.1.0 ##
* Removed subtask types and close option as they're no longer required.
* Added Jasmine tests for core logic.
* Fixed a bug: when manually logging more time than had been accrued sometimes it would not correctly reset to zero

## 2.0.0 ##
* Migrated app from TideSDK to Chrome Extension