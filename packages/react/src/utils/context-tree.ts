/**
 * Context Tree Utilities
 *
 * Provides tree-based context management for hierarchical AI context.
 * Inspired by CopilotKit's useCopilotReadable pattern.
 */

/**
 * Context tree node
 */
export interface ContextTreeNode {
  id: string;
  value: string;
  children: ContextTreeNode[];
  parentId?: string;
}

/**
 * Find a node in the tree by ID
 */
function findNode(
  nodes: ContextTreeNode[],
  id: string,
): ContextTreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    const found = findNode(node.children, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

/**
 * Add a node to the tree
 * If parentId is provided, adds as a child of that node
 * Otherwise adds to the root level
 */
export function addNode(
  tree: ContextTreeNode[],
  node: Omit<ContextTreeNode, "children"> & { children?: ContextTreeNode[] },
  parentId?: string,
): ContextTreeNode[] {
  const newNode: ContextTreeNode = {
    ...node,
    children: node.children || [],
  };

  if (!parentId) {
    // Add to root level
    return [...tree, newNode];
  }

  // Add as child of parent
  return tree.map((n) => {
    if (n.id === parentId) {
      return { ...n, children: [...n.children, newNode] };
    }
    if (n.children.length > 0) {
      return { ...n, children: addNode(n.children, node, parentId) };
    }
    return n;
  });
}

/**
 * Remove a node from the tree by ID
 * Also removes all children of that node
 */
export function removeNode(
  tree: ContextTreeNode[],
  id: string,
): ContextTreeNode[] {
  return tree.reduce((result: ContextTreeNode[], node) => {
    if (node.id !== id) {
      const newNode = { ...node, children: removeNode(node.children, id) };
      result.push(newNode);
    }
    return result;
  }, []);
}

/**
 * Get indentation prefix for tree printing
 * Level 0: 1. 2. 3. ...
 * Level 1: A. B. C. ...
 * Level 2: a. b. c. ...
 * Level 3+: -
 */
function getIndentPrefix(index: number, level: number): string {
  if (level === 0) {
    return `${index + 1}.`;
  } else if (level === 1) {
    return `${String.fromCharCode(65 + index)}.`; // A, B, C...
  } else if (level === 2) {
    return `${String.fromCharCode(97 + index)}.`; // a, b, c...
  } else {
    return "-";
  }
}

/**
 * Print a single node with proper indentation
 */
function printNode(
  node: ContextTreeNode,
  prefix: string = "",
  indentLevel: number = 0,
): string {
  const indent = "   ".repeat(indentLevel);
  const prefixLength = prefix.length + indent.length;
  const subsequentIndent = " ".repeat(prefixLength);

  // Split value into lines and format
  const lines = node.value.split("\n");
  const firstLine = `${indent}${prefix}${lines[0]}`;
  const subsequentLines = lines
    .slice(1)
    .map((line) => `${subsequentIndent}${line}`)
    .join("\n");

  let output = `${firstLine}\n`;
  if (subsequentLines) {
    output += `${subsequentLines}\n`;
  }

  // Print children
  node.children.forEach((child, index) => {
    const childPrefix = `${" ".repeat(prefix.length)}${getIndentPrefix(index, indentLevel + 1)} `;
    output += printNode(child, childPrefix, indentLevel + 1);
  });

  return output;
}

/**
 * Print the entire tree with numbered indentation
 *
 * Output format:
 * ```
 * 1. User profile
 *    {"name": "John"}
 *    A. Preferences
 *       {"theme": "dark"}
 * 2. Current page
 *    /dashboard
 * ```
 */
export function printTree(tree: ContextTreeNode[]): string {
  if (tree.length === 0) {
    return "";
  }

  let output = "";
  tree.forEach((node, index) => {
    if (index > 0) {
      output += "\n";
    }
    output += printNode(node, `${getIndentPrefix(index, 0)} `);
  });

  return output.trim();
}
