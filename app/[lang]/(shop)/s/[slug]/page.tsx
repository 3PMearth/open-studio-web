"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";

import { getTokens, getUserBySlug } from "api";
import TextWithReadMore from "components/text-with-read-more";
import { TokenListItem } from "components/token-item";
import type { Token } from "types/token";
import type { User } from "types/user";

function Shop() {
  const t = useTranslations("shop");

  const { slug } = useParams();

  const [user, setUser] = useState<Partial<User>>({});
  const [tokens, setTokens] = useState<Token[]>();

  useEffect(() => {
    const fetchUser = async () => {
      const _user = await getUserBySlug(slug as string);
      setUser(_user);
      // todo handle not found
    };
    if (slug) {
      fetchUser();
    }
  }, [slug]);

  useEffect(() => {
    const fetchTokens = async () => {
      const _tokens = await getTokens(user.id!);
      setTokens(_tokens.reverse());
    };

    setTokens(undefined);
    if (user?.id) {
      fetchTokens();
    }
  }, [user]);

  return (
    <div className="mx-auto min-h-full overflow-hidden bg-white shadow-md lg:min-h-0 lg:max-w-2xl lg:rounded-lg">
      <header className="relative h-40">
        <div className="h-full bg-primary" />
        <div className="absolute -bottom-12 left-6 flex aspect-square w-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-gray-light">
          <FaUserAstronaut color="black" size={36} />
          {user.profile_img && (
            <Image
              src={user.profile_img}
              alt="user profile"
              className="absolute h-24 w-24 object-cover"
              width={96}
              height={96}
            />
          )}
        </div>
      </header>
      <div className="mt-12 p-6">
        <h1 className="text-2xl font-semibold leading-8">
          {user.first_name} {user.last_name}
        </h1>
        {user.info && (
          <>
            <p className="mt-3 hidden text-sm leading-6 sm:block">
              {user.info}
            </p>
            <TextWithReadMore
              className="mt-3 text-sm leading-6 sm:hidden"
              maxLength={200}
            >
              {user.info}
            </TextWithReadMore>
          </>
        )}
      </div>
      <div className="p-6 lg:py-10">
        <h2 className="text-[2rem] font-semibold leading-10">Tokens</h2>
        <div className="mt-3 min-h-[15rem] divide-y-8 divide-solid divide-gray-400 rounded-lg py-3 shadow-md">
          {!tokens ? (
            <div className="flex h-56 items-center justify-center text-gray-semilight">
              {t("loading")}
            </div>
          ) : !tokens.length ? (
            <div className="flex h-56 items-center justify-center text-gray-semilight">
              {t("empty")}
            </div>
          ) : (
            tokens?.map(token => (
              <TokenListItem
                key={token.id}
                token={token}
                href={`${slug}/token?id=${token.id}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
