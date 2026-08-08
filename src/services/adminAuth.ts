import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const ADMIN_DOC = 'settings/admin'

export const adminAuthService = {
  async getPassword(): Promise<string> {
    try {
      const docSnap = await getDoc(doc(db, ADMIN_DOC))
      if (docSnap.exists()) {
        const data = docSnap.data()
        localStorage.setItem('pizza_saucy_admin_password', JSON.stringify({ password: data.password }))
        return data.password
      }
    } catch (err) {
      console.error('Firestore admin fetch failed:', err)
    }

    // Fallback: localStorage
    const stored = localStorage.getItem('pizza_saucy_admin_password')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed.password || parsed
      } catch {
        return stored
      }
    }
    return 'admin123'
  },

  async updatePassword(newPassword: string): Promise<void> {
    await setDoc(doc(db, ADMIN_DOC), {
      password: newPassword,
      updatedAt: new Date().toISOString(),
    })
    localStorage.setItem('pizza_saucy_admin_password', JSON.stringify({ password: newPassword }))
  },
}