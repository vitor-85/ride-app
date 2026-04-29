# 🚗 UberFull Stack

Aplicação full stack inspirada na Uber, desenvolvida com React, Node.js, Express, MongoDB, Socket.IO e Leaflet.

O projeto permite que usuários solicitem corridas em tempo real enquanto um painel administrativo gerencia o status das viagens, incluindo aceitação e finalização da corrida.

## ✨ Funcionalidades

* 🔐 Autenticação JWT
* 👤 Cadastro e login de usuários
* 🗺️ Integração com mapas usando Leaflet
* 📍 Busca de rotas reais com OSRM
* 🚗 Solicitação de corridas
* 📡 Atualização em tempo real com Socket.IO
* 🎯 Dashboard administrativo
* 💰 Cálculo automático de preço da corrida
* 🚘 Animação do carro no mapa
* 📱 Interface inspirada em aplicativos de mobilidade

## 🛠️ Tecnologias

### Frontend

* React
* React Router DOM
* React Leaflet
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* Socket.IO
* bcryptjs

## 🚀 Como rodar o projeto

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` no backend:

```env
MONGO_URL=sua_url_mongodb
JWT_SECRET=sua_chave_secreta
```

## 📸 Projeto

Sistema completo de corrida em tempo real com comunicação via WebSocket e atualização dinâmica do mapa.


