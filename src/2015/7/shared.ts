export const functions = {
    and: (a: number, b: number) => {
        if (a == undefined || b == undefined) {
            return undefined;
        }
        const abin = (a).toString(2).padStart(16, "0").split('');
        const bbin = (b).toString(2).padStart(16, "0").split('');
        return parseInt(abin.map((n, i) => n == "1" && bbin[i] == "1" ? "1" : "0").join(''), 2);
    },
    or: (a: number, b: number) => {
        if (a == undefined || b == undefined) {
            return undefined;
        }
        const abin = (a).toString(2).padStart(16, "0").split('');
        const bbin = (b).toString(2).padStart(16, "0").split('');
        return parseInt(abin.map((n, i) => n == "1" || bbin[i] == "1" ? "1" : "0").join(''), 2);
    },
    not: (a: number) => {
        if (a == undefined) {
            return undefined;
        }
        const abin = (a).toString(2).padStart(16, '0').replace(/0/g, '_').replace(/1/g, '0').replace(/_/g, '1');
        return parseInt(abin, 2);
    },
    rshift: (a: number, amount: number) => {
        if (a == undefined) {
            return undefined;
        }
        return a >> amount;
    },
    lshift: (a: number, amount: number) => {
        if (a == undefined) {
            return undefined;
        }
        return a << amount;
    }
};

//converts raw strings into usable command objects
export interface interpretedCommand {
    operation: "AND" | "OR" | "NOT" | "LSHIFT" | "RSHIFT" | "ASSIGNC" | "ASSIGNV",
    op0?: string,
    op1?: string,
    to: string,
    value?: number
}

export function interpreter(inputStr: string): interpretedCommand {

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

//converts a string into a reference
export function finder(str: string): number {
    return isNaN(Number(str)) ? wires[str]: Number(str);
}

//executes a single instructtion
export function executor(command: interpretedCommand): void {
    const { operation, op0, op1, to, value } = command;

    switch (operation) {
        case "ASSIGNC":
            wires[to] = value;
            break;
        case "ASSIGNV":
            wires[to] = finder(op0);
            break;
        case "NOT":
            wires[to] = functions.not(finder(op0));
            break;
        case "LSHIFT":
            wires[to] = functions.lshift(finder(op0), value);
            break;
        case "RSHIFT":
            wires[to] = functions.rshift(finder(op0), value);
            break;
        case "AND":
            wires[to] = functions.and(finder(op0), finder(op1));
            break;
        case "OR":
            wires[to] = functions.or(finder(op0), finder(op1));
            break;

    }
}

export const wires={};