// Agac.tsx

import React from 'react';

// Node tipi
class Node {
  id: string;
  children: Node[];
  isOpen: boolean;

  constructor(id: string) {
    this.id = id;
    this.children = [];
    this.isOpen = true; // Düğüm başlangıçta açık olarak işaretlenir
  }
}

// TreeNodeProps tipi
interface TreeNodeProps {
  node: Node;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  return (
    <div>
      <span>{node.id}</span>
      <div>
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} />
        ))}
      </div>
    </div>
  );
};

const Agac: React.FC = () => {
  const rootNode = new Node('Kok');
  rootNode.children.push(new Node('Cocuk1'));
  rootNode.children[0].children.push(new Node('Cocuk1-1'));

  return <TreeNode node={rootNode} />;
};

export default Agac;