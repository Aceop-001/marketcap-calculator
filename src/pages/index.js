import { useState } from 'react';

export default function Home() {
  const [totalSupply, setTotalSupply] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [marketCap, setMarketCap] = useState(''); // For Token Price Calculator mode
  const [tokenPrice, setTokenPrice] = useState(''); // For Market Cap Calculator mode
  const [allottedTokens, setAllottedTokens] = useState(''); // Customizable
  const [result, setResult] = useState(null);
  const [isMarketCapMode, setIsMarketCapMode] = useState(false); // Default to Token Price Calculator

  // Convert short forms (e.g., 1B, 1M, 1K) to numbers
  const parseValue = (value) => {
    if (!value) return 0;
    value = value.toUpperCase();
    if (value.endsWith('B')) return parseFloat(value.replace('B', '')) * 1000000000; // 1B = 1 billion
    if (value.endsWith('M')) return parseFloat(value.replace('M', '')) * 1000000;    // 1M = 1 million
    if (value.endsWith('K')) return parseFloat(value.replace('K', '')) * 1000;      // 1K = 1 thousand
    return parseFloat(value) || 0;
  };

  const calculate = (e) => {
    e.preventDefault();
    const total = parseValue(totalSupply);
    const initial = parseValue(initialSupply);
    const tokens = parseFloat(allottedTokens);
    let cap, price;

    if (!total || !initial || !tokens || total <= 0 || initial <= 0 || tokens <= 0) {
      alert('Please enter valid positive numbers for all fields.');
      return;
    }

    if (initial > total) {
      alert('Initial Supply cannot be greater than Total Supply.');
      return;
    }

    if (isMarketCapMode) {
      price = parseFloat(tokenPrice);
      if (!price || price <= 0) {
        alert('Please enter a valid Token Price.');
        return;
      }
      cap = initial * price; // Market Cap = Initial Supply * Token Price
    } else {
      cap = parseValue(marketCap);
      if (!cap || cap <= 0) {
        alert('Please enter a valid Market Cap.');
        return;
      }
      price = cap / initial; // Token Price = Market Cap / Initial Supply
    }

    const tgeValue = tokens * price;

    setResult({
      marketCap: cap,
      tokenPrice: price,
      tgeValue,
    });
  };

  const resetForm = () => {
    setTotalSupply('');
    setInitialSupply('');
    setMarketCap('');
    setTokenPrice('');
    setAllottedTokens('');
    setResult(null);
  };

  const toggleMode = () => {
    setIsMarketCapMode(!isMarketCapMode);
    setResult(null); // Reset results on mode switch
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/my-crypto-loop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          {isMarketCapMode ? 'Market Cap Calculator' : 'Token Price Calculator'}
        </h1>
        <button
          onClick={toggleMode}
          className="w-full bg-purple-600 text-white p-2 rounded mb-4 hover:bg-purple-700 transition"
        >
          Switch to {isMarketCapMode ? 'Token Price' : 'Market Cap'} Calculator
        </button>
        <form onSubmit={calculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Total Supply *</label>
            <input
              type="text"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              className="w-full p-2 border rounded bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1000 or 1M or 1B"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Initial Supply *</label>
            <input
              type="text"
              value={initialSupply}
              onChange={(e) => setInitialSupply(e.target.value)}
              className="w-full p-2 border rounded bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1000 or 1M or 1B"
              required
            />
          </div>
          {isMarketCapMode ? (
            <div>
              <label className="block text-sm font-medium text-white">Token Price ($)*</label>
              <input
                type="number"
                value={tokenPrice}
                onChange={(e) => setTokenPrice(e.target.value)}
                className="w-full p-2 border rounded bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1"
                min="0.0001"
                step="any"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-white">Market Cap *</label>
              <input
                type="text"
                value={marketCap}
                onChange={(e) => setMarketCap(e.target.value)}
                className="w-full p-2 border rounded bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1000 or 1M or 1B"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white">My Allotted Tokens</label>
            <input
              type="number"
              value={allottedTokens}
              onChange={(e) => setAllottedTokens(e.target.value)}
              className="w-full p-2 border rounded bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5600"
              min="1"
              step="any"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Calculate
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition"
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold text-white">Results</h2>
            <p><span className="text-green-400">TGE Value:</span> ${result.tgeValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            {isMarketCapMode ? (
              <p><span className="text-green-400">Market Cap:</span> ${result.marketCap.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            ) : (
              <p><span className="text-green-400">Token Price:</span> ${result.tokenPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}