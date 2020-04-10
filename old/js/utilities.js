const updateUserInterface = () => {
    const side = document.getElementById('SideToMove');
    const outside = document.getElementById('OutSideGoats');
    const status = document.getElementById('Status');
    const gameState = app.currentGameState;
    document.getElementById('MoveBackButton').disabled = (app.MoveHistory.Pointer < 2);
    document.getElementById('MoveForwardButton').disabled = (app.MoveHistory.InternalArray[app.MoveHistory.Pointer] === null);
    document.getElementById('MoveNowButton').disabled = app.currentGameState.SideToPlay !== app.ComputerPlaysAs;
    app.selectedId = -1;
    for (var i = 0; i < gameState.CurrentPosition.length; i++) {
        const img = document.getElementById(i);
        if (gameState.CurrentPosition[i] === 'G') {
            img.src = 'images/Goat.png';
            img.class = 'Goat';
        } else if (gameState.CurrentPosition[i] === 'T') {
            img.src = 'images/Tiger.png';
            img.class = 'Tiger';
        } else {
            img.src = 'images/Empty.png';
            img.class = 'Empty';
        }
    }
    outside.innerHTML = gameState.OutsideGoats;
    side.innerHTML = gameState.SideToPlay === 0 ? '🐅 Tigers' : '🐐 Goats';
    if (gameState.Result === -1 && app.isInProgress) {
        status.innerHTML = 'In Progress';
        document.getElementById('StopButton').disabled = false;
        document.getElementById('StartButton').disabled = true;
    } else {
        document.getElementById('StartButton').disabled = true;
        if (gameState.Result === 0) status.innerHTML = '🐅 Tigers Win!';
        else if (gameState.Result === 1) status.innerHTML = '🐐 Goats Win!';
        else if (gameState.Result === 2) status.innerHTML = 'Draw';
        else {
            status.innerHTML = 'Stopped';
            const elements = ['CurrentScore', 'CurrentDepth', 'CurrentAction', 'NodesExpanded', 'LeafNodesReached'];
            for (var i = 0; i < elements.length; i++) {
                document.getElementById(`Tigers${elements[i]}`).innerHTML = '';
                document.getElementById(`Goats${elements[i]}`).innerHTML = '';
            }
            document.getElementById('TigersCurrentProgress').value = '';
            document.getElementById('GoatsCurrentProgress').value = '';

            document.getElementById('ComputerSide').disabled = false;
            document.getElementById('StartButton').disabled = false;
        }
        document.getElementById('StopButton').disabled = true;
    }
}

const ProcessUserInput = (element) => {
    const elementId = parseInt(element.id);
    if (app.isInProgress === true && app.ComputerPlaysAs !== 2) {
        if (app.currentGameState.SideToPlay === 1 && [0, 3].includes(app.computerPlaysAs)) {
            actions = app.currentGameState.getLegalActions();
            if (actions.length === 0) {
                declareVictory();
                return;
            }
            if (app.currentGameState.OutsideGoats > 0) {
                var isLegal = false;
                for (var i = 0; i < actions.length; i++) {
                    if (actions[i].compare([-1, -1, elementId])) {
                        isLegal = true;
                        break;
                    }
                }
                if (isLegal) {
                    app.currentGameState = app.currentGameState.generateSuccessor([-1, -1, elementId], app.MoveHistory);
                    app.MoveHistory.push(app.currentGameState);
                    app.MoveHistory.InternalArray[app.MoveHistory.Pointer] = null;
                    updateUserInterface();
                    if (app.computerPlaysAs !== 3) setTimeout(() => computerPlay(0), 500);
                }
            } else {
                if (element.class === 'Goat')
                    app.selectedId = elementId;
                else if (element.class === 'Empty') {
                    if (app.selectedId > -1) {
                        var isLegal = false;
                        for (var i = 0; i < actions.length; i++) {
                            if (actions[i].compare([app.selectedId, -1, elementId])) {
                                isLegal = true;
                                break;
                            }
                        }
                        if (isLegal) {
                            app.currentGameState = app.currentGameState.generateSuccessor([app.selectedId, -1, elementId], app.MoveHistory);
                            app.MoveHistory.push(app.currentGameState);
                            app.MoveHistory.InternalArray[app.MoveHistory.Pointer] = null;
                            updateUserInterface();
                            if (app.computerPlaysAs !== 3) setTimeout(() => computerPlay(0), 500);
                        }
                    }
                }
            }
        } else if (app.currentGameState.SideToPlay === 0 && [1, 3].includes(app.computerPlaysAs)) {
            actions = app.currentGameState.getLegalActions();
            if (actions.length === 0) {
                declareVictory();
                return;
            }
            if (element.class === 'Tiger') {
                app.selectedId = elementId;
            } else if (element.class === 'Empty') {
                if (app.selectedId > -1) {
                    var isLegal = false;
                    var action = [-1, -1, -1];
                    for (var i = 0; i < actions.length; i++) {
                        if (actions[i][0] === app.selectedId && actions[i][2] === elementId) {
                            isLegal = true;
                            action = actions[i];
                            break;
                        }
                    }
                    if (isLegal) {
                        app.currentGameState = app.currentGameState.generateSuccessor(action, app.MoveHistory);
                        app.MoveHistory.push(app.currentGameState);
                        app.MoveHistory.InternalArray[app.MoveHistory.Pointer] = null;
                        updateUserInterface();
                        if (app.computerPlaysAs !== 3) setTimeout(() => computerPlay(1), 500);
                    }
                }
            }

        }
    }
}

