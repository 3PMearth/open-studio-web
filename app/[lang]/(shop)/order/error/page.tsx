'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import Button from 'components/button';

function OrderError() {
  const t = useTranslations('payment');

  const locale = useLocale();
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('tokenId');
  const message = searchParams.get('message');
  const amount = searchParams.get('amount') || 1;
  const currency = searchParams.has('currency')
    ? searchParams.get('currency')
    : locale === 'ko'
    ? 'krw'
    : 'usd';
  const from = searchParams.get('from');

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-semibold leading-8">{t('transactionError')}</h1>
      <p className="mt-16 break-keep text-center text-lg">
        {t('errorText1')}
        <br />
        {t('errorText2')}
      </p>
      {message && <p className="mt-6 text-center text-sm text-gray-semilight">{message}</p>}
      <div className="my-8 text-center">
        <Link
          className="inline-block"
          href={{
            pathname: `/order`,
            query: { tokenId, currency, amount, from },
          }}
        >
          <Button size="large">{t('goBack')}</Button>
        </Link>
      </div>
    </div>
  );
}

export default OrderError;
