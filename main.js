const harvester = require('harvester');
const hauler = require('hauler');
const builder = require('builder');
const upgrader = require('upgrader');

module.exports.loop = function () {
    const spawn = Game.spawns["Spawn1"];

    // Initialize spawn memory if not already set
    if (!Memory.spawnQueue) {
        Memory.spawnQueue = 'harvester'; // Start with harvester
    }

    // Clean up memory of dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            console.log(`Clearing memory of dead creep: ${name}`);
            delete Memory.creeps[name];
        }
    }
    // Spawn logic
    const HARVESTER_LIMIT = 10;
    const HAULER_LIMIT = 10;
    const BUILDER_LIMIT = 3;
    const UPGRADER_LIMIT = 3;

    const builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder');
    const haulers = _.filter(Game.creeps, creep => creep.memory.role === 'hauler');
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader');

    if (harvesters.length == HARVESTER_LIMIT) {
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            // Infer the original role from the creep's name
            const inferredRole = name.startsWith('harvester') ? 'harvester' :
                                 name.startsWith('upgrader') ? 'upgrader' :
                                 name.startsWith('builder') ? 'builder' :
                                 name.startsWith('hauler') ? 'hauler' : null;
    
            // Check if the creep's current role is different from its inferred role
            if (creep.memory.role !== inferredRole && inferredRole !== null) {
                console.log(`Reassigning ${creep.name} back to its original role: ${inferredRole}`);
                creep.memory.role = inferredRole;
                break;
            }
        }
    }
    if (haulers.length == HAULER_LIMIT) {
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            // Infer the original role from the creep's name
            const inferredRole = name.startsWith('harvester') ? 'harvester' :
                                 name.startsWith('upgrader') ? 'upgrader' :
                                 name.startsWith('builder') ? 'builder' :
                                 name.startsWith('hauler') ? 'hauler' : null;
    
            // Check if the creep's current role is different from its inferred role
            if (creep.memory.role !== inferredRole && inferredRole !== null) {
                console.log(`Reassigning ${creep.name} back to its original role: ${inferredRole}`);
                creep.memory.role = inferredRole;
                break;
            }
        }
    }

    // Check available harvesting slots
    const sources = spawn.room.find(FIND_SOURCES_ACTIVE);
    const sourceSlots = {};
    for (const source of sources) {
        const terrain = Game.map.getRoomTerrain(spawn.room.name);
        const positions = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: { structureType: STRUCTURE_ROAD }
        }).length + source.pos.findInRange(1, 1, true).filter(pos => {
            const terrainType = terrain.get(pos.x, pos.y);
            return terrainType === TERRAIN_MASK_SWAMP || terrainType === 0; // 0 for plain
        }).length;

        const assignedHarvesters = _.filter(harvesters, creep => creep.memory.sourceId === source.id).length;
        sourceSlots[source.id] = positions - assignedHarvesters;
    }

    // ...existing code...
    if (!spawn.spawning) {
        console.log(harvesters.length + " harvesters, " + haulers.length + " haulers, " + builders.length + " builders, " + upgraders.length + " upgraders");

        if (Memory.spawnQueue === 'harvester' && harvesters.length < HARVESTER_LIMIT) {
            const body = [WORK, CARRY, MOVE, MOVE];
            const name = `Harvester${Game.time}`;
            const result = spawn.spawnCreep(body, name, { memory: { role: 'harvester' } });
            if (result === OK) {
                console.log(`Spawning new harvester: ${name}`);
                Memory.spawnQueue = 'hauler'; // Switch to hauler next
            }
        } else if (Memory.spawnQueue === 'hauler' && haulers.length < HAULER_LIMIT) {
            const body = [WORK, CARRY, MOVE, MOVE];
            const name = `Hauler${Game.time}`;
            const result = spawn.spawnCreep(body, name, { memory: { role: 'hauler' } });
            if (result === OK) {
                console.log(`Spawning new hauler: ${name}`);
                Memory.spawnQueue = 'harvester'; // Switch to harvester next
            }
        } else if (builders.length < BUILDER_LIMIT) {
            const body = [WORK, CARRY, MOVE, MOVE];
            const name = `Builder${Game.time}`;
            const result = spawn.spawnCreep(body, name, { memory: { role: 'builder' } });
            if (result === OK) {
                console.log(`Spawning new builder: ${name}`);
            }
        } else if (upgraders.length < UPGRADER_LIMIT) {
            const body = [WORK, CARRY, MOVE, MOVE];
            const name = `Upgrader${Game.time}`;
            const result = spawn.spawnCreep(body, name, { memory: { role: 'upgrader' } });
            if (result === OK) {
                console.log(`Spawning new upgrader: ${name}`);
            }
        }
    }

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        // Assign roles if not already
        if (!creep.memory.role) {
            creep.memory.role = 'harvester';
        }

        if (creep.memory.role === 'harvester') {
            harvester.run(creep);
        }
        if (creep.memory.role === 'hauler') {
            hauler.run(creep);
        }
        if (creep.memory.role === 'builder') {
            builder.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            upgrader.run(creep);
        }
    }
}
