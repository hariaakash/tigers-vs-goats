/*
==================================================================================
    Class declaration for all agents
==================================================================================
*/

/*
==================================================================================
    The evaluation function evaluates a game state and then returns a score.
    The score depends on the mobility of the tigers and the number of goats left.
==================================================================================
*/
class Agent {
    constructor() {
        this.Index = 0;
        this.History = new HistoryStack();
    }
    evaluate(gameState, actions, agentIndex) {
        function Score(score) {
            if (agentIndex === 0)
                return score;
            else return -score;
        }
        if (gameState.Result === 0)
            return Score(10000);
        else if (gameState.Result === 1)
            return Score(-10000);
        else if (gameState.Result === 2)
            return -5000;
        var score = 0;
        var nGoats = gameState.OutsideGoats;
        for (var i = 0; i < gameState.CurrentPosition.length; i++)
            if (gameState.CurrentPosition[i] === 'G')
                nGoats++;
        var numActions = 0;
        var numCaptures = 0;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i][1] > -1)
                numCaptures++;
            else numActions++;
        }
        score -= 4 * nGoats;
        if (gameState.SideToPlay === 0) { //if tigers are to move
            score += numActions;
            score += 2 * numCaptures;
        } else { //if goats are to move
            for (var i = 0; i < gameState.CurrentPosition.length; i++) { //suppose that it is tigers to move and assign a score anyway !
                if (gameState.CurrentPosition[i] === 'T') {
                    for (var j = 0; j < MoveActions[i].length; j++)
                        if (gameState.CurrentPosition[MoveActions[i][j]] === 'E')
                            score += 1;
                    for (var j = 0; j < CaptureActions.length; j++)
                        if (CaptureActions[j][0] === i && gameState.CurrentPosition[CaptureActions[j][1]] === 'G' && gameState.CurrentPosition[CaptureActions[j][2]] === 'E')
                            score += 2;
                }
            }
        }
        return Score(score);
    }
}


/*
==================================================================================
    This is where the search algorithms are. The getAction method takes a gameState,
    then gets a list of all possible actions for that game state and chooses (returns)
    the best action using a search algorithm. Other than action the search result also
    includes the evaluated score, maximum depth reached and the number of nodes expanded.
==================================================================================
*/

class expectimaxAgent extends Agent {
    getAction(gameState) {
        const data = {
            nodesExpanded: 0,
            leavesReached: 0,
            index: this.Index,
            history: this.History,
        };
        var depth = 1;
        while (true) {
            const result = this.expectimax(gameState, depth, this.Index, data);
            postMessage([result[0], result[1], depth, data.nodesExpanded, data.leavesReached]); //result = score, action, depth, nodesExpanded
            depth++;
        }
    }
    expectimax(state, depth, agentIndex, data) {
        data.history.push(state);
        const actions = state.getLegalActions();
        var action = [0, 0, 0];
        var score;
        if (depth < 1 || actions.length === 0 || state.Result != -1) {
            data.history.pop();
            data.leavesReached++;
            return [super.evaluate(state, actions, data.index), [0, 0, 0]];
        } else if (agentIndex === data.index) {
            score = Number.NEGATIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.expectimax(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data)[0];
                data.nodesExpanded++;
                if (score < result) {
                    score = result;
                    action = actions[i];
                }
            }
        } else {
            score = 0;
            var num = 0;
            for (var i = 0; i < actions.length; i++) {
                score += this.expectimax(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data)[0];
                data.nodesExpanded++;
                num++;
            }
            score = (Math.round((score / num) * 100) / 100);
        }
        data.history.pop();
        return [score, action];
    }
}

