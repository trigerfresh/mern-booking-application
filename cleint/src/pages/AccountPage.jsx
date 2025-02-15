import { useContext } from 'react'
import { UserContext } from '../UserContext'
import { Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function AccountPage() {
  const { ready, user, setUser } = useContext(UserContext)

  let { subpage } = useParams()
  if (subpage === undefined) {
    subpage = 'profile'
  }

  async function logout() {
    try {
      await axios.post('/logout', {}, { withCredentials: true })
      setUser(null)

      localStorage.removeItem('token')
      sessionStorage.removeItem('token')

      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  if (!ready) {
    return 'Loading...'
  }

  // If user is logged out, redirect to login page
  if (ready && !user) {
    return <Navigate to={'/login'} />
  }

  function linkClasses(type = null) {
    let classes = 'p-2 px-4'
    if (type === subpage) {
      classes += ' bg-pink-700 text-white rounded-full'
    }
    return classes
  }

  return (
    <div>
      <nav className="w-full flex mt-8 gap-2 justify-center mb-8">
        <Link className={linkClasses('profile')} to={'/account/profile'}>
          My Account
        </Link>
        <Link className={linkClasses('bookings')} to={'/account/bookings'}>
          My Bookings
        </Link>
        <Link className={linkClasses('places')} to={'/account/places'}>
          My Accommodations
        </Link>
      </nav>
      {subpage === 'profile' && (
        <div className="text-center max-w-xl mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
