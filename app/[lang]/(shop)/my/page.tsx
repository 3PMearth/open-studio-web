'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { getContracts, getUserOrders } from 'api';
import { withAuth } from 'components/auth';
import OrderListItem from 'components/order-list-item';
import ContractsContext from 'lib/hooks/useContracts';

interface MyProps {
  userId: string;
}

function My({ userId }: MyProps) {
  const t = useTranslations('my-page');

  const [orders, setOrders] = useState<any[]>();
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    getContracts().then((contracts) => {
      setContracts(contracts.filter((contract) => contract.active));
    });
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      let _orders = await getUserOrders(userId);
      setOrders(_orders.reverse());
    };

    setOrders(undefined);
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-semibold leading-8">{t('myPage')}</h1>
      <div className="mt-6 lg:p-6">
        <h2 className="mb-2 text-lg font-semibold">{t('orderHistory')}</h2>
        <ContractsContext.Provider value={contracts}>
          <div className="mt-3 flex min-h-[15rem] flex-col justify-center divide-y-[0.0625rem] divide-solid divide-[#E5E7EB] rounded-lg py-3 shadow-md">
            {orders && orders.length > 0 ? (
              orders.map((order) => <OrderListItem key={order.id} order={order} />)
            ) : (
              <p className="text-center text-gray-semilight">
                {!orders ? t('loading') : t('empty')}
              </p>
            )}
          </div>
        </ContractsContext.Provider>
      </div>
    </div>
  );
}

export default withAuth(My);
