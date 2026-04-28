import { useEffect, useState } from "react";
import { api } from "../services/api";

function Admin() {
    const [rides, setRides] = useState([]);

    async function loadRides() {
        const res = await api.get("/rides");
        setRides(res.data);
    }

    async function updateStatus(id, status) {
        await api.put(`/rides/${id}`, { status });
        loadRides();
    }

    useEffect(() => {
        loadRides();
    }, []);

    // 📊 métricas
    const total = rides.length;
    const revenue = rides.reduce((sum, r) => sum + r.price, 0);

    return (
        <div style={{ display: "flex", height: "100vh", background: "#111" }}>

            {/* SIDEBAR */}
            <div style={{
                width: 220,
                background: "#000",
                color: "#fff",
                padding: 20
            }}>
                <h2>🚗 Admin</h2>
                <p>Dashboard</p>
                <p>Corridas</p>
            </div>

            {/* CONTEÚDO */}
            <div style={{ flex: 1, padding: 20, color: "#fff" }}>

                <h1>📊 Dashboard</h1>

                {/* CARDS */}
                <div style={{ display: "flex", gap: 20 }}>
                    <div style={cardStyle}>
                        <h3>Total Corridas</h3>
                        <p>{total}</p>
                    </div>

                    <div style={cardStyle}>
                        <h3>Faturamento</h3>
                        <p>R$ {revenue.toFixed(2)}</p>
                    </div>
                </div>

                {/* LISTA */}
                <h2 style={{ marginTop: 30 }}>🚗 Corridas</h2>

               
{rides
  .filter(ride => ride.status !== "completed")
  .map(ride => (
    <div key={ride._id} style={rideCard}>
      <p><b>{ride.origin}</b> → {ride.destination}</p>
      <p>💰 R$ {ride.price}</p>
      <p>Status: {ride.status}</p>

      <div style={{ marginTop: 10 }}>
        <button
          style={btnAccept}
          onClick={() => updateStatus(ride._id, "accepted")}
        >
          ✅ Aceitar
        </button>

        <button
          style={btnFinish}
          onClick={() => updateStatus(ride._id, "completed")}
        >
          🏁 Finalizar
        </button>
      </div>
    </div>
))}


            </div>
        </div>
    );
}

const cardStyle = {
    background: "#222",
    padding: 20,
    borderRadius: 15,
    width: 200
};

const rideCard = {
    background: "#222",
    padding: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    borderRadius: 10,
    marginTop: 10
};
const btnAccept = {
    background: "#00c853",
    color: "#fff",
    padding: 8,
    marginRight: 10,
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
};

const btnFinish = {
    background: "#2962ff",
    color: "#fff",
    padding: 8,
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
};

export default Admin;