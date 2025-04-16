const harvester = require('harvester')
const hauler = require('hauler')
const builder = require('builder')
const upgrader = require('upgrader')

module.exports.loop = function () {
    const spawn = Game.spawns["Spawn1"];

    // Clean up memory of dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            console.log(`Clearing memory of dead creep: ${name}`);
            delete Memory.creeps[name];
        }
    }

    // Spawn logic
    const HARVESTER_LIMIT = 5;
    const BUILDER_LIMIT = 2;
    const HAULER_LIMIT = 2;
    const UPGRADER_LIMIT = 3; // Add upgrader limit
    const builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder');
    const haulers = _.filter(Game.creeps, creep => creep.memory.role === 'hauler');
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader'); // Add upgrader filter

    if (harvesters.length < HARVESTER_LIMIT && !spawn.spawning) {
        const body = [WORK, CARRY, MOVE, MOVE]
        const name = `Harvester${Game.time}`

        const result = spawn.spawnCreep(body, name, {
            memory: {role: 'harvester'}
        });

        if (result === OK) {
            console.log(`Spawning new harvester: ${name}`)
        }
    }
    if (builders.length < BUILDER_LIMIT && !spawn.spawning) {
        const body = [WORK, CARRY, MOVE, MOVE]
        const name = `Builder${Game.time}`

        const result = spawn.spawnCreep(body, name, {
            memory: {role: 'builder'}
        });

        if (result === OK) {
            console.log(`Spawning new builder: ${name}`)
        }
    }
    if (haulers.length < HAULER_LIMIT && !spawn.spawning) {
        const body = [WORK, CARRY, MOVE, MOVE]
        const name = `Hauler${Game.time}`

        const result = spawn.spawnCreep(body, name, {
            memory: {role: 'hauler'}
        });

        if (result === OK) {
            console.log(`Spawning new hauler: ${name}`)
        }
    }
    if (upgraders.length < UPGRADER_LIMIT && !spawn.spawning) { // Add upgrader spawn logic
        const body = [WORK, CARRY, MOVE, MOVE]
        const name = `Upgrader${Game.time}`

        const result = spawn.spawnCreep(body, name, {
            memory: {role: 'upgrader'}
        });

        if (result === OK) {
            console.log(`Spawning new upgrader: ${name}`)
        }
    }
    
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        // Assign roles if not already
        if(!creep.memory.role) {
            creep.memory.role = 'harvester';
        }

        if(creep.memory.role === 'harvester') {
            harvester.run(creep)
        }
        if (creep.memory.role === 'hauler') {
            hauler.run(creep)
        }
        if (creep.memory.role === 'builder') {
            builder.run(creep)
        }
        if (creep.memory.role === 'upgrader') { // Add upgrader role logic
            upgrader.run(creep)
        }
    }    
}