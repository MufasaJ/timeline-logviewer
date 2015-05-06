# Event Timeline / Log Viewer

An timeline / log viewer Angular JS project:

+ A single page HTML5 web app -- use the dashboard templates provided in this project
+ One page / view in the web app see figure 1 ![Dashboard template](/requirements/dashboard_template1.png)
+ A timeline / log viewer that will
  + Similar to the UI at http://circleci.com or http://travis.com ![travis](https://travis-ci-org.global.ssl.fastly.net/images/landing-page/laptop-591d440305820f085b038882c820f3fe.png)
  + Display a log (like stderr and stdout) from a server.
  + The viewer will update itself as new lines arrive from the server.  It's infinitely scrollable.
  + There are two parts:
    + A milestone view: top-level events (on the right)
    + A detailed, line-by-line view: simply displays each line of the log stream
  + Based on special annotations in the string, the log viewer can highlight or use different fonts.  Special annotation in the string will also cause a new entry added to the milestone view. For example, a line that begins with **** START:MILESTONE 1,This is a milestone **** will cause a new entry titled 'MILESTONE 1' to be added, with a description 'This is a milestone', this also sets a timestamp and a simple timer in the UI.  As each line is received from the websocket, the detail view is updated continuously.  When a line that looks like **** FINISH: MILESTONE 1, No errors ****, the timestamp is taken and an elapsed time is shown next to the MILESTONE 1 event in the milestone view.  
+ A simple NodeJS server that supports websocket
  - The timeline view 



