import axios from 'axios'

interface User {
  user_id: number
  user_name: string
}

export async function getBackEndAuth(s: SocketIO.Socket): Promise<User|null> {
  if (process.env.NODE_ENV === 'development') {
    return {
      user_id: -1,
      user_name: 'test_user'
    }
  } else {
    try {
      const r = await axios({
        method: 'GET',
        url: 'https://dioedb.dioe.at/routes/auth',
        headers: {
          'Cookie': s.handshake.headers.cookie
        }
      })
      if (r && r.data) {
        return {
          user_id: r.data.user.id,
          user_name: r.data.user.name
        }
      } else {
        return null
      }
    } catch (e) {
      return null
    }
  }
}
