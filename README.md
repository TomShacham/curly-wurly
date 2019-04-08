# curly wurly

An http client using curl under the hood

```typescript
const response = await curl(request('GET', 'http://httpbin.org/get'), '185.74.39.146:41258'/*proxy*/);

const body = JSON.parse(await Buffered.text(response.body))

console.log(body);

/*{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/7.54.0",
  },
  "url": "https://httpbin.org/get"
}*/
```