export const serverLog = async (data: unknown, type: 'info' | 'error' | 'warn' = 'info') => {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data,
        type,
        timestamp: new Date().toISOString()
      }),
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du log au serveur:', error);
  }
};

const logger = {
  info: (data: unknown) => serverLog(data, 'info'),
  error: (data: unknown) => serverLog(data, 'error'),
  warn: (data: unknown) => serverLog(data, 'warn'),
};

export default logger; 