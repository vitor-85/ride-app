
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from "jsonwebtoken";
import Ride from "../models/Ride.js";




const router = express.Router();



function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Sem token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}


function getDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}


async function fetchRoute(url) {
  for (let i = 0; i < 2; i++) {
    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 5000); // 5s

      const res = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (res.ok) {
        return await res.json();
      }

    } catch (err) {
      console.log(`⚠️ tentativa ${i + 1} falhou`);
    }
  }

  return null;
}



router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 validação
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hash = await bcrypt.hash(password, 8);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: "user" 
    });

    return res.json(user);

  } catch (err) {
    console.error("🔥 ERRO REGISTER:", err);
    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});


router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "Usuário não existe" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ error: "Senha inválida" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ user, token });
});



router.post('/route/', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${origin[1]},${origin[0]};${destination[1]},${destination[0]}` +
      `?overview=full&geometries=geojson`;

    console.log("📡 Buscando rota OSRM...");

    const data = await fetchRoute(url);

  
    if (!data || !data.routes?.length) {
      console.log("🔁 fallback ativado");

      const distance = getDistance(origin, destination);

      return res.json({
        coordinates: [origin, destination],
        distanceKm: distance,
        durationMin: distance * 2,
        isFallback: true
      });
    }

    const route = data.routes[0];

    console.log("✅ rota real encontrada");

    return res.json({
      coordinates: route.geometry.coordinates.map(c => [c[1], c[0]]),
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60,
      isFallback: false
    });

  } catch (err) {
    console.error("🔥 ERRO BACK:", err.message);

    const { origin, destination } = req.body;

    const distance = getDistance(origin, destination);

    return res.json({
      coordinates: [origin, destination],
      distanceKm: distance,
      durationMin: distance * 2,
      isFallback: true
    });
  }
});




router.post('/rides/request', auth, async (req, res) => {
  try {
    const { origin, destination, price } = req.body;

    const ride = await Ride.create({
      userId: req.userId, 
      origin,
      destination,
      price,
      status: "requested"
    });

    return res.json({ ride });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro ao criar corrida'
    });
  }
});

router.get('/rides', auth, async (req, res) => {
  let rides;

  
  if (req.userRole === "admin") {
    rides = await Ride.find();
  } 
 
  else {
    rides = await Ride.find({ userId: req.userId });
  }

  return res.json(rides);
});


router.put('/rides/:id', auth, async (req, res) => {
  const { id } = req.params;

  const ride = await Ride.findById(id);

  if (!ride) {
    return res.status(404).json({ error: 'Corrida não encontrada' });
  }


  if (ride.userId.toString() !== req.userId && req.userRole !== "admin") {
    return res.status(403).json({ error: "Sem permissão" });
  }

  
  const allowedStatus = ["requested", "accepted", "completed"];

  if (!allowedStatus.includes(req.body.status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  
  ride.status = req.body.status;
  await ride.save();

const io = req.app.get("io");

io.emit("rideUpdated", ride);

  return res.json(ride);
});

export default router;