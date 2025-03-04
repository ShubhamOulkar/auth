import { i18n } from "@lingui/core";

export async function loadCatalog(locale: string) {
  const { messages } = await import(`./locales/${locale}/messages.po`);
  i18n.loadAndActivate({ locale, messages });
}
