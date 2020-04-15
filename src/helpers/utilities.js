import app from '../stores/app.helper';

export const updateUserInterface = () => {
    app.updateField('selectedId', -1);

    const status = document.getElementById('gameStatus');
    const gameState = app.data().currentGameState;

    // Handle Board
    document.getElementById('moveBackButton').disabled = (app.data().MoveHistory.Pointer < 2);
    document.getElementById('moveForwardButton').disabled = !app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer];
    document.getElementById('moveNowButton').disabled = app.data().currentGameState.SideToPlay !== app.data().ComputerPlaysAs;
    document.getElementById('outSideGoats').innerHTML = gameState.OutsideGoats;
    document.getElementById('outSideTigers').innerHTML = gameState.OutsideTigers;
    document.getElementById('sideToMove').innerHTML = gameState.SideToPlay === 0 ? '🐅 Tigers' : '🐐 Goats';
    for (var i = 0; i < gameState.CurrentPosition.length; i++) {
        const img = document.getElementById(`i${i}`);
        if (gameState.CurrentPosition[i] === 'G') {
            img.href.baseVal = 'img/goat.svg';
            img.className.baseVal = 'goat';
        } else if (gameState.CurrentPosition[i] === 'T') {
            img.href.baseVal = 'img/tiger.svg';
            img.className.baseVal = 'tiger';
        } else {
            img.href.baseVal = 'img/empty.png';
            img.className.baseVal = 'empty';
        }
    }

    // Handle Board Results
    if (gameState.Result === -1 && app.data().isInProgress) {
        status.innerHTML = 'In Progress';
    } else {
        if (gameState.Result === 0) status.innerHTML = '🐅 Tigers Win!';
        else if (gameState.Result === 1) status.innerHTML = '🐐 Goats Win!';
        else if (gameState.Result === 2) status.innerHTML = 'Draw';
        else {
            status.innerHTML = 'Stopped';
            document.getElementById('gameType').disabled = false;
        }
    }
}

// element: { id, class }
export const processUserInput = (element) => {
    // Only process input where atleast one human is involved
    if (app.data().isInProgress === true && app.data().ComputerPlaysAs !== 2) {
        if (app.data().currentGameState.SideToPlay === 1 && [0, 3].includes(app.data().computerPlaysAs)) {
            const actions = app.data().currentGameState.getLegalActions();
            if (actions.length === 0) {
                declareVictory();
                return;
            }
            if (app.data().currentGameState.OutsideGoats > 0) {
                var isLegal = false;
                for (var i = 0; i < actions.length; i++) {
                    if (actions[i].compare([-1, -1, element.id])) {
                        isLegal = true;
                        break;
                    }
                }
                if (isLegal) {
                    app.data().currentGameState = app.data().currentGameState.generateSuccessor([-1, -1, element.id], app.data().MoveHistory);
                    app.data().MoveHistory.push(app.data().currentGameState);
                    app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer] = null;
                    updateUserInterface();
                    if (app.data().computerPlaysAs !== 3) setTimeout(() => computerPlay(0), 500);
                }
            } else {
                if (element.class === 'goat')
                    app.data().selectedId = element.id;
                else if (element.class === 'empty') {
                    if (app.data().selectedId > -1) {
                        var isLegal = false;
                        for (var i = 0; i < actions.length; i++) {
                            if (actions[i].compare([app.data().selectedId, -1, element.id])) {
                                isLegal = true;
                                break;
                            }
                        }
                        if (isLegal) {
                            app.data().currentGameState = app.data().currentGameState.generateSuccessor([app.data().selectedId, -1, element.id], app.data().MoveHistory);
                            app.data().MoveHistory.push(app.data().currentGameState);
                            app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer] = null;
                            updateUserInterface();
                            if (app.data().computerPlaysAs !== 3) setTimeout(() => computerPlay(0), 500);
                        }
                    }
                }
            }
        } else if (app.data().currentGameState.SideToPlay === 0 && [1, 3].includes(app.data().computerPlaysAs)) {
            const actions = app.data().currentGameState.getLegalActions();
            if (actions.length === 0) {
                declareVictory();
                return;
            }
            if (app.data().currentGameState.OutsideTigers > 0) {
                var isLegal = false;
                for (var i = 0; i < actions.length; i++) {
                    if (actions[i].compare([-1, -1, element.id])) {
                        isLegal = true;
                        break;
                    }
                }
                if (isLegal) {
                    app.data().currentGameState = app.data().currentGameState.generateSuccessor([-1, -1, element.id], app.data().MoveHistory);
                    app.data().MoveHistory.push(app.data().currentGameState);
                    app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer] = null;
                    updateUserInterface();
                    if (app.data().computerPlaysAs !== 3) setTimeout(() => computerPlay(0), 500);
                }
            } else {
                if (element.class === 'tiger') {
                    app.updateField('selectedId', element.id);
                } else if (element.class === 'empty') {
                    if (app.data().selectedId > -1) {
                        var isLegal = false;
                        var action = [-1, -1, -1];
                        for (var i = 0; i < actions.length; i++) {
                            if (actions[i][0] === app.data().selectedId && actions[i][2] === element.id) {
                                isLegal = true;
                                action = actions[i];
                                break;
                            }
                        }
                        if (isLegal) {
                            app.data().currentGameState = app.data().currentGameState.generateSuccessor(action, app.data().MoveHistory);
                            app.data().MoveHistory.push(app.data().currentGameState);
                            app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer] = null;
                            updateUserInterface();
                            if (app.data().computerPlaysAs !== 3) setTimeout(() => computerPlay(1), 500);
                        }
                    }
                }
            }
        }
    }
}

