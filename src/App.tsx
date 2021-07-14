import React, { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
import { GREETER_CONTRACT } from './constants'
import { greeter_abi } from './abis/Greeter.abi'

const App = () => {
  const [greeting, setGreetingValue] = useState<string>()

  const requestAccount = async () => {
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  const fetchGreeting = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
      const contract = new ethers.Contract(GREETER_CONTRACT, greeter_abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log('Error: ', err)
      }
    }
  }

  // call the smart contract, send an update
  const setGreeting = async () => {
    if (!greeting) return
    if (typeof (window as any).ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(GREETER_CONTRACT, greeter_abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={(e) => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  )
}

export default App
