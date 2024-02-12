import { useState } from "react";
import { transformNumbers } from "../../utilities/transform";

interface AmountProps {
  amount: number;
}

const Amount: React.FC<AmountProps> = ({ amount }) => {
  const [labelColor, setLabelColor] = useState('success');

  return (
    <>
      <p className={labelColor}>${transformNumbers(amount)}</p>
    </>
  )
}

export default Amount