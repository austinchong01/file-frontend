import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from './services/api'
import Test from './components/Test'
import './App.css'

function App() {
  return (
    <Test />
  )
}

export default App