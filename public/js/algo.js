class Agent {
    constructor() {
        this.Index = 0;
        this.History = new HistoryStack();
    }
    evaluateScore(agentIndex, score) {
        return agentIndex === 0 ? score : -score;
    }
    evaluate(gameState, actions, agentIndex) {
        if (gameState.Result === 0)
            return this.evaluateScore(agentIndex, 10000);
        else if (gameState.Result === 1)
            return this.evaluateScore(agentIndex, -10000);
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
        return this.evaluateScore(agentIndex, score);
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
            postMessage([result[0], result[1], depth]); //result: score, action, depth
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