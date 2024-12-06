// const express = require('express')
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
const app = express()

const httpServer = http.createServer(app)

const IO = new Server(httpServer, { cors: { origin: process.env.BACKEND_URL } })

export { IO, app, httpServer }

