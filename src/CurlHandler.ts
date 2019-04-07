import { HttpHandler, HttpRequest, HttpResponse } from "./contract";
import child_process from "child_process";
import { response } from "./responses";
import { bufferText } from "./bodies";

export class CurlHandler implements HttpHandler {

  async handle(request: HttpRequest): Promise<HttpResponse> {
    let command = `curl -X ${request.method.toUpperCase()} -iv "${request.uri}" `;
    request.headers.forEach(header => command += `-H "${header[0]}: ${header[1]}" `);
    const requestBody = await bufferText(request.body);
    if (requestBody) command += `--data "${requestBody}"`;
    console.log(command);

    const responseString = child_process.execSync(command).toString('utf-8');
    const [headersString, bodyString] = responseString.split('\r\n\r\n');
    const [statusString, ...headersStrings] = headersString.split('\r\n');
    const status = statusString.match(/\d{3}/);
    const headers = headersStrings.map(string => string.split(': ') as [string, string]);

    return response(status && Number(status[0]) || 500, bodyString, ...headers);
  }
}

export async function curl(request: HttpRequest) {
  return new CurlHandler().handle(request);
}