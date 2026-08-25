import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import TopBar from "../../components/TopBar";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  console.log("URL LOCALE:", locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <Header />

      <main>
        {children}
      </main>

      <TopBar />
      <Footer />
    </NextIntlClientProvider>
  );
}