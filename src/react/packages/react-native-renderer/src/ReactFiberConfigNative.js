/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                                              

// Modules provided by RN:
import {
  ReactNativeViewConfigRegistry,
  UIManager,
  deepFreezeAndThrowOnMutationInDev,
} from 'react-native/Libraries/ReactPrivate/ReactNativePrivateInterface';

import {create, diff} from './ReactNativeAttributePayload';
import {
  precacheFiberNode,
  uncacheFiberNode,
  updateFiberProps,
  getClosestInstanceFromNode,
} from './ReactNativeComponentTree';
import ReactNativeFiberHostComponent from './ReactNativeFiberHostComponent';

import {
  DefaultEventPriority,
  NoEventPriority,
                     
} from 'react-reconciler/src/ReactEventPriorities';
                                                                   

import {REACT_CONTEXT_TYPE} from 'shared/ReactSymbols';
                                                    

import {
  getInspectorDataForViewTag,
  getInspectorDataForViewAtPoint,
  getInspectorDataForInstance,
} from './ReactNativeFiberInspector';

export {default as rendererVersion} from 'shared/ReactVersion'; // TODO: Consider exporting the react-native version.
export const rendererPackageName = 'react-native-renderer';
export const extraDevToolsConfig = {
  getInspectorDataForInstance,
  getInspectorDataForViewTag,
  getInspectorDataForViewAtPoint,
};

const {get: getViewConfigForType} = ReactNativeViewConfigRegistry;

                          
                           
                               
                                                     
                                  
                                                         
                                      
                                     
                           
   
                                    // Unused
                             // Unused

                                      
                           
                                     

                                                  
                                                                          
                                                              
                                                       
                                    
                          
                      
                      
                                                          
            
   

// Counter for uniquely identifying views.
// % 10 === 1 means it is a rootTag.
// % 2 === 0 means it is a Fabric tag.
let nextReactTag = 3;
function allocateTag() {
  let tag = nextReactTag;
  if (tag % 10 === 1) {
    tag += 2;
  }
  nextReactTag = tag + 2;
  return tag;
}

function recursivelyUncacheFiberNode(node                         ) {
  if (typeof node === 'number') {
    // Leaf node (eg text)
    uncacheFiberNode(node);
  } else {
    uncacheFiberNode((node     )._nativeTag);

    (node     )._children.forEach(recursivelyUncacheFiberNode);
  }
}

export * from 'react-reconciler/src/ReactFiberConfigWithNoPersistence';
export * from 'react-reconciler/src/ReactFiberConfigWithNoHydration';
export * from 'react-reconciler/src/ReactFiberConfigWithNoScopes';
export * from 'react-reconciler/src/ReactFiberConfigWithNoTestSelectors';
export * from 'react-reconciler/src/ReactFiberConfigWithNoMicrotasks';
export * from 'react-reconciler/src/ReactFiberConfigWithNoResources';
export * from 'react-reconciler/src/ReactFiberConfigWithNoSingletons';

export function appendInitialChild(
  parentInstance          ,
  child                         ,
)       {
  parentInstance._children.push(child);
}

export function createInstance(
  type        ,
  props       ,
  rootContainerInstance           ,
  hostContext             ,
  internalInstanceHandle        ,
)           {
  const tag = allocateTag();
  const viewConfig = getViewConfigForType(type);

  if (__DEV__) {
    for (const key in viewConfig.validAttributes) {
      if (props.hasOwnProperty(key)) {
        deepFreezeAndThrowOnMutationInDev(props[key]);
      }
    }
  }

  const updatePayload = create(props, viewConfig.validAttributes);

  UIManager.createView(
    tag, // reactTag
    viewConfig.uiViewClassName, // viewName
    rootContainerInstance, // rootTag
    updatePayload, // props
  );

  const component = new ReactNativeFiberHostComponent(
    tag,
    viewConfig,
    internalInstanceHandle,
  );

  precacheFiberNode(internalInstanceHandle, tag);
  updateFiberProps(tag, props);

  // Not sure how to avoid this cast. Flow is okay if the component is defined
  // in the same file but if it's external it can't see the types.
  return ((component     )          );
}

export function createTextInstance(
  text        ,
  rootContainerInstance           ,
  hostContext             ,
  internalInstanceHandle        ,
)               {
  if (!hostContext.isInAParentText) {
    throw new Error('Text strings must be rendered within a <Text> component.');
  }

  const tag = allocateTag();

  UIManager.createView(
    tag, // reactTag
    'RCTRawText', // viewName
    rootContainerInstance, // rootTag
    {text: text}, // props
  );

  precacheFiberNode(internalInstanceHandle, tag);

  return tag;
}

