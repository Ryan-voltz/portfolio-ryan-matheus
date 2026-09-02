import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import SheetFrame from '@/components/SheetFrame';
import TitleBlock from '@/components/TitleBlock';
import { ArrowRight } from '@/components/Icons';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <>
      <SheetFrame />
      <Header stations={[]} />
      <main className="relative">
        <div className="field-grid" aria-hidden />
        <div className="sheet relative flex min-h-[60svh] flex-col justify-center py-24">
          <p className="u-label u-label-red flex items-center gap-2.5 font-medium">
            <span className="rev-tri" aria-hidden />
            {t('tag')}
          </p>
          <h1 className="u-display mt-6 max-w-[16ch] text-[clamp(2.25rem,6vw,4rem)]">
            {t('heading')}
          </h1>
          <p className="u-body mt-6 max-w-[52ch]">{t('body')}</p>
          <div className="mt-10">
            <Link href="/" className="plate">
              {t('cta')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <TitleBlock />
    </>
  );
}
