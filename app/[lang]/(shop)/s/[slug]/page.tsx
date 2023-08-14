"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { FaUserAstronaut } from "react-icons/fa";

import { getTokens, getUserBySlug } from "api";
import TextWithReadMore from "components/text-with-read-more";
import { TokenListItem } from "components/token-item";
import type { Token } from "types/token";
import type { User } from "types/user";

const InfoWrapper = isMobile ? TextWithReadMore : "p";

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
    <>
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
          <InfoWrapper
            className="mt-3 whitespace-pre-wrap break-all text-sm leading-6"
            maxLength={200}
          >
            {user.info}
          </InfoWrapper>
        )}
      </div>
      <div className="p-6 lg:py-10">
        <h2 className="text-[2rem] font-semibold leading-10">Tokens</h2>
        <div className="mt-3 flex min-h-[15rem] flex-col justify-center divide-y-[0.0625rem] divide-solid divide-[#E5E7EB] rounded-lg py-3 shadow-md">
          {tokens && tokens.length > 0 ? (
            tokens.map(token => (
              <TokenListItem
                key={token.id}
                token={token}
                href={`${slug}/token?id=${token.id}`}
              />
            ))
          ) : (
            <p className="text-center text-gray-semilight">
              {!tokens ? t("loading") : t("empty")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Shop;