export function finalizeInitialChildren(
  parentInstance          ,
  type        ,
  props       ,
  hostContext             ,
)          {
  // Don't send a no-op message over the bridge.
  if (parentInstance._children.length === 0) {
    return false;
  }

  // Map from child objects to native tags.
  // Either way we need to pass a copy of the Array to prevent it from being frozen.
  const nativeTags = parentInstance._children.map(child =>
    typeof child === 'number'
      ? child // Leaf node (eg text)
      : child._nativeTag,
  );

  UIManager.setChildren(
    parentInstance._nativeTag, // containerTag
    nativeTags, // reactTags
  );

  return false;
}

export function getRootHostContext(
  rootContainerInstance           ,
)              {
  return {isInAParentText: false};
}

export function getChildHostContext(
  parentHostContext             ,
  type        ,
)              {
  const prevIsInAParentText = parentHostContext.isInAParentText;
  const isInAParentText =
    type === 'AndroidTextInput' || // Android
    type === 'RCTMultilineTextInputView' || // iOS
    type === 'RCTSinglelineTextInputView' || // iOS
    type === 'RCTText' ||
    type === 'RCTVirtualText';

  if (prevIsInAParentText !== isInAParentText) {
    return {isInAParentText};
  } else {
    return parentHostContext;
  }
}

export function getPublicInstance(instance          )                 {
  // $FlowExpectedError[prop-missing] For compatibility with Fabric
  if (instance.canonical != null && instance.canonical.publicInstance != null) {
    // $FlowFixMe[incompatible-return]
    return instance.canonical.publicInstance;
  }

  return instance;
}

export function prepareForCommit(containerInfo           )                {
  // Noop
  return null;
}

export function resetAfterCommit(containerInfo           )       {
  // Noop
}

export const isPrimaryRenderer = true;
export const warnsIfNotActing = true;

export const scheduleTimeout = setTimeout;
export const cancelTimeout = clearTimeout;
export const noTimeout = -1;

export function shouldSetTextContent(type        , props       )          {
  // TODO (bvaughn) Revisit this decision.
  // Always returning false simplifies the createInstance() implementation,
  // But creates an additional child Fiber for raw text children.
  // No additional native views are created though.
  // It's not clear to me which is better so I'm deferring for now.
  // More context @ github.com/facebook/react/pull/8560#discussion_r92111303
  return false;
}

let currentUpdatePriority                = NoEventPriority;
export function setCurrentUpdatePriority(newPriority               )       {
  currentUpdatePriority = newPriority;
}

export function getCurrentUpdatePriority()                {
  return currentUpdatePriority;
}

export function resolveUpdatePriority()                {
  if (currentUpdatePriority !== NoEventPriority) {
    return currentUpdatePriority;
  }
  return DefaultEventPriority;
}

export function resolveEventType()                {
  return null;
}

export function resolveEventTimeStamp()         {
  return -1.1;
}

export function shouldAttemptEagerTransition()          {
  return false;
}

// -------------------
//     Mutation
// -------------------

export const supportsMutation = true;

export function appendChild(
  parentInstance          ,
  child                         ,
)       {
  const childTag = typeof child === 'number' ? child : child._nativeTag;
  const children = parentInstance._children;
  const index = children.indexOf(child);

  if (index >= 0) {
    children.splice(index, 1);
    children.push(child);

    UIManager.manageChildren(
      parentInstance._nativeTag, // containerTag
      [index], // moveFromIndices
      [children.length - 1], // moveToIndices
      [], // addChildReactTags
      [], // addAtIndices
      [], // removeAtIndices
    );
  } else {
    children.push(child);

    UIManager.manageChildren(
      parentInstance._nativeTag, // containerTag
      [], // moveFromIndices
      [], // moveToIndices
      [childTag], // addChildReactTags
      [children.length - 1], // addAtIndices
      [], // removeAtIndices
    );
  }
}

export function appendChildToContainer(
  parentInstance           ,
  child                         ,
)       {
  const childTag = typeof child === 'number' ? child : child._nativeTag;
  UIManager.setChildren(
    parentInstance, // containerTag
    [childTag], // reactTags
  );
}

export function commitTextUpdate(
  textInstance              ,
  oldText        ,
  newText        ,
)       {
  UIManager.updateView(
    textInstance, // reactTag
    'RCTRawText', // viewName
    {text: newText}, // props
  );
}

export function commitMount(
  instance          ,
  type        ,
  newProps       ,
  internalInstanceHandle        ,
)       {
  // Noop
}

export function commitUpdate(
  instance          ,
  type        ,
  oldProps       ,
  newProps       ,
  internalInstanceHandle        ,
)       {
  const viewConfig = instance.viewConfig;

  updateFiberProps(instance._nativeTag, newProps);

  const updatePayload = diff(oldProps, newProps, viewConfig.validAttributes);

  // Avoid the overhead of bridge calls if there's no update.
  // This is an expensive no-op for Android, and causes an unnecessary
  // view invalidation for certain components (eg RCTTextInput) on iOS.
  if (updatePayload != null) {
    UIManager.updateView(
      instance._nativeTag, // reactTag
      viewConfig.uiViewClassName, // viewName
      updatePayload, // props
    );
  }
}

