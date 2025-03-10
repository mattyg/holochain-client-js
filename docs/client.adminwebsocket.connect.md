<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@holochain/client](./client.md) &gt; [AdminWebsocket](./client.adminwebsocket.md) &gt; [connect](./client.adminwebsocket.connect.md)

## AdminWebsocket.connect() method

Factory mehtod to create a new instance connected to the given URL.

**Signature:**

```typescript
static connect(url: URL, defaultTimeout?: number): Promise<AdminWebsocket>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  url | URL | A <code>ws://</code> URL used as the connection address. |
|  defaultTimeout | number | _(Optional)_ The default timeout for any request. |

**Returns:**

Promise&lt;[AdminWebsocket](./client.adminwebsocket.md)<!-- -->&gt;

A promise for a new connected instance.

