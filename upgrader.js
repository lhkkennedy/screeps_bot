module.exports = {
    run: function(creep) {
        // Check if creep is upgrading and has no energy left
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 withdraw');
        }
        // Check if creep is withdrawing and is full of energy
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        // If creep is upgrading, upgrade the controller
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        // If creep is withdrawing, get energy from nearby storage or containers
        else {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => 
                    (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
                    structure.store[RESOURCE_ENERGY] > 0
            });
            if (target && creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};