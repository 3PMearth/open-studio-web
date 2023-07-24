import Link from "next/link";

import PageTitle from "components/page-title";

function TokenCreate() {
  const linkStyle =
    "w-72 rounded-lg border border-gray-semilight bg-white text-center text-3xl font-medium leading-[16rem] hover:bg-primary hover:text-gray-light";
  return (
    <div>
      <PageTitle>Create New Token</PageTitle>
      <div className="mt-8 flex items-center justify-center gap-6 lg:h-[50vh]">
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
