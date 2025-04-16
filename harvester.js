/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports.run = function(creep) {

    if ( creep.store[RESOURCE_ENERGY] === 0) {
        harvestEnergy(creep);
    } else {
        dropEnergy(creep)
    }
}

  const dropEnergy = (creep) => {
    creep.memory.state = "dropping";

    if (creep.store[RESOURCE_ENERGY] > 0) {
        creep.drop(RESOURCE_ENERGY);
    } else if (creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false; // Switch to harvesting when energy is empty
    }
};

const harvestEnergy = (creep) => {
    creep.memory.state = "harvesting" 

    // make an easy reference to the energy source
    var source = Game.getObjectById('5bbcae5a9099fc012e638d4f');
    // move my creep to the energy source and harvest energy
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: { stroke: '#ffaa00' }});
    }
}