let featureDataPromise = null;

export class WasmCompat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.featureId = this.getAttribute('wasm-feature');
  }

  static async fetchFeatureData() {
    if (!featureDataPromise) {
      const url =
        'https://raw.githubusercontent.com/WebAssembly/website/main/features.json';
      featureDataPromise = fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error('Could not fetch Wasm feature data:', error);
          return null;
        });
    }
    return featureDataPromise;
  }

  async connectedCallback() {
    this.renderLoading();
    const { features, browsers } = await WasmCompat.fetchFeatureData();
    if (features && this.featureId) {
      const feature = features[this.featureId];
      if (feature) {
        this.render(feature, browsers);
      } else {
        this.renderError(`Feature "${this.featureId}" not found.`);
      }
    } else {
      this.renderError('Could not load WebAssembly feature data.');
    }
  }

  renderLoading() {
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="container loading-container">
        <div class="spinner"></div>
        <p>Loading feature: <strong>${this.featureId}</strong>…</p>
      </div>`;
  }

  renderError(message) {
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="container error-container">
        <p>${message}</p>
      </div>`;
  }

  render(feature, browsers) {
    const browserSupport = browsers ? Object.entries(browsers) : [];

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="container">
        <div class="table-wrapper">
          <table>
            <caption class="feature-title"><a href="${feature.url}">${feature.description}</a> <small>(Phase ${feature.phase})</small></caption>
            <thead>
              <tr>
                ${Object.keys(browsers).map((engineName) => {
                  const engine = browsers[engineName];
                  return `
                    <th>
                      <div class="engine-cell">
                        <img src="https://webassembly.org${engine.logo}" alt="" class="logo">
                        <span>${engineName}</span>
                      </div>
                    </th>`;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                ${browserSupport.length > 0 ? browserSupport.map(([, supportData]) => this.createCell(supportData.features[this.featureId])).join('') : this.createEmptyRow()}
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
  }

  createCell(version) {
    let remarks = '';
    let versionNumber = version;
    if (Array.isArray(version)) {
      versionNumber =
        version[0] === 'flag'
          ? '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" viewBox="0 0 24 24"><path class="svg-stroke" d="M4 17v5H2V3h19.1a.5.5 0 0 1 .5.7L18 10l3.6 6.3a.5.5 0 0 1-.5.7H4zM4 5v10h14.6l-2.9-5 2.9-5H4z"></path></svg>'
          : version[0];
      remarks = version[1];
      remarks = remarks.replace(/`(.+?)`/, '<code>$1</code>');
    }
    const isSupported = typeof versionNumber === 'string';
    const versionText = isSupported
      ? `${versionNumber}${remarks ? ' ' + `<details class="support-details"><summary>More</summary><div>${remarks}</div>` : ''}`
      : 'Not supported';
    const supportClass = isSupported ? 'supported' : 'unsupported';
    const supportIcon = isSupported
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><path d="M20 6 9 17l-5-5"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="x-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

    return `
      <td>
        <div class="support-cell ${supportClass}">
          ${supportIcon}
          <span class="version-info">${versionText}</span>
        </div>
      </td>`;
  }

  createEmptyRow() {
    return `
      <tr>
        <td colspan="2" class="empty-cell">No browser support information available for this feature.</td>
      </tr>`;
  }

  getStyles() {
    return `
      :host {
        display: block;
        margin-bottom: 2rem;
      }
      .container {
        padding: 1.5rem;
      }
      .feature-title {
        text-align: left;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      .feature-title a {
        color: currentColor;
        text-decoration: none;
      }
      .feature-id {
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }
      .feature-id code {
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: monospace;
      }
      .table-wrapper {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
      }
      th, td {
        padding: 0.75rem 1rem;
      }
      th {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.05rem;
      }
      td {
        font-size: 0.95rem;
      }
      .engine-cell {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .logo {
        width: auto;
        height: 24px;
      }
      .support-cell {
        white-space: pre;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
      }
      .version-info {
        display: flex;
        gap: 0.25rem;
        align-items: center;
      }
      .support-details {
        display: inline-block;
        font-size: 0.8rem;
      }
      .support-details summary {
        font-weight: bold;
        cursor: pointer;
      }
      .support-details div {
        white-space: normal;
        max-width: 40ch;
      }
      .support-details code {
        white-space: pre;
      }
      .supported {
        color: #10b981;
      }
      .unsupported {
        color: #ef4444;
      }
      .check-icon { color: #10b981; }
      .x-icon { color: #ef4444; }
      .empty-cell {
        text-align: center;
        color: #6b7280;
        padding: 2rem;
      }
      .loading-container, .error-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #4b5563;
        gap: 0.75rem;
      }
      .error-container {
        color: #b91c1c;
        background-color: #fee2e2;
      }
      .spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #e5e7eb;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }`;
  }
}

customElements.define('wasm-compat', WasmCompat);
