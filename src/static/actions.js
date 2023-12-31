// MoveAction[0] = [2, 3, 4, 5] means that from square 0 we can go to sqaures 2, 3, 4 and 5
export const MoveActions = [
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

// [2, 2, 8] means that from square 0, a tiger can capture square 2 and land in square 8
export const CaptureActions = [
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