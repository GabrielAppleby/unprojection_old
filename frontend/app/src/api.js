export const baseUrl = 'https://vast-everglades-16944.herokuapp.com/';
export const imageUrlGenerator = (dataset, embedding, id) => `${baseUrl}${dataset}/${embedding}/image/${id}`;
export const coord3DUrlGenerator = (dataset, embedding, id) => baseUrl + `${dataset}/raw/coord/${id}`;
export const modelUrlGenerator = (dataset, embedding) => baseUrl + `${dataset}/${embedding}/model`;
export const coordsUrlGenerator = (dataset, embedding) => baseUrl + `${dataset}/${embedding}/coords`;
