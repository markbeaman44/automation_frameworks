// Remove automation fingerprints
Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

// Stabilise environment
Object.defineProperty(navigator, 'languages', {
  get: () => ['en-GB', 'en'],
});

Object.defineProperty(navigator, 'plugins', {
  get: () => [1, 2, 3],
});

// Optional: lock timezone / locale effects
Intl.DateTimeFormat = new Proxy(Intl.DateTimeFormat, {
  construct(target, args) {
    return new target('en-GB', args[1]);
  },
});
