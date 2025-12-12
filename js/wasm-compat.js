// @license © 2025 Google LLC. Licensed under the Apache License, Version 2.0.

let featureDataPromise = null;

const FLAG_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M4 17v5H2V3h19.1a.5.5 0 0 1 .5.7L18 10l3.6 6.3a.5.5 0 0 1-.5.7H4zM4 5v10h14.6l-2.9-5 2.9-5H4z" class="svg-stroke"/></svg>';
const SUPPORTED_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" class="supported-icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
const NOT_SUPPORTED_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" class="not-supported-icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>';

export class WasmCompat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.featureId = this.getAttribute('wasm-feature');
    this.hideHeader = this.hasAttribute('hide-header');
  }

  static async fetchFeatureData() {
    if (!featureDataPromise) {
      const url =
        'https://raw.githubusercontent.com/WebAssembly/website/main/features.json';
      // '/features.json'; // For local testing.
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
    const browserSupport = browsers ? Object.values(browsers) : [];

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="container">
        <div class="table-wrapper">
          <table>
            <caption class="feature-title${this.hideHeader ? ' sr-only' : ''}">
              <a href="${feature.url}">${feature.description}</a>
              <small>(Phase ${feature.phase})</small>
            </caption>
            <thead>
              <tr>
                ${Object.keys(browsers)
                  .map((engineName) => {
                    const engine = browsers[engineName];
                    return `
                    <th>
                      <div class="engine-cell">
                        <img src="https://webassembly.org${engine.logo}" alt="" class="logo">
                        ${engineName}
                      </div>
                    </th>`;
                  })
                  .join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                ${browserSupport.length > 0 ? browserSupport.map((supportData) => this.createCell(supportData.features[this.featureId])).join('') : this.createEmptyRow()}
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
  }

  parseStatus(status) {
    let supported = 'neutral';
    let statusText = '';
    let icon = '';

    // See https://github.com/WebAssembly/website/blob/main/features.schema.json.
    if (status === null) {
      statusText = 'N/A';
    } else if (status === true) {
      supported = true;
      icon = SUPPORTED_ICON;
    } else if (status === 'flag') {
      statusText = 'Flag';
      icon = FLAG_ICON;
    } else if (typeof status === 'string') {
      supported = true;
      statusText = status;
    } else if (!status) {
      supported = false;
      icon = NOT_SUPPORTED_ICON;
    }
    return { statusText, supported, icon };
  }

  createCell(status) {
    let statusText;
    let supported;
    let icon;
    let note = '';
    if (Array.isArray(status)) {
      ({ statusText, supported, icon } = this.parseStatus(status[0]));
      note = `
        <details class="support-details">
          <summary>More</summary>
          <div>
            ${status[1].replace(/`(.+?)`/g, '<code>$1</code>')}
          </div>
        </details>`;
    } else {
      ({ statusText, supported, icon } = this.parseStatus(status));
    }

    return `
      <td>
        <div class="support-cell ${supported !== 'neutral' ? (supported ? 'supported' : 'unsupported') : ''}">
          ${icon}
          ${statusText}
          ${note}
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
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
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
        scrollbar-width: thin;
      }
      table {
        width: 100%;
        border-collapse: collapse;
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
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 500;
      }
      .support-details {
        display: inline-block;
        font-size: 0.8rem;
      }
      .support-details summary {
        white-space: nowrap;
        font-weight: bold;
        cursor: pointer;
      }
      .support-details div {
        width: 40ch;
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
      .supported-icon {
        color: #10b981;
      }
      .not-supported-icon {
        color: #ef4444;
      }
      .empty-cell {
        text-align: center;
        color: #6b7280;
        padding: 2rem;
      }
      .loading-container,
      .error-container {
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
