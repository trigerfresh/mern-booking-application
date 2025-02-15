import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext.jsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const {setUser} = useContext(UserContext)


  async function handleLoginSubmit(ev) {
    ev.preventDefault()
    try {
      const response = await axios.post(
        '/login',
        { email, password },
        { withCredentials: true }
      )
      setUser(response.data)
      // console.log('res', response.data.name)
      alert('Registration Successful. Now you can log in.')
      setRedirect(true)
    } catch (error) {
      console.log('Registration failed. Please try again later', error)
    }
  }

  if(redirect){
    return <Navigate to = {'/'}/>
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-48">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder={'your@gmail.com'}
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />

          <input
            type="password"
            placeholder={'password'}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />

          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have account?{' '}
            <Link to={'/register'} className="underline text-black">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
