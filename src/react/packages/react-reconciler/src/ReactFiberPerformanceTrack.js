/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                                                

import getComponentNameFromFiber from './getComponentNameFromFiber';

import {getGroupNameOfHighestPriorityLane} from './ReactFiberLane';

import {enableProfilerTimer} from 'shared/ReactFeatureFlags';

const supportsUserTiming =
  enableProfilerTimer &&
  typeof performance !== 'undefined' &&
  // $FlowFixMe[method-unbinding]
  typeof performance.measure === 'function';

const TRACK_GROUP = 'Components ⚛';

// Reused to avoid thrashing the GC.
const reusableComponentDevToolDetails = {
  dataType: 'track-entry',
  color: 'primary',
  track: 'Blocking', // Lane
  trackGroup: TRACK_GROUP,
};
const reusableComponentOptions = {
  start: -0,
  end: -0,
  detail: {
    devtools: reusableComponentDevToolDetails,
  },
};

export function setCurrentTrackFromLanes(lanes        )       {
  reusableComponentDevToolDetails.track =
    getGroupNameOfHighestPriorityLane(lanes);
}

export function logComponentRender(
  fiber       ,
  startTime        ,
  endTime        ,
)       {
  const name = getComponentNameFromFiber(fiber);
  if (name === null) {
    // Skip
    return;
  }
  if (supportsUserTiming) {
    let selfTime         = (fiber.actualDuration     );
    if (fiber.alternate === null || fiber.alternate.child !== fiber.child) {
      for (let child = fiber.child; child !== null; child = child.sibling) {
        selfTime -= (child.actualDuration     );
      }
    }
    reusableComponentDevToolDetails.color =
      selfTime < 0.5
        ? 'primary-light'
        : selfTime < 10
          ? 'primary'
          : selfTime < 100
            ? 'primary-dark'
            : 'error';
    reusableComponentOptions.start = startTime;
    reusableComponentOptions.end = endTime;
    performance.measure(name, reusableComponentOptions);
  }
}

export function logComponentEffect(
  fiber       ,
  startTime        ,
  endTime        ,
  selfTime        ,
)       {
  const name = getComponentNameFromFiber(fiber);
  if (name === null) {
    // Skip
    return;
  }
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.color =
      selfTime < 1
        ? 'secondary-light'
        : selfTime < 100
          ? 'secondary'
          : selfTime < 500
            ? 'secondary-dark'
            : 'error';
    reusableComponentOptions.start = startTime;
    reusableComponentOptions.end = endTime;
    performance.measure(name, reusableComponentOptions);
  }
}

export function logBlockingStart(
  updateTime        ,
  eventTime        ,
  eventType               ,
  renderStartTime        ,
)       {
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.track = 'Blocking';
    if (eventTime > 0 && eventType !== null) {
      // Log the time from the event timeStamp until we called setState.
      reusableComponentDevToolDetails.color = 'secondary-dark';
      reusableComponentOptions.start = eventTime;
      reusableComponentOptions.end =
        updateTime > 0 ? updateTime : renderStartTime;
      performance.measure(eventType, reusableComponentOptions);
    }
    if (updateTime > 0) {
      // Log the time from when we called setState until we started rendering.
      reusableComponentDevToolDetails.color = 'primary-light';
      reusableComponentOptions.start = updateTime;
      reusableComponentOptions.end = renderStartTime;
      performance.measure('Blocked', reusableComponentOptions);
    }
  }
}

export function logTransitionStart(
  startTime        ,
  updateTime        ,
  eventTime        ,
  eventType               ,
  renderStartTime        ,
)       {
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.track = 'Transition';
    if (eventTime > 0 && eventType !== null) {
      // Log the time from the event timeStamp until we started a transition.
      reusableComponentDevToolDetails.color = 'secondary-dark';
      reusableComponentOptions.start = eventTime;
      reusableComponentOptions.end =
        startTime > 0
          ? startTime
          : updateTime > 0
            ? updateTime
            : renderStartTime;
      performance.measure(eventType, reusableComponentOptions);
    }
    if (startTime > 0) {
      // Log the time from when we started an async transition until we called setState or started rendering.
      reusableComponentDevToolDetails.color = 'primary-dark';
      reusableComponentOptions.start = startTime;
      reusableComponentOptions.end =
        updateTime > 0 ? updateTime : renderStartTime;
      performance.measure('Action', reusableComponentOptions);
    }
    if (updateTime > 0) {
      // Log the time from when we called setState until we started rendering.
      reusableComponentDevToolDetails.color = 'primary-light';
      reusableComponentOptions.start = updateTime;
      reusableComponentOptions.end = renderStartTime;
      performance.measure('Blocked', reusableComponentOptions);
    }
  }
}

export function logRenderPhase(startTime        , endTime        )       {
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.color = 'primary-dark';
    reusableComponentOptions.start = startTime;
    reusableComponentOptions.end = endTime;
    performance.measure('Render', reusableComponentOptions);
  }
}

export function logSuspenseThrottlePhase(
  startTime        ,
  endTime        ,
)       {
  // This was inside a throttled Suspense boundary commit.
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.color = 'secondary-light';
    reusableComponentOptions.start = startTime;
    reusableComponentOptions.end = endTime;
    performance.measure('Throttled', reusableComponentOptions);
  }
}

export function logSuspendedCommitPhase(
  startTime        ,
  endTime        ,
)       {
  // This means the commit was suspended on CSS or images.
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.color = 'secondary-light';
    reusableComponentOptions.start = startTime;
    reusableComponentOptions.end = endTime;
    performance.measure('Suspended', reusableComponentOptions);
  }
}

export function logCommitPhase(startTime        , endTime        )       {
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.color = 'secondary-dark';
    reusableComponentOptions.start = startTime;
    reusableComponentOptions.end = endTime;
    performance.measure('Commit', reusableComponentOptions);
  }
}

export function logPaintYieldPhase(startTime        , endTime        )       {
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.color = 'secondary-light';
    reusableComponentOptions.start = startTime;
    reusableComponentOptions.end = endTime;
    performance.measure('Waiting for Paint', reusableComponentOptions);
  }
}

export function logPassiveCommitPhase(
  startTime        ,
  endTime        ,
)       {
  if (supportsUserTiming) {
    reusableComponentDevToolDetails.color = 'secondary-dark';
    reusableComponentOptions.start = startTime;
    reusableComponentOptions.end = endTime;
    performance.measure('Remaining Effects', reusableComponentOptions);
  }
}
