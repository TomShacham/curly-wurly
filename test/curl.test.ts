import { expect } from "chai";
import { request } from "../src/requests";
import { Buffered } from "../src/bodies";
import { curl } from "../src/CurlHandler";

describe('curl', () => {
  it('GET', async () => {
    const response = await curl(request('GET', 'http://httpbin.org/get'));

    expect(JSON.parse(await Buffered.text(response.body))).deep.include({
      "args": {},
      "headers": {
        "Accept": "*/*",
        "Host": "httpbin.org",
        "User-Agent": "curl/7.54.0",
      },
      "url": "https://httpbin.org/get"
    });
    expect(response.status).eq(200);
    [
      ["Access-Control-Allow-Credentials", "true"],
      ["Access-Control-Allow-Origin", "*"],
      ["Content-Type", "application/json"],
      ["Server", "nginx"],
      ["Connection", "keep-alive"]
    ].forEach(header => {
      expect(response.headers).deep.include(header);
    })
  });

  it('POST', async () => {
    const response = await curl(request('POST', 'http://httpbin.org/post', 'post body', ['content-type', 'text/plain']));

    const text = await Buffered.text(response.body);
    console.log(text);
    expect(JSON.parse(text)).deep.include({
      "args": {},
      "data": "post body",
      "files": {},
      "form": {},
      "headers": {
        "Accept": "*/*",
        "Content-Length": "9",
        "Content-Type": "text/plain",
        "Host": "httpbin.org",
        "User-Agent": "curl/7.54.0",
      },
      "json": null,
      "url": "https://httpbin.org/post",
    });
    expect(response.status).eq(200);
  });
});