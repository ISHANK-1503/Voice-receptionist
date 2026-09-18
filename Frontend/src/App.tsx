import { useState, useEffect, useCallback, useRef } from 'react'

const BASE = 'http://127.0.0.1:8000'

interface Client {
  client_id: string | number
  name: string
  phone: string
}

interface Appointment {
  appointment_id: string | number
  client_name: string
  client_phone?: string
  appointment_date: string
  service: string
  status: string
}

function StatusPill({ status }: { status: string }) {
  const s = status?.toLowerCase()
  const color =
    s === 'confirmed'
      ? { bg: 'rgba(16,217,138,0.12)', text: '#10D98A', dot: '#10D98A' }
      : s === 'cancelled'
      ? { bg: 'rgba(255,107,91,0.12)', text: '#FF6B5B', dot: '#FF6B5B' }
      : s === 'pending'
      ? { bg: 'rgba(245,166,35,0.12)', text: '#F5A623', dot: '#F5A623' }
      : { bg: 'rgba(74,85,120,0.2)', text: '#9FAAC0', dot: '#4A5578' }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase"
      style={{ background: color.bg, color: color.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color.dot }} />
      {status}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className="h-6 w-6 rounded-full border-2 animate-spin"
        style={{ borderColor: '#2A3352', borderTopColor: '#F5A623' }}
      />
    </div>
  )
}

function ConnectionBadge({ ok }: { ok: boolean | null }) {
  if (ok === null)
    return (
      <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#4A5578' }}>
        Checking…
      </span>
    )
  return (
    <span className="relative flex items-center gap-1.5">
      <span className={`relative flex h-2 w-2 rounded-full ${ok ? 'bg-[#10D98A]' : 'bg-[#FF6B5B]'}`}>
        {ok && <span className="absolute inset-0 animate-ping rounded-full bg-[#10D98A] opacity-60" />}
      </span>
      <span
        className="font-mono text-[10px] tracking-widest uppercase"
        style={{ color: ok ? '#10D98A' : '#FF6B5B' }}
      >
        {ok ? 'Backend Online' : 'Offline'}
      </span>
    </span>
  )
}

