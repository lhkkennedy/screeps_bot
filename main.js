const harvester = require('harvester')
const hauler = require('hauler')
module.exports.loop = function () {
    const spawn = Game.spawns["Spawn1"];

    // Spawn logic
    const HARVESTER_LIMIT = 4;
    const haulers = _.filter(Game.creeps, creep => creep.memory.role === 'hauler');
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
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
    
    
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        // ASSign roles if not already
        if(!creep.memory.role) {
            creep.memory.role = 'harvester';
        }

        if(creep.memory.role === 'harvester') {
            harvester.run(creep)
        }
        if (creep.memory.role === 'hauler') {
            hauler.run(creep)
        }


    }    
}