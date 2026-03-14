const fs = require('fs');
require('dotenv').config();

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.production.ts';

// Get environment variables or default to placeholders
const serviceId = process.env.EMAILJS_SERVICE_ID || 'YOUR_EMAILJS_SERVICE_ID';
const templateId = process.env.EMAILJS_TEMPLATE_ID || 'YOUR_EMAILJS_TEMPLATE_ID';
const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';

// The content to be written to environment files
const envConfigFile = `
export const environment = {
  production: false,
  emailjsServiceId: '${serviceId}',
  emailjsTemplateId: '${templateId}',
  emailjsPublicKey: '${publicKey}'
};
`;

const envConfigProdFile = `
export const environment = {
  production: true,
  emailjsServiceId: '${serviceId}',
  emailjsTemplateId: '${templateId}',
  emailjsPublicKey: '${publicKey}'
};
`;

// Create the directory if it doesn't exist
const dir = './src/environments';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Generated environment.ts`);
  }
});

fs.writeFile(targetProdPath, envConfigProdFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Generated environment.production.ts`);
  }
});
