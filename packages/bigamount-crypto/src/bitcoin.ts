import {BigAmount, Unit, Units} from "@emeraldpay/bigamount";
import BigNumber from "bignumber.js";

export const SATOSHIS = new Units(
    [
        new Unit(0, "Satoshi", "sat"),
        new Unit(1, "Finney", "finney"),
        new Unit(2, "bit", "μBTC"),
        new Unit(5, "millibit", "mBTC"),
        new Unit(8, "Bitcoin", "BTC"),
    ]
);

export class Satoshi extends BigAmount {
    static ZERO: Satoshi = new Satoshi(0);

    constructor(value: BigNumber | string | number | BigAmount) {
        super(value, SATOSHIS);
    }

    static is(value: any): value is Satoshi {
        return BigAmount.is(value) && SATOSHIS.equals(value.units);
    }

}