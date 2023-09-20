'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { withAuth } from 'components/auth';
import Button from 'components/button';
import BuyerListItem from 'components/buyer-list-item';
import PageTitle from 'components/page-title';
import TokenSalesListItem from 'components/token-item/TokenSalesListItem';
import useSalesData from 'lib/hooks/useSalesData';
import useSalesDownload from 'lib/hooks/useSalesDownload';

interface SalesProps {
  userId: string;
}

function Sales({ userId }: SalesProps) {
  const t = useTranslations('sales');

  const { replace } = useRouter();

  const searchParams = useSearchParams();
  const tokenId = searchParams.get('token');

  const { totalSales, salesPerToken } = useSalesData(userId);
  const { download, isDownloading } = useSalesDownload();

  useEffect(() => {
    if (salesPerToken && tokenId) {
      if (!salesPerToken[tokenId]) {
        replace('/sales');
      }
    }
  }, [salesPerToken, tokenId, replace]);

  const handleDownloadSales = () => {
    if (!isDownloading && salesPerToken && tokenId) {
      download(salesPerToken[tokenId].orders);
    }
  };

  if (tokenId) {
    return (
      <div>
        <PageTitle>Token Sales</PageTitle>
        <div className="mt-6 rounded-lg border border-gray-semilight bg-white p-6 text-gray-extradark lg:mt-10 lg:px-12 lg:py-10">
          <div className="lg:py-10">
            <div className="flex flex-col divide-y-[0.0625rem] divide-solid divide-[#E5E7EB]">
              <div className="flex flex-col gap-4 px-6 py-2 text-sm sm:flex-row sm:items-center sm:gap-0">
                <span className="hidden sm:block sm:flex-[0.5]">Token</span>
                <div className="flex justify-between sm:flex-[0.5] sm:justify-evenly">
                  <span>{t('openedAt')}</span>
                  <span>{t('status')}</span>
                  <span>{t('sales')}</span>
                </div>
              </div>
              {salesPerToken && Object.keys(salesPerToken).length > 0 && (
                <TokenSalesListItem
                  key={tokenId}
                  tokenId={tokenId}
                  tokenSales={salesPerToken[tokenId]}
                />
              )}
            </div>
          </div>
          <div className="mt-12">
            <h2 className="flex items-center justify-between text-xl font-semibold">
              {t('saleHistory')}
              <Button
                onClick={handleDownloadSales}
                size="small"
                disabled={
                  isDownloading || !salesPerToken || Object.keys(salesPerToken).length === 0
                }
              >
                {t('downloadSalesData')}
              </Button>
            </h2>
            <div className="mt-4 flex max-h-[30rem] flex-col divide-y-[0.0625rem] divide-solid divide-[#E5E7EB] overflow-auto rounded-lg shadow-md">
              <div className="flex flex-col gap-4 px-6 py-2 text-sm sm:flex-row sm:items-center sm:gap-0">
                <span className="hidden sm:block sm:flex-[0.5]">Buyer</span>
                <div className="flex justify-between sm:flex-[0.5] sm:justify-evenly">
                  <span>{t('soldAt')}</span>
                  <span>{t('orderStatus')}</span>
                  <span>{t('sales')}</span>
                </div>
              </div>
              {salesPerToken && Object.keys(salesPerToken).length > 0 ? (
                salesPerToken[tokenId].orders.map((order) => {
                  return <BuyerListItem key={order.id} orderToken={order} />;
                })
              ) : (
                <p className="py-6 text-center text-gray-semilight">
                  {!salesPerToken ? t('loading') : t('empty')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle>Sales</PageTitle>
      <div className="mt-6 rounded-lg border border-gray-semilight bg-white p-6 text-gray-extradark lg:mt-10 lg:px-12 lg:py-10">
        <div className="mb-12">
          <p className="mb-2 font-semibold leading-6">{t('totalSales')}</p>
          <p className="text-4xl">{totalSales}</p>
        </div>
        <div className="lg:py-10">
          <h2 className="text-xl font-semibold">{t('salesPerToken')}</h2>
          <div className="mt-4 flex flex-col divide-y-[0.0625rem] divide-solid divide-[#E5E7EB] rounded-lg shadow-md">
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
                    href={`sales?token=${tokenId}`}
                  />
                );
              })
            ) : (
              <p className="py-6 text-center text-gray-semilight">
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
