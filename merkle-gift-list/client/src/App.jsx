import React, { useState } from 'react';
import server from "./server";

function App() {
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  async function giftCheck(event) {
    event.preventDefault();

    try {
      const result = await server.post(`gift`, { name });
      setResponse(result.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Error fetching response');
    }

  };

  return (
    <div>
      <h1>Gift Eligibility Checker</h1>
      <form onSubmit={giftCheck}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter a name"
        />
        <button type="submit">Check</button>
      </form>
      {response && <p>{response}</p>} {}
    </div>
  );
};

export default App;
