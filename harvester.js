/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports.run = function(creep) {
    if (needsToHarvest(creep)) {
        harvestEnergy(creep)
    } else {
        deliverEnergy(creep)
    }
}

const needsToHarvest = (creep) => {
    return creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0
}

const harvestEnergy = (creep) => {
    creep.memory.state = "harvesting" 

    // make an easy reference to the energy source
    var source = Game.getObjectById('5bbcae5a9099fc012e638d4f');
    // move my creep to the energy source and harvest energy
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: { stroke: '#ffaa00' }});
    }
}

const deliverEnergy = (creep) => {
    creep.memory.state = "delivering"

    if (!creep.memory.deliverTarget) {
        creep.memory.deliverTarget = 'spawn'
    }

    let target = null;

    if (creep.memory.deliverTarget === 'spawn') {
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: x => 
                x.structureType === STRUCTURE_SPAWN &&
                x.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })
    } else if (creep.memory.deliverTarget === 'controller') {
        target = creep.room.controller;
    }

    if (target) {
        const result = creep.transfer(target, RESOURCE_ENERGY)
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: { stroke: '#ffffff' }})
        } else if (result === OK || result === ERR_FULL) {
            creep.memory.deliverTarget = creep.memory.deliverTarget === 'spawn' ? 'controller' : 'spawn';
        }
    }
}