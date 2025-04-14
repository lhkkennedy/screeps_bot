/src
  |-- main.js                # Entry point
  |-- manager/
  |     |-- creepManager.js  # Role/behavior coordination
  |     |-- roomManager.js   # Room economy, defense, building
  |     |-- spawnManager.js  # Creep production
  |-- roles/
  |     |-- harvester.js
  |     |-- upgrader.js
  |     |-- builder.js
  |-- utils/
  |     |-- profiler.js      # CPU profiling
  |     |-- logger.js        # Fancy logs
  |-- strategy/
  |     |-- planner.js       # Economic + military planning
  |     |-- telemetry.js     # Auto-data collection
  |     |-- policy.js        # Dynamic decision logic