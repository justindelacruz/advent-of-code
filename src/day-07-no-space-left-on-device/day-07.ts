// https://adventofcode.com/2022/day/7
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-07.txt";

type File = {
  id: string;
  size: number;
};

type TreeNode = {
  id: string;
  parentId: TreeNode | null;
  children: Record<string, TreeNode>;
  files: File[];
  size: number;
  totalSize: number;
};

const makeDirectoryTree = (input: string[]): TreeNode => {
  const root: TreeNode = {
    id: "/",
    parentId: null,
    children: {},
    files: [],
    size: 0,
    totalSize: 0,
  };

  const tree: Record<string, TreeNode> = {
    "/": root,
  };

  let pointer = root;

  input.forEach((line) => {
    // Read a command
    if (line.startsWith("$")) {
      const result = /^\$ (\w*)\s{0,1}(.*?)$/.exec(line);
      const [, command, param] = result ?? [];

      // Change directory
      if (command === "cd") {
        if (param === "/") {
          pointer = root;
        } else if (param === "..") {
          // Move to parent
          pointer = pointer.parentId ?? root;
        } else {
          // Move to child
          // (Assume that child already exists)
          pointer = pointer.children[param];
        }
      }

      // List files
      if (command === "ls") {
        // Add next lines to current node
      }
    } else if (line.startsWith("dir")) {
      // Directory
      const result = /^dir (.*)$/.exec(line);
      const [, dirname] = result ?? [];

      pointer.children[dirname] = {
        id: dirname,
        parentId: pointer,
        children: {},
        files: [],
        size: 0,
        totalSize: 0,
      };
    } else {
      // file
      const result = /^(\d*) (.*)$/.exec(line);
      const [, filesizeStr, filename] = result ?? [];
      const filesize = parseInt(filesizeStr, 10);

      pointer.size += filesize;

      pointer.files.push({
        id: filename,
        size: filesize,
      });
    }
  });

  return root;
};

const updateTotalDirectorySizes = (node: TreeNode) => {
  let directorySize = node.size;
  Object.values(node.children).forEach((child) => {
    directorySize += updateTotalDirectorySizes(child);
  });

  node.totalSize = directorySize;

  return directorySize;
};

const calculateSizeOfSmallDirectories = (node: TreeNode, maxSize: number) => {
  let totalSize = node.totalSize <= maxSize ? node.totalSize : 0;

  Object.values(node.children).forEach((child) => {
    totalSize += calculateSizeOfSmallDirectories(child, maxSize);
  });

  return totalSize;
};

const partOne = (input: string[]) => {
  const root = makeDirectoryTree(input);
  updateTotalDirectorySizes(root);
  const sizeOfSmallDirectories = calculateSizeOfSmallDirectories(root, 100000);

  print(`[Part 1] Sum of total sizes of those directories: ${sizeOfSmallDirectories}`);
  assert(sizeOfSmallDirectories === 1845346);
};

const findDirectoryToDelete = (
  node: TreeNode,
  unusedSpace: number,
  requiredUnusedSpace: number
) => {
  let sizeOfSmallestDirectoryToDelete =
    unusedSpace + node.totalSize >= requiredUnusedSpace ? node.totalSize : Infinity;

  Object.values(node.children).forEach((child) => {
    sizeOfSmallestDirectoryToDelete = Math.min(
      sizeOfSmallestDirectoryToDelete,
      findDirectoryToDelete(child, unusedSpace, requiredUnusedSpace)
    );
  });

  return sizeOfSmallestDirectoryToDelete;
};

const partTwo = (input: string[]) => {
  const root = makeDirectoryTree(input);
  updateTotalDirectorySizes(root);

  const totalDiskSpace = 70000000;
  const requiredUnusedSpace = 30000000;
  const unusedSpace = totalDiskSpace - root.totalSize;
  const sizeOfSmallestDirectoryToDelete = findDirectoryToDelete(
    root,
    unusedSpace,
    requiredUnusedSpace
  );

  print(`[Part 2] Total size of directory to delete: ${sizeOfSmallestDirectoryToDelete}`);
  assert(sizeOfSmallestDirectoryToDelete === 3636703);
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
  partTwo(input);
}
