import Link from 'next/link';

import { getContracts } from 'api';
import PageTitle from 'components/page-title';

const linkStyle =
  'p-10 lg:p-0 lg:w-72 rounded-lg border border-gray-semilight bg-white text-center text-xl lg:text-3xl font-medium lg:leading-[16rem] hover:bg-primary hover:text-gray-light';

async function TokenCreate() {
  const contracts = await getContracts();

  return (
    <div>
      <PageTitle>Create New Token</PageTitle>
      <div className="mt-8 flex h-[50vh] items-center justify-center gap-6">
        {contracts
          .filter((contract) => contract.active)
          .map((contract) => (
            <Link
              key={contract.id}
              href={`/token/create/${contract.type.toLowerCase()}`}
              className={linkStyle}
            >
              {contract.type}
            </Link>
          ))}
      </div>
    </div>
  );
}

export default TokenCreate;