export function insertBefore(
  parentInstance          ,
  child                         ,
  beforeChild                         ,
)       {
  const children = (parentInstance     )._children;
  const index = children.indexOf(child);

  // Move existing child or add new child?
  if (index >= 0) {
    children.splice(index, 1);
    const beforeChildIndex = children.indexOf(beforeChild);
    children.splice(beforeChildIndex, 0, child);

    UIManager.manageChildren(
      (parentInstance     )._nativeTag, // containerID
      [index], // moveFromIndices
      [beforeChildIndex], // moveToIndices
      [], // addChildReactTags
      [], // addAtIndices
      [], // removeAtIndices
    );
  } else {
    const beforeChildIndex = children.indexOf(beforeChild);
    children.splice(beforeChildIndex, 0, child);

    const childTag = typeof child === 'number' ? child : child._nativeTag;

    UIManager.manageChildren(
      (parentInstance     )._nativeTag, // containerID
      [], // moveFromIndices
      [], // moveToIndices
      [childTag], // addChildReactTags
      [beforeChildIndex], // addAtIndices
      [], // removeAtIndices
    );
  }
}

export function insertInContainerBefore(
  parentInstance           ,
  child                         ,
  beforeChild                         ,
)       {
  // TODO (bvaughn): Remove this check when...
  // We create a wrapper object for the container in ReactNative render()
  // Or we refactor to remove wrapper objects entirely.
  // For more info on pros/cons see PR #8560 description.
  if (typeof parentInstance === 'number') {
    throw new Error('Container does not support insertBefore operation');
  }
}

export function removeChild(
  parentInstance          ,
  child                         ,
)       {
  recursivelyUncacheFiberNode(child);
  const children = parentInstance._children;
  const index = children.indexOf(child);

  children.splice(index, 1);

  UIManager.manageChildren(
    parentInstance._nativeTag, // containerID
    [], // moveFromIndices
    [], // moveToIndices
    [], // addChildReactTags
    [], // addAtIndices
    [index], // removeAtIndices
  );
}

export function removeChildFromContainer(
  parentInstance           ,
  child                         ,
)       {
  recursivelyUncacheFiberNode(child);
  UIManager.manageChildren(
    parentInstance, // containerID
    [], // moveFromIndices
    [], // moveToIndices
    [], // addChildReactTags
    [], // addAtIndices
    [0], // removeAtIndices
  );
}

export function resetTextContent(instance          )       {
  // Noop
}

export function hideInstance(instance          )       {
  const viewConfig = instance.viewConfig;
  const updatePayload = create(
    {style: {display: 'none'}},
    viewConfig.validAttributes,
  );
  UIManager.updateView(
    instance._nativeTag,
    viewConfig.uiViewClassName,
    updatePayload,
  );
}

export function hideTextInstance(textInstance              )       {
  throw new Error('Not yet implemented.');
}

export function unhideInstance(instance          , props       )       {
  const viewConfig = instance.viewConfig;
  const updatePayload = diff(
    {...props, style: [props.style, {display: 'none'}]},
    props,
    viewConfig.validAttributes,
  );
  UIManager.updateView(
    instance._nativeTag,
    viewConfig.uiViewClassName,
    updatePayload,
  );
}

export function clearContainer(container           )       {
  // TODO Implement this for React Native
  // UIManager does not expose a "remove all" type method.
}

export function unhideTextInstance(
  textInstance              ,
  text        ,
)       {
  throw new Error('Not yet implemented.');
}

export {getClosestInstanceFromNode as getInstanceFromNode};

export function beforeActiveInstanceBlur(internalInstanceHandle        ) {
  // noop
}

export function afterActiveInstanceBlur() {
  // noop
}

export function preparePortalMount(portalInstance          )       {
  // noop
}

export function detachDeletedInstance(node          )       {
  // noop
}

export function requestPostPaintCallback(callback                        ) {
  // noop
}

export function maySuspendCommit(type      , props       )          {
  return false;
}

export function preloadInstance(type      , props       )          {
  // Return false to indicate it's already loaded
  return true;
}

export function startSuspendingCommit()       {}

export function suspendInstance(type      , props       )       {}

export function waitForCommitToBeReady()       {
  return null;
}

export const NotPendingTransition                   = null;
export const HostTransitionContext                                 = {
  $$typeof: REACT_CONTEXT_TYPE,
  Provider: (null     ),
  Consumer: (null     ),
  _currentValue: NotPendingTransition,
  _currentValue2: NotPendingTransition,
  _threadCount: 0,
};

                                    
export function resetFormInstance(form          )       {}
