'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowOut, Zap, RotateCw, Monitor, Smartphone } from './Icons';

type Props = {
  src: string;
  alt: string;
  /** Caption bar under the mount: "DETAIL A — volarecompany.com.br". */
  caption: string;
  url?: string;
  priority?: boolean;
  sizes?: string;
  /** Accessible name for the expand affordance. */
  expandLabel: string;
  closeLabel: string;
  /** Let the shot reach the screen edges below 1024px. */
  bleed?: boolean;
};

export default function MountedShot({
  src,
  alt,
  caption,
  url,
  priority,
  sizes,
  expandLabel,
  closeLabel,
  bleed,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Dialog interactive states
  const [dialogLive, setDialogLive] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [dialogLoading, setDialogLoading] = useState(true);
  const [dialogKey, setDialogKey] = useState(0);

  const domain = caption.split('—')[1]?.trim() || caption;

  const open = () => {
    setOpened(true);
    setDialogLoading(true);
    dialog.current?.showModal();
  };

  const handleStartLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLive(true);
    setIsLoading(true);
  };

  const handleStopLive = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsLive(false);
  };

  const handleReload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setIframeKey((k) => k + 1);
  };

  const handleDialogReload = () => {
    setDialogLoading(true);
    setDialogKey((k) => k + 1);
  };

  return (
    <figure className="m-0">
      <div
        className={`group/mount relative block w-full overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--field)] p-0 text-left shadow-md transition-all duration-300 hover:border-[var(--brand)] hover:shadow-xl ${
          bleed ? 'bleed' : ''
        }`}
      >
        {/* Browser Chrome Header */}
        <div className="flex h-10 items-center justify-between border-b border-[var(--rule)] bg-[var(--sheet)] px-3.5 sm:px-4">
          {/* macOS traffic light controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={isLive ? () => handleStopLive() : undefined}
                className="h-2.5 w-2.5 rounded-full bg-rose-500/80 transition-opacity hover:opacity-100"
                title={isLive ? 'Voltar para o preview' : undefined}
              />
              <button
                type="button"
                onClick={isLive ? (e) => handleReload(e) : undefined}
                className="h-2.5 w-2.5 rounded-full bg-amber-500/80 transition-opacity hover:opacity-100"
                title={isLive ? 'Recarregar site' : undefined}
              />
              <button
                type="button"
                onClick={open}
                className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 transition-opacity hover:opacity-100"
                title="Expandir para tela cheia"
              />
            </div>

            {isLive && (
              <span className="hidden text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 sm:inline-flex items-center gap-1 ml-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AO VIVO
              </span>
            )}
          </div>

          {/* URL address bar */}
          <div className="mx-2 flex max-w-[180px] sm:max-w-xs items-center gap-1.5 truncate rounded-md bg-[var(--field)] px-2.5 py-1 text-[0.6875rem] font-mono text-[var(--ink-3)]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span className="truncate">{domain}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {url && (
              <>
                {!isLive ? (
                  <button
                    type="button"
                    onClick={handleStartLive}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-ink)] shadow-2xs transition-all hover:bg-[var(--brand)]/20 hover:scale-105"
                    title="Carregar o site real interativo com scroll"
                  >
                    <Zap size={12} className="text-[var(--brand-ink)]" />
                    <span className="hidden sm:inline">Interagir ao vivo</span>
                    <span className="sm:hidden">Ao vivo</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleReload}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--rule)] bg-[var(--card)] text-[var(--ink-2)] transition-colors hover:bg-[var(--field)] hover:text-[var(--ink)]"
                      title="Recarregar página"
                    >
                      <RotateCw size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStopLive()}
                      className="rounded-md border border-[var(--rule)] bg-[var(--card)] px-2 py-1 text-[11px] font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--field)] hover:text-[var(--ink)]"
                      title="Voltar ao modo captura"
                    >
                      Preview
                    </button>
                  </>
                )}
              </>
            )}

            <button
              type="button"
              onClick={open}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--rule)] bg-[var(--card)] text-[var(--ink-2)] transition-colors hover:bg-[var(--field)] hover:text-[var(--ink)]"
              title={expandLabel}
            >
              <ArrowOut size={12} />
            </button>
          </div>
        </div>

        {/* Viewport Content Area */}
        {!isLive ? (
          <div className="relative group/shot cursor-pointer" onClick={url ? handleStartLive : open}>
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1000}
              priority={priority}
              sizes={sizes ?? '(max-width: 1023px) 100vw, 58vw'}
              className="h-auto w-full transition-transform duration-300 group-hover/mount:scale-[1.005]"
            />

            {/* Hover overlay hint */}
            {url && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/shot:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--sheet)]/95 px-4 py-2.5 text-xs font-bold text-[var(--ink)] shadow-xl backdrop-blur-md transition-transform duration-200 group-hover/shot:scale-105">
                  <Zap size={15} className="text-[var(--brand-ink)]" />
                  <span>Clique para navegar e rolar o site ao vivo</span>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-16/10 min-h-[440px] md:min-h-[520px] w-full overflow-hidden bg-white">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--card)] text-[var(--ink)]">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--brand-ink)] border-t-transparent mb-3" />
                <p className="text-xs font-bold">Conectando a {domain}...</p>
                <p className="mt-1 text-[11px] text-[var(--ink-3)]">Carregando interface em tempo real</p>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={url}
              title={alt}
              onLoad={() => setIsLoading(false)}
              className="h-full w-full border-0 bg-white"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        )}

        {/* Live Mode Scroll Indicator Bar */}
        {isLive && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--rule)] bg-[var(--sheet)] px-3.5 py-2 text-xs text-[var(--ink-3)]">
            <span className="flex items-center gap-1.5 font-medium text-[var(--ink-2)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Scroll ativo: role dentro da moldura para navegar pela página
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={open}
                className="font-semibold text-[var(--brand-ink)] hover:underline"
              >
                Modo tela cheia
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleStopLive()}
                className="hover:underline text-[var(--ink-3)]"
              >
                Voltar ao preview estático
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Figcaption bar */}
      <figcaption className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--ink-3)]">
        <span className="truncate font-medium">{caption}</span>
        <div className="flex items-center gap-3 shrink-0">
          {url && !isLive && (
            <button
              type="button"
              onClick={handleStartLive}
              className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-[var(--brand-ink)] transition-opacity hover:opacity-80"
            >
              <Zap size={11} />
              <span>Interagir</span>
            </button>
          )}
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center gap-1 text-[0.6875rem] text-[var(--brand-ink)] opacity-90 transition-opacity hover:opacity-100"
          >
            <span>Ampliar</span>
            <ArrowOut size={11} />
          </button>
        </div>
      </figcaption>

      {/* Full-screen Expanded Viewer Dialog */}
      <dialog
        ref={dialog}
        className="viewer"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="viewer-head flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-2 min-w-0">
            <p className="u-label min-w-0 truncate text-sm font-bold">{caption}</p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-[var(--brand-ink)] hover:underline"
              >
                <span>{domain}</span>
                <ArrowOut size={12} />
              </a>
            )}
          </div>

          {/* Interactive controls inside Modal */}
          {url && (
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-[var(--rule)] bg-[var(--field)] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setDialogLive(true)}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                    dialogLive
                      ? 'bg-[var(--card)] text-[var(--brand-ink)] shadow-2xs'
                      : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Zap size={13} />
                  <span>Interativo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDialogLive(false)}
                  className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                    !dialogLive
                      ? 'bg-[var(--card)] text-[var(--ink)] shadow-2xs'
                      : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                  }`}
                >
                  Captura
                </button>
              </div>

              {dialogLive && (
                <>
                  <div className="hidden sm:flex rounded-lg border border-[var(--rule)] bg-[var(--field)] p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeviceMode('desktop')}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
                        deviceMode === 'desktop'
                          ? 'bg-[var(--card)] text-[var(--brand-ink)] shadow-2xs'
                          : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                      }`}
                      title="Visão Desktop"
                    >
                      <Monitor size={14} />
                      <span className="hidden md:inline">Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeviceMode('mobile')}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
                        deviceMode === 'mobile'
                          ? 'bg-[var(--card)] text-[var(--brand-ink)] shadow-2xs'
                          : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                      }`}
                      title="Visão Mobile"
                    >
                      <Smartphone size={14} />
                      <span className="hidden md:inline">Mobile</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDialogReload}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--field)] text-[var(--ink-2)] hover:bg-[var(--card)]"
                    title="Recarregar"
                  >
                    <RotateCw size={13} />
                  </button>
                </>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="u-tag u-tag-ink shrink-0 border border-[var(--rule-strong)] px-3 py-1.5 transition-colors duration-200 hover:border-[var(--red)] hover:text-[var(--red-ink)]"
          >
            {closeLabel}
          </button>
        </div>

        <div className="viewer-scroll p-4 md:p-8 flex items-center justify-center min-h-[70vh]">
          {opened && (
            <>
              {url && dialogLive ? (
                <div
                  className={`relative overflow-hidden rounded-2xl border border-[var(--rule)] bg-white shadow-2xl transition-all duration-300 ${
                    deviceMode === 'mobile'
                      ? 'w-[390px] h-[78vh] ring-8 ring-slate-900/90'
                      : 'w-full max-w-6xl h-[80vh]'
                  }`}
                >
                  {dialogLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--card)] text-[var(--ink)]">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--brand-ink)] border-t-transparent mb-3" />
                      <p className="text-xs font-bold">Carregando {domain} ao vivo...</p>
                    </div>
                  )}
                  <iframe
                    key={dialogKey}
                    src={url}
                    title={alt}
                    onLoad={() => setDialogLoading(false)}
                    className="h-full w-full border-0 bg-white"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              ) : (
                /* Plain img at native width */
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt} width={1600} height={1000} decoding="async" className="max-w-none rounded-xl" />
              )}
            </>
          )}
        </div>
      </dialog>
    </figure>
  );
}
