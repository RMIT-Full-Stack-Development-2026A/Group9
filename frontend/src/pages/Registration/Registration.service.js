export const registerPlayer = async (submitData) => {
  const apiBase = import.meta.env.VITE_API_URL || '';

  try {
    const response = await fetch(`${apiBase}/api/register`, {
      method: 'POST',
      body: submitData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Throw the backend errors so the hook can catch them
      throw data.errors || [{ error: 'Unknown Error' }];
    }
    
    return data;
  } catch (error) {
    // If it's already an array of errors from the backend, throw it forward
    if (Array.isArray(error)) throw error;
    
    // Otherwise, it's a network error
    throw [{ 
      error: 'Network Error', 
      cause: 'Could not reach the server.', 
      example: 'Check if backend is running.' 
    }];
  }
};