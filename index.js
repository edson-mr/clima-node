require("dotenv").config();
require("colors");
const {
  menuInquirer,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opcion = 0;

  // const data = busquedas.leerDBd();
  // if (data) {
  //   busquedas.historial = data.historial;
  // }

  do {
    opcion = await menuInquirer();
    switch (opcion) {
      case 1:
        const lugar = await leerInput("Ciudad: ");
        const lugares = await busquedas.buscarCiudad(lugar);
        if (lugares.length === 0) {
          console.log("no se encontró coincidencias del lugar".bgRed, "\n");
          continue;
        }
        const id = await listarLugares(lugares);
        const { nombre, lng, lat } = lugares.find((lugar) => lugar.id === id);

        busquedas.agregarHistorial(nombre);

        const { description, temp_min, temp_max, temp } =
          await busquedas.obtenerClimaPorLugar(lat, lng);

        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad: ", nombre);
        console.log("Latitud: ", lat);
        console.log("Longitud: ", lng);
        console.log("Temperatura: ", temp);
        console.log("Mínima: ", temp_min);
        console.log("Máxima: ", temp_max);
        console.log("Como está el clima: ", description);
        break;
      case 2:
        busquedas.mostrarHistorial();
        break;
    }
    if (opcion !== 0) await pausa();
  } while (opcion !== 0);
};

main();
