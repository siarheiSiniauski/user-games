interface ParseResult {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
  options: {
    [k: string]: string;
  };
}

export const parseCloudinaryUrl = (url: string): ParseResult => {
  // Проверка на корректность схемы URL
  if (!url.startsWith('cloudinary://')) {
    throw new Error('Invalid Cloudinary URL');
  }

  // Удаление схемы 'cloudinary://'
  const urlWithoutScheme = url.slice(13);

  // Разделение строки на части
  const [credentials, cloudName] = urlWithoutScheme.split('@');
  const [apiKey, apiSecret] = credentials.split(':');

  if (!apiKey || !apiSecret || !cloudName) {
    throw new Error('Invalid Cloudinary URL format');
  }

  // Сбор остальных параметров в options
  const options: { [k: string]: string } = {};
  const urlParts = urlWithoutScheme.split('@')[1].split('/');

  urlParts.slice(1).forEach((part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      options[key] = value;
    }
  });

  return {
    apiKey,
    apiSecret,
    cloudName,
    options,
  };
};