class minimaxAgent extends Agent {
    getAction(gameState) {
        const data = {
            nodesExpanded: 0,
            leavesReached: 0,
            index: this.Index,
            history: this.History,
        };
        var depth = 1;
        while (true) {
            const result = this.minimax(gameState, depth, this.Index, data);
            postMessage([result[0], result[1], depth, data.nodesExpanded, data.leavesReached]); //result = score, action, depth, nodesExpanded
            depth++;
        }
    }
    minimax(state, depth, agentIndex, data) {
        data.history.push(state);
        var actions = state.getLegalActions();
        var action = [0, 0, 0];
        var score;
        if (depth < 1 || actions.length === 0 || state.Result !== -1) {
            data.history.pop();
            data.leavesReached++;
            return [this.evaluate(state, actions, data.index), [0, 0, 0]];
        } else if (agentIndex === data.index) {
            score = Number.NEGATIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.minimax(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data)[0];
                data.nodesExpanded++;
                if (score < result) {
                    score = result;
                    action = actions[i];
                }
            }
        } else {
            score = Number.POSITIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.minimax(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data)[0];
                data.nodesExpanded++;
                if (score > result) {
                    score = result;
                    action = actions[i];
                }
            }
        }
        data.history.pop();
        return [score, action];
    }
}

class alphaBetaAgent extends Agent {
    getAction(gameState) {
        const data = {
            nodesExpanded: 0,
            leavesReached: 0,
            index: this.Index,
            history: this.History,
        };
        var depth = 1;
        while (true) {
            const result = this.alphaBeta(gameState, depth, this.Index, data, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
            postMessage([result[0], result[1], depth, data.nodesExpanded, data.leavesReached]); //result: score, action, depth, nodesExpanded
            depth++;
        }
    }
    alphaBeta(state, depth, agentIndex, data, a, b) {
        data.history.push(state);
        var actions = state.getLegalActions();
        var action = [0, 0, 0];
        var score;
        if (depth < 1 || actions.length === 0 || state.Result != -1) {
            data.history.pop();
            data.leavesReached++;
            return [this.evaluate(state, actions, data.index), [0, 0, 0]];
        } else if (agentIndex === data.index) {
            score = Number.NEGATIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.alphaBeta(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, a, b)[0];
                data.nodesExpanded++;
                if (score < result) {
                    score = result;
                    action = actions[i];
                }
                if (score >= b)
                    break;
                if (score > a)
                    a = score;
            }
        } else {
            score = Number.POSITIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.alphaBeta(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, a, b)[0];
                data.nodesExpanded++;
                if (score > result) {
                    action = actions[i];
                    score = result;
                }
                if (score <= a)
                    break;
                if (b > score)
                    b = score;
            }
        }
        data.history.pop();
        return [score, action];
    }
}

