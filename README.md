# Iceland Quakes
### Experimentations with earthquake data from Iceland ###

This is something I got keen on when I first discovered what APIs are, at Enspiral Dev Academy in 2015.

Iceland has heaps of public APIs available, so I wanted to set up a way of gathering the geological data on offer and representing it visually, making it easy to interpret and maybe even interact with a bit.

Initially I was keen to try working with the following:

#### Node
Set up the project with NPM, -build a server-
#### Babel
I like writing javascript as ES6, and getting familiar with Babel and Browserify to compile it together and use it in the app is a key goal
#### D3
For data display in charts, maybe some cool visual mapping stuff
#### Mocha Tests
I would like to have some of this, keen to learn more specific testing methods for JS especially when using es6.

I never needed my own server for this though as it's a simple client app to consume the data. I originally built it with plain javascript and d3, then included babel for newer features, most of which are now working natively in the recent browsers anyway. Then I rewrote it in React and used create-react-app to bootstrap the process. I haven't written tests for it so far but will just use Jest when I do. I'd like to add some animations and fun little extra features like that but the basic premise of displaying the earthquakes is there now.
