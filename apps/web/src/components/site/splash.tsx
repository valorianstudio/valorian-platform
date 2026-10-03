import Image from 'next/image';

/**
 * Branded intro shown once per browser session. Visibility is decided by an inline script that sets data-splash on <html>
 * before first paint; without JavaScript (and for crawlers) it simply never appears, so it cannot hide content from them.
 */
export function Splash() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "try{if(!sessionStorage.getItem('vs-splash')){document.documentElement.setAttribute('data-splash','1');sessionStorage.setItem('vs-splash','1')}}catch(e){}" }} />
      <div className="splash" aria-hidden>
        <div className="flex flex-col items-center gap-6 px-6">
          <Image src="/branding/valorian-logo.png" alt="" width={1190} height={321} sizes="240px" loading="eager" className="splash-logo h-auto w-48 sm:w-60" />
          <span className="splash-line block h-0.5 w-32 rounded-full bg-coral" />
        </div>
      </div>
    </>
  );
}
