const IPC = require("./IPC.js");
class Base {
    constructor(setup) {
        this.bot = setup.bot;
        this.clusterID = setup.clusterID;
        this.ipc = new IPC();
    }
}

module.exports = Base;