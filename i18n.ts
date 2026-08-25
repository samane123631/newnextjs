import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  return {
    locale: locale ?? "de",
    messages: (await import(`./messages/${locale ?? "de"}.json`)).default,
  };
});