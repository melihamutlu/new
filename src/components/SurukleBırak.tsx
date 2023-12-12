// src/components/SurukleBırak.tsx

import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

// Node tipi
class Node {
  id: string;
  children: Node[];
  isOpen: boolean;
  parentId: string | null; // Ebeveyn düğümün ID'si

  constructor(id: string, parentId: string | null = null) {
    this.id = id;
    this.children = [];
    this.isOpen = true;
    this.parentId = parentId;
  }
}

// TreeNodeProps tipi
interface TreeNodeProps {
  node: Node;
  moveNode: (draggedId: string, targetId: string) => void;
}

const DraggableTreeNode: React.FC<TreeNodeProps> = ({ node, moveNode }) => {
    const [isOpen, setIsOpen] = useState(node.isOpen);
  
    const [{ isDragging }, drag] = useDrag({
      type: 'NODE',
      item: { id: node.id, type: 'NODE' },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
  
    const [{ isOver }, drop] = useDrop({
      accept: 'NODE',
      drop: (item: { id: string; type: string }) => {
        moveNode(item.id, node.id);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
  
    const toggleOpen = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div style={{ opacity: isDragging ? 0.5 : 1 }} ref={drop}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span onClick={toggleOpen}>
            <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} style={{ marginRight: '5px', cursor: 'pointer' }} />
          </span>
          <div ref={drag}>
            <span>{node.id}</span>
          </div>
        </div>
        {isOpen && (
          <div style={{ marginLeft: '20px' }}>
            {node.children.map((child) => (
              <DraggableTreeNode key={child.id} node={child} moveNode={moveNode} />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // AgacSurukleBirak bileşeni
  const AgacSurukleBirak: React.FC = () => {
    const [rootNode, setRootNode] = useState(new Node('Kok'));
    rootNode.children.push(new Node('Cocuk1', rootNode.id));
    rootNode.children[0].children.push(new Node('Cocuk1-1', rootNode.children[0].id));
    rootNode.children[0].children.push(new Node('Cocuk1-2', rootNode.children[0].id));
  
    rootNode.children.push(new Node('Cocuk2', rootNode.id));
    rootNode.children[1].children.push(new Node('Cocuk2-1', rootNode.children[1].id));
    rootNode.children[1].children.push(new Node('Cocuk2-2', rootNode.children[1].id));
  
    const moveNode = (draggedId: string, targetId: string) => {
        const dragNode = findNode(rootNode, draggedId);
        const targetNode = findNode(rootNode, targetId);
      
        if (!dragNode || !targetNode || dragNode.id === targetNode.id) {
          return;
        }
      
        // Taşınan düğümü kopyala ve hedef düğümün altına ekle
        const clonedNode = { ...dragNode };
        targetNode.children.push(clonedNode);
      
        // Taşınan düğümün orijinal yerinden kaldırılması
        const dragNodeParent = findNode(rootNode, dragNode.parentId || '');
        if (dragNodeParent) {
          dragNodeParent.children = dragNodeParent.children.filter((child) => child.id !== draggedId);
        }
      
        setRootNode({ ...rootNode });
      };
  
    // Ağaç yapısında düğüm bulma işlevi
    const findNode = (node: Node, id: string): Node | null => {
      if (node.id === id) {
        return node;
      }
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) {
          return found;
        }
      }
      return null;
    };
  
    return (
      <DndProvider backend={HTML5Backend}>
        <DraggableTreeNode node={rootNode} moveNode={moveNode} />
      </DndProvider>
    );
  };
  
  export default AgacSurukleBirak;
