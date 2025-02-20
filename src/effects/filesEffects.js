import axios from 'axios';
import { updateFile } from '../store/reducers/filesSlice';
import { API_PATH } from '../utils/api-urls';
import axiosInstance from './axiosInstance';
import { saveBlob, downloadFile } from 'gdgateway-client';
import { FILE_ACTIONS } from '../config/contracts';

export const getDownloadOTT = (body) => {
  const url = `${API_PATH}/download/generate/token`;
  return axiosInstance.post(url, body, {
    headers: {
      'X-Action': FILE_ACTIONS.downloaded
    }
  });
};

export const getFilePreviewEffect = async (
  fileId,
  cancelToken = null,
  type = undefined
) => {
  const {
    data: {
      jwt_ott,
      user_tokens: { token: oneTimeToken },
      gateway
    }
  } = await getDownloadOTT([{ slug: fileId }]);

  let url;
  if (type.includes('doc')) {
    url = `${gateway.url}/doc/preview/${fileId}`;
    return axiosInstance
      .create({
        headers: {
          'One-Time-Token': oneTimeToken,
          'X-Download-OTT-JWT': jwt_ott
        }
      })
      .get(url, null, {
        options: {
          responseType: 'blob',
          cancelToken
        }
      })
      .then((response) => {
        const urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(response.data);
      })
      .catch((response) => {
        throw response;
      });
  } else {
    url = `${gateway.url}/preview/${fileId}`;

    return axiosInstance
      .create({
        headers: {
          'one-time-token': oneTimeToken,
          'X-Download-OTT-JWT': jwt_ott
        }
      })
      .get(url, {
        cancelToken
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log({ downloadErr: err });
        return null;
      });
  }
};

export const getTotalDownloadFileSize = (files) => {
  const totalSize = files.reduce((accumulator, file) => {
    return accumulator + file.size;
  }, 0);

  return totalSize;
};

export const downloadFileEffect = async (file, afterCb) => {
  const {
    data: {
      jwt_ott,
      user_tokens: { token: oneTimeToken },
      gateway,
      upload_chunk_size
    }
  } = await getDownloadOTT([{ slug: file.slug }]);
  const controller = new AbortController();

  const blob = await downloadFile({
    file,
    oneTimeToken,
    endpoint: gateway.url,
    isEncrypted: false,
    signal: controller.signal,
    uploadChunkSize: upload_chunk_size[file.slug] || gateway.upload_chunk_size,
    jwtOneTimeToken: jwt_ott
  });
  if (blob && !blob?.failed) {
    const realBlob = new Blob([blob]);
    saveBlob({
      blob: realBlob,
      name: file?.name,
      mime: file?.mime
    });
    afterCb && afterCb(file);
    return;
  }
};

export const autoCompleteSearchEffect = async (term = '') => {
  const url = `${API_PATH}/search/autocomplete?term=${term}`;
  return await axiosInstance
    .get(url)
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getFileInfoEffect = async (id) => {
  const url = `${API_PATH}/files/file/${id}`;
  return await axiosInstance
    .get(url)
    .then(({ data }) => {
      return data.entry;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const updateShareEffect = async (
  fileId,
  shareId = 1,
  canComment = false,
  canEdit = false,
  expiredAt = 0
) => {
  const url = `${API_PATH}/files/${fileId}/share/${shareId}`;

  return axiosInstance
    .post(url, {
      canComment: canEdit || canComment,
      canEdit,
      expiredAt
    })
    .then((response) => {
      return response.data;
    })
    .catch((response) => {
      console.error(response);
    });
};

export const updateEntrySorting = async (direction) => {
  const body = {
    orderBy: 'createdAt',
    orderDirection: direction,
    page: 'root_files'
  };
  return axiosInstance.post(`${API_PATH}/entry-sorting`, body).catch((e) => {
    console.error(e);
  });
};

export const updateFileFavoriteEffect = async (slug, dispatch) => {
  const url = `${API_PATH}/files/favorite/toggle/${slug}`;
  try {
    const { data } = await axiosInstance.post(url);
    const file = data?.data;
    if (file) {
      dispatch(updateFile(file));
    } else {
      throw Error();
    }
  } catch (e) {
    console.warn(e);
  }
};

export const createFolderEffect = async (name) =>
  axiosInstance
    .post(`${API_PATH}/folders/folder`, { name, parent: null })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      return err;
    });

export const getFilesEffect = async (page = 1, order = 'desc') => {
  const url = `${API_PATH}/files?page=${page}&order_by=createdAt&order=${order}`;
  return await axiosInstance.get(url).then((result) => result.data);
};

export const getPaidShareFilesEffect = async (page = 1) => {
  try {
    const data = await axiosInstance.get(`${API_PATH}/share/file/list?page=${page}`);
    return data?.data;
  } catch (error) {
    throw Error(error);
  }
};

export const createPaidShareFileEffect = async (id, body) => {
  try {
    const data = await axiosInstance.post(`${API_PATH}/share/file/${id}`, body);
    return data?.data;
  } catch (error) {
    throw Error(error);
  }
};

export const deletePaidShareEffect = async (id, body) => {
  try {
    const url = `${API_PATH}/share/file/${id}`;
    return await axiosInstance.delete(url, body)
      .then((result) => {
        if (result.data.message === "success") {
          return result?.data; 
        } else {
          throw Error('Something went wrong');
        }
      });
  } catch (error) {
    throw Error(error);
  }
};

export const getPaidShareFileEffect = async (slug) => {
  try {
    const data = await axiosInstance.get(`${API_PATH}/share/file/${slug}`);
    return data?.data
  } catch (error) {
    throw Error(error);
  }
};

export const getFilesByTypeEffect = async (type, page = 1) => {
  return axiosInstance
    .get(
      `${API_PATH}/files?extension=${type}&page=${page}&order_by=createdAt&order=desc`
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw Error(err);
    });
};
export const getFavoritesEffect = async () => {
  return axiosInstance
    .get(`${API_PATH}/files/file/favorites`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw Error(err);
    });
};
export const getSharedFilesEffect = async (page = 1) => {
  return axiosInstance
    .get(
      `${API_PATH}/files/shared/my?page=${page}&order_by=createdAt&order=desc`
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw Error(err);
    });
};
export const getDeletedFilesEffect = async (page = 1) => {
  return axiosInstance
    .get(`${API_PATH}/trash?page=${page}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw Error(err);
    });
};
export const getGeoPinFilesEffect = async (page = 1) => {
  return axiosInstance
    .get(
      `${API_PATH}/files/geo/security?page=${page}&order_by=createdAt&order=desc'`
    )
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      throw Error(err);
    });
};
export const createStreamEffect = async (slug) => {
  try {
    const {
      data: {
        user_tokens: { token: oneTimeToken },
        gateway
      }
    } = await getDownloadOTT([{ slug }]);
    const url = `${gateway.url}/stream/${slug}/${oneTimeToken}`;
    return url;
  } catch (error) {
    throw Error(error);
  }
};

export const getFileStarStatistic = async (slug) => {
  try {
    const data = await axios.get(`${API_PATH}/share/file/stat/${slug}`);
    return data.data;
  } catch (error) {
    throw Error(error);
  }
};
