'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const WalletPage = () => {
  const { user: dynamicUserObj } = useDynamicContext();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Wallet Details</h1>

      <div className="space-y-4">
        {dynamicUserObj && (
          <div>
            <h2 className="text-lg font-semibold">User Info</h2>
            <p>ID: {JSON.stringify(dynamicUserObj)}</p>
            <p>Email: {dynamicUserObj.email}</p>
          </div>
        )}
        {dynamicUserObj && (
          <button
            onClick={() => {
              console.log(dynamicUserObj);
            }}
          >
            create user
          </button>
        )}
      </div>
    </main>
  );
};

export default WalletPage;
