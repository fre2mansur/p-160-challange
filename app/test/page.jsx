"use client"
import { useState, useEffect } from "react";
import { ec as EC } from "elliptic";
import Result160 from "../components/Result160";

const target = "0385663c8b2f90659e1ccab201694f4f8ec24b3749cfe5030c7c3646a709408e19";

// Initialize the secp256k1 elliptic curve
const ec = new EC('secp256k1');

const generatePublicKey = (values) => {
  // Combine hex values into a single private key string
  const privateKeyHex = values.join("");

  try {
    // Create a key pair from the private key
    const key = ec.keyFromPrivate(privateKeyHex);
    
    // Get the public key in compressed format (as a hex string)
    const publicKey = key.getPublic(true, "hex");
  
  
    return publicKey;
  } catch (error) {
   
    return publicKey
  }
};

const getRandomHexValue = () => {
  const hexCharacters = "0123456789ABCDEF";
  return hexCharacters[Math.floor(Math.random() * 16)];
};

export default function Home() {
  
  const hexOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
  const initialValues = new Array(5).fill("0");
  //initialValues[0] = 1;

  const initiallockValues = new Array(5).fill(0);
  const [lockValues, setLockValues] = useState(initiallockValues);

  const [values, setValues] = useState(initialValues);
  const [publicKey, setPublicKey] = useState("000000000000000000000000000000000000000000000000000000000000000000");

  const lockIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>;

  const unlockIcon =  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>;

const [isRunning, setIsRunning] = useState(false); // New state to track if randomization is running
const [intervalId, setIntervalId] = useState(null); // New state to store the interval ID

 // Initialize history with 50 entries, each filled with `initialValues`
const [history, setHistory] = useState([initialValues]); // History state with the initial values
const [historyIndex, setHistoryIndex] = useState(0); // Index to track the current position in history

const hexRegex = /^[0-9A-F]+$/;
const [hasInvalidChar, setHasInvalidChar] = useState(false); 

const [result, setResult] = useState([]); // To store the last 10 results

const [speed, setSpeed] = useState(1); // To store the last 10 results
const [runTime, setRunTime] = useState(0);
const [pauseTime, setPauseTime] = useState(0);

  const handleSelectChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
   
    
     // Save new values to history and update the index
   let updatedHistory = [...history.slice(0, historyIndex + 1), newValues];
    // If history length exceeds 50, remove the oldest item
    if (updatedHistory.length > 50) {
      updatedHistory = updatedHistory.slice(1); // Remove the first (oldest) item
    }
    
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setValues(newValues);

    // Update public key and result
    const newPublicKey = generatePublicKey(newValues);
    setPublicKey(newPublicKey); // publicKey will trigger updateResult via useEffect
    const newPrivateKey = newValues.join('');
    updateResult(newPrivateKey, newPublicKey);

  };

  const handleRandomButtonClick = () => {
    console.log("result", result)
    
   //const newValues = values.map((val) => (val === "0" ? getRandomHexValue() : val));
   const newValues = values.map((val, index) => {
    // Only update if lockValues[index] is 0 and the value is "0"
      if (lockValues[index] === 0) {
        return getRandomHexValue();
      } else {
        return val; // Keep the current value if locked or non-zero
      }
    });

    // Save new values to history and update the index
   let updatedHistory = [...history.slice(0, historyIndex + 1), newValues];




    // If history length exceeds 50, remove the oldest item
    if (updatedHistory.length > 50) {
      updatedHistory = updatedHistory.slice(1); // Remove the first (oldest) item
    }
    
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setValues(newValues);

    // Update public key and result
    const newPublicKey = generatePublicKey(newValues);
    setPublicKey(newPublicKey); // publicKey will trigger updateResult via useEffect
    const newPrivateKey = newValues.join('');
    updateResult(newPrivateKey, newPublicKey);
    
  };

  const handleResetButtonClick = () => {
    const initialValues = new Array(5).fill("0");
    initialValues[0] = 1;
    setValues(initialValues)
    setPublicKey(generatePublicKey(initialValues));
  
  }

  const setClass = (v, i) => {
    // Assuming target is an array or a string you want to compare with publicKey
    if (target[i] === v) {
      return "bg-green-500 text-green-900 px-1"; // Add a class if the condition matches
    } else {
      return "px-1"; // Return an empty string if no class is applied
    }
  };

  const lock = (index) => {
    const newLockValues = [...lockValues];
    newLockValues[index] = 1;
    setLockValues(newLockValues);
    console.log(lockValues);
  }

  const unlock = (index) => {
    const newLockValues = [...lockValues];
    newLockValues[index] = 0;
    setLockValues(newLockValues);
    console.log(lockValues);
  }

  // Function to start or stop the randomization process
  const run = () => {
    let runTimeoutId = null;
    let pauseTimeoutId = null;  
    
  
    if (isRunning) {
      // If already running, stop the interval
      clearInterval(intervalId);
      setIsRunning(false);
      setIntervalId(null);

      clearTimeout(runTimeoutId); // Clear run timeout if it exists
      clearTimeout(pauseTimeoutId); // Clear pause timeout if it exists
    } else {
      const intervalTimes = [
        20,   // 20ms Speed 1: 50 loops/sec
        10,   // Speed 2: 100 loops/sec
        6.67, // Speed 3: 150 loops/sec
        5,    // Speed 4: 200 loops/sec
        4,    // Speed 5: 250 loops/sec
        3.33, // Speed 6: 300 loops/sec
        2.86, // Speed 7: 350 loops/sec
        2.5,  // Speed 8: 400 loops/sec
        2.22, // Speed 9: 450 loops/sec
        1     // Speed 10: 500 loops/sec
      ];
      const intervalTime = intervalTimes[speed - 1];

      // Function to handle the running logic
    const startRunning = () => {
      if (isRunning) {
        setIsRunning(false);
      }
      const id = setInterval(() => {
        handleRandomButtonClick();
      }, intervalTime); // Use the calculated interval time
      setIntervalId(id);
      setIsRunning(true);
      if (isRunning) {
        setIsRunning(false);
      }

      // Stop after `runTime` minutes if `runTime` > 0
      if (runTime > 0) {
        runTimeoutId = setTimeout(() => {
          setValues(initialValues)
          console.log("Pausing...");
          clearInterval(id);
          setIsRunning(false);
          setIntervalId(null);

          // Resume after `pauseTime` minutes
          if (pauseTime > 0) {
            pauseTimeoutId = setTimeout(() => {
              console.log("Resuming...");
              startRunning(); // Restart after the pause
            }, pauseTime * 60 * 1000); // Convert pauseTime to milliseconds
          }
        }, runTime * 60 * 1000); // Convert runTime to milliseconds
      }
    };

    // If `runTime` is 0, run indefinitely
    if (runTime === 0) {
      startRunning(); // Run forever without stopping
    } else {
      startRunning(); // Run with stop and restart logic
    }

    }
  };
  // const run = () => {
  //   if (isRunning) {
  //     // If already running, stop the interval
  //     clearInterval(intervalId);
  //     setIsRunning(false);
  //     setIntervalId(null);
  //   } else {
  //     // Start the interval (10 randomizations per second)
  //     const id = setInterval(() => {
  //       handleRandomButtonClick()
   
  //     }, 5);
  //     setIntervalId(id);
  //     setIsRunning(true);
  //   }
  // };

  // Function to move back in history
  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setValues(history[newIndex]);
      generatePublicKey(history[newIndex]); // Generate public key for the previous state
      setPublicKey(generatePublicKey(history[newIndex]));
    }
  };

  // Function to move forward in history
  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setValues(history[newIndex]);
      generatePublicKey(history[newIndex]); // Generate public key for the next state
      setPublicKey(generatePublicKey(history[newIndex]));
    }
  };

   // Handle change in text input
   const handleInputChange = (e) => {
    let newValue = e.target.value.toUpperCase();
     // Check if the input contains any non-hexadecimal characters
    const isValidHex = newValue.split('').every((char) => hexRegex.test(char));
    // Update the state to indicate if invalid characters are found
    setHasInvalidChar(!isValidHex);

    // Update the values array based on the input text (only up to 40 characters)
    const updatedValues = newValue
      .split('') // Convert the input string into an array
      .slice(0, 40) // Ensure it doesn't exceed 40 characters
      .map((char, index) => char || values[index]); // If a character is missing, retain the old value
      
    // Update the state for select fields
    setValues(updatedValues);
    setPublicKey(generatePublicKey(updatedValues));
    updateResult(updatedValues, publicKey);
  };

  const calculateMatch = (generatedPublicKey, targetPublicKey) => {
    let matchCount = 0;
  
    // Ensure both public keys are defined and have a valid length
    if (!generatedPublicKey || !targetPublicKey || generatedPublicKey.length !== targetPublicKey.length) {
      console.error('Public key or target public key is missing or has a mismatched length.');
      return { matchCount: 0, matchPercentage: 0 };
    }
  
    // Compare each character in the generatedPublicKey with the targetPublicKey
    generatedPublicKey.split('').forEach((char, index) => {
      if (char === targetPublicKey[index]) {
        matchCount++;
      }
    });
  
    const matchPercentage = ((matchCount / targetPublicKey.length) * 100).toFixed(2);
    return { matchCount, matchPercentage };
  };
  

  // Function to update the result history
  const updateResult = (privateKey, publicKey) => {
    const { matchCount, matchPercentage } = calculateMatch(publicKey, target);
  
    // Add the new result to the history
    const newResult = {
      matchPercentage: parseFloat(matchPercentage),
      matchCount,
      privateKey, // Store the private key used to generate the public key
    };
  
    setResult((prevResult) => {
      let updatedResult = [...prevResult, newResult];
  
      // Sort the history by matchPercentage in descending order
      updatedResult.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
      // Keep only the top 10 records
      if (updatedResult.length > 10) {
        updatedResult = updatedResult.slice(0, 10);
      }
  
      return updatedResult;
    });
  };

  //clear history
  const clearResult = () => {
    setResult([])
   
  }

