/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder');
 * mod.thing == 'a thing'; // true
 */

module.exports.run = function(creep){

    updateWorkingState(creep);

    if (creep.memory.working) {
        buildStructure(creep);
    } else {
        collectEnergy(creep);
    }
};

const buildStructure = (creep) => {
    creep.memory.state = "building";

    const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    if (!target) {
        console.log(`${creep.name} could not find any construction sites.`);
        return;
    }

    const result = creep.build(target);
    if (result === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
    } else if (result !== OK) {
        console.log(`${creep.name} encountered an error while building: ${result}`);
    }
};



const updateWorkingState = (creep) => {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 collect');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('⚡ build');
    }
};

const collectEnergy = (creep) => {
    creep.memory.state = "collecting";

    let source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure =>
            (structure.structureType === STRUCTURE_CONTAINER ||
             structure.structureType === STRUCTURE_STORAGE) &&
            structure.store[RESOURCE_ENERGY] > 0
    });

    if (!source) {
        source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: resource => resource.resourceType === RESOURCE_ENERGY
        });
    }

    if (!source) {
        console.log(`${creep.name} could not find a valid energy source.`);
        return;
    }

    if (source instanceof Resource) {
        const result = creep.pickup(source);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    } else {
        const result = creep.withdraw(source, RESOURCE_ENERGY);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};