class scoutAgent extends Agent {
    getAction(gameState) {
        const data = {
            nodesExpanded: 0,
            leavesReached: 0,
            index: this.Index,
            history: this.History,
        };
        var depth = 1;
        while (true) {
            const result = this.scout(gameState, depth, this.Index, data, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
            postMessage([result[0], result[1], depth, data.nodesExpanded, data.leavesReached]); //result: score, action, depth, nodesExpanded
            depth++;
        }
    }
    scout(state, depth, agentIndex, data, a, b) {
        data.history.push(state);
        var actions = state.getLegalActions();
        var action = [0, 0, 0];
        var score;
        if (depth < 1 || actions.length === 0 || state.Result != -1) {
            data.history.pop();
            data.leavesReached++;
            return [this.evaluate(state, actions, data.index), [0, 0, 0]];
        } else if (agentIndex === data.index) {
            score = Number.NEGATIVE_INFINITY;
            var result;
            var n = b;
            for (var i = 0; i < actions.length; i++) {
                result = this.scout(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, a, n)[0];
                data.nodesExpanded++;
                if (score < result) {
                    if (n === b || depth < 2) {
                        score = result;
                    } else {
                        score = this.scout(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, result, b)[0];
                        data.nodesExpanded++;
                    }
                    action = actions[i];
                }
                if (score >= b)
                    break;
                if (score > a)
                    a = score;
                n = a + 1;
            }
        } else {
            score = Number.POSITIVE_INFINITY;
            var result;
            var n = a;
            for (var i = 0; i < actions.length; i++) {
                result = this.scout(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, n, b)[0];
                data.nodesExpanded++;
                if (score > result) {
                    if (n === a || depth < 2)
                        score = result;
                    else {
                        score = this.scout(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, a, result)[0];
                    }
                    action = actions[i];
                }
                if (score <= a)
                    break;
                if (b > score)
                    b = score;
                n = b - 1;
            }
        }
        data.history.pop();
        return [score, action];
    }
}

class alphaBetaWithTTAgent extends Agent {
    getAction(gameState) {
        const data = {
            nodesExpanded: 0,
            leavesReached: 0,
            index: this.Index,
            history: this.History,
            transpositionTable: new HashTree()
        };
        var depth = 1;
        while (true) {
            const result = this.alphaBeta(gameState, depth, this.Index, data, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
            postMessage([result[0], result[1], depth, data.nodesExpanded, data.leavesReached]); //result: score, action, depth, nodesExpanded
            depth++;
        }
    }
    alphaBeta(state, depth, agentIndex, data, a, b) {
        data.history.push(state);
        var actions = state.getLegalActions();
        var action = [0, 0, 0];
        var score;
        if (depth < 1 || actions.length === 0 || state.Result != -1) {
            data.history.pop();
            data.leavesReached++;
            return [this.evaluate(state, actions, data.index), [0, 0, 0]];
        }
        var TTresult = data.transpositionTable.find(state.Hash);
        if (TTresult != null) {
            if (TTresult[1] >= depth) {
                if (TTresult[2] === TTresult[3]) {
                    data.history.pop();
                    return [TTresult[2], TTresult[0]];
                }
                if (TTresult[2] > b) {
                    data.history.pop();
                    return [TTresult[2], TTresult[0]];
                }
                if (TTresult[3] < a) {
                    data.history.pop();
                    return [TTresult[3], TTresult[0]];
                }
                a = Math.max(a, TTresult[2]);
                b = Math.min(b, TTresult[3]);
            }
            for (var i = 0; i < actions.length; i++) {
                if (actions[i].compare(TTresult[0])) {
                    actions.splice(i, 1);
                    actions.splice(0, 0, TTresult[0]);
                    break;
                }
            }
        }
        if (agentIndex === data.index) {
            score = Number.NEGATIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.alphaBeta(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, a, b)[0];
                data.nodesExpanded++;
                if (score < result) {
                    score = result;
                    action = actions[i];
                }
                if (score >= b)
                    break;
                if (score > a)
                    a = score;
            }
        } else {
            score = Number.POSITIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.alphaBeta(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, a, b)[0];
                data.nodesExpanded++;
                if (score > result) {
                    action = actions[i];
                    score = result;
                }
                if (score <= a)
                    break;
                if (b > score)
                    b = score;
            }
        }
        data.history.pop();
        if (score <= a) data.transpositionTable.insert(state.Hash, [action, depth, Number.NEGATIVE_INFINITY, score]);
        else if (score >= b) data.transpositionTable.insert(state.Hash, [action, depth, score, Number.POSITIVE_INFINITY]);
        else data.transpositionTable.insert(state.Hash, [action, depth, score, score]);
        return [score, action];
    }
}