const declareVictory = () => {
    app.isInProgress = false;
    updateUserInterface();
}

const computerPlay = (agentIndex) => {
    const side = agentIndex === 0 ? 'Tigers' : 'Goats';
    const agentName = document.getElementById(`${side}Algorithm`).value;
    const elements = {
        currentScore: document.getElementById(`${side}CurrentScore`),
        currentDepth: document.getElementById(`${side}CurrentDepth`),
        currentAction: document.getElementById(`${side}CurrentAction`),
        currentProgress: document.getElementById(`${side}CurrentProgress`),
        nodesExpanded: document.getElementById(`${side}NodesExpanded`),
        leafReached: document.getElementById(`${side}LeafNodesReached`),
        timeLimit: Number(document.getElementById(`${side}Time`).value),
        depthLimit: Number(document.getElementById(`${side}Depth`).value),
    };
    app.AgentTerminated = false;
    document.getElementById('MoveNowButton').disabled = false;
    const output = document.getElementById('output');
    app.AgentWorker = new Worker('./js/engine.js');
    elements.currentProgress.value = 0;
    app.AgentTimers = new Array(3);
    const startTime = new Date().getTime() / 1000;
    app.AgentWorker.onmessage = (e) => {
        if (app.AgentTerminated)
            return;
        app.AgentResult = e.data;
        if (app.AgentResult[2] <= elements.depthLimit) {
            const time = new Date().getTime();
            elements.currentScore.innerHTML = app.AgentResult[0];
            elements.currentAction.innerHTML = app.AgentResult[1];
            elements.currentDepth.innerHTML = app.AgentResult[2];
            elements.nodesExpanded.innerHTML = app.AgentResult[3];
            elements.leafReached.innerHTML = app.AgentResult[4];
            output.innerHTML += 'Agent: ';
            if (app.currentGameState.SideToPlay === 0)
                output.innerHTML += 'Tigers&#13;&#10;';
            else output.innerHTML += 'Goats&#13;&#10;';
            output.innerHTML += 'Algorithm: ' + agentName + '&#13;&#10;';
            output.innerHTML += 'Depth: ' + app.AgentResult[2] + '&#13;&#10;';
            output.innerHTML += 'Score: ' + app.AgentResult[0] + '&#13;&#10;';
            output.innerHTML += 'Action: ' + app.AgentResult[1] + '&#13;&#10;';
            output.innerHTML += 'Nodes Expanded: ' + app.AgentResult[3] + '&#13;&#10;';
            output.innerHTML += 'Leaf Nodes Reached: ' + app.AgentResult[4] + '&#13;&#10;';
            output.innerHTML += 'Time: ' + (time - startTime * 1000) + ' ms&#13;&#10;';
            output.innerHTML += '---------------------------------------&#13;&#10;';
            if (output.innerHTML.length > 4000)
                output.innerHTML = output.innerHTML.slice(output.innerHTML.length - 3000, output.innerHTML.length - 1);
            output.scrollTop = output.scrollHeight;

        }
        if (app.AgentResult[2] >= elements.depthLimit) {
            app.AgentTerminated = true;
            app.AgentWorker.terminate();
        }
    }
    app.AgentTimers[0] = setInterval(() => {
        if (!app.AgentTerminated) {
            if (app.AgentResult) {
                const value = Math.max(Number(app.AgentResult[2]) / elements.depthLimit * 100, ((new Date().getTime() / 1000) - startTime) / elements.timeLimit * 100);
                elements.currentProgress.value = value;
            }
        }
    }, 1000);
    app.AgentWorker.postMessage([app.currentGameState, agentName, agentIndex, app.MoveHistory]);
    app.AgentTimers[1] = setTimeout(() => {
        if (!app.AgentTerminated) {
            app.AgentTerminated = true;
            app.AgentWorker.terminate();
            elements.currentProgress.value = 100;
        }
    }, elements.timeLimit * 1000);
    app.AgentTimers[2] = setInterval(() => {
        if (app.AgentTerminated) {
            for (var i = 0; i < app.AgentTimers.length; i++) {
                clearTimeout(app.AgentTimers[i]);
            }
            if (app.isInProgress) {
                if (!app.AgentResult) {
                    resetGame();
                    return;
                }
                app.currentGameState = app.currentGameState.generateSuccessor(app.AgentResult[1], app.MoveHistory);
                app.MoveHistory.push(app.currentGameState);
                app.MoveHistory.InternalArray[app.MoveHistory.Pointer] = null;
                if (app.currentGameState.Result !== -1) {
                    app.isInProgress = false;
                    app.AgentTerminated = true;
                    app.AgentWorker.terminate();
                }
                document.getElementById('MoveNowButton').disabled = true;
            }
            updateUserInterface();
            if (app.isInProgress && app.computerPlaysAs === 2)
                computerPlay(app.currentGameState.SideToPlay);
        }
    }, 300);
}

