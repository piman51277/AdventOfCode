//this is over-engineered as fuck

const functions = {
    and: (a: number, b: number) => {
        if (!a || !b) {
            return null;
        }
        const abin = (a).toString(2).padStart(16, "0").split('');
        const bbin = (b).toString(2).padStart(16, "0").split('');
        return parseInt(abin.map((n, i) => n == "1" && bbin[i] == "1" ? "1" : "0").join(''), 2);
    },
    or: (a: number, b: number) => {
        if (!a || !b) {
            return null;
        }
        const abin = (a).toString(2).padStart(16, "0").split('');
        const bbin = (b).toString(2).padStart(16, "0").split('');
        return parseInt(abin.map((n, i) => n == "1" || bbin[i] == "1" ? "1" : "0").join(''), 2);
    },
    not: (a: number) => {
        if (!a) {
            return null;
        }
        const abin = (a).toString(2).padStart(16, '0').replace(/0/g, '_').replace(/1/g, '0').replace(/_/g, '1');
        return parseInt(abin, 2);
    },
    rshift: (a: number, amount: number) => {
        if (!a) {
            return null;
        }
        return a >> amount;
    },
    lshift: (a: number, amount: number) => {
        if (!a) {
            return null;
        }
        return a << amount;
    }
};

//converts raw strings into usable command objects
interface interpretedCommand {
    operation: "AND" | "OR" | "NOT" | "LSHIFT" | "RSHIFT" | "ASSIGNC" | "ASSIGNV",
    op0?: string,
    op1?: string,
    to: string,
    value?: number
}

function interpreter(inputStr: string): interpretedCommand {

    //split into command/output
    const [head, to] = inputStr.split(' -> ');
    if (!head.match(/(AND|OR|NOT|LSHIFT|RSHIFT|ASSIGN)/)) {

        //figure out if its a variable link or a constant assignment
        if (!isNaN(Number(head))) {
            return {
                operation: "ASSIGNC",
                to,
                value: Number(head)
            };
        } else {
            return {
                operation: "ASSIGNV",
                to,
                op0: head
            };
        }
    }

    //figure out what other operand it is
    const [a, b, c] = head.split(' ');
    if (c) {
        switch (b) {
            case "AND":
            case "OR":
                return {
                    operation: b,
                    op0: a,
                    op1: c,
                    to
                };
                break;
            case "LSHIFT":
            case "RSHIFT":
                return {
                    operation: b,
                    op0: a,
                    value: Number(c),
                    to
                };
                break;
        }
    } else {
        return {
            operation: "NOT",
            op0: b,
            to
        };
    }
}

//wire class
class Wire {
    outputs: Socket[];
    value: number;
    isConstant: boolean;
    constructor() {
        this.value = null;
        this.isConstant = false;
        this.outputs = [];
    }
    set(value: number) {
        this.value = value;
        this.outputs.forEach(n => n.set(value));
    }
    link(output: Socket) {
        this.outputs.push(output);
    }
    trigger() {
        this.outputs.forEach(n => n.set(this.value));
    }
    static constant(val: number): Wire {
        const wire = new Wire();
        wire.isConstant = true;
        wire.set(val);
        return wire;
    }
}


//socket class
class Socket {
    port: Wire;
    value: number;
    output: ASSIGN | NOT | AND | OR | LSHIFT | RSHIFT;
    constructor(wire: Wire, output: ASSIGN | NOT | AND | OR | LSHIFT | RSHIFT) {
        this.port = wire;
        this.output = output;
        wire.link(this);
    }
    set(value: number) {
        this.value = value;
        this.output.update();
    }
}

//gate class
class Gate {
    inputs: Socket[];
    output: Wire;
}

//operations
class ASSIGN extends Gate {
    constructor(input: Wire, output: Wire) {
        super();
        this.inputs = [new Socket(input, this)];
        this.output = output;
    }
    update() {
        //console.log("assign gate triggered!");
        this.output.set(this.inputs[0].value);
    }
}

class NOT extends Gate {
    constructor(input: Wire, output: Wire) {
        super();
        this.inputs = [new Socket(input, this)];
        this.output = output;
    }
    update() {
        //console.log("not gate triggered!");
        this.output.set(functions.not(this.inputs[0].value));
    }
}

class AND extends Gate {
    constructor(a: Wire, b: Wire, output: Wire) {
        super();
        this.inputs = [new Socket(a, this), new Socket(b, this)];
        this.output = output;
    }
    update() {
        //console.log("and gate triggered!");
        this.output.set(functions.and(this.inputs[0].value, this.inputs[1].value));
    }
}

class OR extends Gate {
    constructor(a: Wire, b: Wire, output: Wire) {
        super();
        this.inputs = [new Socket(a, this), new Socket(b, this)];
        this.output = output;
    }
    update() {
        //console.log("or gate triggered!");
        this.output.set(functions.or(this.inputs[0].value, this.inputs[1].value));
    }
}

class LSHIFT extends Gate {
    shift: number;
    constructor(input: Wire, shift: number, output: Wire) {
        super();
        this.inputs = [new Socket(input, this)];
        this.output = output;
        this.shift = shift;
    }
    update() {
        //console.log("lshift gate triggered!");
        this.output.set(functions.lshift(this.inputs[0].value, this.shift));
    }
}

class RSHIFT extends Gate {
    shift: number;
    constructor(input: Wire, shift: number, output: Wire) {
        super();
        this.inputs = [new Socket(input, this)];
        this.output = output;
        this.shift = shift;
    }
    update() {
        //console.log("rshift gate triggered!");
        this.output.set(functions.rshift(this.inputs[0].value, this.shift));
    }
}

//import commands and interpret
import fs from "fs";
const commands = fs.readFileSync('./src/2015/7/input.txt', 'utf8').split('\n');
const code = commands.map(interpreter);

const wires = {};
const constantWires = [];
const gates = [];

for (const line of code) {
    const { operation, op0, op1, to, value } = line;
    if (op0 && !wires[op0]) wires[op0] = new Wire();
    if (op1 && !wires[op1]) wires[op1] = new Wire();
    if (to && !wires[to]) wires[to] = new Wire();

    if (operation == "ASSIGNC") {
        const constantWire = Wire.constant(value);
        const assign = new ASSIGN(constantWire, wires[to]);
        gates.push(assign);
        constantWires.push(constantWire);
    }
    else if (operation == "ASSIGNV") {
        const assign = new ASSIGN(wires[op0], wires[to]);
        gates.push(assign);
    }
    else if (operation == "NOT") {
        const not = new NOT(wires[op0], wires[to]);
        gates.push(not);
    }
    else if (operation == "AND") {
        const and = new AND(wires[op0], wires[op1], wires[to]);
        gates.push(and);
    }
    else if (operation == "OR") {
        const or = new OR(wires[op0], wires[op1], wires[to]);
        gates.push(or);
    }
    else if (operation == "LSHIFT") {
        const lshift = new LSHIFT(wires[op0], value, wires[to]);
        gates.push(lshift);
    }
    else if (operation == "RSHIFT") {
        const rshift = new RSHIFT(wires[op0], value, wires[to]);
        gates.push(rshift);
    }
}

constantWires.forEach(n => n.trigger());

setTimeout(()=>{
    //console.log(wires["a"].value);
},5000);