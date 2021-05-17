import Province from './Province';
import sampleProvinceData from './data';
import { expect } from '@jest/globals';

describe('province', () => {
    it('shortfall', function(){
        const asia = new Province(sampleProvinceData());
        //assert.equal(asia.shortfall, 5);
        expect(asia.shortfall).toEqual(5);
    })
})