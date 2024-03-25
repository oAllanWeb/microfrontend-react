import { useState } from 'react';

import { Button } from '@nextui-org/react';


const HelloWorld = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter - 1);
  return (
    <div>
      <h1>Olá Mundo!</h1>
      <div className="counter">

        <Button color='primary' onClick={decrement}>-</Button>
        <span>{counter}</span>
        <Button color='primary' onClick={increment}>+</Button>
      </div>
    </div>
  );
}

export default HelloWorld;
