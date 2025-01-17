import { StyleSheet, Text, View, Alert } from "react-native";
import params from "./src/params";
import MineField from "./src/components/MineField";
import Header from "./src/components/Header";
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
} from "./src/functions";
import { useState, useCallback } from "react"; // Importando useCallback
import LevelSelection from "./src/screens/LevelSelection";

export default function App() {
  // Função para calcular a quantidade de minas
  const minesAmount = useCallback(() => {
    const columns = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return Math.ceil(columns * rows * params.difficultLevel); // Cálculo das minas
  }, []);

  // Função para criar o estado inicial
  const createState = useCallback(
    () => ({
      board: createMinedBoard(
        params.getRowsAmount(),
        params.getColumnsAmount(),
        minesAmount()
      ),
      won: false,
      lost: false,
      showLevelSelection: false, // Controle do modal
    }),
    [minesAmount]
  );

  // Inicializando o estado corretamente com createState
  const [state, setState] = useState(createState);

  // Extrair o board do estado
  const { board, won, lost, showLevelSelection } = state;

  // Função para abrir um campo
  const onOpenField = (row, column) => {
    // Verifica se o jogo foi perdido, se sim, não permite abrir mais campos
    if (lost) {
      return; // Não permite abrir campos se o jogo foi perdido
    }

    const newBoard = cloneBoard(board); // Clonando o board
    openField(newBoard, row, column);
    const newLost = hadExplosion(newBoard);
    const newWon = wonGame(newBoard);

    if (newLost) {
      showMines(newBoard);
      Alert.alert("Perdeeeu!", "Que Buuurro!");
    }
    if (newWon) {
      Alert.alert("Parabéns!", "Você venceu!");
    }

    // Atualizando o estado corretamente
    setState((prevState) => ({
      ...prevState,
      board: newBoard,
      lost: newLost,
      won: newWon,
    }));
  };

  // Função para alternar bandeira
  const onSelectField = (row, column) => {
    // Não permite marcar bandeira após a perda do jogo
    if (lost) {
      return; // Não permite marcar bandeira se o jogo foi perdido
    }

    const newBoard = cloneBoard(board); // Clonando o board
    invertFlag(newBoard, row, column); // Alternando a bandeira
    const newWon = wonGame(newBoard);

    if (newWon) {
      Alert.alert("Parabéns!", "Você venceu!");
    }

    // Atualizando o estado corretamente
    setState((prevState) => ({
      ...prevState,
      board: newBoard,
      won: newWon,
    }));
  };

  // Calculando o total de flags e as usadas
  const totalFlags = minesAmount(); // Total de flags é igual à quantidade de minas
  const flagsLeft = totalFlags - flagsUsed(board); // Flags restantes

  // Função para controlar a exibição do modal
  const onLevelSelected = (level) => {
    // Alterando o nível de dificuldade globalmente
    params.difficultLevel = level;

    // Resetando o estado com a nova dificuldade
    setState(createState);
  };

  return (
    <View style={styles.container}>
      {/* Modal de seleção de nível */}
      <LevelSelection
        isVisible={showLevelSelection} // Controlando a visibilidade do modal
        onLevelSelected={onLevelSelected} // Selecionar nível e resetar o jogo
        onCancel={
          () =>
            setState((prevState) => ({
              ...prevState,
              showLevelSelection: false,
            })) // Fechar o modal
        }
      />

      {/* Cabeçalho - Exibindo as informações e a bandeira para abrir o modal */}
      <Header
        flagsLeft={flagsLeft}
        onNewGame={() => setState(createState)} // Função de novo jogo
        onFlagPress={
          () =>
            setState((prevState) => ({
              ...prevState,
              showLevelSelection: true,
            })) // Exibir o modal ao clicar na bandeira
        }
      />
      <View style={styles.board}>
        <MineField
          board={board} // Passando o board correto
          onOpenField={onOpenField} // Passando corretamente a função onOpenField
          onSelectField={onSelectField} // Corrigido para onSelect
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  board: {
    marginTop: 20,
    backgroundColor: "#AAA",
    padding: 10,
    borderRadius: 10,
  },
});
