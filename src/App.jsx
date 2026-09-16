import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('Ya, InsyaAllah Saya Hadir')
  const [message, setMessage] = useState('')
  const [photo, setPhoto] = useState('')
  const [loading, setLoading] = useState(false)
  const [messagesList, setMessagesList] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('id', { ascending: false })

      if (!error) setMessagesList(data || [])
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar! Maksimal 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => setPhoto(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      alert('Nama dan Pesan wajib diisi!')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
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
        alert('Gagal mengirim ucapan: ' + error.message)
      } else {
        alert('Terima kasih! Ucapan & doa tulus Anda telah terkirim. ✨')
        setName('')
        setMessage('')
        setPhoto('')
        fetchMessages()
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      backgroundColor: '#fff5f7',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#4a4a4a',
      paddingBottom: '50px'
    }}>
      {/* Header Utama */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        background: 'linear-gradient(180deg, #ffe3e8 0%, #fff5f7 100%)',
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px',
        boxShadow: '0 4px 15px rgba(255, 182, 193, 0.3)'
      }}>
        <span style={{ fontSize: '24px' }}>💖✨💖</span>
        <h3 style={{ color: '#d63384', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px', margin: '10px 0' }}>The Wedding Of</h3>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', color: '#881337', margin: '10px 0' }}>Satria & Pasangan</h1>
        <p style={{ fontStyle: 'italic', color: '#9f1239' }}>"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu..."</p>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>

        {/* Card Form RSVP */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '25px',
          marginTop: '30px',
          boxShadow: '0 10px 25px rgba(214, 51, 132, 0.08)',
          border: '1px solid #ffe4e6'
        }}>
          <h3 style={{ textAlign: 'center', color: '#9f1239', marginTop: 0 }}>💌 Konfirmasi Kehadiran & Doa</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#9f1239' }}>Nama Anda:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi & Partner"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #fecdd3', boxSizing: 'border-box', outline: 'none' }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#9f1239' }}>Apakah Anda Akan Hadir?</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #fecdd3', boxSizing: 'border-box', backgroundColor: '#fff' }}
              >
                <option value="Ya, InsyaAllah Saya Hadir">🌸 Ya, InsyaAllah Saya Hadir</option>
                <option value="Maaf, Belum Bisa Hadir">🙏 Maaf, Belum Bisa Hadir</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#9f1239' }}>Ucapan & Doa Tulus:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan ucapan selamat & doa untuk kedua mempelai..."
                rows="3"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #fecdd3', boxSizing: 'border-box', outline: 'none' }}
                required
              ></textarea>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#9f1239' }}>📷 Upload Foto Kamu (Opsional):</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '12px' }} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#e11d48',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Mengirim...' : '💖 Kirim Ucapan & Doa'}
            </button>
          </form>
        </div>

        {/* Untaian Doa Sahabat */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '25px',
          marginTop: '30px',
          boxShadow: '0 10px 25px rgba(214, 51, 132, 0.08)',
          border: '1px solid #ffe4e6'
        }}>
          <h3 style={{ textAlign: 'center', color: '#9f1239', marginTop: 0 }}>💬 Untaian Doa Sahabat</h3>
          {messagesList.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>Belum ada ucapan. Jadilah yang pertama! 😊</p>
          ) : (
            messagesList.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#fff1f2',
                  borderLeft: '4px solid #f43f5e',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#881337', fontSize: '14px' }}>{item.name}</strong>
                  <span style={{ fontSize: '11px', color: '#e11d48', backgroundColor: '#ffe4e6', padding: '2px 8px', borderRadius: '10px' }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ margin: '8px 0 4px', fontSize: '13px', color: '#4c0519' }}>{item.message}</p>
                {item.photo && (
                  <img
                    src={item.photo}
                    alt="Foto Tamu"
                    style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '8px', marginTop: '6px' }}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Card Amplop Digital */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '25px',
          marginTop: '30px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(214, 51, 132, 0.08)',
          border: '1px solid #ffe4e6'
        }}>
          <h3 style={{ color: '#9f1239', marginTop: 0 }}>🎁 Amplop Digital</h3>
          <p style={{ fontSize: '12px', color: '#666' }}>Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika ingin memberi hadiah, dapat melalui:</p>
          
          <div style={{ backgroundColor: '#fff1f2', padding: '15px', borderRadius: '12px', marginTop: '10px' }}>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#881337' }}>BANK BCA</p>
            <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', color: '#e11d48' }}>1234 5678 90</p>
            <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#666' }}>a.n. Satria</p>
            <button
              onClick={() => copyToClipboard('1234567890')}
              style={{
                backgroundColor: '#be123c',
                color: '#fff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {copied ? '✓ Berhasil Disalin!' : '📋 Salin Nomor Rekening'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}