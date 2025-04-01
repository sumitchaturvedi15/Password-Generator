import "./App.css";
import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [isNum, setNum] = useState(false);
  const [isChar, setChar] = useState(false);
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);
  const containerRef = useRef(null);
  const createParticles = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const existingParticles = container.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());
    
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 8 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animation = `float ${duration}s ease-in ${delay}s infinite`;
      
      container.appendChild(particle);
    }
  }, []);
  const addCopyAnimation = useCallback(() => {
    const copyButton = document.querySelector('button');
    if (!copyButton) return;
    
    const handleClick = () => {
      copyButton.classList.add('copied');
      setTimeout(() => {
        copyButton.classList.remove('copied');
      }, 2000);
    };
    copyButton.removeEventListener('click', handleClick);
    copyButton.addEventListener('click', handleClick);
  }, []);
  const updatePasswordStrength = useCallback((password) => {
    let strengthClass = 'weak';
    const existingIndicator = document.querySelector('.password-strength');
    if (existingIndicator) existingIndicator.remove();
    
    // Create new strength indicator
    const strengthIndicator = document.createElement('div');
    strengthIndicator.classList.add('password-strength');
    
    // Determine password strength
    if (password.length > 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      strengthClass = 'strong';
    } else if (password.length > 8 && (/[A-Z]/.test(password) || /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password))) {
      strengthClass = 'medium';
    }
    
    strengthIndicator.classList.add(strengthClass);
    
    // Add to DOM
    const passwordContainer = document.querySelector('.flex.shadow');
    if (passwordContainer) {
      passwordContainer.classList.add('password-container');
      passwordContainer.appendChild(strengthIndicator);
    }
  }, []);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
  }, [password]);

  const passwordGenerator = useCallback(() => {
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let pass = "";
    if (isNum) {
      str += "0123456789";
    }
    if (isChar) {
      str += "@#$&*()_+!?~";
    }
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }
    setPassword(pass);
    setTimeout(() => updatePasswordStrength(pass), 0);
    
  }, [length, isNum, isChar, setPassword, updatePasswordStrength]);

  useEffect(() => {
    passwordGenerator();
  }, [length, isNum, isChar, passwordGenerator]);
  useEffect(() => {
    createParticles();
    addCopyAnimation();
    if (password) updatePasswordStrength(password);
    return () => {
      const copyButton = document.querySelector('button');
      if (copyButton) {
        copyButton.removeEventListener('click', () => {});
      }
    };
  }, [createParticles, addCopyAnimation, updatePasswordStrength, password]);

  return (
    <>
      <div ref={containerRef} className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 text-orange-500 bg-gray-700">
        <h1 className="text-md text-white mb-3">Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4 bg-black">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3 text-white"
            placeholder="Password"
            ref={passwordRef}
            readOnly
          />
          <button onClick={copyPasswordToClipboard} className="text-black bg-yellow-500 outline-none px-3 py=0.5 shrink-0">
            Copy
          </button>
        </div>
        <div className="flex text-sm gap-x-2">
          <div className="flex text-center gap-x-1">
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              onChange={(e) => {
                setLength(e.target.value);
              }}
              className="cursor-pointer"
            />
            <label className="text-white">Length: {length}</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={isChar}
              id="charInput"
              onChange={() => {
                setChar((prev) => !prev);
              }}
            />
            <label htmlFor="charInput" className="text-white">
              Special Characters
            </label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={isNum}
              id="numberInput"
              onChange={() => {
                setNum((prev) => !prev);
              }}
            />
            <label htmlFor="numberInput" className="text-white">
              Numbers
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;