import { getTlesAPI } from '../../api/v1/tles';
import { Params } from '../../api/types/interface';

describe('Test satelite TLE data via API GET requests', () => {
  const statusData: [string, number, Params][] = [
    // [id, statusCodes, parameters]
    ['25544', 200, { format: 'json' }],
    ['25544', 200, { format: 'text' }],
    ['25543', 404, { format: 'json' }],
  ];

  it.each(statusData)(`Should return correct response status code`, async (id, statusCodes, parameters) => {
    await getTlesAPI(id, parameters).then((response: any) => {
      expect(response.status).toEqual(statusCodes);
    });
  });
});