const terminateAgent = (force = false) => {
    if (!app.AgentTerminated || force) {
        app.AgentTerminated = true;
        if (app.AgentWorker) app.AgentWorker.terminate();
    }
};

const moveNow = () => terminateAgent();

const stopGame = () => {
    app.isInProgress = false;
    terminateAgent();
    updateUserInterface();
}

const moveBack = () => {
    app.isInProgress = false;
    terminateAgent();
    if (app.MoveHistory.Pointer > 1) {
        app.currentGameState = app.MoveHistory.InternalArray[app.MoveHistory.Pointer - 2];
        app.MoveHistory.Pointer--;
    }
    updateUserInterface();
}

const moveForward = () => {
    app.isInProgress = false;
    terminateAgent();
    const state = app.MoveHistory.InternalArray[app.MoveHistory.Pointer];
    if (state) {
        app.currentGameState = state;
        app.MoveHistory.Pointer++;
    }
    updateUserInterface();
}

const toggleSide = (side, disabled) => {
    const elements = ['Algorithm', 'Time', 'Depth', 'CurrentProgress'];
    for (var i = 0; i < elements.length; i++) {
        document.getElementById(`${side}${elements[i]}`).disabled = disabled;
    }
}

const changeGameType = (element) => {
    if (element.value === 'tigers') {
        toggleSide('Goats', true);
        toggleSide('Tigers', false);
    } else if (element.value === 'goats') {
        toggleSide('Goats', false);
        toggleSide('Tigers', true);
    } else {
        toggleSide('Goats', false);
        toggleSide('Tigers', false);
    }
}

// 0 = Computer plays as tigers
// 1 = Computer plays as goats
// 2 = Computer vs Computer
// 3 = Human vs Human
const startGame = () => {
    app.isInProgress = true;
    const cmpside = document.getElementById('ComputerSide');
    cmpside.disabled = true;
    app.computerPlaysAs = parseInt(cmpside.value);
    updateUserInterface();
    if (app.currentGameState.SideToPlay === app.computerPlaysAs || app.computerPlaysAs == 2)
        computerPlay(app.currentGameState.SideToPlay);
}

const resetGame = () => {
    terminateAgent(true);
    if (app.AgentTimers) {
        for (var i = 0; i < app.AgentTimers.length; i++) {
            clearTimeout(app.AgentTimers[i]);
        }
    }
    init();
    document.getElementById('StartButton').disabled = false;
    document.getElementById('output').innerHTML = '';
    document.getElementById('TigersDepth').value = Number(document.getElementById('TigersDepth').max);
    document.getElementById('TigersTime').value = Number(document.getElementById('TigersTime').min);
    document.getElementById('GoatsDepth').value = Number(document.getElementById('GoatsDepth').max);
    document.getElementById('GoatsTime').value = Number(document.getElementById('GoatsTime').min);
    updateUserInterface();
}