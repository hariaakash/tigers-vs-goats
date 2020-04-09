function updateUserInterface() {
    const side = document.getElementById("SideToMove");
    const outside = document.getElementById("OutSideGoats");
    const status = document.getElementById("Status");
    const gameState = app.currentGameState;
    document.getElementById("MoveBackButton").disabled = (app.MoveHistory.Pointer < 2);
    document.getElementById("MoveForwardButton").disabled = (app.MoveHistory.InternalArray[app.MoveHistory.Pointer] === null);
    document.getElementById("MoveNowButton").disabled = app.currentGameState.SideToPlay !== app.ComputerPlaysAs;
    app.selectedId = -1;
    for (var i = 0; i < gameState.CurrentPosition.length; i++) {
        const img = document.getElementById(i);
        if (gameState.CurrentPosition[i] === 'G') {
            img.src = "images/Goat.png";
            img.class = "Goat";
        } else if (gameState.CurrentPosition[i] === 'T') {
            img.src = "images/Tiger.png";
            img.class = "Tiger";
        } else {
            img.src = "images/Empty.png";
            img.class = "Empty";
        }
    }
    outside.innerHTML = gameState.OutsideGoats;
    side.innerHTML = gameState.SideToPlay === 0 ? '🐅 Tigers' : '🐐 Goats';
    if (gameState.Result === -1 && app.isInProgress) {
        status.innerHTML = "In Progress";
        document.getElementById("StopButton").disabled = false;
        document.getElementById("StartButton").disabled = true;
    } else {
        document.getElementById("StartButton").disabled = true;
        if (gameState.Result === 0) status.innerHTML = "🐅 Tigers Win!";
        else if (gameState.Result === 1) status.innerHTML = "🐐 Goats Win!";
        else if (gameState.Result === 2) status.innerHTML = "Draw";
        else {
            status.innerHTML = "Stopped";
            document.getElementById("TigersCurrentScore").innerHTML = "";
            document.getElementById("TigersCurrentDepth").innerHTML = "";
            document.getElementById("TigersCurrentAction").innerHTML = "";
            document.getElementById("TigersCurrentProgress").value = "";
            document.getElementById("TigersNodesExpanded").innerHTML = "";
            document.getElementById("TigersLeafNodesReached").innerHTML = "";

            document.getElementById("GoatsCurrentScore").innerHTML = "";
            document.getElementById("GoatsCurrentDepth").innerHTML = "";
            document.getElementById("GoatsCurrentAction").innerHTML = "";
            document.getElementById("GoatsCurrentProgress").value = "";
            document.getElementById("GoatsNodesExpanded").innerHTML = "";
            document.getElementById("GoatsLeafNodesReached").innerHTML = "";

            document.getElementById("ComputerSide").disabled = false;
            document.getElementById("StartButton").disabled = false;
        }
        document.getElementById("StopButton").disabled = true;
    }
}

function ProcessUserInput(element) {
    if (app.isInProgress === true && app.ComputerPlaysAs !== 2) {
        if (app.currentGameState.SideToPlay === 1 && app.computerPlaysAs === 0) {
            actions = app.currentGameState.getLegalActions();
            if (actions.length === 0) {
                declareVictory();
                return;
            }
            if (app.currentGameState.OutsideGoats > 0) {
                var isLegal = false;
                for (var i = 0; i < actions.length; i++)
                    if (actions[i].compare([-1, -1, element.id])) {
                        isLegal = true;
                        break;
                    }
                if (isLegal) {
                    app.currentGameState = app.currentGameState.generateSuccessor([-1, -1, element.id], app.MoveHistory);
                    app.MoveHistory.push(app.currentGameState);
                    app.MoveHistory.InternalArray[app.MoveHistory.Pointer] = null;
                    updateUserInterface(app.currentGameState);
                    setTimeout(function () {
                        computerPlay(0)
                    }, 500);
                }
            } else {
                if (element.class === "Goat")
                    app.selectedId = element.id;
                else if (element.class === "Empty") {
                    if (app.selectedId > -1) {
                        var isLegal = false;
                        for (var i = 0; i < actions.length; i++)
                            if (actions[i].compare([app.selectedId, -1, element.id])) {
                                isLegal = true;
                                break;
                            }
                        if (isLegal) {
                            app.currentGameState = app.currentGameState.generateSuccessor([app.selectedId, -1, element.id], app.MoveHistory);
                            app.MoveHistory.push(app.currentGameState);
                            app.MoveHistory.InternalArray[app.MoveHistory.Pointer] = null;
                            updateUserInterface(app.currentGameState);
                            setTimeout(function () {
                                computerPlay(0)
                            }, 500);
                        }
                    }
                }
            }
        } else if (app.currentGameState.SideToPlay === 0 && app.computerPlaysAs === 1) {
            actions = app.currentGameState.getLegalActions();
            if (actions.length === 0) {
                declareVictory();
                return;
            }
            if (element.class === "Tiger")
                app.selectedId = element.id;
            else if (element.class === "Empty") {
                if (app.selectedId > -1) {
                    var isLegal = false;
                    var action = [-1, -1, -1];
                    for (var i = 0; i < actions.length; i++)
                        if (actions[i][0] === app.selectedId && actions[i][2] === element.id) {
                            isLegal = true;
                            action = actions[i];
                            break;
                        }
                    if (isLegal) {
                        app.currentGameState = app.currentGameState.generateSuccessor(action, app.MoveHistory);
                        app.MoveHistory.push(app.currentGameState);
                        app.MoveHistory.InternalArray[app.MoveHistory.Pointer] = null;
                        updateUserInterface(app.currentGameState);
                        setTimeout(function () {
                            computerPlay(1)
                        }, 500);
                    }
                }
            }

        }
    }

    function declareVictory() {
        app.isInProgress = false;
        //app.currentGameState.Result = (app.currentGameState.SideToPlay + 1) % 2;
        updateUserInterface();
    }
}

