const { put } = require('@vercel/blob');
const fs = require('fs');

async function uploadModel() {
  const modelBuffer = fs.readFileSync('./models/deepfake_detector.onnx');
  
  const blob = await put('deepfake_detector.onnx', modelBuffer, {
    access: 'public', // or 'private' for more security
  });
  
  console.log('Model uploaded to:', blob.url);
  console.log('Use this URL in your API route');
}

uploadModel();