export default function App() {
  const [clients, setClients] = useState<Client[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingAppts, setLoadingAppts] = useState(true)
  const [backendOk, setBackendOk] = useState<boolean | null>(null)
  const [recording, setRecording] = useState(false)
const mediaRecorderRef = useRef<MediaRecorder | null>(null)
const chunksRef = useRef<Blob[]>([])

  // Form state
  const [clientId, setClientId] = useState('')
  const [isNewClient, setIsNewClient] = useState(false)
const [newClientName, setNewClientName] = useState('')
const [newClientPhone, setNewClientPhone] = useState('')
const [newClientEmail, setNewClientEmail] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [service, setService] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const loadClients = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/clients`)
      const data: Client[] = await res.json()
      setClients(data)
      setBackendOk(true)
    } catch {
      setBackendOk(false)
    }
  }, [])

  const loadAppointments = useCallback(async () => {
    setLoadingAppts(true)
    try {
      const res = await fetch(`${BASE}/appointments`)
      const data: Appointment[] = await res.json()
      setAppointments(data)
    } catch {
      setAppointments([])
    } finally {
      setLoadingAppts(false)
    }
  }, [])

  useEffect(() => {
    loadClients()
    loadAppointments()
  }, [loadClients, loadAppointments])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!apptDate || !service.trim()) return

  setSubmitting(true)

  try {
    let finalClientId = clientId

    // Create a new client first
    if (isNewClient) {
      if (!newClientName.trim() || !newClientPhone.trim()) {
        showToast("Please enter client name and phone number.", false)
        setSubmitting(false)
        return
      }

      const clientRes = await fetch(`${BASE}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClientName,
          phone: newClientPhone,
          email: newClientEmail,
        }),
      })

      if (!clientRes.ok) {
        showToast("Failed to create client.", false)
        setSubmitting(false)
        return
      }

      const clientData = await clientRes.json()

      finalClientId = clientData.client_id.toString()

      await loadClients()
    }

    // Create appointment
    const apptRes = await fetch(`${BASE}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: finalClientId,
        appointment_date: apptDate,
        service: service,
      }),
    })

    if (!apptRes.ok) {
      showToast("Failed to book appointment.", false)
      return
    }

    showToast("Appointment booked successfully!", true)

    // Reset form
    setClientId("")
    setApptDate("")
    setService("")

    setIsNewClient(false)
    setNewClientName("")
    setNewClientPhone("")
    setNewClientEmail("")

    await loadAppointments()
    await loadClients()

  } catch (err) {
    console.error(err)
    showToast("Could not reach backend.", false)
  } finally {
    setSubmitting(false)
  }
}
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  })

  const recorder = new MediaRecorder(stream)

  chunksRef.current = []

  recorder.ondataavailable = (event) => {
    chunksRef.current.push(event.data)
  }

  recorder.start()

  mediaRecorderRef.current = recorder
  setRecording(true)
}
const stopRecording = async () => {
  if (!mediaRecorderRef.current) return

  mediaRecorderRef.current.onstop = () => {
    const audioBlob = new Blob(chunksRef.current, {
      type: "audio/webm",
    })

    console.log(audioBlob)

    alert("Recording finished!")
  }

  mediaRecorderRef.current.stop()
  setRecording(false)
}

  return (
    <div style={{ background: '#0B0F1A', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(42,51,82,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(42,51,82,0.18) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          zIndex: 0,
        }}
      />

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded px-4 py-3 text-sm font-medium shadow-lg"
          style={{
            background: toast.ok ? 'rgba(16,217,138,0.12)' : 'rgba(255,107,91,0.12)',
            border: `1px solid ${toast.ok ? '#10D98A' : '#FF6B5B'}`,
            color: toast.ok ? '#10D98A' : '#FF6B5B',
          }}
        >
          <span>{toast.ok ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: '1px solid #2A3352', background: 'rgba(11,15,26,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded"
            style={{ background: '#F5A623' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2C5.24 2 3 4.24 3 7c0 1.6.73 3.02 1.87 3.97L4.5 13.5l2.7-1.13A5.02 5.02 0 0 0 8 12.5c2.76 0 5-2.24 5-5s-2.24-5.5-5-5.5Z"
                fill="#0B0F1A"
              />
            </svg>
          </div>
          <div>
            <span
              className="text-sm font-semibold tracking-tight"
              style={{ color: '#E8EBF2' }}
            >
              Receptia
            </span>
            <span
              className="ml-2 font-mono text-[10px] tracking-widest uppercase"
              style={{ color: '#4A5578' }}
            >
              / Appointments
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ConnectionBadge ok={backendOk} />
          <span className="hidden md:block font-mono text-[10px] text-[#4A5578] tracking-widest uppercase">
            {BASE}
          </span>
          <button
            onClick={() => { loadClients(); loadAppointments() }}
            className="rounded px-4 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ border: '1px solid #2A3352', color: '#9FAAC0' }}
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-10 space-y-8">

        {/* Page title */}
        <div className="flex items-end justify-between">
          <div>
            <h1
              className="text-4xl md:text-5xl leading-tight"
              style={{ fontFamily: 'Instrument Serif, serif', color: '#E8EBF2' }}
            >
              Appointment{' '}
              <span style={{ fontStyle: 'italic', color: '#F5A623' }}>Dashboard</span>
            </h1>
            <p className="mt-2 text-sm" style={{ color: '#4A5578' }}>
              Manage bookings, track status, and connect to your AI receptionist backend.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Total', val: appointments.length },
              {
                label: 'Confirmed',
                val: appointments.filter((a) => a.status?.toLowerCase() === 'confirmed').length,
              },
              {
                label: 'Pending',
                val: appointments.filter((a) => a.status?.toLowerCase() === 'pending').length,
              },
            ].map((s) => (
              <div key={s.label} className="text-right">
                <div className="text-2xl font-semibold tabular-nums" style={{ color: '#E8EBF2' }}>
                  {s.val}
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: '#4A5578' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Book Appointment Form */}
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid #2A3352', background: '#161C2D' }}
          >
            <div
              className="px-6 py-4 flex items-center gap-2"
              style={{ borderBottom: '1px solid #2A3352' }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: '#F5A623' }}
              />
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#9FAAC0' }}>
                Add New Appointment
              </span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label
                  className="mb-1.5 block font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: '#4A5578' }}
                >
                  Client
                </label>
                <select
    value={isNewClient ? "__NEW__" : clientId}
    onChange={(e) => {
        const value = e.target.value

        if (value === "__NEW__") {
            setIsNewClient(true)
            setClientId("")
        } else {
            setIsNewClient(false)
            setClientId(value)
        }
    }}
                  required
                  className="w-full rounded px-3 py-2.5 text-sm outline-none appearance-none"
                  style={{
                    background: '#0B0F1A',
                    border: '1px solid #2A3352',
                    color: clientId ? '#E8EBF2' : '#4A5578',
                  }}
                >
                  <option value="" disabled>
                    {clients.length === 0 ? 'Loading clients…' : 'Select a client'}
                  </option>
                  <option value="__NEW__">
    + Add New Client
</option>
                  {clients.map((c) => (
                    <option key={c.client_id} value={c.client_id}>
                      {c.name} — {c.phone}
                    </option>
                  ))}
                </select>

{isNewClient && (
  <>
    <div className="mt-4">
      <label
        className="mb-1.5 block font-mono text-[10px] tracking-widest uppercase"
        style={{ color: "#4A5578" }}
      >
        Client Name
      </label>

      <input
        type="text"
        value={newClientName}
        onChange={(e) => setNewClientName(e.target.value)}
        placeholder="Enter client name"
        className="w-full rounded px-3 py-2.5 text-sm outline-none"
        style={{
          background: "#0B0F1A",
          border: "1px solid #2A3352",
          color: "#E8EBF2",
        }}
      />
    </div>

    <div className="mt-4">
      <label
        className="mb-1.5 block font-mono text-[10px] tracking-widest uppercase"
        style={{ color: "#4A5578" }}
      >
        Phone Number
      </label>

      <input
        type="tel"
        value={newClientPhone}
        onChange={(e) => setNewClientPhone(e.target.value)}
        placeholder="9876543210"
        className="w-full rounded px-3 py-2.5 text-sm outline-none"
        style={{
          background: "#0B0F1A",
          border: "1px solid #2A3352",
          color: "#E8EBF2",
        }}
      />
    </div>

    <div className="mt-4">
      <label
        className="mb-1.5 block font-mono text-[10px] tracking-widest uppercase"
        style={{ color: "#4A5578" }}
      >
        Email (Optional)
      </label>

      <input
        type="email"
        value={newClientEmail}
        onChange={(e) => setNewClientEmail(e.target.value)}
        placeholder="name@example.com"
        className="w-full rounded px-3 py-2.5 text-sm outline-none"
        style={{
          background: "#0B0F1A",
          border: "1px solid #2A3352",
          color: "#E8EBF2",
        }}
      />
    </div>
  </>
)}

              </div>

              <div>
                <label
                  className="mb-1.5 block font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: '#4A5578' }}
                >
                  Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  required
                  className="w-full rounded px-3 py-2.5 text-sm outline-none"
                  style={{
                    background: '#0B0F1A',
                    border: '1px solid #2A3352',
                    color: '#E8EBF2',
                    colorScheme: 'dark',
                  }}
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: '#4A5578' }}
                >
                  Service
                </label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                  placeholder="e.g. General Consultation"
                  className="w-full rounded px-3 py-2.5 text-sm outline-none placeholder:text-[#4A5578]"
                  style={{
                    background: '#0B0F1A',
                    border: '1px solid #2A3352',
                    color: '#E8EBF2',
                  }}
                />
              </div>

              <div className="flex gap-3">
  <button
    type="button"
    className="flex-1 rounded py-2.5 text-sm font-medium"
    style={{
      background: "#161C2D",
      border: "1px solid #2A3352",
      color: "#E8EBF2",
    }}
  >
    🎤 Start Recording
  </button>

<button
  type="button"
  onClick={recording ? stopRecording : startRecording}
  className="flex-1 rounded py-2.5 text-sm font-medium"
  style={{
    background: "#2A3352",
    color: "#E8EBF2",
  }}
>
  {recording ? "🛑 Stop Recording" : "🎤 Talk to AI Receptionist"}
</button>
 
 </div>
 
</form>
            {/* Backend info */}
            <div
              className="px-6 py-3 font-mono text-[10px]"
              style={{ borderTop: '1px solid #2A3352', color: '#4A5578' }}
            >
              <div>POST {BASE}/appointments</div>
              <div className="mt-0.5">GET {BASE}/clients</div>
            </div>
          </div>

          {/* Appointments Table */}
          <div
            className="lg:col-span-2 rounded-lg overflow-hidden"
            style={{ border: '1px solid #2A3352', background: '#161C2D' }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid #2A3352' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: '#10D98A' }}
                />
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#9FAAC0' }}>
                  Appointments
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#4A5578]">
                GET {BASE}/appointments
              </span>
            </div>

            {loadingAppts ? (
              <Spinner />
            ) : appointments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm" style={{ color: '#4A5578' }}>
                  {backendOk === false
                    ? 'Cannot reach backend. Make sure the server is running on port 8000.'
                    : 'No appointments found.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2A3352' }}>
                      {['ID', 'Client', 'Phone', 'Date & Time', 'Service', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left font-mono text-[10px] tracking-widest uppercase"
                          style={{ color: '#4A5578' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt, i) => (
                      <tr
                        key={appt.appointment_id}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid #1E2740' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#1A2235')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td
                          className="px-4 py-3 font-mono text-xs"
                          style={{ color: '#4A5578' }}
                        >
                          #{appt.appointment_id}
                        </td>
                        <td className="px-4 py-3" style={{ color: '#E8EBF2' }}>
                          {appt.client_name}
                        </td>
                        <td
                          className="px-4 py-3 font-mono text-xs"
                          style={{ color: '#9FAAC0' }}
                        >
                          {appt.client_phone ?? '—'}
                        </td>
                        <td
                          className="px-4 py-3 font-mono text-xs tabular-nums"
                          style={{ color: '#9FAAC0' }}
                        >
                          {new Date(appt.appointment_date).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3" style={{ color: '#9FAAC0' }}>
                          {appt.service}
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill status={appt.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loadingAppts && appointments.length > 0 && (
              <div
                className="px-6 py-3 font-mono text-[10px]"
                style={{ borderTop: '1px solid #2A3352', color: '#4A5578' }}
              >
                {appointments.length} record{appointments.length !== 1 ? 's' : ''} · Last synced{' '}
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 mt-16 px-8 py-6"
        style={{ borderTop: '1px solid #2A3352' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#4A5578]">
            Receptia · AI Receptionist Platform
          </span>
          <span className="font-mono text-[10px] text-[#4A5578]">
            Backend · {BASE}
          </span>
        </div>
      </footer>
    </div>
  )
}
