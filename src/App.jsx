import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('Hadir')
  const [message, setMessage] = useState('')
  const [photo, setPhoto] = useState('')
  const [loading, setLoading] = useState(false)
  const [messagesList, setMessagesList] = useState([])
  const [showAdmin, setShowAdmin] = useState(false)

  // Fetch daftar ucapan saat halaman dimuat
  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching data:', error)
      } else {
        setMessagesList(data || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  // Handle konversi foto ke Base64 (dengan penanganan file kecil)
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar! Maksimal 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPhoto(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      alert('Nama dan Pesan wajib diisi!')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('rsvps')
        .insert([
          {
            name: name,
            status: status,
            message: message,
            photo: photo || null,
          },
        ])

      if (error) {
        console.error('Supabase Error:', error)
        alert('Gagal mengirim ucapan: ' + error.message)
      } else {
        alert('Ucapan & RSVP Berhasil Terkirim!')
        setName('')
        setMessage('')
        setPhoto('')
        fetchMessages() // Refresh daftar ucapan
      }
    } catch (err) {
      console.error('Catch Error:', err)
      alert('Terjadi kesalahan koneksi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Undangan Digital</h1>
      
      {/* Form RSVP */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Konfirmasi Kehadiran & Ucapan</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nama Lengkap:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Konfirmasi Kehadiran:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            >
              <option value="Hadir">Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
              <option value="Ragu-ragu">Ragu-ragu</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Pesan & Ucapan:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan & doa Anda"
              rows="4"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
              required
            ></textarea>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Upload Foto (Opsional, maks 2MB):</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </form>
      </div>

      {/* Tombol Toggle Admin */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {showAdmin ? 'Sembunyikan Panel Admin' : 'Lihat Panel Admin'}
        </button>
      </div>

      {/* Panel Admin / Daftar Ucapan */}
      {showAdmin && (
        <div style={{ borderTop: '2px solid #ccc', paddingTop: '20px' }}>
          <h2>Dashboard Admin (Daftar RSVP)</h2>
          {messagesList.length === 0 ? (
            <p>Belum ada ucapan masuk.</p>
          ) : (
            messagesList.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong>{item.name}</strong>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: item.status === 'Hadir' ? '#e6fffa' : '#fff5f5',
                      color: item.status === 'Hadir' ? '#234e52' : '#742a2a',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <p style={{ margin: '5px 0' }}>{item.message}</p>
                {item.photo && (
                  <img
                    src={item.photo}
                    alt="Foto Tamu"
                    style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', marginTop: '8px' }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}