/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports.run = function(creep) {
    updateWorkingState(creep);

    if (creep.memory.working) {
        dropEnergy(creep);
    } else {
        harvestEnergy(creep)
    }
}

const updateWorkingState = (creep) => {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = false;
      creep.memory.deliverTarget = creep.memory.deliverTarget === 'spawn' ? 'controller' : 'spawn';
      creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
      creep.say('⚡ deliver');
    }
  };

  const dropEnergy = (creep) => {
    creep.memory.state = "dropping";

    if (creep.store[RESOURCE_ENERGY] > 0) {
        creep.drop(RESOURCE_ENERGY);
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