# Iceland-quake-data
*** Experimentations with earthquake data from Iceland ***

This is something I got keen on when I first discovered what APIs are, at Enspiral Dev Academy. Iceland has heaps of public APIs available, so my plan is to set up a way of gathering the geological data on offer and representing it in a range of ways to map it over time, and make it easy to interpret and maybe even interact with a bit. I'm keen to try working with the following:

* Rails
To set up an API endpoint (or endpoints) of my own to consume and then access particular bits of the Iceland data
* D3
For data display in charts, maybe some cool visual stuff
* React
For speedy loading and some interactivity for user
* Pusher
Would be cool to set up a live feed type of thing for the quake data, but might not be necessary as they don't happen all that often...

* Jasmine Tests
I have done a bit of this, keen to learn more specific testing methods for JS especially with React as I get to it.

I haven't used D3 or React before, and I may end up not using Rails for this as it might work best just as a front end consumable app... I'm looking forward to finding out as I go.

#NOTES FROM IAIN

to build the JSON for the map, clone the repo and run 'make' in the terminal.
this will execute the Makefile which downloads the 10m .shp admin file from Natural Earth, converts it to GeoJSON while filtering for Iceland, and then converts to TopoJSON. 

- see Bostock's great entry about Make http://bost.ocks.org/mike/make/
- also a stackoverflow post i found useful to explain some further mysteries of Make: http://stackoverflow.com/questions/12837823/only-first-command-of-makefile-is-executed
- and some of the weirder Make commands stolen from here: http://bost.ocks.org/mike/bubble-map/
