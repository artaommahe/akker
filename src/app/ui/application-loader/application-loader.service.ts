import { Injectable } from '@angular/core';
import { fromEvent, of, race, take, timer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApplicationLoaderService {
  removeLoader() {
    const applicationLoaderElement = document.querySelector(applicationLoaderElementSelector);
    const removeAnimation = applicationLoaderElement?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: animationDurationMs,
    });

    const removeAnimationFinished =
      removeAnimation && !environment.animationsDisabled ? fromEvent(removeAnimation, 'finish').pipe(take(1)) : of();

    // use fallback timer in case the animation does not finish for some reason
    race(removeAnimationFinished, timer(fallbackDelayMs)).subscribe({
      complete: () => {
        applicationLoaderElement?.remove();
        // unblock the app root element content for interaction
        document.querySelector(appRootSelector)?.removeAttribute('inert');
      },
    });
  }
}

const appRootSelector = 'app-root';
const applicationLoaderElementSelector = '#app-application-loader';
const animationDurationMs = 300;
const fallbackDelayMs = 500;
