import React from "react";

const Bkp = () => {
  // tx
  const btcPending = userCoins.getCoin.transactions.filter((transaction) =>
    transaction.trxName.includes("bitcoin")
  );
  const btccompletePending = btcPending.filter((transaction) =>
    transaction.status.includes("pending")
  );
  let btcCountPending = 0;
  let btcValueAddedPending = 0;
  for (let i = 0; i < btccompletePending.length; i++) {
    const element = btccompletePending[i];
    btcCountPending = element.amount;
    btcValueAddedPending += btcCountPending;
  }
  // tx
  // tx
  const ethPending = userCoins.getCoin.transactions.filter((transaction) =>
    transaction.trxName.includes("ethereum")
  );
  const ethcompletePending = ethPending.filter((transaction) =>
    transaction.status.includes("pending")
  );
  let ethCountPending = 0;
  let ethValueAddedPending = 0;
  for (let i = 0; i < ethcompletePending.length; i++) {
    const element = ethcompletePending[i];
    ethCountPending = element.amount;
    ethValueAddedPending += ethCountPending;
  }
  // tx
  // tx
  const usdtPending = userCoins.getCoin.transactions.filter((transaction) =>
    transaction.trxName.includes("tether")
  );
  const usdtcompletePending = usdtPending.filter((transaction) =>
    transaction.status.includes("pending")
  );
  let usdtCountPending = 0;
  let usdtValueAddedPending = 0;
  for (let i = 0; i < usdtcompletePending.length; i++) {
    const element = usdtcompletePending[i];
    usdtCountPending = element.amount;
    usdtValueAddedPending += usdtCountPending;
  }
  // tx

  let lakhPending = btcValueAddedPending * val;
  const totalValuePending = (
    lakhPending +
    ethValueAddedPending * 2640 +
    usdtValueAddedPending
  ).toFixed(2);

  const [integerPartPending, fractionalPartPending] =
    totalValuePending.split(".");

  const formattedTotalValuePending = parseFloat(
    integerPartPending
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  //
  setfractionBalancePending(fractionalPartPending);
  settotalBalancePending(formattedTotalValuePending);

  return <div></div>;
};

export default Bkp;
