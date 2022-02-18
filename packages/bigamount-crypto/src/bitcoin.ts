import {BigAmount, Unit, Units, NumberAmount, CreateAmount, FormatterBuilder, Predicates} from "@emeraldpay/bigamount";
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

    constructor(value: NumberAmount | BigAmount, unit?: string | Unit) {
        if (typeof unit !== "undefined") {
            if (BigAmount.is(value)) {
                throw new Error("Already BigAmount");
            }
            return BigAmount.createFor(value, SATOSHIS, Satoshi.factory(), unit)
        }
        super(value, SATOSHIS);
    }

    static factory(): CreateAmount<Satoshi> {
        return (value) => new Satoshi(value)
    }

    static is(value: any): value is Satoshi {
        return BigAmount.is(value)
            && SATOSHIS.equals(value.units)
            // @ts-ignore
            && typeof value.toBitcoin === "function";
    }

    static fromBitcoin(value: NumberAmount): Satoshi {
        return new Satoshi(value, "BITCOIN")
    }

    toBitcoin(): number {
        return this.number.dividedBy(this.units.top.multiplier).toNumber()
    }

    static decode(value: string): Satoshi {
        return BigAmount.decodeFor(value, SATOSHIS, (n) => new Satoshi(n));
    }

    protected copyWith(value: BigNumber): this {
        // @ts-ignore
        return new Satoshi(value)
    }
}

export const BitcoinFormatter = new FormatterBuilder()
    .when(Predicates.ZERO, (a, b) => {
        a.useTopUnit();
        b.useOptimalUnit(undefined, [SATOSHIS.units[0], SATOSHIS.units[3], SATOSHIS.units[4]]);
    })
    .number(3, true)
    .append(" ")
    .unitCode()
    .build();