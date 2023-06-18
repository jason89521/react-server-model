# React Server Model

[![npm version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![PR's Welcome][pr-welcoming-image]][pr-welcoming-url]

RSM (React Server Model) is a server state management library that emphasizes developer control over data. It allows for customized data structures and adapters to handle data updates effectively. With an intuitive API, developers can directly access and manipulate their data structures. RSM also provides hooks for easy server data retrieval and synchronization. It offers a flexible approach for developers who desire more control and customization in managing server state in their React applications.

- Customizable data structure
- Auto deduplication
- Revalidate on Focus
- Revalidate on network reconnection
- Polling support
- Pre-built pagination adapter
- Easy mutation
- Written in Typescript

---

- [Comparison](#comparison)
- [Installation](#installation)
- [Simple Example](#simple-example)
- [Getting Started](#getting-started)
  - [Accessor with the `useAccessor` hook](#accessor-with-the-useaccessor-hook)
  - [Mutation](#mutation)
- [Development Motivation](#development-motivation)
  - [Why not use SWR or React Query?](#why-not-use-swr-or-react-query)
  - [Goals to achieve](#goals-to-achieve)
- [Design Philosophy](#design-philosophy)

## Comparison

|                             | `RSM` | `React Query` | `Redux` |
| --------------------------- | :---: | :-----------: | :-----: |
| Customizable data structure |  ✅   |      ❌       |   ✅    |
| Dedupe                      |  ✅   |      ✅       |   ❌    |
| Revalidate on focus         |  ✅   |      ✅       |   ❌    |
| Revalidate on reconnect     |  ✅   |      ✅       |   ❌    |
| Revalidate if stale         |  ✅   |      ✅       |   ❌    |
| Polling                     |  ✅   |      ✅       |   ❌    |
| Error retry                 |  ✅   |      ✅       |   ❌    |
| Invalidate queries          |  🚧   |      ✅       |   ❌    |
| Mutation                    |  ✅   |      ✅       |   ✅    |
| Conditional fetching        |  ✅   |      ✅       |   ❌    |

## Installation

```sh
pnpm add react-server-model
```

```sh
yarn add react-server-model
```

```sh
npm install react-server-model
```

## Simple Example

```typescript
export const postAdapter = createPaginationAdapter<Post>();
export const postModel = createModel(postAdapter.initialModel);
export const getPostById = post.defineAccessor<number, Post>('normal', {
  fetchData: async arg => {
    const data = await getPostApi({ id: arg });
    return data;
  },
  syncState: (draft, payload) => {
    postAdapter.upsertOne(draft, payload.data);
  },
});

export function usePost(id: number) {
  const accessor = getPostById(id);
  const { data, error, isFetching } = useAccessor(
    accessor,
    state => {
      return postAdapter.tryReadOne(state, id);
    },
    {
      revalidateOnFocus: true,
    }
  );

  return { data, error, isFetching, revalidate: () => accessor.revalidate() };
}
```

## Getting Started

When using RSM, you need to create models for different types of data. Taking our company as an example, the backend data includes posts, comments, forums, and more. You must create separate models for them when using RSM.

Different models can use different data structures. For example, posts are suitable for storing data using a pagination data structure, while user settings may not be. You need to create different data structures for your models based on different requirements.

```typescript
const postAdapter = createPaginationAdapter<Post>();
const postModel = createModel(postAdapter.initialState);
```

> The object returned by `createPaginationAdapter` provides not only the initial state but also various operation functions for handling pagination. This allows developers to manipulate pagination easily. Of course, you can design your own pagination if desired, as RSM gives developers complete control over data.

### Accessor with the `useAccessor` hook

After creating the model, you can start defining accessors. Accessors play a significant role in RSM as they help fetch data from the server and synchronize it with your model once the data is obtained. Then, after your model is updated, it notifies the components that use the corresponding model to check if rerendering is necessary.

```typescript
const getPostById = postModel.defineAccessor<number, Post>('normal', {
  fetchData: async id => {
    const data = await getPostApi(id);
    return data;
  },
  syncState: (draft, payload) => {
    postAdapter.upsertOne(draft, payload.data);
  },
});
```

The first argument of the `defineAccessor` method accepts only `'normal'` or `'infinite'`. Typically, you would only use `'infinite'` when implementing infinite loading. In most cases, `'normal'` is sufficient.

The second argument is the accessor's **action**. `fetchData` tells the accessor how to fetch data from the server, while `syncState` specifies how to synchronize the obtained data with the model's state.

`defineAccessor` returns an accessor creator function. If you pass the same arguments to it, it will return the same accessor. Next, we will use the accessor created by `defineAccessor` with the `useAccessor` hook.

```typescript
function usePost(id: number) {
  const accessor = getPostById(id);
  const { data, error, isFetching } = useAccessor(accessor, state =>
    postAdapter.tryReadOne(state, id)
  );

  return { post: data, error, isFetching, revalidate: () => accessor.revalidate() };
}
```

The second argument of `useAccessor` determines the shape of the `data`. You can think of it as a selector function in Redux. In RSM, we refer to this parameter as `getSnapshot` because it obtains a snapshot of the model's state. If you only want to retrieve the title of a specific post, you can write it like this:

```typescript
function usePostTitle(id: number) {
  const accessor = getPostById(id);
  const { data } = useAccessor(accessor, state => postAdapter.tryReadOne(state, id)?.title);

  return data;
}
```

Although both hooks subscribe to the same accessor, they rerender at different times due to the difference in the second argument. `usePost` rerenders when the data of the corresponding post ID changes, while `usePostTitle` only rerenders when the title of the corresponding post ID changes.

It's important to note that `getSnapshot` is bound to the accessor, so you must ensure that the props and state used in `getSnapshot` are the parameters required by the accessor creator. Otherwise, unexpected behavior may occur. In the example above, only `id` affects the accessor, so only `id` is passed to `getSnapshot`. You can think of this limitation as similar to the dependencies array in `useEffect`.

In addition to using it with `useAccessor`, accessors themselves have several methods that can be used. For example, `accessor.revalidate` used in `usePost`. If there is no ongoing revalidation for the accessor, calling this method will fetch the data and synchronize it with the model.

### Mutation

RSM's model provides the `mutate` method, allowing developers to manually modify data. Since `immer` is used internally, you can directly mutate the data without cumbersome immutable updates.

```typescript
async function createComment(postId: number, content: string) {
  const res = await createCommentApi({ postId, content });
  // do something with `res`
  postModel.mutate(draft => {
    postAdapter.readOne(draft, postId).totalCommentCount += 1;
  });
}
```

## Development Motivation

In my company, we use Redux with async thunk to manage server state. While Redux brings many benefits with centralized state management, it also comes with some drawbacks. For example, combining all reducers into a single store leads to excessively large initial JavaScript files. Additionally, even with Redux Toolkit, we still need to write a lot of repetitive code. As a result, senior engineers in the company have been considering replacing Redux, but so far, we haven't found a suitable package.

### Why not use SWR or React Query?

Actually, we have tried incorporating both SWR and React Query into our internal console-type websites, and colleagues find React Query to be more user-friendly than SWR. Although React Query performs well in console-type products, most colleagues believe it is not quite suitable for our main product website.

Our product is a user forum that receives a large number of user visits every day. Here's an example that colleagues think React Query is not suitable for our product: when a user creates a new comment, we want the corresponding post's `totalCommentCount` to increase by one. From the perspective of React Query, we should execute the following code after creating a comment:

```typescript
queryClient.invalidateQueries({ queryKey: ['posts', 'get', postId] });
```

This way, React Query will automatically request the new post in the background and update the corresponding post. However, considering that our post response is quite large, fetching the entire post just for updating `totalCommentCount` seems wasteful. You might think we can do it this way instead:

```typescript
queryClient.setQueryData(['posts', 'get', postId], oldPost => {
  const totalCommentCount = oldPost.totalCommentCount + 1;
  return { ...oldPost, totalCommentCount };
});
```

But there's a problem with this approach. When the user goes back to the post list, the totalCommentCount on the list won't update because the queryKey is different. This may appear odd to observant users. Of course, we can add more code like this:

```typescript
queryClient.setQueryData(['posts', 'list'], oldPosts => {
  const oldPost = oldPosts.find(post => post.id === postId);
  if (!post) return oldPosts;
  const totalCommentCount = oldPost.totalCommentCount + 1;
  const newPost = { ...oldPost, totalCommentCount };
  const oldPostIndex = oldPosts.indexOf(oldPost);
  const newPosts = [...oldPosts];
  newPosts.splice(oldPostIndex, 1, newPost);
  return newPosts;
});
```

This way, we take into account the scenario of updating the list. But is it really that simple? Our list can have various forms, such as "popular," "latest," and different forums with their own lists. The queryKey might look like this:

```typescript
const allPopular = ['posts', 'list', 'popular', 'all'];
const allLatest = ['posts', 'list', 'latest', 'all'];
const forumPopular = ['posts', 'list', 'popular', forumId];
const forumLatest = ['posts', 'list', 'latest', forumId];
```

If we also consider all these scenarios, it might bring us even more mental burden than using Redux, not to mention some API responses have this format:

```json
{
  "items": [],
  "nextKey": "123"
}
```

If we have to mutate the data using the methods mentioned above, it would be a disaster. Moreover, [it goes against the practical way React Query recommends us to use](https://tkdodo.eu/blog/practical-react-query#dont-use-the-querycache-as-a-local-state-manager). While React Query fits well with console-type websites, unfortunately, it seems less suitable for our main website.

> You may think that we can use `queryClient.setQueriesData` to set all lists, but it will make things more complicated. Moreover, the maintainer of RQ doesn't like use this too. (See [here](https://tkdodo.eu/blog/using-web-sockets-with-react-query#partial-data-updates))

So, what makes React Query unsuitable for our main website? I believe it's the level of control over the data. React Query focuses on managing server state for us, which means we don't have as much control over the data compared to using Redux. When using Redux, updating a post would automatically update the corresponding post in the list. However, when using Redux, it's not as straightforward as using `useQuery` to retrieve the data. We need to write a lot of actions and reducers, and if we want to add features like deduplication and revalidation, the amount of code to write increases even more. Clearly, Redux is not the optimal choice.

Since we haven't found a suitable package for our use case, why not develop our own? This brings up the issue of maintainability. If we create a tool that only we use, then the responsibility of maintaining it falls solely on us. Lack of community support is a significant concern for senior colleagues.

As a junior developer, I have always been interested in state management problems. Therefore, I want to try developing my own tool that meets the company's needs as my side project. Of course, I also hope this tool can help other developers who are struggling with managing server state.

### Goals to achieve

First and foremost, it is essential to empower users to have full control over their data. Unlike React Query, where server state management is handled for us, all data writes will be user-defined. Although this may require users to write more code, I believe it is a necessary trade-off, and compared to Redux, the amount of code to write is relatively less.

Another crucial point is to provide a concise and user-friendly hook, similar to `useQuery`, that allows developers to call it from any component without worrying about duplicate requests. Additionally, features like polling and revalidation are also important.

If you have any ideas or suggestions regarding this project, please feel free to share them with me. Thank you.

## Design Philosophy

Using Redux has its advantages, especially when it comes to customizing data structures. In our company, pagination is one of the most frequently used data structures for various entities like posts, comments, and forums. To simplify the process of creating paginations, our senior engineer developed a `createPaginationAdapter` function.

The state type returned by `createPaginationAdapter` is defined as follows:

```typescript
export interface Pagination {
  noMore: boolean;
  index: EntityId[];
  loading: boolean;
  fetched: boolean;
  error?: any;
}

export interface PaginationState<T> {
  data: Record<EntityId, T | undefined>;
  paginations: Record<string, Pagination | undefined>;
}
```

`PaginationState` consists of two properties: `data` and `paginations`. `data` stores all the entity data, while `paginations` keeps track of the pagination states and the associated IDs.

To illustrate, let's consider the example of managing posts. When retrieving the list of posts without any filters, the API endpoint would look like `/api/posts?filter=all`, and the corresponding pagination key would be `filter=all`. Suppose the API returns the first page of posts with IDs 1 to 5. In this case, `paginations["filter=all"]` would contain the following:

```javascript
{
    noMore: false,
    index: [1, 2, 3, 4, 5],
    loading: false,
    fetched: true
}
```

The `data` object would store the actual post data:

```javascript
{
    1: {
        // post data
    },
    // and so on
}
```

To access the pagination for `filter=all`, we can use the object obtained from `createPaginationAdapter`:

```javascript
const postAdapter = createPaginationAdapter();

function usePost() {
  const postPagination = useSelector(state =>
    postAdapter.selectByPagination(state.post, 'filter=all')
  );
  return postPagination;
}
```

At this point, you might think, "Isn't this similar to RTK's [`createEntityAdapter`](https://redux-toolkit.js.org/api/createEntityAdapter)?" Indeed, there are similarities between the two, but `createPaginationAdapter` is an enhanced version specifically designed for pagination data. Now, let's delve into its most significant advantage.

Do you remember [when React Query fails to meet our needs](#why-not-use-swr-or-react-query)? Yes, it's when we have multiple paginations that might include the same post. React Query cannot handle this scenario effectively, but the pagination adapter perfectly solves this problem. By centralizing all the data in `data` and using `paginations` to collect the associated IDs, any updates to a specific post will automatically reflect in all the paginations containing that post. There won't be any inconsistencies.

So, what is the design philosophy behind RSM?

The answer lies in **customized data structures**.

Every application has unique requirements for data structures. In our company, we designed `PaginationState` to fulfill our needs. RSM's design philosophy empowers developers to define and use data structures tailored to their specific requirements. You only need to invest effort in creating suitable adapters and instructing RSM on how to fetch data and synchronize it with your model. RSM takes care of the rest, including deduplication, revalidation, and more.

However, creating an adapter does require some code, so RSM also strives to provide pre-built adapters that cater to most use cases. If you have any new data structures in mind that RSM doesn't support yet, we welcome your suggestions, and we'll make an effort to implement them.

> Currently, RSM only offers `createPaginationAdapter`, and I haven't thought of other forms of data structures. If you have any ideas, please let me know!

[npm-image]: https://badge.fury.io/js/react-server-model.svg
[npm-url]: https://www.npmjs.com/package/react-server-model
[license-image]: https://img.shields.io/github/license/jason89521/react-server-model?style=flat-square
[license-url]: https://github.com/jason89521/react-server-model
[pr-welcoming-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[pr-welcoming-url]: https://github.com/jason89521/react-server-model/pull/new
