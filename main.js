module.exports.loop = function () {

    Game.spawns["Spawn1"].spawnCreep([WORK,CARRY,MOVE,MOVE], "My First Creep");
    Game.spawns["Spawn1"].spawnCreep([WORK,CARRY,MOVE,MOVE], "My Second Creep");
    var mycreep = Game.creeps["My First Creep"];
    if (mycreep.store[RESOURCE_ENERGY] == 0) {
        // make an easy reference to the energy source
        var source = Game.getObjectById('5bbcae5a9099fc012e638d4f');
        // move my creep to the energy source and harvest energy
        mycreep.moveTo(source);
        mycreep.harvest(source);
    } else {
        // but if our creep does have energy, bring it to the controller and upgrade it
        
        // make an easy reference to the room's controller
        var controller = mycreep.room.controller;
        // move my creep to the controller and upgrade it
        mycreep.moveTo(controller);
        mycreep.upgradeController(controller);
        

    }
    mycreep = Game.creeps["My Second Creep"]
        if (mycreep.store[RESOURCE_ENERGY] == 0) {
        // make an easy reference to the energy source
        var source = Game.getObjectById('5bbcae5a9099fc012e638d4f');
        // move my creep to the energy source and harvest energy
        mycreep.moveTo(source);
        mycreep.harvest(source);
    } else {
        // but if our creep does have energy, bring it to the controller and upgrade it
        
        // make an easy reference to the room's controller
        var controller = mycreep.room.controller;
        // move my creep to the controller and upgrade it
        mycreep.moveTo(controller);
        mycreep.upgradeController(controller);
    }
}