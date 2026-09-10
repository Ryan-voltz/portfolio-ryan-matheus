import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import SectionHead from './SectionHead';
import { AcademicCap, AwardBadge, ArrowOut } from './Icons';

type CertificateItem = {
  id: string;
  title: string;
  hours: number;
  date: string;
  code: string;
  image: string;
  pdf: string;
};

const certificates: CertificateItem[] = [
  {
    id: 'ux-architecture',
    title: 'Fundamentos da Arquitetura de User Experience (UX)',
    hours: 3,
    date: '20/04/2026',
    code: 'HRF4H6UJ',
    image: '/certificates/fundamento-arquitetura.jpg',
    pdf: '/docs/certificado-fundamentos-ux-arquitetura.pdf',
  },
  {
    id: 'dbms',
    title: 'Sistemas de Gerenciamento de Banco de Dados',
    hours: 2,
    date: '21/12/2024',
    code: 'CA9BH1BY',
    image: '/certificates/sistema-gerenciamento.jpg',
    pdf: '/docs/certificado-sistema-gerenciamento-banco-dados.pdf',
  },
  {
    id: 'php-oop',
    title: 'Orientação a Objetos, Exceções e Banco de Dados com PHP',
    hours: 3,
    date: '20/11/2024',
    code: 'GAODHZYS',
    image: '/certificates/php.jpg',
    pdf: '/docs/certificado-php-orientacao-objetos.pdf',
  },
  {
    id: 'git-github',
    title: 'Versionamento de Código com Git e GitHub',
    hours: 2,
    date: '19/09/2024',
    code: 'IMWAHERL',
    image: '/certificates/git-github.jpg',
    pdf: '/docs/certificado-git-github.pdf',
  },
];

export default async function CredentialsSection() {
  const t = await getTranslations('home.credentials');

  return (
    <div className="sheet relative">
      <SectionHead
        gutter={t('gutter')}
        headingId="credentials-heading"
        heading={t('heading')}
        lead={t('lead')}
      />

      <div className="mt-12 space-y-12">
        {/* Featured Degree: Diploma Digital ADS */}
        <div className="rounded-3xl border border-[var(--rule)] bg-[var(--card)] p-6 sm:p-8 lg:p-10 shadow-sm transition-colors duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-ink)]/10 text-[var(--brand-ink)]">
                <AcademicCap size={16} />
              </span>
              <span className="u-tag text-xs font-semibold tracking-wider text-[var(--brand-ink)]">
                {t('degreeBadge')}
              </span>
            </div>
            <span className="u-tag font-mono text-xs text-[var(--ink-3)]">
              MEC · PROCESSO Nº 128020
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Visual preview */}
            <div className="lg:col-span-5">
              <a
                href="/docs/diploma-analise-desenvolvimento-sistemas.pdf"
                target="_blank"
                rel="noreferrer noopener"
                className="group relative block overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--sheet)] shadow-md transition-all duration-300 hover:shadow-xl hover:border-[var(--brand-ink)]"
                title={t('openPdf')}
              >
                <div className="relative aspect-[1.414/1] w-full overflow-hidden bg-[var(--sheet)]">
                  <Image
                    src="/certificates/diploma-ads.jpg"
                    alt={t('degreeTitle')}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow backdrop-blur-sm">
                      <span>{t('openPdf')}</span>
                      <ArrowOut size={13} />
                    </span>
                  </div>
                </div>
              </a>
            </div>

            {/* Academic details */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
                  {t('degreeTitle')}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--brand-ink)]">
                  {t('degreeInstitution')}
                </p>
                <p className="mt-2 text-xs text-[var(--ink-3)]">
                  {t('degreeDate')}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[var(--rule)] bg-[var(--sheet)] p-3">
                    <p className="u-tag text-[10px] text-[var(--ink-3)]">Grau Acadêmico</p>
                    <p className="mt-1 font-semibold text-[var(--ink)]">Tecnólogo</p>
                  </div>
                  <div className="rounded-xl border border-[var(--rule)] bg-[var(--sheet)] p-3">
                    <p className="u-tag text-[10px] text-[var(--ink-3)]">Colação de Grau</p>
                    <p className="mt-1 font-semibold text-[var(--ink)]">19 de Agosto de 2025</p>
                  </div>
                  <div className="rounded-xl border border-[var(--rule)] bg-[var(--sheet)] p-3">
                    <p className="u-tag text-[10px] text-[var(--ink-3)]">Registro do Diploma</p>
                    <p className="mt-1 font-mono font-semibold text-[var(--ink)]">Nº 128020 · Livro 65</p>
                  </div>
                  <div className="rounded-xl border border-[var(--rule)] bg-[var(--sheet)] p-3">
                    <p className="u-tag text-[10px] text-[var(--ink-3)]">Código Validador MEC</p>
                    <p className="mt-1 font-mono font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                      671.671.a2aaccd3f06d
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/docs/diploma-analise-desenvolvimento-sistemas.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="plate text-xs"
                >
                  <AcademicCap size={15} />
                  <span>{t('openPdf')}</span>
                  <ArrowOut size={13} />
                </a>

                <a
                  href="https://diplomas.cogna.com.br/diploma-digital/validador/documento/academico/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="chip u-tag u-tag-ink text-xs font-semibold"
                >
                  <span>Validador Oficial MEC/Cogna</span>
                  <ArrowOut size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Certifications Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--brand-ink)]/10 text-[var(--brand-ink)]">
                <AwardBadge size={15} />
              </span>
              <h3 className="text-base font-bold text-[var(--ink)]">
                {t('certTitle')}
              </h3>
            </div>
            <span className="u-tag text-xs font-mono text-[var(--ink-3)]">
              DIO · 4 CERTIFICAÇÕES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certificates.map((cert) => (
              <a
                key={cert.id}
                href={cert.pdf}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-col justify-between rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-4 shadow-sm transition-all duration-300 hover:border-[var(--brand-ink)] hover:shadow-md"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--sheet)]">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      unoptimized
                      loading="eager"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-mono text-white backdrop-blur-sm">
                      {cert.hours}h
                    </div>
                  </div>

                  <h4 className="mt-3.5 text-xs font-bold leading-snug text-[var(--ink)] group-hover:text-[var(--brand-ink)] transition-colors">
                    {cert.title}
                  </h4>

                  <div className="mt-3 space-y-1 text-[11px] text-[var(--ink-3)]">
                    <div className="flex justify-between">
                      <span>Emissão:</span>
                      <strong className="text-[var(--ink-2)] font-mono">{cert.date}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Cód:</span>
                      <strong className="text-[var(--ink-2)] font-mono">{cert.code}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-[var(--rule)] pt-3 flex items-center justify-between text-xs font-semibold text-[var(--brand-ink)]">
                  <span>{t('viewCert')}</span>
                  <ArrowOut size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
