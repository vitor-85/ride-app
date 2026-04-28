import Map from './components/Map'
import { useState, useEffect } from 'react';
import { api } from './services/api';
import { io } from "socket.io-client";

const socket = io("http://localhost:3002");


async function getCoords(place) {
  try {
    let query = place;

    let res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );

    let data = await res.json();

    // 🔥 fallback se não encontrar
    if (!data.length) {
      query = `${place}, Brasil`;

      res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );

      data = await res.json();
    }

    if (!data.length) {
      alert("Endereço não encontrado");
      return null;
    }

    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];

  } catch (err) {
    console.error(err);
    return null;
  }
}

// 🚗 ROTA (AGORA VIA BACKEND)
async function getRoute(origin, destination) {
  try {
    const res = await api.post('/route', {
      origin,
      destination
    });

    return res.data;

  } catch (err) {
    console.error("Erro rota:", err);


    return {
      coordinates: [origin, destination],
      distanceKm: 5,
      durationMin: 10
    };
  }
}

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [coords, setCoords] = useState(null);

  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  const [step, setStep] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);

  const [rideId, setRideId] = useState(null);
  const [rideStatus, setRideStatus] = useState("requested");

  useEffect(() => {
    if (!rideId || step !== "confirmed") return;

    const handleRideUpdate = (ride) => {
      console.log("SOCKET RECEBIDO:", ride);

      if (String(ride._id) === String(rideId)) {

        setRideStatus(ride.status);

        if (ride.status === "accepted") {
          setMoving(true);
        }

        if (ride.status === "completed") {
          setMoving(false);
        }
      }
    };

    socket.on("rideUpdated", handleRideUpdate);

    return () => {
      socket.off("rideUpdated", handleRideUpdate);
    };

  }, [rideId, step]);





  async function handleRide() {
    try {
      if (!origin || !destination) {
        return alert("Preencha origem e destino");
      }

      setLoading(true);
      setStep("searching");

      const o = await getCoords(origin);
      const d = await getCoords(destination);

      if (!o || !d) {
        setStep("idle");
        return;
      }

      const route = await getRoute(o, d);

      if (!route || !route.coordinates) {
        alert("Erro na rota");
        setStep("idle");
        return;
      }

      setCoords(route.coordinates);

      const priceCalc =
        5 +
        (route.distanceKm || 0) * 2 +
        (route.durationMin || 0) * 0.5;

      setPrice(Number(priceCalc.toFixed(2)));
      setDistance(route.distanceKm || 0);
      setDuration(route.durationMin || 0);

      setStep("found");

    } catch (err) {
      console.error(err);
      setStep("idle");
    } finally {
      setLoading(false);
    }
  }

  // 🚗 CONFIRMAR
  async function confirmRide() {
    try {
      const res = await api.post('/rides/request', {

        origin,
        destination,
        price
      });

      const rideId = res.data.ride._id;

      setRideStatus("requested");
      setRideId(rideId);


      setStep("confirmed");




    } catch (err) {
      console.error(err);
      alert("Erro ao confirmar corrida");
    }
  }

  console.log("STATUS:", rideStatus);
  console.log("MOVING:", moving);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#111"
    }}>
      <div style={{
        width: 375,
        height: 700,
        borderRadius: 30,
        overflow: "hidden",
        position: "relative",
        background: "#000",
        boxShadow: "0 0 40px rgba(0,0,0,0.6)"
      }}>

        {/* 🗺️ MAPA */}
        <Map
          route={coords}
          hasCard={step !== "idle"}
          moving={moving}
        />

        {/* INPUT */}
        {step !== "confirmed" && (
          <div style={{
            position: "absolute",
            top: 20,
            left: 15,
            right: 15,
            background: "white",
            padding: 18,
            borderRadius: 20,
            zIndex: 10
          }}>
            <input
              placeholder="📍 Origem"
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              style={{
                width: "95%",
                padding: 14,
                borderRadius: 15,
                border: "1px solid #e2cccc",
                fontSize: 16
              }}
            />

            <input
              placeholder="🏁 Destino"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              style={{
                width: "95%",
                padding: 14,
                marginTop: 10,
                borderRadius: 15,
                border: "1px solid #cab8b8",
                fontSize: 16
              }}
            />

            <button
              onClick={handleRide}
              style={{
                width: "100%",
                marginTop: 12,
                padding: 14,
                borderRadius: 15,
                fontSize: 16,
                background: "#000",
                color: "#fff",
                border: "none"
              }}
            >
              {loading ? "Calculando..." : "🚗 Calcular corrida"}
            </button>
          </div>
        )}

        {/* CARD */}
        {step === "found" && price !== null && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#bebebe",
            padding: 25,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            zIndex: 999,
            boxShadow: "0 -5px 20px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{ fontSize: 30, marginBottom: 10 }}>
              💰 R$ {price}
            </h2>

            <p style={{ fontSize: 18, color: "#000000" }}>
              📏 {distance.toFixed(2)} km • ⏱ {duration.toFixed(1)} min
            </p>

            <button
              onClick={confirmRide}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 20,
                fontSize: 18,
                background: "#000",
                color: "#fff",
                border: "none",
                marginTop: 10
              }}
            >
              🚗 Confirmar corrida
            </button>
          </div>
        )}

        {step === "confirmed" && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#000",
            color: "#fff",
            padding: 25,
            textAlign: "center",
            fontSize: 20,
            zIndex: 999
          }}>
            <p>
              {{
                requested: "🔎 Procurando motorista...",
                accepted: "🚗 Motorista a caminho",
                completed: "🏁 Corrida finalizada"
              }[rideStatus]}
            </p>
          </div>
        )}


      </div>
    </div>
  );
}

export default App;