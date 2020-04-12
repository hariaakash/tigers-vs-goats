import app from '../stores/app.helper';

export const updateUserInterface = () => {
    const side = document.getElementById('SideToMove');
    const outside = document.getElementById('OutSideGoats');
    const status = document.getElementById('Status');
    const gameState = app.data().currentGameState;
    document.getElementById('MoveBackButton').disabled = (app.data().MoveHistory.Pointer < 2);
    document.getElementById('MoveForwardButton').disabled = !app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer];
    document.getElementById('MoveNowButton').disabled = app.data().currentGameState.SideToPlay !== app.data().ComputerPlaysAs;
    app.data().selectedId = -1;
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
    outside.innerHTML = gameState.OutsideGoats;
    side.innerHTML = gameState.SideToPlay === 0 ? '🐅 Tigers' : '🐐 Goats';
    if (gameState.Result === -1 && app.data().isInProgress) {
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
            document.getElementById('gameType').disabled = false;
            document.getElementById('StartButton').disabled = false;
        }
        document.getElementById('StopButton').disabled = true;
    }
}

// element: { id, class }
export const processUserInput = (element) => {
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
            if (element.class === 'tiger') {
                app.data().selectedId = element.id;
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

const declareVictory = () => {
    app.data().isInProgress = false;
    updateUserInterface();
}

const computerPlay = (agentIndex) => {
    const agentName = app.data().agent;
    const elements = {
        timeLimit: app.data().timeLimit,
        depthLimit: app.data().depthLimit,
    };
    app.data().AgentTerminated = false;
    document.getElementById('MoveNowButton').disabled = false;
    app.data().AgentWorker = new Worker('./js/Engine.js');
    app.data().AgentTimers = new Array(3);
    const startTime = new Date().getTime() / 1000;
    app.data().AgentWorker.onmessage = (e) => {
        if (app.data().AgentTerminated)
            return;
        app.data().AgentResult = e.data;
        if (app.data().AgentResult[2] >= elements.depthLimit) {
            app.data().AgentTerminated = true;
            app.data().AgentWorker.terminate();
        }
    }
    app.data().AgentTimers[0] = setInterval(() => {
        if (!app.data().AgentTerminated) {
            if (app.data().AgentResult) {
                const value = Math.max(Number(app.data().AgentResult[2]) / elements.depthLimit * 100, ((new Date().getTime() / 1000) - startTime) / elements.timeLimit * 100);
            }
        }
    }, 1000);
    app.data().AgentWorker.postMessage([app.data().currentGameState, agentName, agentIndex, app.data().MoveHistory]);
    app.data().AgentTimers[1] = setTimeout(() => {
        if (!app.data().AgentTerminated) {
            app.data().AgentTerminated = true;
            app.data().AgentWorker.terminate();
        }
    }, elements.timeLimit * 1000);
    app.data().AgentTimers[2] = setInterval(() => {
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
                    app.data().AgentTerminated = true;
                    app.data().AgentWorker.terminate();
                }
                document.getElementById('MoveNowButton').disabled = true;
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

export const stopGame = () => {
    app.data().isInProgress = false;
    terminateAgent();
    updateUserInterface();
}

export const moveBack = () => {
    app.data().isInProgress = false;
    terminateAgent();
    if (app.data().MoveHistory.Pointer > 1) {
        app.data().currentGameState = app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer - 2];
        app.data().MoveHistory.Pointer--;
    }
    updateUserInterface();
}

export const moveForward = () => {
    app.data().isInProgress = false;
    terminateAgent();
    const state = app.data().MoveHistory.InternalArray[app.data().MoveHistory.Pointer];
    if (state) {
        app.data().currentGameState = state;
        app.data().MoveHistory.Pointer++;
    }
    updateUserInterface();
}

// 0 = Computer plays as tigers
// 1 = Computer plays as goats
// 2 = Computer vs Computer
// 3 = Human vs Human
export const startGame = () => {
    app.data().isInProgress = true;
    const cmpside = document.getElementById('gameType');
    cmpside.disabled = true;
    app.data().computerPlaysAs = parseInt(cmpside.value);
    updateUserInterface();
    if (app.data().currentGameState.SideToPlay === app.data().computerPlaysAs || app.data().computerPlaysAs == 2)
        computerPlay(app.data().currentGameState.SideToPlay);
}

export const resetGame = () => {
    terminateAgent(true);
    if (app.data().AgentTimers) {
        for (var i = 0; i < app.data().AgentTimers.length; i++) {
            clearTimeout(app.data().AgentTimers[i]);
        }
    }
    app.init();
    document.getElementById('StartButton').disabled = false;
    updateUserInterface();
}