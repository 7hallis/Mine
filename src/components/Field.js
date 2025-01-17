import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import params from "../params";
import Mine from "./Mine";
import Flag from "./Flag";

export default (props) => {
  const { mined, opened, nearMines, exploded, flagged } = props;

  // Definir a lista de estilos dinamicamente
  const styleField = [styles.field];

  if (opened) styleField.push(styles.opened);
  if (exploded) styleField.push(styles.exploded); // Aplicando o estilo de "exploded"
  if (flagged) styleField.push(styles.flagged);
  if (!opened && !exploded) styleField.push(styles.regular);

  // Lógica para determinar a cor do texto com base no número de minas próximas
  const getTextColor = (nearMines) => {
    if (nearMines === 1) return "#2A28D7";
    if (nearMines === 2) return "#2B520F";
    if (nearMines > 2 && nearMines < 6) return "#F9060A";
    if (nearMines >= 6) return "#F221A9";
    return null;
  };

  return (
    <TouchableOpacity
      onPress={props.onOpen}
      onLongPress={props.onSelect}
      style={styleField}
    >
      {/* Se o campo não for mina, estiver aberto e tiver minas próximas, exibe o número de minas */}
      {!mined && opened && nearMines > 0 && (
        <Text style={[styles.label, { color: getTextColor(nearMines) }]}>
          {nearMines}
        </Text>
      )}

      {/* Exibe o ícone de mina se o campo for uma mina e estiver aberto */}
      {mined && opened && <Mine />}

      {/* Exibe a bandeira se o campo estiver marcado como flag e não estiver aberto */}
      {flagged && !opened && <Flag />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  field: {
    height: params.blocksSize,
    width: params.blocksSize,
    borderWidth: params.borderSize,
  },
  regular: {
    backgroundColor: "#999",
    borderLeftColor: "#ccc",
    borderTopColor: "#ccc",
    borderRightColor: "#333",
    borderBottomColor: "#333",
  },
  opened: {
    backgroundColor: "#999",
    borderColor: "#777",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: params.fontSize,
  },
  exploded: {
    backgroundColor: "#F9060A", // Cor de fundo vermelha para o campo explodido
    borderColor: "#F9060A", // Cor da borda vermelha para o campo explodido
  },
  flagged: {
    // Estilo para a bandeira, se necessário
  },
});
