import React, { useState } from 'react';
import lectioData from "./dados-leitura.json";

function App() {
  // Gerenciar qual data estamos vendo (começa com hoje)
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatKey = (date: Date) => {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${m}-${d}`;
  };

  const key = formatKey(currentDate);
  const altKey = `${key.split('-')[1]}-${key.split('-')[0]}`;
  const data = (lectioData as any)[key] || (lectioData as any)[altKey];

  return (
    <div style={{ backgroundColor: '#f4ece1', minHeight: '100vh', padding: '20px', fontFamily: 'serif', color: '#2c3e50' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        
        <h1 style={{ fontSize: '2.5rem', borderBottom: '2px solid #d4a373', paddingBottom: '10px' }}>Lectio Divina</h1>

        {/* BOTÕES DE NAVEGAÇÃO */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => changeDay(-1)} style={btnStyle}>← Anterior</button>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{currentDate.toLocaleDateString('pt-BR')}</span>
          <button onClick={() => changeDay(1)} style={btnStyle}>Próximo →</button>
        </div>

        {data ? (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'left' }}>
            <h2 style={{ color: '#a67c52', fontSize: '1.8rem' }}>{data.day}</h2>
            <p style={{ fontSize: '1.2rem' }}><strong>📖 Referência:</strong> {data.reference}</p>
            <hr style={{ opacity: 0.3 }} />
            <div style={{ fontSize: '1.4rem', lineHeight: '1.8', marginTop: '20px', whiteSpace: 'pre-wrap' }}>
              {data.text}
            </div>
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff9f0', borderLeft: '6px solid #d4a373', borderRadius: '4px' }}>
              <h3 style={{ marginTop: 0, color: '#d4a373' }}>💡 Meditação</h3>
              <p style={{ fontSize: '1.3rem', fontStyle: 'italic' }}>{data.meditation}</p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '50px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '15px' }}>
            <p style={{ fontSize: '1.5rem' }}>Nenhuma leitura cadastrada para {key}.</p>
            <p>Use os botões acima para navegar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '10px 20px',
  fontSize: '1rem',
  backgroundColor: '#d4a373',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: 'bold' as const
};

export default App;