function computerPlay(agentIndex) {
    var agentName;
    app.AgentTerminated = false;
    document.getElementById("MoveNowButton").disabled = false;
    var currentScore, currentDepth, currentAction, currentProgress, depthLimit, timeLimit, nodesExpanded, leafReached;
    var output = document.getElementById("output");
    if (agentIndex === 0) {
        agentName = document.getElementById("TigersAlgorithm").options[document.getElementById("TigersAlgorithm").selectedIndex].value;
        currentScore = document.getElementById("TigersCurrentScore");
        currentDepth = document.getElementById("TigersCurrentDepth");
        currentAction = document.getElementById("TigersCurrentAction");
        currentProgress = document.getElementById("TigersCurrentProgress");
        depthLimit = Number(document.getElementById("TigersDepth").value);
        nodesExpanded = document.getElementById("TigersNodesExpanded");
        leafReached = document.getElementById("TigersLeafNodesReached");
        timeLimit = Number(document.getElementById("TigersTime").value);
    } else {
        agentName = document.getElementById("GoatsAlgorithm").options[document.getElementById("GoatsAlgorithm").selectedIndex].value;
        currentScore = document.getElementById("GoatsCurrentScore");
        currentDepth = document.getElementById("GoatsCurrentDepth");
        currentAction = document.getElementById("GoatsCurrentAction");
        nodesExpanded = document.getElementById("GoatsNodesExpanded");
        leafReached = document.getElementById("GoatsLeafNodesReached");
        currentProgress = document.getElementById("GoatsCurrentProgress");
        depthLimit = Number(document.getElementById("GoatsDepth").value);
        timeLimit = Number(document.getElementById("GoatsTime").value);
    }
    app.AgentWorker = new Worker('js/Engine.js');
    currentProgress.value = 0;
    app.AgentTimers = new Array(3);
    var startTime = new Date().getTime() / 1000;
    app.AgentWorker.onmessage = function (e) {
        if (app.AgentTerminated)
            return;
        app.AgentResult = e.data;
        if (app.AgentResult[2] <= depthLimit) {
            var time = new Date().getTime();
            currentScore.innerHTML = app.AgentResult[0];
            currentAction.innerHTML = app.AgentResult[1];
            currentDepth.innerHTML = app.AgentResult[2];
            nodesExpanded.innerHTML = app.AgentResult[3];
            leafReached.innerHTML = app.AgentResult[4];
            output.innerHTML += "Agent: ";
            if (app.currentGameState.SideToPlay === 0)
                output.innerHTML += "Tigers&#13;&#10;";
            else output.innerHTML += "Goats&#13;&#10;";
            output.innerHTML += "Algorithm: " + agentName + "&#13;&#10;";
            output.innerHTML += "Depth: " + app.AgentResult[2] + "&#13;&#10;";
            output.innerHTML += "Score: " + app.AgentResult[0] + "&#13;&#10;";
            output.innerHTML += "Action: " + app.AgentResult[1] + "&#13;&#10;";
            output.innerHTML += "Nodes Expanded: " + app.AgentResult[3] + "&#13;&#10;";
            output.innerHTML += "Leaf Nodes Reached: " + app.AgentResult[4] + "&#13;&#10;";
            output.innerHTML += "Time: " + (time - startTime * 1000) + " ms&#13;&#10;";
            output.innerHTML += "---------------------------------------&#13;&#10;";
            if (output.innerHTML.length > 4000)
                output.innerHTML = output.innerHTML.slice(output.innerHTML.length - 3000, output.innerHTML.length - 1);
            output.scrollTop = output.scrollHeight;

        }
        if (app.AgentResult[2] >= depthLimit) {
            app.AgentTerminated = true;
            app.AgentWorker.terminate();
        }
    }
    app.AgentTimers[0] = setInterval(function () {
        if (!app.AgentTerminated) {
            if (app.AgentResult !== null) {
                var value = Math.max(Number(app.AgentResult[2]) / depthLimit * 100, ((new Date().getTime() / 1000) - startTime) / timeLimit * 100);
                currentProgress.value = value;
            }
        }
    }, 1000);
    app.AgentWorker.postMessage([app.currentGameState, agentName, agentIndex, app.MoveHistory]);
    app.AgentTimers[1] = setTimeout(function () {
        if (!app.AgentTerminated) {
            app.AgentTerminated = true;
            app.AgentWorker.terminate();
            currentProgress.value = 100;
        }
    }, timeLimit * 1000);
    app.AgentTimers[2] = setInterval(function () {
        if (app.AgentTerminated) {
            for (var i = 0; i < app.AgentTimers.length; i++)
                clearTimeout(app.AgentTimers[i]);
            if (app.isInProgress) {
                if (app.AgentResult === null) {
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
                document.getElementById("MoveNowButton").disabled = true;
            }
            updateUserInterface();
            if (app.isInProgress && app.computerPlaysAs === 2)
                computerPlay(app.currentGameState.SideToPlay);
        }
    }, 300);
}

function moveNow() {
    if (!app.AgentTerminated) {
        app.AgentTerminated = true;
        app.AgentWorker.terminate();
    }
}

function stopGame() {
    app.isInProgress = false;
    if (!app.AgentTerminated) {
        app.AgentTerminated = true;
        app.AgentWorker.terminate();
    }
    updateUserInterface();
}

function moveBack() {
    app.isInProgress = false;
    if (!app.AgentTerminated) {
        app.AgentTerminated = true;
        app.AgentWorker.terminate();
    }
    if (app.MoveHistory.Pointer > 1) {
        app.currentGameState = app.MoveHistory.InternalArray[app.MoveHistory.Pointer - 2];
        app.MoveHistory.Pointer--;
    }
    updateUserInterface();
}

function moveForward() {
    app.isInProgress = false;
    if (!app.AgentTerminated) {
        app.AgentTerminated = true;
        app.AgentWorker.terminate();
    }
    var state = app.MoveHistory.InternalArray[app.MoveHistory.Pointer];
    if (state !== null) {
        app.currentGameState = state;
        app.MoveHistory.Pointer++;
    }
    updateUserInterface();
}

function ToggleGoats(disabled) {
    document.getElementById("GoatsAlgorithm").disabled = disabled;
    document.getElementById("GoatsTime").disabled = disabled;
    document.getElementById("GoatsDepth").disabled = disabled;
    document.getElementById("GoatsCurrentProgress").disabled = disabled;
}

function ToggleTigers(disabled) {
    document.getElementById("TigersAlgorithm").disabled = disabled;
    document.getElementById("TigersTime").disabled = disabled;
    document.getElementById("TigersDepth").disabled = disabled;
    document.getElementById("TigersCurrentProgress").disabled = disabled;
}

function changeGameType(element) {
    if (element.options[element.selectedIndex].value === "tigers") {
        ToggleGoats(true);
        ToggleTigers(false);
    } else if (element.options[element.selectedIndex].value === "goats") {
        ToggleGoats(false);
        ToggleTigers(true);
    } else {
        ToggleGoats(false);
        ToggleTigers(false);
    }
}

function startGame() {
    app.isInProgress = true;
    var cmpside = document.getElementById("ComputerSide");
    cmpside.disabled = true;
    if (cmpside.options[cmpside.selectedIndex].value === "goats") {
        app.computerPlaysAs = 1;
        updateUserInterface();
        if (app.currentGameState.SideToPlay === app.computerPlaysAs)
            computerPlay(app.currentGameState.SideToPlay);
    } else if (cmpside.options[cmpside.selectedIndex].value === "tigers") {
        app.computerPlaysAs = 0;
        updateUserInterface();
        if (app.currentGameState.SideToPlay === app.computerPlaysAs)
            computerPlay(app.currentGameState.SideToPlay);
    } else {
        app.computerPlaysAs = 2;
        updateUserInterface();
        computerPlay(app.currentGameState.SideToPlay);
    }
}

function resetGame() {
    setTimeout(function () {
        if (app.AgentWorker !== null) {
            app.AgentTerminated = true;
            app.AgentWorker.terminate();
        }
        if (app.AgentTimers !== null) {
            for (var i = 0; i < app.AgentTimers.length; i++)
                clearTimeout(app.AgentTimers[i]);
        }
        app.selectedId = -1;
        app.isInProgress = false;
        app.currentGameState = new GameState();
        app.MoveHistory = new HistoryStack(500);
        document.getElementById("StartButton").disabled = false;
        document.getElementById("output").innerHTML = "";
        document.getElementById("TigersDepth").value = Number(document.getElementById("TigersDepth").max);
        document.getElementById("TigersTime").value = Number(document.getElementById("TigersTime").min);
        document.getElementById("GoatsDepth").value = Number(document.getElementById("GoatsDepth").max);
        document.getElementById("GoatsTime").value = Number(document.getElementById("GoatsTime").min);
        updateUserInterface();
    }, 0);
}