import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [formData, setFormData] = useState({ name: '', status: 'hadir', message: '', photo: '' })
  const [guestMessages, setGuestMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [responseMsg, setResponseMsg] = useState('')
  const [previewPhoto, setPreviewPhoto] = useState(null)

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date('2026-12-31T09:00:00').getTime()
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // AMBIL DATA UCAPAN DARI SUPABASE
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('id', { ascending: false })

      if (error) throw error
      if (data) setGuestMessages(data)
    } catch (err) {
      console.error("Gagal mengambil ucapan:", err.message)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  // Konversi foto ke Base64
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto maksimal 2MB ya, bro!")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result })
        setPreviewPhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // SIMPAN DATA KE SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponseMsg('')

    try {
      const { error } = await supabase
        .from('rsvps')
        .insert([
          {
            name: formData.name,
            status: formData.status,
            message: formData.message,
            photo: formData.photo
          }
        ])

      if (error) throw error

      setResponseMsg('✨ Terima kasih! Konfirmasi & Foto kamu berhasil terkirim. 💖')
      setFormData({ name: '', status: 'hadir', message: '', photo: '' })
      setPreviewPhoto(null)
      fetchMessages()
    } catch (err) {
      console.error(err)
      setResponseMsg('❌ Gagal mengirim konfirmasi: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* 1. HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroCard}>
          <span style={styles.heroSubtitle}>THE WEDDING OF</span>
          <h1 style={styles.heroTitle}>Satria & Partner</h1>
          <p style={styles.heroDate}>Sabtu, 31 Desember 2026</p>
          
          <div style={styles.timerContainer}>
            <div style={styles.timerBox}><span>{timeLeft.days}</span><small>Hari</small></div>
            <div style={styles.timerBox}><span>{timeLeft.hours}</span><small>Jam</small></div>
            <div style={styles.timerBox}><span>{timeLeft.minutes}</span><small>Menit</small></div>
            <div style={styles.timerBox}><span>{timeLeft.seconds}</span><small>Detik</small></div>
          </div>
        </div>
      </section>

      {/* 2. RANGKAIAN ACARA & MAPS */}
      <section style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>🗓️ Rangkaian Acara</h2>
          <div style={styles.eventGrid}>
            <div style={styles.eventBox}>
              <h3>Akad Nikah</h3>
              <p>⏰ 08.00 WIB - Selesai</p>
              <p>📍 Gedung Perkawinan Indah</p>
            </div>
            <div style={styles.eventBox}>
              <h3>Resepsi</h3>
              <p>⏰ 11.00 - 15.00 WIB</p>
              <p>📍 Gedung Perkawinan Indah</p>
            </div>
          </div>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={styles.mapButton}>
            🗺️ Buka Google Maps
          </a>
        </div>
      </section>

      {/* 3. FORM KONFIRMASI KEHADIRAN & UPLOAD FOTO */}
      <section style={styles.section}>
        <div style={styles.card}>
          <div style={styles.iconHeader}>🕊️✨</div>
          <h2 style={styles.sectionTitle}>Konfirmasi Kehadiran</h2>
          <p style={styles.cardSubtitle}>Mohon Doa Restu & Kehadiran Anda</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>👤 Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap..."
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>📸 Upload Foto Kamu (Opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={styles.fileInput}
              />
              {previewPhoto && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <img src={previewPhoto} alt="Preview" style={styles.avatarPreview} />
                </div>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>💌 Apakah Anda Akan Hadir?</label>
              <select name="status" value={formData.status} onChange={handleChange} style={styles.select}>
                <option value="hadir" style={{ color: '#000' }}>🎉 Ya, InsyaAllah Saya Hadir</option>
                <option value="tidak_hadir" style={{ color: '#000' }}>🙏 Maaf, Saya Berhalangan Hadir</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>💬 Ucapan & Doa Tulus</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tuliskan ucapan terbaik kamu..."
                rows="4"
                style={styles.textarea}
              ></textarea>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? '⏳ Sedang Mengirim...' : '💖 Kirim Ucapan & Foto'}
            </button>
          </form>

          {responseMsg && <div style={styles.alert}>{responseMsg}</div>}
        </div>
      </section>

      {/* 4. LIVE GUESTBOOK DENGAN FOTO TAMU */}
      <section style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>💌 Untaian Doa Sahabat</h2>
          <div style={styles.messageList}>
            {guestMessages.length === 0 ? (
              <p style={styles.noMessage}>Belum ada ucapan. Jadilah yang pertama! 😊</p>
            ) : (
              guestMessages.map((msg, index) => (
                <div key={index} style={styles.messageItem}>
                  <div style={styles.messageUserHeader}>
                    <img 
                      src={msg.photo || 'https://via.placeholder.com/40?text=👤'} 
                      alt="Avatar" 
                      style={styles.guestAvatar} 
                    />
                    <div>
                      <span style={styles.messageName}>{msg.name}</span>
                      <span style={{...styles.messageStatus, color: msg.status === 'hadir' ? '#15803d' : '#b91c1c' }}>
                        {msg.status === 'hadir' ? '✅ Hadir' : '❌ Absen'}
                      </span>
                    </div>
                  </div>
                  <p style={styles.messageText}>{msg.message || "(Tanpa Ucapan)"}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. AMPLOP DIGITAL */}
      <section style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>🎁 Amplop Digital</h2>
          <p style={styles.cardSubtitle}>Bagi yang ingin memberikan kado/tanda kasih:</p>
          
          <div style={styles.bankBox}>
            <strong>BCA</strong>
            <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>123-456-7890</p>
            <span>a.n. Satria</span>
          </div>
        </div>
      </section>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff5f5 0%, #fed7aa 50%, #fef08a 100%)',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#0f172a',
    paddingBottom: '60px'
  },
  heroSection: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  heroCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '40px 20px',
    borderRadius: '30px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    border: '2px solid #ffffff'
  },
  heroSubtitle: { letterSpacing: '3px', fontSize: '12px', fontWeight: 'bold', color: '#e11d48' },
  heroTitle: { fontSize: '36px', color: '#be123c', margin: '10px 0' },
  heroDate: { fontSize: '16px', color: '#475569', fontWeight: '600' },
  timerContainer: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '25px' },
  timerBox: {
    background: '#fff1f2',
    padding: '10px',
    borderRadius: '12px',
    width: '65px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #fecdd3'
  },
  section: { display: 'flex', justifyContent: 'center', padding: '0 20px', marginBottom: '30px' },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '35px 25px',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #ffffff'
  },
  iconHeader: { fontSize: '40px', marginBottom: '5px' },
  sectionTitle: { margin: '0 0 10px 0', color: '#be123c', fontSize: '24px', fontWeight: '800' },
  cardSubtitle: { margin: '0 0 20px 0', color: '#64748b', fontSize: '14px' },
  eventGrid: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' },
  eventBox: { background: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' },
  mapButton: {
    display: 'inline-block',
    padding: '12px 20px',
    borderRadius: '12px',
    background: '#0284c7',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '700', color: '#0f172a' },
  input: { padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', backgroundColor: '#fff', color: '#0f172a' },
  fileInput: { padding: '8px', borderRadius: '12px', border: '1.5px solid #cbd5e1', backgroundColor: '#fff' },
  avatarPreview: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e11d48' },
  select: { padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', backgroundColor: '#fff', color: '#0f172a' },
  textarea: { padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', backgroundColor: '#fff', color: '#0f172a' },
  button: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(90deg, #e11d48 0%, #f43f5e 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  alert: { marginTop: '15px', padding: '10px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: 'bold' },
  messageList: { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' },
  noMessage: { color: '#64748b', fontStyle: 'italic' },
  messageItem: { background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left' },
  messageUserHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  guestAvatar: { width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' },
  messageName: { color: '#0f172a', fontWeight: 'bold', display: 'block', fontSize: '14px' },
  messageStatus: { fontSize: '11px', display: 'inline-block', marginTop: '2px' },
  messageText: { margin: '0', fontSize: '13px', color: '#334155', paddingLeft: '54px' },
  bankBox: { background: '#fff1f2', padding: '20px', borderRadius: '16px', border: '1px dashed #f43f5e' }
}

export default App