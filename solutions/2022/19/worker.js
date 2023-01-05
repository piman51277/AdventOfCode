class Factory {
  blueprint = {};
  constructor(blueprint) {
    this.blueprint = blueprint;
    this.ore = 0;
    this.clay = 0;
    this.obsidian = 0;
    this.geode = 0;

    this.oreRobots = 1;
    this.clayRobots = 0;
    this.obsidianRobots = 0;
    this.geodeRobots = 0;
    this.minute = 0;
  }

  collect() {
    this.minute++;
    this.ore += this.oreRobots;
    this.clay += this.clayRobots;
    this.obsidian += this.obsidianRobots;
    this.geode += this.geodeRobots;
    return this;
  }
  canBuildOrerobot() {
    return this.ore >= this.blueprint.oreCost;
  }

  canBuildClayrobot() {
    return this.ore >= this.blueprint.clayCost;
  }

  canBuildObsidianrobot() {
    return (
      this.ore >= this.blueprint.obsidianCostOre &&
      this.clay >= this.blueprint.obsidianCostClay
    );
  }

  canBuildGeoderobot() {
    return (
      this.ore >= this.blueprint.geodeCostOre &&
      this.obsidian >= this.blueprint.geodeCostObsidian
    );
  }

  buildOrerobot() {
    this.ore -= this.blueprint.oreCost;
    this.oreRobots++;

    this.ore--;

    return this;
  }

  buildClayrobot() {
    this.ore -= this.blueprint.clayCost;
    this.clayRobots++;

    this.clay--;

    return this;
  }

  buildObsidianrobot() {
    this.ore -= this.blueprint.obsidianCostOre;
    this.clay -= this.blueprint.obsidianCostClay;
    this.obsidianRobots++;

    this.obsidian--;
    return this;
  }

  buildGeoderobot() {
    this.ore -= this.blueprint.geodeCostOre;
    this.obsidian -= this.blueprint.geodeCostObsidian;
    this.geodeRobots++;

    this.geode--;

    return this;
  }

  clone() {
    const factory = new Factory(this.blueprint);
    factory.ore = this.ore;
    factory.clay = this.clay;
    factory.obsidian = this.obsidian;
    factory.geode = this.geode;
    factory.oreRobots = this.oreRobots;
    factory.clayRobots = this.clayRobots;
    factory.obsidianRobots = this.obsidianRobots;
    factory.geodeRobots = this.geodeRobots;
    factory.minute = this.minute;
    return factory;
  }
}

function getFitness(factory) {
  const { geode } = factory;
  const { oreRobots, clayRobots, obsidianRobots, geodeRobots } = factory;
  const minute = factory.minute;
  const remaining = 24 - minute;

  //figure out how much future geode production we can get
  const futureGeodes = geode + remaining * geodeRobots;

  //compile that into a score
  return (
    futureGeodes * 10000000 +
    obsidianRobots * 10000 +
    clayRobots * 100 +
    oreRobots
  );
}

function processBlueprint(blueprint) {
  let currentGen = [new Factory(blueprint)];
  let nextGen = [];
  let processed = 0;

  for (let gen = 0; gen < 24; gen++) {
    //process current gen
    for (const factory of currentGen) {
      processed++;

      /* Branching */

      //build geode robots
      if (factory.canBuildGeoderobot()) {
        nextGen.push(factory.clone().buildGeoderobot().collect());
      }
      //build obsidian robots
      if (factory.canBuildObsidianrobot()) {
        nextGen.push(factory.clone().buildObsidianrobot().collect());
      }

      //build clay robots
      if (factory.canBuildClayrobot()) {
        nextGen.push(factory.clone().buildClayrobot().collect());
      }

      //build ore robots
      if (factory.canBuildOrerobot()) {
        nextGen.push(factory.clone().buildOrerobot().collect());
      }

      //don't build any robots
      nextGen.push(factory.clone().collect());
    }

    //prune next gen
    const fitnessValues = nextGen.map((factory) => getFitness(factory));

    //sort by fitness
    currentGen = nextGen
      .map((factory, i) => ({ factory, fitness: fitnessValues[i] }))
      .sort((a, b) => b.fitness - a.fitness)
      .map((a) => a.factory)
      .slice(0, 20000);
    nextGen = [];
  }

  //sort by geodes
  const bestFactory = currentGen.sort((a, b) => {
    return b.geode - a.geode;
  })[0];

  return bestFactory.geode;
}

process.on("message", (msg) => {
  const input = msg.msg.input;
  const output = processBlueprint(input);
  process.send({ output: { geodes: output, id: input.blueprintid } });
});
