import Image from 'next/image';
import Link from 'next/link';

import { Token } from 'types/token';

interface TokenItemProps {
  token: Token;
}

export default function TokenItem({ token }: TokenItemProps) {
  const { id, token_img, name } = token;

  return (
    <Link href={`/token/${id}`}>
      <div className="rounded-md p-2 pb-0 hover:bg-primary-light">
        <div className="aspect-square">
          {token_img && (
            <Image layout="responsive" src={token_img} alt={name} width={135} height={135} />
          )}
        </div>
        <div className="flex h-20 flex-col justify-between px-3 py-[0.7rem]">
          <p>{token.name}</p>
          <p className="text-xs">See More {'>'}</p>
        </div>
      </div>
    </Link>
  );
}
