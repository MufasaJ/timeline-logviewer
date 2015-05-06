# Event Timeline / Log Viewer

An timeline / log viewer Angular JS project:

+ A single page HTML5 web app -- use the dashboard templates provided in this project:  http://qoriolabs.github.io/timeline-logviewer
+ One page / view in the web app based on the template.
+ A timeline / log viewer
  + Here is the mock  ![mock](/requirements/mock.png)
  + For displaying events/ milestones and a log (like stderr and stdout) from a server.
  + The viewer will update itself as new lines arrive from the server.  It's infinitely scrollable.
  + There are two parts:
    + A milestone view: top-level events (on the right) -- this is a timeline of events from top to bottom.  Most recent event is appended at bottom (see first figure).
    + A detailed, line-by-line view: simply displays each line of the log stream -- this would look like a terminal window.
  + Based on special annotations in the string, the log viewer can highlight or use different fonts.  
Special annotation in the string will also cause a new entry added to the milestone view (see below).
+ A simple NodeJS server that supports websocket.  The Angular component connects to a URL as a websocket component and listens for input line by line.  Each line is rendered in the milestone and detailed views according to the specification below:


## Special features in processing the loglines:

1. The websocket will receive one line at a time.  A simple string (not json).
2. Each line represents the output of a process running on a server.  For example we may want to run `ls -al /bin` on the server and there are many lines returned from the stdout.
3. Each line is rendered in the detailed view, just like a web console / terminal emulator.
4. Depending on the format of the line, trigger special handling and display events in the milestone view.

For example, a line that looks like 

    **** START:MILESTONE 1,This is a milestone **** 

will cause a new entry titled `MILESTONE 1` to be added, with a description `This is a milestone`, this also sets a timestamp and a simple timer in the UI.  
As each line is received from the websocket, the detail view is updated continuously.  
When a line that looks like 

    **** FINISH: MILESTONE 1, No errors ****

is received, the timestamp is taken and an elapsed time is shown next to the `MILESTONE 1` event in the milestone view.  When another line that has the `****` sequence, a new event is added to the milestone view.

Different character sequences will map to different colors to indicate the level of importance:

+ `****` means INFORMATION ==> Use green
+ `????` means WARNING ==> Use orange / yellow
+ `!!!!` means ERROR ==> Use red

We will iterate on the style of the milestone /event object in the milestone/timeline view.


## Simple NodeJS server:

1. This is for this project testing only - not production. 
2. Deployed somewhere.  I can set up a host.
3. The source code should be checked into this repository too.
4. The server should send CORS headers so that the single page web app can work without cross-origin problems.
4. We will use a test bash script to simulate some process that will write to stdout.   When a URL is requsted,
the server will execute the process and send the output to the websocket connection for the viewer to render.




