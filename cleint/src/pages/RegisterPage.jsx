import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const hName = (e) => {
    setName(e.target.value)
  }
  const hEmail = (e) => {
    setEmail(e.target.value)
  }
  const hPassword = (e) => {
    setPassword(e.target.value)
  }

  async function registerUser(e) {
    e.preventDefault()
    try {
      const res = await axios.post('/register', {
        name,
        email,
        password,
      })
      console.log('res', res)
      console.log(axios.defaults.baseURL + '/register');
      alert('Registration Successful. Now you can log in.')
    } catch (error) {
      console.log('Registration failed. Please try again later', error)
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-48">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder={'John Doe'}
            value={name}
            onChange={hName}
          />

          <input
            type="email"
            placeholder={'your@gmail.com'}
            value={email}
            onChange={hEmail}
          />

          <input
            type="password"
            placeholder={'password'}
            value={password}
            onChange={hPassword}
          />

          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already have account?{' '}
            <Link to={'/login'} className="underline text-black">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
