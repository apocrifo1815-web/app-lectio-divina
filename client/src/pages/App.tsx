import React, { useState } from 'react';
import lectioData from "./dados-leitura.json";

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('lectio'); // Controla a aba atual

  const changeDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
    setActiveTab('lectio'); // Reseta para a primeira aba ao mudar de dia
  };

  const key = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const data = (lectioData as any)[key];

  const tabStyle = (id: string) => ({
    padding: '10px 15px',
    cursor: 'pointer',
    backgroundColor: activeTab === id ? '#d4a373' : '#e9edc9',
    color: activeTab === id ? 'white' : '#5d4037',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    fontWeight: 'bold' as const,
    flex: 1,
    margin: '0 2px'
  });

  return (
    <div style={{ backgroundColor: '#fefae0', minHeight: '100vh', padding: '20px', fontFamily: 'serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Navegação de Dias */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => changeDay(-1)} style={navBtn}>← Previous Day</button>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
          <button onClick={() => changeDay(1)} style={navBtn}>Next Day →</button>
        </div>

        {data ? (
          <div>
            <h1 style={{ textAlign: 'center', color: '#5d4037' }}>{data.day}</h1>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{data.reference}</p>

            {/* ABAS DA LECTIO DIVINA */}
            <div style={{ display: 'flex', marginTop: '20px' }}>
              <button style={tabStyle('lectio')} onClick={() => setActiveTab('lectio')}>LECTIO</button>
              <button style={tabStyle('meditatio')} onClick={() => setActiveTab('meditatio')}>MEDITATIO</button>
              <button style={tabStyle('oratio')} onClick={() => setActiveTab('oratio')}>ORATIO</button>
              <button style={tabStyle('contemplatio')} onClick={() => setActiveTab('contemplatio')}>CONTEMPLATIO</button>
            </div>

            {/* CONTEÚDO DA ABA */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '0 0 15px 15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minHeight: '300px' }}>
              <h3 style={{ color: '#d4a373', marginTop: 0 }}>
                {activeTab.toUpperCase()}
              </h3>
              <p style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#2c3e50', whiteSpace: 'pre-wrap' }}>
                {(data as any)[activeTab]}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>No content found for this date ({key}).</p>
          </div>
        )}
      </div>
    </div>
  );
}

const navBtn = { padding: '8px 12px', borderRadius: '5px', border: '1px solid #d4a373', backgroundColor: 'transparent', cursor: 'pointer' };

export default App;
