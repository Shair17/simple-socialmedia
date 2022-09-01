export function getCloudinaryPublicId(url: string) {
  const arr = url.split('/');
  const name = arr[arr.length - 1];
  const [public_id] = name.split('.');

  return public_id;
}
