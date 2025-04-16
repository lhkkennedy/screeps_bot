module.exports.run = function(creep){
    updateWorkingStatue(creep);

    if (creep.memory.working) {
        collectEnergy(creep);
    } else {
        deliverEnergy(creep);
    }
};

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

const collectEnergy = (creep) => {
    creep.memory.state = "harvesting";

    const source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure =>
            (structure.structureType === STRUCTURE_CONTAINER ||
             structure.structureType === STRUCTURE_STORAGE) &&
            structure.store[RESOURCE_ENERGY] > 0
    });

    if (source) {
        const result = creep.withdraw(source, RESOURCE_ENERGY);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};

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
    } else if (!target) {
        target = creep.room.controller;
    }
    if (target) {
        let result;
        if (target instanceof StructureController) {
            result = creep.upgradeController(target);
        } else {
            result = creep.transfer(target, RESOURCE_ENERGY);
        }
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: { stroke: '#ffffff' }});
        }
    }
}
