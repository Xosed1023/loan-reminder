import { useState } from "react";

interface AmountProps {
  amount: number;
}

const Amount: React.FC<AmountProps> = ({ amount }) => {
  const [labelColor, setLabelColor] = useState('success');

  return (
    <>
      <p className={labelColor}>${amount}</p>
    </>
  )
}

export default Amount