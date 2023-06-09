[daxus](../README.md) / InfiniteAccessor

# Class: InfiniteAccessor<S, Arg, Data, E\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | `S` |
| `Arg` | `any` |
| `Data` | `any` |
| `E` | `unknown` |

## Hierarchy

- [`Accessor`](Accessor.md)<`S`, `Data`[], `E`, `Arg`\>

  ↳ **`InfiniteAccessor`**

## Table of contents

### Properties

- [getState](InfiniteAccessor.md#getstate)

### Methods

- [fetchNext](InfiniteAccessor.md#fetchnext)
- [getKey](InfiniteAccessor.md#getkey)
- [invalidate](InfiniteAccessor.md#invalidate)
- [revalidate](InfiniteAccessor.md#revalidate)
- [subscribeData](InfiniteAccessor.md#subscribedata)

## Properties

### getState

• **getState**: (`serverStateKey?`: `object`) => `S`

#### Type declaration

▸ (`serverStateKey?`): `S`

Get the state of the corresponding model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `serverStateKey?` | `object` |

##### Returns

`S`

#### Inherited from

[Accessor](Accessor.md).[getState](Accessor.md#getstate)

#### Defined in

[model/Accessor.ts:50](https://github.com/jason89521/react-fetch/blob/6f430a6/src/lib/model/Accessor.ts#L50)

## Methods

### fetchNext

▸ **fetchNext**(): `Promise`<[`FetchPromiseResult`](../README.md#fetchpromiseresult)<`E`, `Data`[]\>\>

Fetch the next page.

#### Returns

`Promise`<[`FetchPromiseResult`](../README.md#fetchpromiseresult)<`E`, `Data`[]\>\>

The all pages if it is not interrupted by the other revalidation, otherwise returns `null`.

#### Defined in

[model/InfiniteAccessor.ts:67](https://github.com/jason89521/react-fetch/blob/6f430a6/src/lib/model/InfiniteAccessor.ts#L67)

___

### getKey

▸ **getKey**(): `string`

#### Returns

`string`

#### Inherited from

[Accessor](Accessor.md).[getKey](Accessor.md#getkey)

#### Defined in

[model/Accessor.ts:85](https://github.com/jason89521/react-fetch/blob/6f430a6/src/lib/model/Accessor.ts#L85)

___

### invalidate

▸ **invalidate**(): `void`

#### Returns

`void`

#### Inherited from

[Accessor](Accessor.md).[invalidate](Accessor.md#invalidate)

#### Defined in

[model/Accessor.ts:160](https://github.com/jason89521/react-fetch/blob/6f430a6/src/lib/model/Accessor.ts#L160)

___

### revalidate

▸ **revalidate**(): `Promise`<[`FetchPromiseResult`](../README.md#fetchpromiseresult)<`E`, `Data`[]\>\>

Return the result of the revalidation.

#### Returns

`Promise`<[`FetchPromiseResult`](../README.md#fetchpromiseresult)<`E`, `Data`[]\>\>

#### Overrides

Accessor.revalidate

#### Defined in

[model/InfiniteAccessor.ts:58](https://github.com/jason89521/react-fetch/blob/6f430a6/src/lib/model/InfiniteAccessor.ts#L58)

___

### subscribeData

▸ **subscribeData**(`listener`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | () => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Inherited from

[Accessor](Accessor.md).[subscribeData](Accessor.md#subscribedata)

#### Defined in

[model/Accessor.ts:140](https://github.com/jason89521/react-fetch/blob/6f430a6/src/lib/model/Accessor.ts#L140)
