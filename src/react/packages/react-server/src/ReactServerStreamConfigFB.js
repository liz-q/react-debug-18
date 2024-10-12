/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                           
                 
                
                 
               
  

                                             
                                  
                                        

export function flushBuffered(destination             ) {}

export const supportsRequestStorage = false;
export const requestStorage                                    = (null     );

export function beginWriting(destination             ) {}

export function writeChunk(
  destination             ,
  chunk                                        ,
)       {
  destination.buffer += chunk;
}

export function writeChunkAndReturn(
  destination             ,
  chunk                                        ,
)          {
  destination.buffer += chunk;
  return true;
}

export function completeWriting(destination             ) {}

export function close(destination             ) {
  destination.done = true;
}

export function stringToChunk(content        )        {
  return content;
}

export function stringToPrecomputedChunk(content        )                   {
  return content;
}

export function typedArrayToBinaryChunk(
  content                  ,
)              {
  throw new Error('Not implemented.');
}

export function byteLengthOfChunk(chunk                          )         {
  throw new Error('Not implemented.');
}

export function byteLengthOfBinaryChunk(chunk             )         {
  throw new Error('Not implemented.');
}

export function closeWithError(destination             , error       )       {
  destination.done = true;
  destination.fatal = true;
  destination.error = error;
}

export {createFastHashJS as createFastHash} from './createFastHashJS';
