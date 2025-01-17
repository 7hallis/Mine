import React from "react";
import { View, StyleSheet } from "react-native";
import Field from "./Field";

const Board = (props) => {
  // Mapeando as linhas e colunas
  const renderRows = props.board.map((row, r) => {
    // Verifique se row é um array antes de mapear as colunas
    if (!Array.isArray(row)) {
      console.error("A linha não é um array ou é undefined.");
      return null; // Se row não for um array, retorne null para não renderizar
    }

    // Renderizando as colunas (campos) dentro de cada linha
    const columns = row.map((field, c) => {
      // Verifique se o campo é válido
      if (!field) {
        console.error(
          `O campo na posição (${r}, ${c}) é inválido ou undefined.`
        );
        return null; // Se o campo for inválido, retorne null
      }

      return (
        <Field
          {...field}
          key={c}
          onOpen={() => props.onOpenField(r, c)}
          onSelect={() => props.onSelectField(r, c)}
        />
      );
    });

    return (
      <View key={r} style={styles.row}>
        {columns}
      </View>
    );
  });

  return <View style={styles.container}>{renderRows}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
  },
  row: {
    flexDirection: "row", // Estilo aplicado globalmente para as linhas
  },
});

export default Board;
