onmessage = function (e) {
    const { values, lockValues, hexOptions } = e.data;
  
    const newValues = values.map((val, index) => {
      if (lockValues[index] === 0) {
        return hexOptions[Math.floor(Math.random() * 16)];
      }
      return val;
    });
  
    postMessage(newValues);
};