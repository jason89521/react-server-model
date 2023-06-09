[daxus](../README.md) / NormalAccessor

# Class: NormalAccessor<S, Arg, Data, E\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | `S` |
| `Arg` | `any` |
| `Data` | `any` |
| `E` | `unknown` |

## Hierarchy

- [`Accessor`](Accessor.md)<`S`, `Data`, `E`, `Arg`\>

  ↳ **`NormalAccessor`**

## Table of contents

### Properties

- [getState](NormalAccessor.md#getstate)

### Methods

- [getKey](NormalAccessor.md#getkey)
- [invalidate](NormalAccessor.md#invalidate)
- [revalidate](NormalAccessor.md#revalidate)
- [subscribeData](NormalAccessor.md#subscribedata)

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

▸ **revalidate**(): `Promise`<[`FetchPromiseResult`](../README.md#fetchpromiseresult)<`E`, `Data`\>\>

Return the result of the revalidation.

#### Returns

`Promise`<[`FetchPromiseResult`](../README.md#fetchpromiseresult)<`E`, `Data`\>\>

#### Overrides

Accessor.revalidate

#### Defined in

[model/NormalAccessor.ts:44](https://github.com/jason89521/react-fetch/blob/6f430a6/src/lib/model/NormalAccessor.ts#L44)

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
