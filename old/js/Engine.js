importScripts('TigersAndGoats.js');

self.onmessage = (e) => {
    var AgentName = e.data[1];
    var agent;
    switch (AgentName.toLowerCase()) {
        case "minimax":
            agent = new minimaxAgent();
            break;
        case "alphabeta":
            agent = new alphaBetaAgent();
            break;
        case "expectimax":
            agent = new expectimaxAgent();
            break;
        case "scout":
            agent = new scoutAgent();
            break;
        case "alphabetawithmemory":
            agent = new alphaBetaWithTTAgent();
            break;
        case "scoutwithttagent":
            agent = new scoutWithTTAgent();
            break;
        case "mtdfagent":
            agent = new mtdfAgent();
            break;
    }
    agent.Index = Number(e.data[2]);
    agent.History = new HistoryStack(500);
    for (var i = 0; i < e.data[3].Pointer; i++)
        agent.History.push(createGameState(e.data[3].InternalArray[i]));
    agent.getAction(createGameState(e.data[0]));
}

const createGameState = (data) => {
    var gameState = new GameState();
    gameState.SideToPlay = data.SideToPlay;
    gameState.CurrentPosition = data.CurrentPosition.slice(0);
    gameState.OutsideGoats = data.OutsideGoats;
    gameState.Result = data.Result;
    gameState.Hash = data.Hash;
    return gameState;
}