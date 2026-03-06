import React from 'react';
import lectioData from "./dados-leitura.json";

function App() {
  const today = new Date();
  
  // Testamos os dois formatos: Dia-Mês e Mês-Dia para não ter erro!
  const format1 = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; // 03-07
  const format2 = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`; // 07-03

  // Tenta achar a leitura em qualquer um dos formatos
  const data = (lectioData as any)[format1] || (lectioData as any)[format2];

  return (
    <div style={{ 
      backgroundColor: '#f4ece1', // Cor bege de pergaminho
      minHeight: '100vh', 
      padding: '40px 20px', 
      fontFamily: 'serif', 
      color: '#2c3e50',
      textAlign: 'center' 
    }}>
      <h1 style={{ borderBottom: '2px solid #d4a373', display: 'inline-block', paddingBottom: '10px' }}>
        Lectio Divina
      </h1>

      {data ? (
        <div style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'left', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#a67c52' }}>{data.day}</h2>
          <p><strong>📖 Referência:</strong> {data.reference}</p>
          <hr />
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic' }}>"{data.text}"</p>
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff9f0', borderLeft: '5px solid #d4a373' }}>
            <strong>💡 Meditação:</strong> {data.meditation}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '50px' }}>
          <p>Buscando leitura para: <strong>{format1}</strong>...</p>
          <p>Nenhuma leitura encontrada para esta data no arquivo.</p>
          <p><i>Dica: Verifique se no seu JSON a data está como "03-07".</i></p>
        </div>
      )}
    </div>
  );
}

export default App;
