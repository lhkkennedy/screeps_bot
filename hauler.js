module.exports.run = function(creep) {
    updateWorkingState(creep);

    if (creep.memory.working) {
        deliverEnergy(creep);
    } else {
        collectEnergy(creep);
    }
};

const updateWorkingState = (creep) => {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 collect');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('⚡ deliver');
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

const deliverEnergy = (creep) => {
    creep.memory.state = "delivering";

    let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: structure =>
            (structure.structureType === STRUCTURE_SPAWN ||
             structure.structureType === STRUCTURE_EXTENSION ||
             structure.structureType === STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });

    if (!target) {
        target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: otherCreep =>
                otherCreep.memory.role === 'upgrader' &&
                otherCreep.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
    }

    if (target) {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};
