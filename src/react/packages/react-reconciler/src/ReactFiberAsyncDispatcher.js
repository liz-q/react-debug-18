/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                 
                                                      

import {enableCache} from 'shared/ReactFeatureFlags';
import {readContext} from './ReactFiberNewContext';
import {CacheContext} from './ReactFiberCacheComponent';

import {disableStringRefs} from 'shared/ReactFeatureFlags';

import {current as currentOwner} from './ReactCurrentFiber';

function getCacheForType   (resourceType         )    {
  if (!enableCache) {
    throw new Error('Not implemented.');
  }
  const cache        = readContext(CacheContext);
  let cacheForType           = (cache.data.get(resourceType)     );
  if (cacheForType === undefined) {
    cacheForType = resourceType();
    cache.data.set(resourceType, cacheForType);
  }
  return cacheForType;
}

export const DefaultAsyncDispatcher                  = ({
  getCacheForType,
}     );

if (__DEV__ || !disableStringRefs) {
  DefaultAsyncDispatcher.getOwner = ()               => {
    return currentOwner;
  };
}
