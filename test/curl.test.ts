import { expect } from "chai";
import child_process from 'child_process';
import { HttpHandler, HttpRequest, HttpResponse } from "../src/contract";
import { response } from "../src/responses";
import { request } from "../src/requests";
import { Buffered } from "../src/bodies";

export async function curl(request: HttpRequest) {
  return new CurlHandler().handle(request);
}

export class CurlHandler implements HttpHandler {

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const responseBody = child_process.execSync(`curl -iv "${request.uri}"`).toString('utf-8');
    const [headersString, bodyString] = responseBody.split('\r\n\r\n');
    const [statusString, ...headersStrings] = headersString.split('\r\n');
    const status = statusString.match(/\d{3}/);
    const headers = headersStrings.map(string => string.split(': ') as [string, string]);

    return response(status && Number(status[0]) || 500, bodyString, ...headers);
  }
}

describe('curl', () => {

  it('GET', async () => {
    const response = await curl(request('GET', 'http://httpbin.org/get'));

    expect(JSON.parse(await Buffered.text(response.body))).eql({
      "args": {},
      "headers": {
        "Accept": "*/*",
        "Host": "httpbin.org",
        "User-Agent": "curl/7.54.0",
      },
      "origin": "80.43.87.237, 80.43.87.237",
      "url": "https://httpbin.org/get"
    });
    expect(response.status).eq(200);
    expect(response.headers).eq([
      ["Access-Control-Allow-Credentials", "true"],
      ["Access-Control-Allow-Origin", "*"],
      ["Content-Type", "application/json"],
      ["Date", "Sun, 07 Apr 2019 10:21:56 GMT"],
      ["Server", "nginx"],
      ["Content-Length", "200"],
      ["Connection", "keep-alive"]
    ]);
  });
});