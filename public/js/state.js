class GameState {
    constructor() {
        this.SideToPlay = 1; //0 === Tigers, 1 === Goats same as AgentIndex
        this.OutsideGoats = 15;
        this.OutsideTigers = 3;
        //array of 23 elements corresponding to 23 squares of the board. Each square is either empty or has a goat or a tiger in it.
        this.CurrentPosition = Array(23).fill('E');
        this.Hash = 0; // A compact representation of the game state. Hash is a 51 bit binary number.
        this.Result = -1; // 0 === Tigers win, 1 === Goats Win, 2 === Draw, -1 === no result
    }

    //getLegalActions: returns a list of legal actions that can be taken from the current game state.
    getLegalActions() {
        var actions = [];
        if (this.SideToPlay === 1) {
            if (this.OutsideGoats > 0) {
                for (var i = 0; i < this.CurrentPosition.length; i++)
                    if (this.CurrentPosition[i] === 'E')
                        actions.push([-1, -1, i]); // first value = from, second value = capture square, third value = to,  -1 means outside or no capture
            } else {
                for (var i = 0; i < this.CurrentPosition.length; i++) {
                    if (this.CurrentPosition[i] === 'G')
                        for (var j = 0; j < MoveActions[i].length; j++)
                            if (this.CurrentPosition[MoveActions[i][j]] === 'E')
                                actions.push([i, -1, MoveActions[i][j]]);
                }
            }
        } else {
            if (this.OutsideTigers > 0) {
                for (var i = 0; i < this.CurrentPosition.length; i++)
                    if (this.CurrentPosition[i] === 'E')
                        actions.push([-1, -1, i]);
            } else {
                for (var i = 0; i < this.CurrentPosition.length; i++) {
                    if (this.CurrentPosition[i] === 'T') {
                        for (var j = 0; j < CaptureActions.length; j++)
                            if (CaptureActions[j][0] === i && this.CurrentPosition[CaptureActions[j][1]] === 'G' && this.CurrentPosition[CaptureActions[j][2]] === 'E')
                                actions.push(CaptureActions[j]);
                        for (var j = 0; j < MoveActions[i].length; j++)
                            if (this.CurrentPosition[MoveActions[i][j]] === 'E')
                                actions.push([i, -1, MoveActions[i][j]]);
                    }
                }
            }
        }
        return actions;
    }

    //generateSuccessor: executes an action and then returns the successor state
    generateSuccessor(action, history) {
        var state = new GameState();
        state.OutsideGoats = this.OutsideGoats;
        state.OutsideTigers = this.OutsideTigers;
        state.Result = this.Result;
        state.SideToPlay = (this.SideToPlay + 1) % 2;
        state.CurrentPosition = this.CurrentPosition.slice(0);
        if (action === [0, 0, 0])
            state.Result = state.SideToPlay;
        else {
            if (action[0] === -1) {
                if (this.SideToPlay === 1) {
                    state.OutsideGoats -= 1;
                    state.CurrentPosition[action[2]] = 'G';
                } else {
                    state.OutsideTigers -= 1;
                    state.CurrentPosition[action[2]] = 'T';
                }
            } else {
                var temp = state.CurrentPosition[action[0]];
                state.CurrentPosition[action[0]] = 'E';
                state.CurrentPosition[action[2]] = temp;
                if (action[1] != -1)
                    state.CurrentPosition[action[1]] = 'E';
            }
        }
        var num = state.OutsideGoats;
        for (var i = 0; i < state.CurrentPosition.length; i++)
            if (state.CurrentPosition[i] === 'G')
                num += 1;
        if (num === 0)
            state.Result = 0;
        else if (state.getLegalActions().length === 0)
            state.Result = this.SideToPlay;

        //compute hash
        state.Hash = 0;
        for (var i = 0; i < state.CurrentPosition.length; i++) {
            if (state.CurrentPosition[i] === 'T')
                state.Hash += 2;
            else if (state.CurrentPosition[i] === 'G')
                state.Hash += 1;
            state.Hash *= 4;
        }
        state.Hash *= 4;
        state.Hash += state.OutsideGoats;
        state.Hash *= 2;
        state.Hash += state.SideToPlay;
        var numEquals = 0;
        for (var i = history.Pointer - 1; i >= 0; i--) {
            if (history.InternalArray[i].Hash === state.Hash)
                numEquals++;
            if (numEquals > 1) {
                state.Result = 2;
                return state;
            }
        }
        return state;
    }
}

class HistoryStack {
    constructor(length) {
        this.InternalArray = new Array(length);
        this.Pointer = 0;
    }
    push(obj) {
        this.InternalArray[this.Pointer] = obj;
        this.Pointer += 1;
    }
    pop() {
        this.Pointer -= 1;
    }
}


class HashTree {
    constructor() {
        this.Nodes = new Array(256);
        this.Data = null;
    }
    find(key) {
        return this.treeSearch(7, key, this.Nodes);
    }
    treeSearch(depth, key, Nodes) {
        var nextKey = key & 0xff;
        if (depth === 1 && Nodes[key]) {
            return Nodes[key].Data;
        } else if (Nodes[nextKey]) {
            key = key - (key & 0xff);
            return this.treeSearch(depth - 1, key / 256, Nodes[nextKey]);
        }
        return null;
    }
    insert(key, data) {
        this.treeInsert(7, key, data, this.Nodes);
    }
    treeInsert(depth, key, data, Nodes) {
        if (depth === 1) {
            Nodes[key] = new HashTree();
            Nodes[key].Data = data;
        } else {
            var nextKey = key & 0xff;
            if (!Nodes[nextKey]) {
                Nodes[nextKey] = new HashTree();
            }
            key = key - (key & 0xff);
            this.treeInsert(depth - 1, key / 256, data, Nodes[nextKey]);
        }
    }
}