class scoutWithTTAgent extends Agent {
    getAction(gameState) {
        const data = {
            nodesExpanded: 0,
            leavesReached: 0,
            index: this.Index,
            history: this.History,
            transpositionTable: new HashTree()
        };
        var depth = 1;
        while (true) {
            const result = this.scout(gameState, depth, this.Index, data, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
            postMessage([result[0], result[1], depth, data.nodesExpanded, data.leavesReached]); //result: score, action, depth, nodesExpanded
            depth++;
        }
    }
    scout(state, depth, agentIndex, data, a, b) {
        data.history.push(state);
        var actions = state.getLegalActions();
        var action = [0, 0, 0];
        var score;
        if (depth < 1 || actions.length === 0 || state.Result != -1) {
            data.history.pop();
            data.leavesReached++;
            return [this.evaluate(state, actions, data.index), [0, 0, 0]];
        }
        var TTresult = data.transpositionTable.find(state.Hash);
        if (TTresult != null) {
            if (TTresult[1] >= depth) {
                if (TTresult[2] === TTresult[3]) {
                    data.history.pop();
                    return [TTresult[2], TTresult[0]];
                }
                if (TTresult[2] > b) {
                    data.history.pop();
                    return [TTresult[2], TTresult[0]];
                }
                if (TTresult[3] < a) {
                    data.history.pop();
                    return [TTresult[3], TTresult[0]];
                }
                a = Math.max(a, TTresult[2]);
                b = Math.min(b, TTresult[3]);
            }
            for (var i = 0; i < actions.length; i++) {
                if (actions[i].compare(TTresult[0])) {
                    actions.splice(i, 1);
                    actions.splice(0, 0, TTresult[0]);
                    break;
                }
            }
        }
        if (agentIndex === data.index) {
            score = Number.NEGATIVE_INFINITY;
            var result;
            var n = b;
            for (var i = 0; i < actions.length; i++) {
                result = this.scout(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, a, n)[0];
                data.nodesExpanded++;
                if (score < result) {
                    if (n === b || depth < 2) {
                        score = result;
                    } else {
                        score = this.scout(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, result, b)[0];
                        data.nodesExpanded++;
                    }
                    action = actions[i];
                }
                if (score >= b)
                    break;
                if (score > a)
                    a = score;
                n = a + 1;
            }
        } else {
            score = Number.POSITIVE_INFINITY;
            var result;
            var n = a;
            for (var i = 0; i < actions.length; i++) {
                result = this.scout(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, n, b)[0];
                data.nodesExpanded++;
                if (score > result) {
                    if (n === a || depth < 2)
                        score = result;
                    else {
                        score = this.scout(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, a, result)[0];
                    }
                    action = actions[i];
                }
                if (score <= a)
                    break;
                if (b > score)
                    b = score;
                n = b - 1;
            }
        }
        data.history.pop();
        if (score <= a) data.transpositionTable.insert(state.Hash, [action, depth, Number.NEGATIVE_INFINITY, score]);
        else if (score >= b) data.transpositionTable.insert(state.Hash, [action, depth, score, Number.POSITIVE_INFINITY]);
        else data.transpositionTable.insert(state.Hash, [action, depth, score, score]);
        return [score, action];
    }
}

class mtdfAgent extends Agent {
    getAction(gameState) {
        const data = {
            nodesExpanded: 0,
            leavesReached: 0,
            index: this.Index,
            history: this.History,
            transpositionTable: new HashTree()
        };
        var result = this.evaluate(gameState, gameState.getLegalActions(), data.index);
        var depth = 1,
            guess, lowerBound, upperBound;
        while (true) {
            upperBound = Number.POSITIVE_INFINITY;
            lowerBound = Number.NEGATIVE_INFINITY;
            while (lowerBound < upperBound) {
                if (result[0] === lowerBound) guess = result[0] + 1;
                else guess = result[0];
                result = this.MT(gameState, depth, this.Index, data, guess);
                if (result[0] < guess) upperBound = result[0];
                else lowerBound = result[0];
            }
            postMessage([result[0], result[1], depth, data.nodesExpanded, data.leavesReached]); //result: score, action, depth, nodesExpanded
            depth++;
        }
    }
    MT(state, depth, agentIndex, data, test) {
        data.history.push(state);
        var actions = state.getLegalActions();
        var action = [0, 0, 0];
        var score;
        if (depth < 1 || actions.length === 0 || state.Result != -1) {
            data.history.pop();
            data.leavesReached++;
            return [this.evaluate(state, actions, data.index), [0, 0, 0]];
        }
        var TTresult = data.transpositionTable.find(state.Hash);
        if (TTresult != null) {
            if (TTresult[1] >= depth) {
                if (TTresult[2] >= test) { //if TTresult is a high cutoff
                    data.history.pop();
                    return [TTresult[2], TTresult[0]];
                }
                if (TTresult[3] < test) { //if TTresult is a low cutoff
                    data.history.pop();
                    return [TTresult[3], TTresult[0]];
                }
            }
            for (var i = 0; i < actions.length; i++) {
                if (actions[i].compare(TTresult[0])) {
                    actions.splice(i, 1);
                    actions.splice(0, 0, TTresult[0]);
                    break;
                }
            }
        }
        if (agentIndex === data.index) {
            score = Number.NEGATIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.MT(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, test)[0];
                data.nodesExpanded++;
                if (score < result) {
                    score = result;
                    action = actions[i];
                }
                if (score >= test)
                    break;
            }
        } else {
            score = Number.POSITIVE_INFINITY;
            var result;
            for (var i = 0; i < actions.length; i++) {
                result = this.MT(state.generateSuccessor(actions[i], data.history), depth - 1, (agentIndex + 1) % 2, data, test)[0];
                data.nodesExpanded++;
                if (score > result) {
                    action = actions[i];
                    score = result;
                }
                if (score < test)
                    break;
            }
        }
        data.history.pop();
        if (score >= test) //if failed high
            data.transpositionTable.insert(state.Hash, [action, depth, score, Number.POSITIVE_INFINITY]);
        else if (score < test) //if failed low
            data.transpositionTable.insert(state.Hash, [action, depth, Number.NEGATIVE_INFINITY, score]);
        return [score, action];
    }
}

