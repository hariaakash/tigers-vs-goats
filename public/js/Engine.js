importScripts('./classes.js');

self.onmessage = (e) => {
    const agent = new mtdfAgent();
    agent.Index = Number(e.data[1]);
    agent.History = new HistoryStack(500);
    for (var i = 0; i < e.data[2].Pointer; i++)
        agent.History.push(createGameState(e.data[2].InternalArray[i]));
    agent.getAction(createGameState(e.data[0]));
}

const createGameState = (data) => {
    const gameState = new GameState();
    gameState.SideToPlay = data.SideToPlay;
    gameState.CurrentPosition = data.CurrentPosition.slice(0);
    gameState.OutsideGoats = data.OutsideGoats;
    gameState.Result = data.Result;
    gameState.Hash = data.Hash;
    return gameState;
}