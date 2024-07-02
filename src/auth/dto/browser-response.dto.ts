export class BrowserResponse {
  constructor(private readonly content: Record<string, any>) {}

  toString() {
    const response = JSON.stringify({
      origin: 'fingercoder-oauth',
      payload: this.content,
      emitTime: Date.now(),
    });
    return `<html>
      <head>
        <script type="text/javascript">
          window.opener.postMessage(${response}, '*');
        </script>
      </head>
    </html>`;
  }
}
