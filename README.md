# eris-sharder
A sharding manager for the JavaScript eris library

# How to download
To download eris-sharder run `npm install eris-sharder`

# How to use
To use eris-sharder simply copy this code and place it in a file, in the same directory that you ran the npm install in.
```javascript
const Sharder = require('eris-sharder');
const sharder = new Sharder(token, pathToMainFile);
```
-`token` should be your discord bot token. It will be used to calculate how many shards to spawn and to pass it on to your main file.

-`pathToMainFile` should be the path to a file that exports a class. The class must containt a method called "launch". In the constructor the only paramater you should put is for the bot.

# Some notes
Instead of `console.log` use `process.send({ type: "log", msg: "yourLog"});`. This is so that your logs can actually be logged to the console you an view.

# Example of the class file
```javascript
class Class {
    constructor(bot) {
        this.bot = bot;
    }

    launch() {

    }

}

module.exports = Class;
```

# Example of the first file
```javascript
const Sharder = require('eris-sharder');
const sharder = new Sharder("someToken", "/src/main.js);
```
In this example the directory tree will look something like this:
```
Project/
├── node-modules/
│   ├── eris-sharder
|
├── src/
│   ├── main.js
│   
├── index.js
```

