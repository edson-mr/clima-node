require("colors");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

const menuInquirer = async () => {
  const { opcion } = await prompt([
    {
      type: "list",
      name: "opcion",
      message: "¿Qué desea hacer?".toUpperCase().yellow,
      choices: [
        {
          name: `1. Buscar Ciudad`,
          value: 1,
        },
        {
          name: `2. Historial`,
          value: 2,
        },
        {
          name: `0. Salir`,
          value: 0,
        },
      ],
    },
  ]);
  return opcion;
};

const pausa = async () => {
  console.log();
  await prompt([
    {
      type: "input",
      name: "enter",
      message: `Presione ${"ENTER".green} para continuar`,
    },
  ]);
};

const leerInput = async (message = "") => {
  const { ciudad } = await prompt([
    {
      type: "input",
      name: "ciudad",
      message,
      validate(value) {
        if (value.trim().length === 0) {
          return "debe ingresar una ciudad";
        }
        return true;
      },
    },
  ]);

  return ciudad;
};
const listarLugares = async (ciudades = []) => {
  choices = ciudades.map((ciudad, index) => {
    const indice = `${index + 1}.`.green;
    return {
      name: `${indice} ${ciudad.nombre}`,
      value: ciudad.id,
    };
  });
  const { id } = await prompt([
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar:",
      choices,
    },
  ]);

  return id;
};

module.exports = {
  menuInquirer,
  pausa,
  leerInput,
  listarLugares,
};