// Update result when publicKey changes
useEffect(() => {
  if (publicKey) {
    updateResult();
  }
}, [publicKey]);

const speeds = [
  {
    'label': 50,
    'value': 1
  },
  {
    'label': 100,
    'value': 2
  },
  {
    'label': 150,
    'value': 3
  },
  {
    'label': 200,
    'value': 4
  },
  {
    'label': 250,
    'value': 4
  },
  {
    'label': 300,
    'value': 6
  }
]
  return (
    
    <div className="w-full p-1">
      <div className="mb-4">
        <h3>Settings</h3>
      
        <label>Keys</label>
      <select className="border-1" value={speed} onChange={(e) => setSpeed(e.target.value)}>
        {speeds.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select> per second
      <hr />
      </div>
     
      <div className="mb-4">
      <h3>Pause & Play</h3>
          <label htmlFor="">Stop Interval</label>
          <select value={runTime} onChange={(e) => setRunTime(e.target.value)}>
            <option value="0">0 sec (Nonstop)</option>
            <option value="1">1 sec</option>
            <option value="5">5 sec</option>
            <option value="10">10 sec</option>
          </select>
          <label htmlFor="">Wait Interval</label>
          <select value={pauseTime} onChange={(e) => setPauseTime(e.target.value)}>
            <option value="0">0 sec (No wait)</option>
            <option value="1">1 sec</option>
            <option value="5">5 sec</option>
            <option value="10">10 sec</option>
          </select>
      <hr />
      </div>
     
      <p className="font-bold">Hexadecimal Input</p>
      <div className="bg-gray-100 dark:bg-gray-700 grid grid-cols-3 lg:grid-cols-10 gap-1 p-1 lg:p-2 mb-3">
        
        {values.map((value, index) => (
          <div className="flex bg-white dark:bg-gray-800 border dark:border-gray-600 space-x-2 items-center p-1">
            <div className="w-full flex">
            <select disabled = {lockValues[index] == 1 ? true: false}
              key={index}
              value={value}
              onChange={(e) => handleSelectChange(index, e)}
              className="w-full h-8 dark:bg-gray-950"
            >
              {hexOptions.map((option) => (
                <option disabled={index === 0 && option == 0} key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            </div>
           {lockValues[index] == 0 ? <div className="bg-gray-200 dark:bg-transparent p-1" onClick={()=>{lock(index)}}>{unlockIcon}</div> : <div className="bg-gray-200 dark:bg-transparent p-1 text-gray-400" onClick={()=>{unlock(index)}}>{lockIcon}</div>}
          </div>
        ))}
      </div>
      <div className="mb-1">
        <input
          className={values.join('').length != 40 || hasInvalidChar ? "dark:bg-gray-800 border-2 border-red-400 w-full p-2 outline-0": "dark:bg-gray-800 border-2 outline-0 border-green-400 w-full p-2"  } //
          type="text"
          value={values.join('')} // Join values without commas
          maxLength={40} // Limit input to 40 characters
          onChange={handleInputChange} // Handle input change
        />
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 px-0.5 py-0.5 uppercase flex flex-wrap gap-1 text-[13px] lg:text-base font-semibold mb-3 lg:mb-5">
        {publicKey.split("").map((v, i) => {
          const className = setClass(v, i);
          return (
            <span className={className} key={i}>
              {v}
            </span>
          );
        })}
      </div>
      
      <p className="font-semibold">Expected result</p>
      <p className="p-2 bg-gray-100 dark:bg-gray-700 break-words uppercase text-[13px] font-semibold tracking-wider">
        {target}
      </p>

      <Result160 target={target}/>

      <div className="my-3 grid grid-cols-5 gap-1">
        <button className={historyIndex === 0 ? "bg-gray-200 px-4 py-2 text-black" : "bg-gray-600 px-4 py-2 text-white"} onClick={handleBack} disabled={historyIndex === 0}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>

        </button>
        <button className={historyIndex === history.length - 1 ? "bg-gray-200 px-4 py-2 text-black" : "bg-gray-800 px-4 py-2 text-white"} onClick={handleForward} disabled={historyIndex === history.length - 1}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>

        </button>
          <button className="bg-blue-600 py-2 px-1 text-white" onClick={handleRandomButtonClick}>
            Random
          </button>
          <button className="bg-yellow-600 py-2 px-1 text-white" onClick={handleResetButtonClick}>
            Reset
          </button>
          <button className="bg-pink-600 py-2 px-1 text-white" onClick={run}>
          {isRunning ? "Stop" : "Run"}
        </button>
      </div>

      {/* Display the last 10 match results in DESC order */}
      <h3 className="font-bold mt-4">
        Match History (Last 10 Runs)
        <button className="text-blue-600 p-1" onClick={clearResult}>
        Clear Result
      </button>

      </h3>
      <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
        {result.map((r, index) => (
          <p key={index} className="mb-2 break-words font-semibold text-[14px]">
            <span className="text-orange-600">{r.matchPercentage}%</span> match ({r.matchCount} characters) - Generated key: <span className="text-emerald-700">{r.privateKey}</span>
          </p>
        ))}
      </div>
    </div>
  );
}