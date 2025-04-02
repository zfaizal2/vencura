'use client';
import { VencuraSdk } from '@repo/sdk';
import { useDynamicContext, getAuthToken } from '@dynamic-labs/sdk-react-core';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@repo/ui/button';

const WalletPage = () => {
  const { user: dynamicUserObj } = useDynamicContext();
  const [sdk, setSdk] = useState<VencuraSdk | null>(null);

  useEffect(() => {
    if (dynamicUserObj) {
      const token = getAuthToken();
      if (token) {
        setSdk(new VencuraSdk(process.env.NEXT_PUBLIC_API_URL!, token));
      }
    }
  }, [dynamicUserObj]);
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
        {sdk && dynamicUserObj ? (
          <Button
            appName="vencura"
            onClick={() => {
              sdk.createUser({
                name: dynamicUserObj.alias,
              });
            }}
          >
            create user
          </Button>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
};

export default WalletPage;
