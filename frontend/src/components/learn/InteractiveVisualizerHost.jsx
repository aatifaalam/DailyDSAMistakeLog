import React from 'react';
import ArrayVisualizer from './visualizers/ArrayVisualizer';
import StackVisualizer from './visualizers/StackVisualizer';
import QueueVisualizer from './visualizers/QueueVisualizer';
import BinarySearchVisualizer from './visualizers/BinarySearchVisualizer';

const InteractiveVisualizerHost = ({ visualType }) => {
  if (!visualType) return null;

  switch (visualType) {
    case 'array-visualizer':
    case 'two-pointers-visualizer':
      return <ArrayVisualizer />;
    case 'stack-visualizer':
      return <StackVisualizer />;
    case 'queue-visualizer':
      return <QueueVisualizer />;
    case 'binary-search-visualizer':
      return <BinarySearchVisualizer />;
    default:
      return null;
  }
};

export default InteractiveVisualizerHost;
