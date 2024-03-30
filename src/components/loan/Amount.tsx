import { useEffect, useState } from "react";
import { transformNumbers } from "../../utilities/transform";

interface AmountProps {
  amount: number;
  color: string;
}

const Amount: React.FC<AmountProps> = ({ amount, color }) => {
  /* success -> a tiempo
  danger -> vencidos
  warning -> proximoss
  gris -> pago */

  return (
    <>
      <p className={color}>${transformNumbers(amount)}</p>
    </>
  )
}

export default Amount