/*
==================================================================================
    Game State represents the current state of the game.
==================================================================================
*/

class GameState {
    constructor() {
        this.SideToPlay = 1; //0 === Tigers, 1 === Goats same as AgentIndex
        this.OutsideGoats = 15;
        //array of 23 elements corresponding to 23 squares of the board. Each square is either empty or has a goat or a tiger in it.
        this.CurrentPosition = ['T', 'E', 'E', 'T', 'T', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
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
        return actions;
    }

    //generateSuccessor: executes an action and then returns the successor state
    generateSuccessor(action, history) {
        var state = new GameState();
        state.OutsideGoats = this.OutsideGoats;
        state.Result = this.Result;
        state.SideToPlay = (this.SideToPlay + 1) % 2;
        state.CurrentPosition = this.CurrentPosition.slice(0);
        if (action === [0, 0, 0])
            state.Result = state.SideToPlay;
        else {
            if (action[0] === -1) {
                state.OutsideGoats -= 1;
                state.CurrentPosition[action[2]] = 'G';
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

/*
==================================================================================
    Utility
==================================================================================
*/
// MoveAction[0] = [2, 3, 4, 5] means that from square 0 we can go to sqaures 2, 3, 4 and 5
const MoveActions = [
    [2, 3, 4, 5],
    [2, 7],
    [0, 1, 3, 8],
    [2, 0, 4, 9],
    [3, 0, 5, 10],
    [0, 4, 11, 6],
    [5, 12],
    [1, 8, 13],
    [2, 7, 14, 9],
    [3, 8, 10, 15],
    [9, 4, 11, 16],
    [5, 12, 10, 17],
    [6, 11, 18],
    [7, 14],
    [13, 8, 15, 19],
    [9, 14, 16, 20],
    [10, 15, 17, 21],
    [16, 11, 18, 22],
    [12, 17],
    [14, 20],
    [15, 19, 21],
    [16, 20, 22],
    [17, 21]
];
// [2, 2, 8] means that from square 0 a tiger can capture square 2 and land in square 8
const CaptureActions = [
    [0, 2, 8],
    [0, 3, 9],
    [0, 4, 10],
    [0, 5, 11],
    [1, 2, 3],
    [1, 7, 13],
    [2, 8, 14],
    [2, 3, 4],
    [3, 9, 15],
    [3, 4, 5],
    [3, 2, 1],
    [4, 3, 2],
    [4, 5, 6],
    [4, 10, 16],
    [5, 4, 3],
    [5, 11, 17],
    [6, 5, 4],
    [6, 12, 18],
    [7, 8, 9],
    [8, 9, 10],
    [8, 2, 0],
    [8, 14, 19],
    [9, 8, 7],
    [9, 10, 11],
    [9, 3, 0],
    [9, 15, 20],
    [10, 4, 0],
    [10, 9, 8],
    [10, 11, 12],
    [10, 16, 21],
    [11, 10, 9],
    [11, 5, 0],
    [11, 17, 22],
    [12, 11, 10],
    [13, 7, 1],
    [13, 14, 15],
    [14, 8, 2],
    [14, 15, 16],
    [15, 14, 13],
    [15, 16, 17],
    [15, 9, 3],
    [16, 15, 14],
    [16, 10, 4],
    [16, 17, 18],
    [17, 16, 15],
    [17, 11, 5],
    [18, 12, 6],
    [18, 17, 16],
    [19, 14, 8],
    [19, 20, 21],
    [20, 15, 9],
    [20, 21, 22],
    [21, 20, 19],
    [21, 16, 10],
    [22, 21, 20],
    [22, 17, 11]
];

//function taken from stackoverflow
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
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