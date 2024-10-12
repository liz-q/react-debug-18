# 搭建一个Vite项目

> 使用 vite + react + JavaScript

```bash
pnpm create vite
```

# 克隆React源码

```bash
git clone https://github.com/facebook/react.git
```

> 下载 React18 最新版本就行 main 分支
>
> 在 vite 项目 src 目录下新建 react 文件夹，把 react 源码中 packages 目录复制过来

# 删除 Flow 类型代码

```bash
// 1. 安装flow-remove-types (https://www.npmjs.com/package/flow-remove-types)
npm install --global flow-remove-types

// 2. 执行删除命令（https://blog.csdn.net/gitblog_00365/article/details/141492182）
flow-remove-types src/react/packages/ -d lib/

// 3. 删除packages下的文件

// 4. 将lib文件夹下转换过的代码复制到packages下

```

> flow-remove-types src/react/packages/ -d src/react/packages/ 貌似可以直接输出到原目录替换

# 修改 vite.config.ts

```typescript
import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  define: {
    __DEV__: true,
    __PROFILE__: true,
    __UMD__: true,
    __EXPERIMENTAL__: true,
    __VARIANT__: false,
  },
  resolve: {
    /*
    * Vite会先查找resolve.alias中配置的别名，如果找不到，才会查找node_modules中的包
    * 如果你在package.json中设置了name，并且你在resolve.alias中为这个包设置了别名，那么Vite将优先使用resolve.alias中的配置。
    * 这是因为在Vite的解析过程中，别名配置具有更高的优先级。
    * */
    alias: {
      '@': path.join(process.cwd(), 'src'),
      'react': path.join(process.cwd(), 'src/react/packages/react'),
      'react-dom': path.join(process.cwd(), 'src/react/packages/react-dom'),
      'react-dom-bindings': path.join(process.cwd(), 'src/react/packages/react-dom-bindings'),
      'react-reconciler': path.join(process.cwd(), 'src/react/packages/react-reconciler'),
      'shared': path.join(process.cwd(), 'src/react/packages/shared'),
      'scheduler': path.join(process.cwd(), 'src/react/packages/scheduler')
    }
  }
})

```

注意：项目中所有react组件都增加 `import * as React from 'react'`

# 修改package.json

```json
{
  "name": "debug-react-18",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "globals": "^15.9.0",
    "vite": "^5.4.8"
  }
}

```

> 删除不相关依赖

# 修改以下源码文件

## react/packages/react-reconciler/src/ReactFiberConfig.js

```javascript
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

/* eslint-disable react-internal/prod-error-codes */

// We expect that our Rollup, Jest, and Flow configurations
// always shim this module with the corresponding host config
// (either provided by a renderer, or a generic shim for npm).
//
// We should never resolve to this file, but it exists to make
// sure that if we *do* accidentally break the configuration,
// the failure isn't silent.

// throw new Error('This module must be shimmed by a specific renderer.');

// liz-q
export * from "./forks/ReactFiberConfig.dom";

```

## <font style="color:rgb(31, 35, 40);">/src/react/packages/shared/ReactSharedInternals.js</font>

```javascript
// import * as React from 'react';

// const ReactSharedInternals =
//   React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

// liz-q
import ReactSharedInternals from '../react/src/ReactSharedInternalsClient'

export default ReactSharedInternals;
```

## <font style="color:rgb(31, 35, 40);">/src/react/packages/scheduler/index.js</font>

```javascript
'use strict';

export * from './src/forks/Scheduler';

export {
	log,
	unstable_flushAllWithoutAsserting,
	unstable_flushNumberOfYields,
	unstable_flushExpired,
	unstable_flushUntilNextPaint,
	unstable_flushAll,
	unstable_advanceTime,
	unstable_setDisableYieldValue,
} from './src/forks/SchedulerMock';
```

