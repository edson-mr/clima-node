const fs = require("node:fs");
const axios = require("axios").default;

class Busquedas {
  historial = [];
  dbPath = "./db/data.json";
  constructor() {
    this.leerDB();
  }

  get getParamsMapBox() {
    return {
      limit: 5,
      proximity: "ip",
      language: "es",
      access_token: process.env.MAPBOX_KEY,
    };
  }

  get getParamsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async buscarCiudad(ciudad = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
        params: this.getParamsMapBox,
      });

      const { data } = await instance.get();
      return data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar["place_name"],
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      throw error;
    }
  }

  async obtenerClimaPorLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.getParamsOpenWeather, lat, lon },
      });

      const { data } = await instance.get();
      const {
        weather: [{ description }],
        main: { temp_min, temp_max, temp },
      } = data;

      return {
        description,
        temp_min,
        temp_max,
        temp,
      };
    } catch (error) {
      throw error;
    }
  }

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar)) {
      return;
    }
    this.historial = this.historial.splice(0, 6);
    this.historial.unshift(lugar);
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, {
      encoding: "utf-8",
    });

    const data = JSON.parse(info);

    this.historial = data.historial;
  }

  mostrarHistorial() {
    this.historial.forEach((ciudad, i) => {
      const indice = `${i + 1}.`.green;
      console.log(`${indice} ${ciudad}`);
    });
  }
}

module.exports = Busquedas;
