// uploadAdapter.js
import axios from 'axios';

class UploadAdapter {
  constructor(loader) {
    this.url = 'https://backend.kingsmankids.com/api/temp/template/image-upload';
    this.loader = loader;
    this.loader.file.then((pic) => (this.file = pic));
  }

  upload() {
    const fd = new FormData();
    fd.append('image', this.file);

    return new Promise((resolve, reject) => {
      axios
        .post(this.url, fd, {
          onUploadProgress: (e) => {
            console.log(Math.round((e.loaded / e.total) * 100) + ' %');
          },
        })
        .then((response) => {
          const imageUrl = response.data.url;
          console.log(imageUrl)
          // Update the CKEditor image source
          resolve({
            default: imageUrl,
          });
          // resolve(response);
        })
        .catch((error) => {
          reject('Server Error');
          console.log('Server Error: ', error);
        });
    });
  }
}

export default UploadAdapter;
