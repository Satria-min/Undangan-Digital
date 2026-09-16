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
      backgroundColor: '#fce7f3',
      minHeight: '100vh',
      fontFamily: "sans-serif",
      color: '#000000',
      paddingBottom: '50px'
    }}>
      {/* Header Utama */}
      <div style={{
        textAlign: 'center',
        padding: '50px 20px 30px',
        background: '#fbcfe8',
        borderBottomLeftRadius: '25px',
        borderBottomRightRadius: '25px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <span style={{ fontSize: '28px' }}>💖✨💖</span>
        <h3 style={{ color: '#831843', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px', margin: '10px 0', fontWeight: 'bold' }}>The Wedding Of</h3>
        <h1 style={{ fontFamily: 'serif', fontSize: '36px', color: '#000000', margin: '10px 0', fontWeight: 'bold' }}>Satria & Pasangan</h1>
        <p style={{ fontStyle: 'italic', color: '#000000', fontWeight: '500', marginTop: '10px' }}>
          "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu..."
        </p>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 15px' }}>

        {/* Card Form RSVP */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '2px solid #f472b6'
        }}>
          <h3 style={{ textAlign: 'center', color: '#000000', marginTop: 0, fontWeight: 'bold' }}>💌 Konfirmasi Kehadiran & Doa</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#000000' }}>Nama Anda:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #000000', 
                  boxSizing: 'border-box', 
                  color: '#000000', 
                  backgroundColor: '#ffffff',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#000000' }}>Apakah Anda Akan Hadir?</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #000000', 
                  boxSizing: 'border-box', 
                  color: '#000000', 
                  backgroundColor: '#ffffff',
                  fontSize: '14px'
                }}
              >
                <option value="Ya, InsyaAllah Saya Hadir">🌸 Ya, InsyaAllah Saya Hadir</option>
                <option value="Maaf, Belum Bisa Hadir">🙏 Maaf, Belum Bisa Hadir</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#000000' }}>Ucapan & Doa Tulus:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan selamat..."
                rows="3"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #000000', 
                  boxSizing: 'border-box', 
                  color: '#000000', 
                  backgroundColor: '#ffffff',
                  fontSize: '14px'
                }}
                required
              ></textarea>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#000000' }}>📷 Upload Foto Kamu (Opsional):</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '13px', color: '#000000' }} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#db2777',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Mengirim...' : '💖 Kirim Ucapan & Doa'}
            </button>
          </form>
        </div>

        {/* Untaian Doa Sahabat */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '2px solid #f472b6'
        }}>
          <h3 style={{ textAlign: 'center', color: '#000000', marginTop: 0, fontWeight: 'bold' }}>💬 Untaian Doa Sahabat</h3>
          {messagesList.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#000000', fontStyle: 'italic' }}>Belum ada ucapan. Jadilah yang pertama! 😊</p>
          ) : (
            messagesList.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#fce7f3',
                  borderLeft: '5px solid #db2777',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  color: '#000000'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#000000', fontSize: '15px' }}>{item.name}</strong>
                  <span style={{ fontSize: '12px', color: '#ffffff', backgroundColor: '#db2777', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ margin: '8px 0 4px', fontSize: '14px', color: '#000000' }}>{item.message}</p>
                {item.photo && (
                  <img
                    src={item.photo}
                    alt="Foto Tamu"
                    style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '6px', marginTop: '8px', border: '1px solid #000' }}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Card Amplop Digital */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '25px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '2px solid #f472b6'
        }}>
          <h3 style={{ color: '#000000', marginTop: 0, fontWeight: 'bold' }}>🎁 Amplop Digital</h3>
          <p style={{ fontSize: '13px', color: '#000000' }}>Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika ingin memberi hadiah, dapat melalui:</p>
          
          <div style={{ backgroundColor: '#fce7f3', padding: '15px', borderRadius: '10px', marginTop: '10px', border: '1px solid #f472b6' }}>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#000000' }}>BANK BCA</p>
            <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px', color: '#db2777' }}>1234 5678 90</p>
            <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#000000' }}>a.n. Satria</p>
            <button
              onClick={() => copyToClipboard('1234567890')}
              style={{
                backgroundColor: '#9d174d',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 'bold',
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