'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { getTokens, createVerifier } from 'api';
import { withAuth } from 'components/auth';
import Button from 'components/button';
import { Container } from 'components/layout';
import VerifierModal from 'components/modal/verifierModal';
import PageTitle from 'components/page-title';
import { TokenItem } from 'components/token-item';
import { getStoredUser } from 'lib/user';
import { Token } from 'types/token';

interface HomeProps {
  walletAddress: string;
}

function Home({ walletAddress }: HomeProps) {
  const t = useTranslations('home');
  const user = getStoredUser(walletAddress);
  const [isVerifierModal, setIsVerifierModal] = React.useState(false);

  const [tokens, setTokens] = React.useState<Token[]>();

  React.useEffect(() => {
    const fetchTokens = async () => {
      const _tokens = await getTokens(user!.id);
      setTokens(_tokens.reverse());
    };

    if (user?.id && tokens === undefined) {
      fetchTokens();
    }
  }, [user, tokens]);

  const handleCreateVerifier = () => {
    setIsVerifierModal(true);
  };

  const closeVerifierModal = () => {
    setIsVerifierModal(false);
  };

  return (
    <div>
      <PageTitle>{t('hello', { name: user?.first_name || '' })}</PageTitle>
      <div className="mt-6 space-y-10 rounded-lg border border-gray-semilight bg-white p-6 text-gray-extradark lg:mt-10 lg:px-12 lg:py-10">
        {user && (
          <section className="space-y-1">
            <p className="flex items-center gap-2 leading-6">
              <span className="text-lg font-semibold">
                {user.first_name} {user.last_name}
              </span>
              <span className="hidden text-sm sm:inline-block">{user.wallet_address}</span>
              <span className="sm:hidden">
                {walletAddress.substring(0, 6)}...
                {walletAddress.substring(walletAddress.length - 6)}
              </span>
            </p>
            <p className="space-x-2">
              <Button onClick={handleCreateVerifier}>{t('createverifier')}</Button>
            </p>
          </section>
        )}
        <section className="text-center">
          <Link href="token/create">
            <Button>{t('createNewToken')}</Button>
          </Link>
        </section>
        <Container tag="section">
          {!tokens ? (
            <div className="flex h-40 items-center justify-center text-gray-semilight">
              {t('loading')}
            </div>
          ) : tokens.length === 0 ? (
            <div className="flex h-40 items-center justify-center">{t('empty')}</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {tokens.map((token) => (
                <TokenItem key={token.id} token={token} />
              ))}
            </div>
          )}
        </Container>
        {isVerifierModal && <VerifierModal onClose={closeVerifierModal} />}
      </div>
    </div>
  );
}

export default withAuth(Home);
