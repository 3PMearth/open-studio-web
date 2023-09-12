import Link from 'next/link';

import PageTitle from 'components/page-title';

function TokenCreate() {
  const linkStyle =
    'p-10 lg:p-0 lg:w-72 rounded-lg border border-gray-semilight bg-white text-center text-xl lg:text-3xl font-medium lg:leading-[16rem] hover:bg-primary hover:text-gray-light';
  return (
    <div>
      <PageTitle>Create New Token</PageTitle>
      <div className="mt-8 flex h-[50vh] items-center justify-center gap-6">
        <Link href="/token/create/1" className={linkStyle}>
          Music
        </Link>
        <Link href="/token/create/2" className={linkStyle}>
          Ticket
        </Link>
      </div>
    </div>
  );
}

export default TokenCreate;
