'use client';

import { useTranslations } from 'next-intl';

import { withAuth } from 'components/auth';
import PageTitle from 'components/page-title';
import TokenSalesListItem from 'components/token-item/TokenSalesListItem';
import useSalesData from 'lib/hooks/useSalesData';

interface SalesProps {
  userId: string;
}

function Sales({ userId }: SalesProps) {
  const t = useTranslations('sales');

  const { totalSales, salesPerToken } = useSalesData(userId);

  return (
    <div>
      <PageTitle>Sales</PageTitle>
      <div className="mt-6 rounded-lg border border-gray-semilight bg-white p-6 text-gray-extradark lg:mt-10 lg:px-12 lg:py-10">
        <div>
          <p className="mb-2 font-semibold leading-6">{t('totalSales')}</p>
          <p className="text-4xl">{totalSales}</p>
        </div>
        <div className="mt-12 lg:py-10">
          <h2 className="text-xl font-semibold">{t('salesPerToken')}</h2>
          <div className="mt-4 flex min-h-[15rem] flex-col divide-y-[0.0625rem] divide-solid divide-[#E5E7EB] rounded-lg shadow-md">
            <div className="flex flex-col gap-4 px-6 py-2 text-sm sm:flex-row sm:items-center sm:gap-0">
              <span className="hidden sm:block sm:flex-[0.5]">Token</span>
              <div className="flex justify-between sm:flex-[0.5] sm:justify-evenly">
                <span>{t('openedAt')}</span>
                <span>{t('status')}</span>
                <span>{t('sales')}</span>
              </div>
            </div>
            {salesPerToken && Object.keys(salesPerToken).length > 0 ? (
              Object.keys(salesPerToken).map((tokenId) => {
                return (
                  <TokenSalesListItem
                    key={tokenId}
                    tokenId={tokenId}
                    tokenSales={salesPerToken[tokenId]}
                    href={`sales/token/${tokenId}`}
                  />
                );
              })
            ) : (
              <p className="text-center text-gray-semilight">
                {!salesPerToken ? t('loading') : t('empty')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Sales);
