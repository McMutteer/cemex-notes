import { useState } from 'react'
import './index.css'
import { AppProvider } from './context/AppContext'
import PhoneShell from './components/PhoneShell'
import Dashboard from './screens/Dashboard'
import Proyecto from './screens/Proyecto'
import Sesion from './screens/Sesion'
import DatosColado from './screens/DatosColado'
import Camiones from './screens/Camiones'
import Plano from './screens/Plano'
import PlanoProyecto from './screens/PlanoProyecto'
import Fotos from './screens/Fotos'
import NuevoProyecto from './screens/NuevoProyecto'

type Screen = 'dashboard' | 'proyecto' | 'sesion' | 'colado' | 'camiones' | 'plano' | 'plano-proyecto' | 'fotos' | 'nuevo-proyecto'

const isMobile = window.innerWidth < 768

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [online, setOnline] = useState(true)

  const navigate = (s: string) => setScreen(s as Screen)

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':      return <Dashboard online={online} onNavigate={navigate} />
      case 'proyecto':       return <Proyecto onNavigate={navigate} />
      case 'sesion':         return <Sesion onNavigate={navigate} />
      case 'colado':         return <DatosColado onNavigate={navigate} />
      case 'camiones':       return <Camiones onNavigate={navigate} />
      case 'plano':          return <Plano onNavigate={navigate} />
      case 'plano-proyecto': return <PlanoProyecto onNavigate={navigate} />
      case 'fotos':          return <Fotos onNavigate={navigate} />
      case 'nuevo-proyecto': return <NuevoProyecto onNavigate={navigate} />
    }
  }

  return (
    <AppProvider>
      {isMobile ? (
        <div style={{ width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {renderScreen()}
        </div>
      ) : (
        <div>
          {/* Controls outside phone */}
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white shadow rounded-xl px-3 py-2 text-xs font-medium text-slate-600">
            <span>Conexión</span>
            <button
              onClick={() => setOnline(!online)}
              className={`relative w-10 h-5 rounded-full transition-colors ${online ? 'bg-green-400' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${online ? 'left-5' : 'left-0.5'}`} />
            </button>
            <span className={online ? 'text-green-600' : 'text-red-400'}>{online ? 'Online' : 'Offline'}</span>
          </div>

          <PhoneShell>
            {renderScreen()}
          </PhoneShell>
        </div>
      )}
    </AppProvider>
  )
}
