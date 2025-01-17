// Cria um tabuleiro com as características iniciais
const createBoard = (rows, columns) => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => ({
      row,
      column,
      opened: false,
      flagged: false,
      mined: false,
      explored: false,
      nearMines: 0,
    }))
  );
};

// Espalha as minas aleatoriamente no tabuleiro
const spreadMines = (board, minesAmount) => {
  if (!Array.isArray(board) || board.length === 0 || !Array.isArray(board[0])) {
    console.error("board não é um array válido para espalhar minas!");
    return; // Saia da função caso board não seja válido
  }

  const rows = board.length;
  const columns = board[0].length;
  let minesPlanted = 0;

  while (minesPlanted < minesAmount) {
    const rowSel = Math.floor(Math.random() * rows);
    const columnSel = Math.floor(Math.random() * columns);

    if (!board[rowSel][columnSel].mined) {
      board[rowSel][columnSel].mined = true;
      minesPlanted++;
    }
  }
};

// Cria um tabuleiro com minas espalhadas
const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  spreadMines(board, minesAmount);
  return board;
};

// Clona o tabuleiro para manter a imutabilidade
const cloneBoard = (board) => {
  // Verifique se o board é um array antes de chamar map
  if (!Array.isArray(board)) {
    console.error("board não é um array válido!");
    return []; // Retorna um array vazio em caso de erro
  }

  return board.map((row) => row.map((field) => ({ ...field })));
};

// Obtém os vizinhos de um campo no tabuleiro
const getNeighbors = (board, row, column) => {
  // Verifique se board é um array antes de acessar
  if (!Array.isArray(board) || board.length === 0 || !Array.isArray(board[0])) {
    console.error("board não é um array válido!");
    return []; // Retorna um array vazio se não for um array válido
  }

  const neighbors = [];
  const rows = [row - 1, row, row + 1];
  const columns = [column - 1, column, column + 1];

  rows.forEach((r) => {
    columns.forEach((c) => {
      const isSameField = r === row && c === column;
      const isValidRow = r >= 0 && r < board.length;
      const isValidColumn = c >= 0 && c < board[0].length;

      if (!isSameField && isValidRow && isValidColumn) {
        neighbors.push(board[r][c]);
      }
    });
  });

  return neighbors;
};

// Verifica se todos os vizinhos de um campo são seguros (não possuem minas)
const allNeighborsAreSafe = (board, row, column) => {
  return getNeighbors(board, row, column).every((neighbor) => !neighbor.mined);
};

// Abre um campo no tabuleiro
const openField = (board, row, column) => {
  if (!Array.isArray(board)) {
    console.error("board não é um array válido!");
    return; // Retorna caso board não seja válido
  }

  const field = board[row][column];
  if (!field.opened) {
    field.opened = true;
    if (field.mined) {
      field.explored = true;
    } else if (allNeighborsAreSafe(board, row, column)) {
      getNeighbors(board, row, column).forEach((neighbor) =>
        openField(board, neighbor.row, neighbor.column)
      );
    } else {
      const neighbors = getNeighbors(board, row, column);
      field.nearMines = neighbors.filter((n) => n.mined).length;
    }
  }
};

// Funções auxiliares
const fields = (board) => {
  if (!Array.isArray(board)) {
    console.error("board não é um array válido!");
    return []; // Retorna um array vazio em caso de erro
  }
  return [].concat(...board); // Flatten para facilitar as buscas
};

const hadExplosion = (board) => fields(board).some((field) => field.explored); // Verifica se houve explosão
const pending = (field) =>
  (field.mined && !field.flagged) || (!field.mined && field.opened); // Verifica campos pendentes
const wonGame = (board) => fields(board).every(pending); // Verifica se o jogo foi ganho

const showMines = (board) =>
  fields(board)
    .filter((field) => field.mined)
    .forEach((field) => (field.opened = true)); // Exibe as minas

const invertFlag = (board, row, column) => {
  const field = board[row][column];
  field.flagged = !field.flagged;
};

const flagsUsed = (board) =>
  fields(board).filter((field) => field.flagged).length;

export {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
};
