import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [nama, setNama] = useState('')
  const [kehadiran, setKehadiran] = useState('Ya, InsyaAllah Saya Hadir')
  const [ucapan, setUcapan] = useState('')
  const [foto, setFoto] = useState('')
  const [loading, setLoading] = useState(false)
  const [daftarUcapan, setDaftarUcapan] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchUcapan()
  }, [])

  const fetchUcapan = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('id', { ascending: false })

      if (!error && data) {
        setDaftarUcapan(data)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
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
    reader.onloadend = () => {
      setFoto(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nama.trim() || !ucapan.trim()) {
      alert('Nama dan Ucapan wajib diisi!')
      return
    }

    setLoading(true)

    try {
      // Disesuaikan dengan nama kolom tabel Supabase: name, status, message, photo
      const { error } = await supabase
        .from('rsvps')
        .insert([
          {
            name: nama,
            status: kehadiran,
            message: ucapan,
            photo: foto || null,
          },
        ])

      if (error) {
        console.error('Supabase error:', error)
        alert('Gagal mengirim konfirmasi: ' + error.message)
      } else {
        alert('Terima kasih! Ucapan dan konfirmasi Anda telah tersimpan.')
        setNama('')
        setUcapan('')
        setFoto('')
        fetchUcapan()
      }
    } catch (err) {
      console.error('Catch error:', err)
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
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: '#4a5568',
      paddingBottom: '60px'
    }}>
      {/* Header Aesthetic */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        background: 'linear-gradient(180deg, #ffe4e6 0%, #fff5f7 100%)',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: '0 10px 25px -5px rgba(244, 63, 94, 0.1)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>💖</div>
        <span style={{ 
          color: '#e11d48', 
          letterSpacing: '3px', 
          textTransform: 'uppercase', 
          fontSize: '12px', 
          fontWeight: '700' 
        }}>
          Undangan Digital
        </span>
        <h1 style={{ 
          fontFamily: "'Georgia', serif", 
          fontSize: '40px', 
          color: '#881337', 
          margin: '12px 0 8px',
          fontWeight: 'bold' 
        }}>
          Satria & Pasangan
        </h1>
        <p style={{ 
          fontStyle: 'italic', 
          color: '#9f1239', 
          maxWidth: '400px', 
          margin: '0 auto',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..."
        </p>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px' }}>

        {/* Card Form RSVP */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '28px 24px',
          marginTop: '28px',
          boxShadow: '0 10px 30px -5px rgba(225, 29, 72, 0.08)',
          border: '1px solid #ffe4e6'
        }}>
          <h3 style={{ 
            textAlign: 'center', 
            color: '#9f1239', 
            marginTop: 0, 
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            💌 Konfirmasi Kehadiran & Doa
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                fontSize: '13px', 
                color: '#881337' 
              }}>
                Nama Anda:
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Budi & Partner"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #fda4af',
                  boxSizing: 'border-box',
                  color: '#1a202c',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                fontSize: '13px', 
                color: '#881337' 
              }}>
                Apakah Anda Akan Hadir?
              </label>
              <select
                value={kehadiran}
                onChange={(e) => setKehadiran(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #fda4af',
                  boxSizing: 'border-box',
                  color: '#1a202c',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="Ya, InsyaAllah Saya Hadir">🌸 Ya, InsyaAllah Saya Hadir</option>
                <option value="Maaf, Belum Bisa Hadir">🙏 Maaf, Belum Bisa Hadir</option>
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                fontSize: '13px', 
                color: '#881337' 
              }}>
                Ucapan & Doa Tulus:
              </label>
              <textarea
                value={ucapan}
                onChange={(e) => setUcapan(e.target.value)}
                placeholder="Tuliskan ucapan selamat & doa untuk kedua mempelai..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #fda4af',
                  boxSizing: 'border-box',
                  color: '#1a202c',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                required
              ></textarea>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                fontSize: '13px', 
                color: '#881337' 
              }}>
                📷 Upload Foto Kamu (Opsional):
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ 
                  fontSize: '12px', 
                  color: '#4a5568',
                  width: '100%'
                }} 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Mengirim...' : '💖 Kirim Ucapan & Doa'}
            </button>
          </form>
        </div>

        {/* Untaian Doa Sahabat */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '28px 24px',
          marginTop: '28px',
          boxShadow: '0 10px 30px -5px rgba(225, 29, 72, 0.08)',
          border: '1px solid #ffe4e6'
        }}>
          <h3 style={{ 
            textAlign: 'center', 
            color: '#9f1239', 
            marginTop: 0, 
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            💬 Untaian Doa Sahabat
          </h3>

          {daftarUcapan.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0aec0', fontStyle: 'italic', fontSize: '14px' }}>
              Belum ada ucapan. Jadilah yang pertama! 😊
            </p>
          ) : (
            daftarUcapan.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#fff1f2',
                  borderLeft: '4px solid #f43f5e',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  marginBottom: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#881337', fontSize: '14px' }}>{item.name}</strong>
                  <span style={{ 
                    fontSize: '11px', 
                    color: '#e11d48', 
                    backgroundColor: '#ffe4e6', 
                    padding: '3px 10px', 
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ margin: '8px 0 4px', fontSize: '13px', color: '#4c0519', lineHeight: '1.5' }}>
                  {item.message}
                </p>
                {item.photo && (
                  <img
                    src={item.photo}
                    alt="Foto Tamu"
                    style={{ 
                      maxWidth: '90px', 
                      maxHeight: '90px', 
                      borderRadius: '8px', 
                      marginTop: '8px',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Card Amplop Digital */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '28px 24px',
          marginTop: '28px',
          textAlign: 'center',
          boxShadow: '0 10px 30px -5px rgba(225, 29, 72, 0.08)',
          border: '1px solid #ffe4e6'
        }}>
          <h3 style={{ color: '#9f1239', marginTop: 0, fontSize: '18px', fontWeight: '700' }}>
            🎁 Amplop Digital
          </h3>
          <p style={{ fontSize: '13px', color: '#718096', margin: '8px 0 16px' }}>
            Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika ingin memberi hadiah, dapat melalui:
          </p>
          
          <div style={{ 
            backgroundColor: '#fff1f2', 
            padding: '18px', 
            borderRadius: '16px', 
            border: '1px dashed #fda4af' 
          }}>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#881337', fontSize: '14px' }}>BANK BCA</p>
            <p style={{ 
              margin: '6px 0', 
              fontSize: '20px', 
              fontWeight: 'bold', 
              letterSpacing: '1px', 
              color: '#e11d48' 
            }}>
              1234 5678 90
            </p>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#718096' }}>a.n. Satria</p>
            <button
              onClick={() => copyToClipboard('1234567890')}
              style={{
                backgroundColor: '#be123c',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
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