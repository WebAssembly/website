import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';

// Function to recursively find all SVG files in a directory
function findSvgFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      findSvgFiles(filePath, fileList); // Recursively call for subdirectories
    } else if (stats.isFile() && path.extname(file).toLowerCase() === '.svg') {
      fileList.push(filePath); // Add SVG file to the list
    }
  });

  return fileList;
}

// Function to optimize an SVG file
function optimizeSvg(filePath) {
  const svgString = fs.readFileSync(filePath, 'utf8');

  const result = optimize(svgString, {
    path: filePath, // Recommended for better error reporting
    multipass: true, // Enable multipass optimization
    // Add any other SVGO plugin configuration here if needed
  });

  // Write the optimized SVG back to the file
  fs.writeFileSync(filePath, result.data, 'utf8');
  console.log(`Optimized: ${filePath}`);
}

// Main function to process a given directory
function processDirectory(baseDir) {
  const svgFiles = findSvgFiles(baseDir);

  if (svgFiles.length === 0) {
    console.log('No SVG files found.');
    return;
  }

  console.log(`Found ${svgFiles.length} SVG file(s). Optimizing…`);
  svgFiles.forEach((filePath) => {
    try {
      optimizeSvg(filePath);
    } catch (error) {
      console.error(`Error optimizing ${filePath}:`, error.message);
    }
  });
}

const directoryToOptimize = '.';
processDirectory(directoryToOptimize);
