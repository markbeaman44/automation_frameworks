import { calculateValue } from '../../api/helpers';
import { getPositionsAPI } from '../../api/v1/positions';
import { Params, pickOption } from '../../api/types/interface';

import * as fs from 'fs';

describe('Test satelite positions via API GET requests', () => {
  const statusData: [string, number, Params][] = [
    // [id, statusCodes, parameters]
    ['25544', 200, { timestamps: '1436029892' }],
    ['25544', 400, {}],
    ['25543', 404, { timestamps: '1436029892' }],
  ];

  it.each(statusData)(`Should return correct response status code`, async (id, statusCodes, parameters) => {
    await getPositionsAPI(id, parameters).then((response) => {
      expect(response.status).toEqual(statusCodes);
    });
  });

  it('Should return response data for specific timestamp', async () => {
    await getPositionsAPI('25544', { timestamps: '1436029902' }).then((response) => {
      const jsonResults = fs.readFileSync('./tests/fixtures/p_ts_1436029902.json');
      expect(response.data).toEqual(JSON.parse(jsonResults.toString()));
    });
  });

  const timestamp = [];
  for (let i = 1; i <= 10; i++) {
    it(`Should ${
      i >= 11 ? 'not' : ''
    } return results for ${i} comma delimited list of timestamps (10 limit)`, async () => {
      timestamp.push(`${i}436029902`);

      await getPositionsAPI('25544', { timestamps: timestamp.toString() }).then((response: any) => {
        if (i <= 10) {
          expect(response.status).toEqual(200);
        } else {
          expect(response.status).toEqual(404);
        }

        if (i > 1 && i <= 10) {
          // Validating timestamp responses within list differs from each other
          expect(response.data[i - 2]).not.toContainEqual(response.data[i - 1]);
        }
      });
    });
  }

  const unitsData: [string, pickOption, Params, Params][] = [
    // [id, eq, parameterOne, parameterTwo]
    [
      '25544',
      'divide',
      { timestamps: '1036029892', units: 'miles' },
      { timestamps: '1036029892', units: 'kilometers' },
    ],
    [
      '25544',
      'multiply',
      { timestamps: '1136044729', units: 'kilometers' },
      { timestamps: '1136044729', units: 'miles' },
    ],
  ];
  let firstValue: number;

  it.each(unitsData)(
    `Should return correct unit measurement & check converted calculations`,
    async (id, eq, parameterOne, parameterTwo) => {
      await getPositionsAPI(id, parameterOne).then((response) => {
        firstValue = response.data[0].altitude;
        expect(response.data[0].units).toEqual(parameterOne.units);
      });

      await getPositionsAPI(id, parameterTwo).then((response) => {
        expect(response.data[0].units).toEqual(parameterTwo.units);
        expect(firstValue.toFixed(2)).toEqual(calculateValue(eq, response.data[0].altitude).toFixed(2));
      });
    },
  );
});