const declareVictory = () => {
    app.updateField('isInProgress', false);
    updateUserInterface();
}

const computerPlay = (agentIndex) => {
    const elements = {
        timeLimit: app.data().timeLimit,
        depthLimit: app.data().depthLimit,
    };
    app.data().AgentTerminated = false;
    document.getElementById('moveNowButton').disabled = false;
    app.data().AgentWorker = new Worker('./js/Engine.js');
    app.data().AgentTimers = new Array(3);
    app.data().AgentWorker.onmessage = (e) => {
        if (app.data().AgentTerminated)
            return;
        app.data().AgentResult = e.data;
        if (app.data().AgentResult[2] >= elements.depthLimit) {
            terminateAgent(true);
        }
    }
    app.data().AgentWorker.postMessage([app.data().currentGameState, agentIndex, app.data().MoveHistory]);
    app.data().AgentTimers[0] = setTimeout(() => terminateAgent(), elements.timeLimit * 1000);
    app.data().AgentTimers[1] = setInterval(() => {
        if (app.data().AgentTerminated) {
            for (var i = 0; i < app.data().AgentTimers.length; i++) {
                clearTimeout(app.data().AgentTimers[i]);
            }
            if (app.data().isInProgress) {
                if (!app.data().AgentResult) {
                    resetGame();
                    return;
                }
                app.data().currentGameState = app.data().currentGameState.generateSuccessor(app.data().AgentResult[1], app.data().MoveHistory);
                app.data().MoveHistory.push(app.data().currentGameState);
                app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer] = null;
                if (app.data().currentGameState.Result !== -1) {
                    app.data().isInProgress = false;
                    terminateAgent(true);
                }
                document.getElementById('moveNowButton').disabled = true;
            }
            updateUserInterface();
            if (app.data().isInProgress && app.data().computerPlaysAs === 2)
                computerPlay(app.data().currentGameState.SideToPlay);
        }
    }, 300);
}

const terminateAgent = (force = false) => {
    if (!app.data().AgentTerminated || force) {
        app.data().AgentTerminated = true;
        if (app.data().AgentWorker) app.data().AgentWorker.terminate();
    }
};

export const moveNow = () => terminateAgent();

export const moveBack = () => {
    app.updateField('isInProgress', false);
    terminateAgent();
    if (app.data().MoveHistory.Pointer > 1) {
        app.data().currentGameState = app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer - 2];
        app.data().MoveHistory.Pointer--;
    }
    updateUserInterface();
}

export const moveForward = () => {
    app.updateField('isInProgress', false);
    terminateAgent();
    const state = app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer];
    if (state) {
        app.data().currentGameState = state;
        app.data().MoveHistory.Pointer++;
    }
    updateUserInterface();
}

// -1 = No gametype chosen
// 0 = Computer plays as tigers
// 1 = Computer plays as goats
// 2 = Computer vs Computer
// 3 = Human vs Human
export const startGame = () => {
    const cmpside = document.getElementById('gameType');
    const gameType = parseInt(cmpside.value);
    if (gameType > -1 && app.data().currentGameState.Result === -1) {
        cmpside.disabled = true;
        app.data().isInProgress = true;
        app.data().computerPlaysAs = gameType;
        updateUserInterface();
        if (app.data().currentGameState.SideToPlay === gameType || gameType == 2)
            computerPlay(app.data().currentGameState.SideToPlay);
    }
}

export const stopGame = () => {
    app.updateField('isInProgress', false);
    terminateAgent();
    updateUserInterface();
}

export const resetGame = () => {
    terminateAgent(true);
    if (app.data().AgentTimers) {
        for (var i = 0; i < app.data().AgentTimers.length; i++) {
            clearTimeout(app.data().AgentTimers[i]);
        }
    }
    app.init();
}