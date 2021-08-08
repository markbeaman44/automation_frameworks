import axios from 'axios';
import { baseUrl } from '../constant';
import { Params } from '../types/interface';

export async function getTlesAPI(id: string, parameters: Params) {
  return await axios({
    method: 'get',
    url: `${baseUrl}/v1/satellites/${id}/tles`,
    params: parameters,
  }).catch(function (error) {
    return error.response;
  });
}
