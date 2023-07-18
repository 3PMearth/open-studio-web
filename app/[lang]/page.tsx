import { Metadata } from "next";

import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";

export const metadata: Metadata = {
  title: "3PM Studio",
};

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div>
      <p>{dictionary["home"].welcome}</p>
    </div>
  );
}
